import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { 
  getAnalyticsData, 
  getConversionFunnelByDay, 
  getConversionFunnelByWeek,
  getConversionFunnelByMonth,
  getVisitorConversionByDay,
  getVisitorConversionByWeek,
  getVisitorConversionByMonth,
  getDayOfWeekPerformance,
  getTimeOfDayPerformance,
  getDayTimeHeatmap,
  AnalyticsData, 
  ConversionDataPoint,
  VisitorConversionDataPoint,
  DayOfWeekDataPoint,
  TimeOfDayDataPoint,
  DayTimeSlot
} from '@/lib/googleAnalytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AnalyticsResponse {
  success: boolean;
  configured: boolean;
  daily?: AnalyticsData & { 
    chart: ConversionDataPoint[];
    visitorChart: VisitorConversionDataPoint[];
  };
  weekly?: AnalyticsData & { 
    chart: ConversionDataPoint[];
    visitorChart: VisitorConversionDataPoint[];
  };
  monthly?: AnalyticsData & { 
    chart: ConversionDataPoint[];
    visitorChart: VisitorConversionDataPoint[];
  };
  dayOfWeek?: DayOfWeekDataPoint[];
  timeOfDay?: TimeOfDayDataPoint[];
  dayTimeHeatmap?: DayTimeSlot[];
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

    // Daily chart: last 14 days
    const dailyChartEnd = new Date(today);
    dailyChartEnd.setDate(dailyChartEnd.getDate() - 1);
    const dailyChartStart = new Date(dailyChartEnd);
    dailyChartStart.setDate(dailyChartStart.getDate() - 13);

    // Fetch all data in parallel
    const [
      dailyData, 
      weeklyData, 
      monthlyData, 
      dailyChart, 
      weeklyChart, 
      monthlyChart,
      dailyVisitorChart,
      weeklyVisitorChart,
      monthlyVisitorChart,
      dayOfWeekData,
      timeOfDayData,
      dayTimeHeatmapData
    ] = await Promise.all([
      getAnalyticsData(dailyStartDate, dailyEndDate, dailyPeriodLabel, true),
      getAnalyticsData(weeklyStartStr, weeklyEndStr, weeklyPeriodLabel, true),
      getAnalyticsData(monthlyStartStr, monthlyEndStr, monthlyPeriodLabel, true),
      getConversionFunnelByDay(dailyChartStart.toISOString().split('T')[0], dailyChartEnd.toISOString().split('T')[0]),
      getConversionFunnelByWeek(8), // Last 8 weeks
      getConversionFunnelByMonth(6), // Last 6 months
      getVisitorConversionByDay(dailyChartStart.toISOString().split('T')[0], dailyChartEnd.toISOString().split('T')[0]),
      getVisitorConversionByWeek(8), // Last 8 weeks
      getVisitorConversionByMonth(6), // Last 6 months
      getDayOfWeekPerformance(), // Last 30 days aggregated by day of week
      getTimeOfDayPerformance(), // Last 30 days aggregated by time bucket
      getDayTimeHeatmap(), // Last 30 days day + time combined
    ]);

    const response: AnalyticsResponse = {
      success: true,
      configured: true,
      daily: { ...dailyData, chart: dailyChart, visitorChart: dailyVisitorChart },
      weekly: { ...weeklyData, chart: weeklyChart, visitorChart: weeklyVisitorChart },
      monthly: { ...monthlyData, chart: monthlyChart, visitorChart: monthlyVisitorChart },
      dayOfWeek: dayOfWeekData,
      timeOfDay: timeOfDayData,
      dayTimeHeatmap: dayTimeHeatmapData,
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
