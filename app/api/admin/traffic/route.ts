import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { getAnalyticsData } from '@/lib/googleAnalytics';

export async function GET(request: NextRequest) {
  // Check authentication
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || null;
  
  if (!validateToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if GA is configured
  if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
    return NextResponse.json({ 
      error: 'Google Analytics not configured',
      configured: false 
    }, { status: 200 });
  }

  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Calculate date ranges
    const todayStart = today;
    
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStart = weekAgo.toISOString().split('T')[0];
    
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthStart = monthAgo.toISOString().split('T')[0];

    // Fetch data for different periods in parallel
    const [todayData, weekData, monthData] = await Promise.all([
      getAnalyticsData(todayStart, today, 'Today', false),
      getAnalyticsData(weekStart, today, 'Last 7 Days', true),
      getAnalyticsData(monthStart, today, 'Last 30 Days', true),
    ]);

    return NextResponse.json({
      success: true,
      configured: true,
      today: {
        visitors: todayData.totalUsers,
        pageViews: todayData.pageViews,
        sessions: todayData.sessions,
        appointmentClicks: todayData.appointmentClicks,
        phoneClicks: todayData.phoneClicks,
        formSubmits: todayData.formSubmits,
      },
      week: {
        visitors: weekData.totalUsers,
        pageViews: weekData.pageViews,
        sessions: weekData.sessions,
        appointmentClicks: weekData.appointmentClicks,
        phoneClicks: weekData.phoneClicks,
        formSubmits: weekData.formSubmits,
        avgSessionDuration: weekData.avgSessionDuration,
        bounceRate: weekData.bounceRate,
        trends: weekData.trends,
      },
      month: {
        visitors: monthData.totalUsers,
        pageViews: monthData.pageViews,
        sessions: monthData.sessions,
        appointmentClicks: monthData.appointmentClicks,
        phoneClicks: monthData.phoneClicks,
        formSubmits: monthData.formSubmits,
        avgSessionDuration: monthData.avgSessionDuration,
        bounceRate: monthData.bounceRate,
        topPages: monthData.topPages,
        topSources: monthData.topSources,
        topCities: monthData.topCities,
        trends: monthData.trends,
      },
    });
  } catch (error) {
    console.error('Traffic data error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch traffic data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

