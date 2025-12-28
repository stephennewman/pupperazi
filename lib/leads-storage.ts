import { createClient } from '@supabase/supabase-js';

// Separate Supabase client for leads storage (v7-form-builder project)
// This keeps Pupperazi leads separate from other data
const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';

const leadsClient = LEADS_SUPABASE_KEY 
  ? createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY)
  : null;

export interface PupperaziLead {
  name?: string;
  email: string;
  phone?: string;
  is_new_customer?: string;
  pet_info?: string;
  requested_datetime?: string;
  message?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'booked' | 'closed';
}

export async function storeLead(lead: PupperaziLead): Promise<{ success: boolean; id?: number; error?: string }> {
  if (!leadsClient) {
    console.warn('Leads storage not configured - LEADS_SUPABASE_ANON_KEY missing');
    return { success: false, error: 'Storage not configured' };
  }

  try {
    const { data, error } = await leadsClient
      .from('pupperazi_leads')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        is_new_customer: lead.is_new_customer,
        pet_info: lead.pet_info,
        requested_datetime: lead.requested_datetime,
        message: lead.message,
        source: lead.source || 'appointment_form',
        status: lead.status || 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error storing lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Lead storage error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getLeadsStats(): Promise<{
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byStatus: Record<string, number>;
}> {
  if (!leadsClient) {
    return { total: 0, today: 0, thisWeek: 0, thisMonth: 0, byStatus: {} };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    const [totalRes, todayRes, weekRes, monthRes, statusRes] = await Promise.all([
      leadsClient.from('pupperazi_leads').select('id', { count: 'exact', head: true }),
      leadsClient.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      leadsClient.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
      leadsClient.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      leadsClient.from('pupperazi_leads').select('status'),
    ]);

    const byStatus: Record<string, number> = {};
    statusRes.data?.forEach((row: { status: string }) => {
      byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    });

    return {
      total: totalRes.count || 0,
      today: todayRes.count || 0,
      thisWeek: weekRes.count || 0,
      thisMonth: monthRes.count || 0,
      byStatus,
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return { total: 0, today: 0, thisWeek: 0, thisMonth: 0, byStatus: {} };
  }
}

export async function getAllLeads(limit = 100): Promise<PupperaziLead[]> {
  if (!leadsClient) {
    return [];
  }

  try {
    const { data, error } = await leadsClient
      .from('pupperazi_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

