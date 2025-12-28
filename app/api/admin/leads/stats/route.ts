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

    // Get counts
    const [totalRes, todayRes, weekRes, monthRes, statusRes, recentRes] = await Promise.all([
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('pupperazi_leads').select('status'),
      supabase.from('pupperazi_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    // Calculate status breakdown
    const byStatus: Record<string, number> = {};
    statusRes.data?.forEach((row: { status: string }) => {
      byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats: {
        total: totalRes.count || 0,
        today: todayRes.count || 0,
        thisWeek: weekRes.count || 0,
        thisMonth: monthRes.count || 0,
        byStatus,
      },
      recentLeads: recentRes.data || [],
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

