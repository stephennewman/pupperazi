import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';

const supabase = LEADS_SUPABASE_KEY 
  ? createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY)
  : null;

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
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    // Previous month range
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    // Get counts
    const [totalRes, todayRes, weekRes, monthRes, statusRes, recentRes, currentMonthData, prevMonthData] = await Promise.all([
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('pupperazi_leads').select('status'),
      supabase.from('pupperazi_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
      // Current month: get is_new_customer data
      supabase.from('pupperazi_leads')
        .select('is_new_customer')
        .gte('created_at', monthStart),
      // Previous month: get is_new_customer data
      supabase.from('pupperazi_leads')
        .select('is_new_customer')
        .gte('created_at', prevMonthStart)
        .lte('created_at', prevMonthEnd),
    ]);

    // Calculate status breakdown
    const byStatus: Record<string, number> = {};
    statusRes.data?.forEach((row: { status: string }) => {
      byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    });

    // Calculate new customer acquisition stats
    const currentMonthTotal = currentMonthData.data?.length || 0;
    const currentMonthNew = currentMonthData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'yes').length || 0;
    const currentMonthReturning = currentMonthData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'no').length || 0;
    const currentMonthNewPct = currentMonthTotal > 0 ? Math.round((currentMonthNew / currentMonthTotal) * 100) : 0;

    const prevMonthTotal = prevMonthData.data?.length || 0;
    const prevMonthNew = prevMonthData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'yes').length || 0;
    const prevMonthReturning = prevMonthData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'no').length || 0;
    const prevMonthNewPct = prevMonthTotal > 0 ? Math.round((prevMonthNew / prevMonthTotal) * 100) : 0;

    // Get month names
    const currentMonthName = now.toLocaleString('default', { month: 'long' });
    const prevMonthName = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString('default', { month: 'long' });

    return NextResponse.json({
      success: true,
      stats: {
        total: totalRes.count || 0,
        today: todayRes.count || 0,
        thisWeek: weekRes.count || 0,
        thisMonth: monthRes.count || 0,
        byStatus,
      },
      customerAcquisition: {
        currentMonth: {
          name: currentMonthName,
          total: currentMonthTotal,
          newCustomers: currentMonthNew,
          returningCustomers: currentMonthReturning,
          newCustomerPct: currentMonthNewPct,
        },
        previousMonth: {
          name: prevMonthName,
          total: prevMonthTotal,
          newCustomers: prevMonthNew,
          returningCustomers: prevMonthReturning,
          newCustomerPct: prevMonthNewPct,
        },
        trend: currentMonthNewPct - prevMonthNewPct,
      },
      recentLeads: recentRes.data || [],
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

