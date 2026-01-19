import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';

const supabase = LEADS_SUPABASE_KEY 
  ? createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY)
  : null;

interface AdditionalInfo {
  dateRequested: string | null;
  timeRequested: string | null;
  newCustomer: string | null;
  message: string | null;
}

interface RepeatCustomer {
  email: string;
  name: string;
  phone: string;
  totalAppointments: number;
  appointmentsLast90Days: number;
  appointmentsLast30Days: number;
  firstVisit: string;
  lastVisit: string;
  petInfo: string[];
  avgDaysBetweenVisits: number | null;
  additionalInfo: AdditionalInfo[];
}

export async function GET(request: NextRequest) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || null;
  
  if (!validateToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const now = new Date();
    const days90Ago = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Get all leads
    const { data: allLeads, error } = await supabase
      .from('pupperazi_leads')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by email to find repeat customers
    const customerMap = new Map<string, {
      email: string;
      names: string[];
      phones: string[];
      pets: string[];
      visits: Date[];
      additionalInfo: AdditionalInfo[];
    }>();

    allLeads?.forEach(lead => {
      const email = (lead.email || '').toLowerCase().trim();
      if (!email || email === 'historical@pupperazi.com') return;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          email,
          names: [],
          phones: [],
          pets: [],
          visits: [],
          additionalInfo: [],
        });
      }

      const customer = customerMap.get(email)!;
      if (lead.name && !customer.names.includes(lead.name)) {
        customer.names.push(lead.name);
      }
      if (lead.phone && !customer.phones.includes(lead.phone)) {
        customer.phones.push(lead.phone);
      }
      if (lead.pet_info && !customer.pets.includes(lead.pet_info)) {
        customer.pets.push(lead.pet_info);
      }
      customer.visits.push(new Date(lead.created_at));
      
      // Capture additional form info from most recent lead
      customer.additionalInfo.push({
        dateRequested: lead.date_requested || null,
        timeRequested: lead.time_requested || null,
        newCustomer: lead.new_customer || null,
        message: lead.message || null,
      });
    });

    // Build repeat customer list
    const repeatCustomers: RepeatCustomer[] = [];

    customerMap.forEach((customer) => {
      // Only include customers with 2+ visits OR any visits in last 90 days
      const visits90Days = customer.visits.filter(v => v >= new Date(days90Ago));
      const visits30Days = customer.visits.filter(v => v >= new Date(days30Ago));

      // Sort visits by date
      customer.visits.sort((a, b) => a.getTime() - b.getTime());

      // Calculate average days between visits
      let avgDays: number | null = null;
      if (customer.visits.length >= 2) {
        const daysDiffs: number[] = [];
        for (let i = 1; i < customer.visits.length; i++) {
          const diff = (customer.visits[i].getTime() - customer.visits[i-1].getTime()) / (1000 * 60 * 60 * 24);
          daysDiffs.push(diff);
        }
        avgDays = Math.round(daysDiffs.reduce((a, b) => a + b, 0) / daysDiffs.length);
      }

      repeatCustomers.push({
        email: customer.email,
        name: customer.names[0] || 'Unknown',
        phone: customer.phones[0] || '',
        totalAppointments: customer.visits.length,
        appointmentsLast90Days: visits90Days.length,
        appointmentsLast30Days: visits30Days.length,
        firstVisit: customer.visits[0]?.toISOString() || '',
        lastVisit: customer.visits[customer.visits.length - 1]?.toISOString() || '',
        petInfo: customer.pets,
        avgDaysBetweenVisits: avgDays,
        additionalInfo: customer.additionalInfo,
      });
    });

    // Sort by total appointments descending
    repeatCustomers.sort((a, b) => b.totalAppointments - a.totalAppointments);

    // Calculate summary stats
    const totalCustomers = repeatCustomers.length;
    const repeatCustomersCount = repeatCustomers.filter(c => c.totalAppointments >= 2).length;
    const activeIn90Days = repeatCustomers.filter(c => c.appointmentsLast90Days > 0).length;
    const activeIn30Days = repeatCustomers.filter(c => c.appointmentsLast30Days > 0).length;
    const avgAppointments = totalCustomers > 0 
      ? (repeatCustomers.reduce((sum, c) => sum + c.totalAppointments, 0) / totalCustomers).toFixed(1)
      : '0';

    return NextResponse.json({
      success: true,
      summary: {
        totalCustomers,
        repeatCustomers: repeatCustomersCount,
        repeatRate: totalCustomers > 0 ? Math.round((repeatCustomersCount / totalCustomers) * 100) : 0,
        activeIn90Days,
        activeIn30Days,
        avgAppointmentsPerCustomer: avgAppointments,
      },
      customers: repeatCustomers,
    });

  } catch (error) {
    console.error('Repeat customers error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}


