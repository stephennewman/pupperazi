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
    const prevWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const prevWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    // Previous month range
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    // Get counts
    const [
      totalRes, 
      todayRes, 
      weekRes, 
      prevWeekRes,
      monthRes, 
      statusRes, 
      recentRes, 
      currentMonthData, 
      prevMonthData,
      currentWeekData,
      prevWeekData,
    ] = await Promise.all([
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
      supabase.from('pupperazi_leads').select('id', { count: 'exact', head: true }).gte('created_at', prevWeekStart).lt('created_at', prevWeekEnd),
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
      // Current week: get is_new_customer data
      supabase.from('pupperazi_leads')
        .select('is_new_customer, created_at')
        .gte('created_at', weekStart),
      // Previous week: get is_new_customer data
      supabase.from('pupperazi_leads')
        .select('is_new_customer, created_at')
        .gte('created_at', prevWeekStart)
        .lt('created_at', prevWeekEnd),
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

    // Calculate weekly stats
    const currentWeekTotal = currentWeekData.data?.length || 0;
    const currentWeekNew = currentWeekData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'yes').length || 0;
    const currentWeekReturning = currentWeekData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'no').length || 0;
    const currentWeekNewPct = currentWeekTotal > 0 ? Math.round((currentWeekNew / currentWeekTotal) * 100) : 0;

    const prevWeekTotal = prevWeekData.data?.length || 0;
    const prevWeekNew = prevWeekData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'yes').length || 0;
    const prevWeekReturning = prevWeekData.data?.filter((r: { is_new_customer: string }) => r.is_new_customer === 'no').length || 0;
    const prevWeekNewPct = prevWeekTotal > 0 ? Math.round((prevWeekNew / prevWeekTotal) * 100) : 0;

    // Week-over-week change
    const weekOverWeekChange = prevWeekTotal > 0 
      ? Math.round(((currentWeekTotal - prevWeekTotal) / prevWeekTotal) * 100) 
      : currentWeekTotal > 0 ? 100 : 0;

    // Calculate daily average for this week
    const daysThisWeek = Math.min(7, Math.ceil((now.getTime() - new Date(weekStart).getTime()) / (24 * 60 * 60 * 1000)));
    const dailyAvgThisWeek = daysThisWeek > 0 ? (currentWeekTotal / daysThisWeek).toFixed(1) : '0';
    const dailyAvgLastWeek = (prevWeekTotal / 7).toFixed(1);

    // Get all leads for chart data
    const allLeadsRes = await supabase
      .from('pupperazi_leads')
      .select('created_at, is_new_customer, status')
      .order('created_at', { ascending: true });

    const allLeads = allLeadsRes.data || [];

    // Build weekly chart data (last 8 weeks)
    const weeklyChartData = [];
    for (let i = 7; i >= 0; i--) {
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStartDate = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weekLeads = allLeads.filter(l => {
        const d = new Date(l.created_at);
        return d >= weekStartDate && d < weekEnd;
      });
      
      const newCount = weekLeads.filter(l => l.is_new_customer === 'yes').length;
      const returningCount = weekLeads.filter(l => l.is_new_customer === 'no').length;
      
      weeklyChartData.push({
        week: `W${Math.ceil((weekEnd.getDate()) / 7)}`,
        label: weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: weekLeads.length,
        new: newCount,
        returning: returningCount,
      });
    }

    // Build monthly chart data (last 6 months)
    const monthlyChartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEndDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      const monthLeads = allLeads.filter(l => {
        const d = new Date(l.created_at);
        return d >= monthDate && d <= monthEndDate;
      });
      
      const newCount = monthLeads.filter(l => l.is_new_customer === 'yes').length;
      const returningCount = monthLeads.filter(l => l.is_new_customer === 'no').length;
      
      monthlyChartData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        total: monthLeads.length,
        new: newCount,
        returning: returningCount,
      });
    }

    // Build daily chart data (last 14 days)
    const dailyChartData = [];
    for (let i = 13; i >= 0; i--) {
      const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 23, 59, 59);
      
      const dayLeads = allLeads.filter(l => {
        const d = new Date(l.created_at);
        return d >= dayDate && d <= dayEnd;
      });
      
      const newCount = dayLeads.filter(l => l.is_new_customer === 'yes').length;
      const returningCount = dayLeads.filter(l => l.is_new_customer === 'no').length;
      
      dailyChartData.push({
        day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: dayLeads.length,
        new: newCount,
        returning: returningCount,
      });
    }

    // Status distribution for pie chart
    const statusChartData = Object.entries(byStatus).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        total: totalRes.count || 0,
        today: todayRes.count || 0,
        thisWeek: weekRes.count || 0,
        lastWeek: prevWeekRes.count || 0,
        thisMonth: monthRes.count || 0,
        byStatus,
      },
      weeklyMetrics: {
        currentWeek: {
          total: currentWeekTotal,
          newCustomers: currentWeekNew,
          returningCustomers: currentWeekReturning,
          newCustomerPct: currentWeekNewPct,
          dailyAvg: parseFloat(dailyAvgThisWeek),
        },
        previousWeek: {
          total: prevWeekTotal,
          newCustomers: prevWeekNew,
          returningCustomers: prevWeekReturning,
          newCustomerPct: prevWeekNewPct,
          dailyAvg: parseFloat(dailyAvgLastWeek),
        },
        weekOverWeekChange,
        weekOverWeekNewCustomerChange: currentWeekNewPct - prevWeekNewPct,
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
      chartData: {
        weekly: weeklyChartData,
        monthly: monthlyChartData,
        daily: dailyChartData,
        status: statusChartData,
      },
      recentLeads: recentRes.data || [],
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

