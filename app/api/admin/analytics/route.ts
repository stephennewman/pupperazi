import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { getAnalyticsData, getConversionFunnelByDay, AnalyticsData, ConversionDataPoint } from '@/lib/googleAnalytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AnalyticsResponse {
  success: boolean;
  configured: boolean;
  daily?: AnalyticsData;
  weekly?: AnalyticsData;
  monthly?: AnalyticsData;
  conversionChart?: {
    daily: ConversionDataPoint[];  // Last 14 days
    weekly: ConversionDataPoint[]; // Last 7 days
  };
  error?: string;
}

export async function GET(request: NextRequest) {
  // Verify admin token
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || null;
  
  if (!validateToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or expired token' },
      { status: 401 }
    );
  }

  // Check if GA is configured
  const isConfigured = !!(
    process.env.GA_CLIENT_EMAIL &&
    process.env.GA_PRIVATE_KEY &&
    process.env.GA_PROPERTY_ID
  );

  if (!isConfigured) {
    return NextResponse.json({
      success: true,
      configured: false,
      error: 'Google Analytics not configured'
    });
  }

  try {
    const today = new Date();
    
    // Daily: yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dailyStartDate = yesterday.toISOString().split('T')[0];
    const dailyEndDate = dailyStartDate;
    const dailyPeriodLabel = yesterday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    // Weekly: last 7 days ending yesterday
    const weekEndDate = new Date(today);
    weekEndDate.setDate(weekEndDate.getDate() - 1);
    const weekStartDate = new Date(weekEndDate);
    weekStartDate.setDate(weekStartDate.getDate() - 6);
    const weeklyStartStr = weekStartDate.toISOString().split('T')[0];
    const weeklyEndStr = weekEndDate.toISOString().split('T')[0];
    const weeklyPeriodLabel = `${weekStartDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${weekEndDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    // Monthly: last 30 days ending yesterday
    const monthEndDate = new Date(today);
    monthEndDate.setDate(monthEndDate.getDate() - 1);
    const monthStartDate = new Date(monthEndDate);
    monthStartDate.setDate(monthStartDate.getDate() - 29);
    const monthlyStartStr = monthStartDate.toISOString().split('T')[0];
    const monthlyEndStr = monthEndDate.toISOString().split('T')[0];
    const monthlyPeriodLabel = `${monthStartDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${monthEndDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    // Conversion chart dates: last 14 days for daily, last 7 days for weekly
    const chartEnd = new Date(today);
    chartEnd.setDate(chartEnd.getDate() - 1);
    
    const chart14DaysStart = new Date(chartEnd);
    chart14DaysStart.setDate(chart14DaysStart.getDate() - 13);
    
    const chart7DaysStart = new Date(chartEnd);
    chart7DaysStart.setDate(chart7DaysStart.getDate() - 6);

    // Fetch all data in parallel
    const [dailyData, weeklyData, monthlyData, conversionDaily, conversionWeekly] = await Promise.all([
      getAnalyticsData(dailyStartDate, dailyEndDate, dailyPeriodLabel, true),
      getAnalyticsData(weeklyStartStr, weeklyEndStr, weeklyPeriodLabel, true),
      getAnalyticsData(monthlyStartStr, monthlyEndStr, monthlyPeriodLabel, true),
      getConversionFunnelByDay(chart14DaysStart.toISOString().split('T')[0], chartEnd.toISOString().split('T')[0]),
      getConversionFunnelByDay(chart7DaysStart.toISOString().split('T')[0], chartEnd.toISOString().split('T')[0]),
    ]);

    const response: AnalyticsResponse = {
      success: true,
      configured: true,
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData,
      conversionChart: {
        daily: conversionDaily,
        weekly: conversionWeekly,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        configured: true,
        error: 'Failed to fetch analytics data' 
      },
      { status: 500 }
    );
  }
}
