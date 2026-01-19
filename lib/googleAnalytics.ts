import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Initialize the client with service account credentials
function getAnalyticsClient() {
  let privateKey = process.env.GA_PRIVATE_KEY || "";
  
  // Handle various newline formats from env vars
  privateKey = privateKey.replace(/\\n/g, "\n");
  
  // If the key doesn't have proper line breaks, try to fix it
  if (!privateKey.includes("\n") && privateKey.includes("-----BEGIN")) {
    privateKey = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----/, "-----BEGIN PRIVATE KEY-----\n")
      .replace(/-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----")
      .replace(/(.{64})/g, "$1\n");
  }

  const credentials = {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: privateKey,
  };

  return new BetaAnalyticsDataClient({ credentials });
}

// Pupperazi GA4 Property ID - G-5DXLGKFPVZ
const PROPERTY_ID = process.env.GA_PROPERTY_ID || "";

export interface TrendData {
  current: number;
  previous: number;
  change: number;
  direction: "up" | "down" | "flat";
}

export interface AnalyticsData {
  period: string;
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  avgSessionDuration: string;
  avgSessionDurationSeconds: number;
  bounceRate: string;
  bounceRateValue: number;
  topPages: { page: string; views: number }[];
  topSources: { source: string; users: number }[];
  topCities: { city: string; users: number }[];
  // CTA Events
  appointmentClicks: number;
  phoneClicks: number;
  // Form Funnel Events
  formOpens: number;
  formStarts: number;
  formSubmits: number;
  formAbandons: number;
  // Trends (compared to previous period)
  trends?: {
    totalUsers: TrendData;
    pageViews: TrendData;
    sessions: TrendData;
    appointmentClicks: TrendData;
    phoneClicks: TrendData;
    formSubmits: TrendData;
  };
}

function calculateTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return {
      current,
      previous,
      change: current > 0 ? 100 : 0,
      direction: current > 0 ? "up" : "flat",
    };
  }
  const change = ((current - previous) / previous) * 100;
  return {
    current,
    previous,
    change: Math.abs(change),
    direction: change > 1 ? "up" : change < -1 ? "down" : "flat",
  };
}

async function getEventCount(
  client: BetaAnalyticsDataClient,
  startDate: string,
  endDate: string,
  eventName: string
): Promise<number> {
  try {
    const [response] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: eventName },
        },
      },
    });
    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0");
  } catch {
    return 0;
  }
}

async function getBasicMetrics(
  client: BetaAnalyticsDataClient,
  startDate: string,
  endDate: string
): Promise<{
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  avgDurationSeconds: number;
  bounceRateValue: number;
}> {
  const [metricsResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
  });

  const metrics = metricsResponse.rows?.[0]?.metricValues || [];
  return {
    totalUsers: parseInt(metrics[0]?.value || "0"),
    newUsers: parseInt(metrics[1]?.value || "0"),
    sessions: parseInt(metrics[2]?.value || "0"),
    pageViews: parseInt(metrics[3]?.value || "0"),
    avgDurationSeconds: parseFloat(metrics[4]?.value || "0"),
    bounceRateValue: parseFloat(metrics[5]?.value || "0"),
  };
}

export async function getAnalyticsData(
  startDate: string,
  endDate: string,
  periodLabel: string,
  includeTrends: boolean = true
): Promise<AnalyticsData> {
  const client = getAnalyticsClient();

  // Calculate previous period dates for comparison
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - daysDiff + 1);
  
  const prevStartDate = prevStart.toISOString().split("T")[0];
  const prevEndDate = prevEnd.toISOString().split("T")[0];

  // Fetch current period data
  const [
    currentMetrics, 
    appointmentClicks, 
    phoneClicks,
    formOpens,
    formStarts,
    formSubmits,
    formAbandons
  ] = await Promise.all([
    getBasicMetrics(client, startDate, endDate),
    getEventCount(client, startDate, endDate, "appointment_click"),
    getEventCount(client, startDate, endDate, "phone_click"),
    getEventCount(client, startDate, endDate, "form_open"),
    getEventCount(client, startDate, endDate, "form_start"),
    getEventCount(client, startDate, endDate, "form_submit_success"),
    getEventCount(client, startDate, endDate, "form_abandon"),
  ]);

  // Fetch previous period data for trends
  let trends: AnalyticsData["trends"];
  if (includeTrends) {
    const [
      prevMetrics, 
      prevAppointmentClicks, 
      prevPhoneClicks,
      prevFormSubmits
    ] = await Promise.all([
      getBasicMetrics(client, prevStartDate, prevEndDate),
      getEventCount(client, prevStartDate, prevEndDate, "appointment_click"),
      getEventCount(client, prevStartDate, prevEndDate, "phone_click"),
      getEventCount(client, prevStartDate, prevEndDate, "form_submit_success"),
    ]);

    trends = {
      totalUsers: calculateTrend(currentMetrics.totalUsers, prevMetrics.totalUsers),
      pageViews: calculateTrend(currentMetrics.pageViews, prevMetrics.pageViews),
      sessions: calculateTrend(currentMetrics.sessions, prevMetrics.sessions),
      appointmentClicks: calculateTrend(appointmentClicks, prevAppointmentClicks),
      phoneClicks: calculateTrend(phoneClicks, prevPhoneClicks),
      formSubmits: calculateTrend(formSubmits, prevFormSubmits),
    };
  }

  // Top pages request
  const [pagesResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 5,
  });

  // Top sources request
  const [sourcesResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "sessionSource" }],
    metrics: [{ name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 5,
  });

  // Top cities request
  const [citiesResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "city" }],
    metrics: [{ name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
    limit: 5,
  });

  // Format duration
  const minutes = Math.floor(currentMetrics.avgDurationSeconds / 60);
  const seconds = Math.round(currentMetrics.avgDurationSeconds % 60);
  const avgSessionDuration = `${minutes}m ${seconds}s`;

  // Format bounce rate
  const bounceRate = `${(currentMetrics.bounceRateValue * 100).toFixed(1)}%`;

  // Parse top pages
  const topPages =
    pagesResponse.rows?.map((row) => ({
      page: row.dimensionValues?.[0]?.value || "Unknown",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
    })) || [];

  // Parse top sources
  const topSources =
    sourcesResponse.rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Direct",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    })) || [];

  // Parse top cities
  const topCities =
    citiesResponse.rows
      ?.filter((row) => row.dimensionValues?.[0]?.value !== "(not set)")
      .map((row) => ({
        city: row.dimensionValues?.[0]?.value || "Unknown",
        users: parseInt(row.metricValues?.[0]?.value || "0"),
      })) || [];

  return {
    period: periodLabel,
    totalUsers: currentMetrics.totalUsers,
    newUsers: currentMetrics.newUsers,
    sessions: currentMetrics.sessions,
    pageViews: currentMetrics.pageViews,
    avgSessionDuration,
    avgSessionDurationSeconds: currentMetrics.avgDurationSeconds,
    bounceRate,
    bounceRateValue: currentMetrics.bounceRateValue,
    topPages,
    topSources,
    topCities,
    appointmentClicks,
    phoneClicks,
    formOpens,
    formStarts,
    formSubmits,
    formAbandons,
    trends,
  };
}

function formatTrend(trend: TrendData | undefined, isInverse: boolean = false): string {
  if (!trend) return "";
  
  const arrow = trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";
  const color = trend.direction === "flat" 
    ? "" 
    : (trend.direction === "up" !== isInverse) ? " 🟢" : " 🔴";
  
  if (trend.change === 0 || trend.direction === "flat") {
    return " (→ no change)";
  }
  
  return ` (${arrow}${trend.change.toFixed(0)}%${color})`;
}

export function formatSlackMessage(data: AnalyticsData, type: "daily" | "weekly" | "monthly"): object {
  const emoji = type === "daily" ? "📊" : type === "weekly" ? "📈" : "🎯";
  const title = type === "daily" ? "Daily" : type === "weekly" ? "Weekly" : "Monthly";
  const comparisonText = type === "daily" ? "vs yesterday" : type === "weekly" ? "vs last week" : "vs last month";

  const topPagesText = data.topPages
    .map((p, i) => `${i + 1}. \`${p.page}\` - ${p.views} views`)
    .join("\n");

  const topSourcesText = data.topSources
    .map((s) => `• ${s.source}: ${s.users} users`)
    .join("\n");

  const topCitiesText = data.topCities
    .slice(0, 3)
    .map((c) => `• ${c.city}: ${c.users}`)
    .join("\n");

  const blocks: object[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} Pupperazi Pet Spa - ${title} Report`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Period:* ${data.period}${data.trends ? `\n_Trends ${comparisonText}_` : ""}`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*👥 Total Visitors*\n${data.totalUsers.toLocaleString()}${formatTrend(data.trends?.totalUsers)}`,
        },
        {
          type: "mrkdwn",
          text: `*🆕 New Visitors*\n${data.newUsers.toLocaleString()}`,
        },
        {
          type: "mrkdwn",
          text: `*📄 Page Views*\n${data.pageViews.toLocaleString()}${formatTrend(data.trends?.pageViews)}`,
        },
        {
          type: "mrkdwn",
          text: `*🔄 Sessions*\n${data.sessions.toLocaleString()}${formatTrend(data.trends?.sessions)}`,
        },
        {
          type: "mrkdwn",
          text: `*⏱️ Avg. Duration*\n${data.avgSessionDuration}`,
        },
        {
          type: "mrkdwn",
          text: `*↩️ Bounce Rate*\n${data.bounceRate}`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*🐾 CTA Performance*",
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*📅 Appointment Clicks*\n${data.appointmentClicks}${formatTrend(data.trends?.appointmentClicks)}`,
        },
        {
          type: "mrkdwn",
          text: `*📱 Phone Clicks*\n${data.phoneClicks}${formatTrend(data.trends?.phoneClicks)}`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📝 Form Funnel*",
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*📂 Form Opens*\n${data.formOpens}`,
        },
        {
          type: "mrkdwn",
          text: `*✏️ Form Starts*\n${data.formStarts}`,
        },
        {
          type: "mrkdwn",
          text: `*✅ Submissions*\n${data.formSubmits}${formatTrend(data.trends?.formSubmits)}`,
        },
        {
          type: "mrkdwn",
          text: `*❌ Abandons*\n${data.formAbandons}`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🔥 Top Pages*\n${topPagesText || "No data"}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*🌐 Traffic Sources*\n${topSourcesText || "No data"}`,
        },
        {
          type: "mrkdwn",
          text: `*📍 Top Cities*\n${topCitiesText || "No data"}`,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Data from Google Analytics • pupperazipetspa.com",
        },
      ],
    },
  ];

  return { blocks };
}

export interface ConversionDataPoint {
  date: string;
  label: string;
  appointmentClicks: number;
  formSubmits: number;
  conversionRate: number;
}

export interface VisitorConversionDataPoint {
  date: string;
  label: string;
  totalVisitors: number;
  appointmentClicks: number;
  conversionRate: number;
}

export interface DayOfWeekDataPoint {
  day: string;
  dayIndex: number;
  visitors: number;
  appointmentClicks: number;
  formSubmits: number;
  clickRate: number;
  conversionRate: number;
}

export interface TimeOfDayDataPoint {
  bucket: string;
  timeRange: string;
  visitors: number;
  appointmentClicks: number;
  formSubmits: number;
  clickRate: number;
  conversionRate: number;
}

export interface DayTimeSlot {
  day: string;
  dayIndex: number;
  bucket: string;
  timeRange: string;
  visitors: number;
  appointmentClicks: number;
  formSubmits: number;
  clickRate: number;
  intensity: number; // 0-100 scale for heatmap
  isOpportunity: boolean; // Low traffic = opportunity for promos
}

// Get day-by-day conversion data
export async function getConversionFunnelByDay(
  startDate: string,
  endDate: string
): Promise<ConversionDataPoint[]> {
  const client = getAnalyticsClient();

  try {
    const [appointmentResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "appointment_click" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const [formSubmitResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "form_submit_success" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const appointmentMap: Record<string, number> = {};
    appointmentResponse.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const count = parseInt(row.metricValues?.[0]?.value || "0");
      appointmentMap[date] = count;
    });

    const formSubmitMap: Record<string, number> = {};
    formSubmitResponse.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const count = parseInt(row.metricValues?.[0]?.value || "0");
      formSubmitMap[date] = count;
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const results: ConversionDataPoint[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0].replace(/-/g, "");
      const displayDate = new Date(d);
      const label = displayDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const appointmentClicks = appointmentMap[dateStr] || 0;
      const formSubmits = formSubmitMap[dateStr] || 0;
      const conversionRate = appointmentClicks > 0 
        ? Math.round((formSubmits / appointmentClicks) * 100) 
        : 0;

      results.push({
        date: dateStr,
        label,
        appointmentClicks,
        formSubmits,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching conversion funnel data:", error);
    return [];
  }
}

// Get week-by-week conversion data (last N weeks)
export async function getConversionFunnelByWeek(numWeeks: number = 8): Promise<ConversionDataPoint[]> {
  const client = getAnalyticsClient();
  const results: ConversionDataPoint[] = [];

  try {
    const today = new Date();
    
    for (let i = numWeeks - 1; i >= 0; i--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - 1 - (i * 7)); // End of week (yesterday minus i weeks)
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6); // Start of week (7 days before end)

      const startStr = weekStart.toISOString().split("T")[0];
      const endStr = weekEnd.toISOString().split("T")[0];

      const [appointmentClicks, formSubmits] = await Promise.all([
        getEventCount(client, startStr, endStr, "appointment_click"),
        getEventCount(client, startStr, endStr, "form_submit_success"),
      ]);

      const conversionRate = appointmentClicks > 0 
        ? Math.round((formSubmits / appointmentClicks) * 100) 
        : 0;

      const label = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      results.push({
        date: startStr.replace(/-/g, ""),
        label,
        appointmentClicks,
        formSubmits,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching weekly conversion data:", error);
    return [];
  }
}

// Get month-by-month conversion data (last N months)
export async function getConversionFunnelByMonth(numMonths: number = 6): Promise<ConversionDataPoint[]> {
  const client = getAnalyticsClient();
  const results: ConversionDataPoint[] = [];

  try {
    const today = new Date();
    
    for (let i = numMonths - 1; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      // Don't go past yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (monthEnd > yesterday) {
        monthEnd.setTime(yesterday.getTime());
      }

      const startStr = monthStart.toISOString().split("T")[0];
      const endStr = monthEnd.toISOString().split("T")[0];

      const [appointmentClicks, formSubmits] = await Promise.all([
        getEventCount(client, startStr, endStr, "appointment_click"),
        getEventCount(client, startStr, endStr, "form_submit_success"),
      ]);

      const conversionRate = appointmentClicks > 0 
        ? Math.round((formSubmits / appointmentClicks) * 100) 
        : 0;

      const label = monthStart.toLocaleDateString("en-US", { month: "short" });

      results.push({
        date: startStr.replace(/-/g, ""),
        label,
        appointmentClicks,
        formSubmits,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching monthly conversion data:", error);
    return [];
  }
}

// Get day-by-day visitor to appointment click conversion
export async function getVisitorConversionByDay(
  startDate: string,
  endDate: string
): Promise<VisitorConversionDataPoint[]> {
  const client = getAnalyticsClient();

  try {
    // Fetch visitors by date
    const [visitorsResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "totalUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    // Fetch appointment clicks by date
    const [appointmentResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "appointment_click" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    const visitorsMap: Record<string, number> = {};
    visitorsResponse.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const count = parseInt(row.metricValues?.[0]?.value || "0");
      visitorsMap[date] = count;
    });

    const appointmentMap: Record<string, number> = {};
    appointmentResponse.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const count = parseInt(row.metricValues?.[0]?.value || "0");
      appointmentMap[date] = count;
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const results: VisitorConversionDataPoint[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0].replace(/-/g, "");
      const displayDate = new Date(d);
      const label = displayDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const totalVisitors = visitorsMap[dateStr] || 0;
      const appointmentClicks = appointmentMap[dateStr] || 0;
      const conversionRate = totalVisitors > 0 
        ? Math.round((appointmentClicks / totalVisitors) * 100) 
        : 0;

      results.push({
        date: dateStr,
        label,
        totalVisitors,
        appointmentClicks,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching visitor conversion data:", error);
    return [];
  }
}

// Get week-by-week visitor to appointment click conversion
export async function getVisitorConversionByWeek(numWeeks: number = 8): Promise<VisitorConversionDataPoint[]> {
  const client = getAnalyticsClient();
  const results: VisitorConversionDataPoint[] = [];

  try {
    const today = new Date();
    
    for (let i = numWeeks - 1; i >= 0; i--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - 1 - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      const startStr = weekStart.toISOString().split("T")[0];
      const endStr = weekEnd.toISOString().split("T")[0];

      const [basicMetrics, appointmentClicks] = await Promise.all([
        getBasicMetrics(client, startStr, endStr),
        getEventCount(client, startStr, endStr, "appointment_click"),
      ]);

      const totalVisitors = basicMetrics.totalUsers;
      const conversionRate = totalVisitors > 0 
        ? Math.round((appointmentClicks / totalVisitors) * 100) 
        : 0;

      const label = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      results.push({
        date: startStr.replace(/-/g, ""),
        label,
        totalVisitors,
        appointmentClicks,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching weekly visitor conversion data:", error);
    return [];
  }
}

// Get month-by-month visitor to appointment click conversion
export async function getVisitorConversionByMonth(numMonths: number = 6): Promise<VisitorConversionDataPoint[]> {
  const client = getAnalyticsClient();
  const results: VisitorConversionDataPoint[] = [];

  try {
    const today = new Date();
    
    for (let i = numMonths - 1; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (monthEnd > yesterday) {
        monthEnd.setTime(yesterday.getTime());
      }

      const startStr = monthStart.toISOString().split("T")[0];
      const endStr = monthEnd.toISOString().split("T")[0];

      const [basicMetrics, appointmentClicks] = await Promise.all([
        getBasicMetrics(client, startStr, endStr),
        getEventCount(client, startStr, endStr, "appointment_click"),
      ]);

      const totalVisitors = basicMetrics.totalUsers;
      const conversionRate = totalVisitors > 0 
        ? Math.round((appointmentClicks / totalVisitors) * 100) 
        : 0;

      const label = monthStart.toLocaleDateString("en-US", { month: "short" });

      results.push({
        date: startStr.replace(/-/g, ""),
        label,
        totalVisitors,
        appointmentClicks,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching monthly visitor conversion data:", error);
    return [];
  }
}

// Get performance by day of week (last 30 days)
export async function getDayOfWeekPerformance(): Promise<DayOfWeekDataPoint[]> {
  const client = getAnalyticsClient();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29); // Last 30 days

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    // Fetch visitors by day of week
    const [visitorsResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "dayOfWeek" }],
      metrics: [{ name: "totalUsers" }],
      orderBys: [{ dimension: { dimensionName: "dayOfWeek" } }],
    });

    // Fetch appointment clicks by day of week
    const [appointmentResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "dayOfWeek" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "appointment_click" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "dayOfWeek" } }],
    });

    // Fetch form submits by day of week
    const [formSubmitResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "dayOfWeek" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "form_submit_success" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "dayOfWeek" } }],
    });

    // Build maps
    const visitorsMap: Record<string, number> = {};
    visitorsResponse.rows?.forEach((row) => {
      const dayIndex = row.dimensionValues?.[0]?.value || "0";
      visitorsMap[dayIndex] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    const appointmentMap: Record<string, number> = {};
    appointmentResponse.rows?.forEach((row) => {
      const dayIndex = row.dimensionValues?.[0]?.value || "0";
      appointmentMap[dayIndex] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    const formSubmitMap: Record<string, number> = {};
    formSubmitResponse.rows?.forEach((row) => {
      const dayIndex = row.dimensionValues?.[0]?.value || "0";
      formSubmitMap[dayIndex] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    // Build results for all 7 days
    const results: DayOfWeekDataPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const visitors = visitorsMap[String(i)] || 0;
      const appointmentClicks = appointmentMap[String(i)] || 0;
      const formSubmits = formSubmitMap[String(i)] || 0;
      const clickRate = visitors > 0 ? Math.round((appointmentClicks / visitors) * 100) : 0;
      const conversionRate = appointmentClicks > 0 ? Math.round((formSubmits / appointmentClicks) * 100) : 0;

      results.push({
        day: dayNames[i],
        dayIndex: i,
        visitors,
        appointmentClicks,
        formSubmits,
        clickRate,
        conversionRate,
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching day of week data:", error);
    return [];
  }
}

// Get performance by time of day (last 30 days)
// Buckets: Morning (8-11am), Lunch/Afternoon (11am-2pm), Late Afternoon (2-6pm), Other
export async function getTimeOfDayPerformance(): Promise<TimeOfDayDataPoint[]> {
  const client = getAnalyticsClient();

  // Define time buckets
  const buckets = [
    { name: 'Morning', range: '8am - 11am', hours: [8, 9, 10] },
    { name: 'Lunch/Afternoon', range: '11am - 2pm', hours: [11, 12, 13] },
    { name: 'Late Afternoon', range: '2pm - 6pm', hours: [14, 15, 16, 17] },
    { name: 'Other', range: 'Before 8am / After 6pm', hours: [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23] },
  ];

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29); // Last 30 days

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    // Fetch visitors by hour
    const [visitorsResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "hour" }],
      metrics: [{ name: "totalUsers" }],
      orderBys: [{ dimension: { dimensionName: "hour" } }],
    });

    // Fetch appointment clicks by hour
    const [appointmentResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "hour" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "appointment_click" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "hour" } }],
    });

    // Fetch form submits by hour
    const [formSubmitResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "hour" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "form_submit_success" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "hour" } }],
    });

    // Build maps by hour
    const visitorsMap: Record<number, number> = {};
    visitorsResponse.rows?.forEach((row) => {
      const hour = parseInt(row.dimensionValues?.[0]?.value || "0");
      visitorsMap[hour] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    const appointmentMap: Record<number, number> = {};
    appointmentResponse.rows?.forEach((row) => {
      const hour = parseInt(row.dimensionValues?.[0]?.value || "0");
      appointmentMap[hour] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    const formSubmitMap: Record<number, number> = {};
    formSubmitResponse.rows?.forEach((row) => {
      const hour = parseInt(row.dimensionValues?.[0]?.value || "0");
      formSubmitMap[hour] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    // Aggregate into buckets
    const results: TimeOfDayDataPoint[] = buckets.map(bucket => {
      const visitors = bucket.hours.reduce((sum, h) => sum + (visitorsMap[h] || 0), 0);
      const appointmentClicks = bucket.hours.reduce((sum, h) => sum + (appointmentMap[h] || 0), 0);
      const formSubmits = bucket.hours.reduce((sum, h) => sum + (formSubmitMap[h] || 0), 0);
      const clickRate = visitors > 0 ? Math.round((appointmentClicks / visitors) * 100) : 0;
      const conversionRate = appointmentClicks > 0 ? Math.round((formSubmits / appointmentClicks) * 100) : 0;

      return {
        bucket: bucket.name,
        timeRange: bucket.range,
        visitors,
        appointmentClicks,
        formSubmits,
        clickRate,
        conversionRate,
      };
    });

    return results;
  } catch (error) {
    console.error("Error fetching time of day data:", error);
    return [];
  }
}

// Get combined day + time performance for heatmap (last 30 days)
export async function getDayTimeHeatmap(): Promise<DayTimeSlot[]> {
  const client = getAnalyticsClient();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const buckets = [
    { name: 'Morning', range: '8am-11am', hours: [8, 9, 10] },
    { name: 'Lunch', range: '11am-2pm', hours: [11, 12, 13] },
    { name: 'Afternoon', range: '2pm-6pm', hours: [14, 15, 16, 17] },
    { name: 'Other', range: 'Off-hours', hours: [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23] },
  ];

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29);

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    // Fetch visitors by day + hour
    const [visitorsResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "dayOfWeek" }, { name: "hour" }],
      metrics: [{ name: "totalUsers" }],
    });

    // Fetch appointment clicks by day + hour
    const [appointmentResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "dayOfWeek" }, { name: "hour" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "appointment_click" },
        },
      },
    });

    // Fetch form submits by day + hour
    const [formResponse] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: startStr, endDate: endStr }],
      dimensions: [{ name: "dayOfWeek" }, { name: "hour" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "form_submit_success" },
        },
      },
    });

    // Build maps: key = "dayIndex-hour"
    const visitorsMap: Record<string, number> = {};
    visitorsResponse.rows?.forEach((row) => {
      const day = row.dimensionValues?.[0]?.value || "0";
      const hour = row.dimensionValues?.[1]?.value || "0";
      const key = `${day}-${hour}`;
      visitorsMap[key] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    const appointmentMap: Record<string, number> = {};
    appointmentResponse.rows?.forEach((row) => {
      const day = row.dimensionValues?.[0]?.value || "0";
      const hour = row.dimensionValues?.[1]?.value || "0";
      const key = `${day}-${hour}`;
      appointmentMap[key] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    const formMap: Record<string, number> = {};
    formResponse.rows?.forEach((row) => {
      const day = row.dimensionValues?.[0]?.value || "0";
      const hour = row.dimensionValues?.[1]?.value || "0";
      const key = `${day}-${hour}`;
      formMap[key] = parseInt(row.metricValues?.[0]?.value || "0");
    });

    // Aggregate into day + bucket combinations (exclude "Other" bucket for business hours focus)
    const businessBuckets = buckets.filter(b => b.name !== 'Other');
    const results: DayTimeSlot[] = [];
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      for (const bucket of businessBuckets) {
        let visitors = 0;
        let clicks = 0;
        let fills = 0;

        for (const hour of bucket.hours) {
          const key = `${dayIndex}-${hour}`;
          visitors += visitorsMap[key] || 0;
          clicks += appointmentMap[key] || 0;
          fills += formMap[key] || 0;
        }

        const clickRate = visitors > 0 ? Math.round((clicks / visitors) * 100) : 0;

        results.push({
          day: dayNames[dayIndex],
          dayIndex,
          bucket: bucket.name,
          timeRange: bucket.range,
          visitors,
          appointmentClicks: clicks,
          formSubmits: fills,
          clickRate,
          intensity: 0, // Will calculate after
          isOpportunity: false, // Will calculate after
        });
      }
    }

    // Calculate intensity (0-100) based on visitor count
    const maxVisitors = Math.max(...results.map(r => r.visitors), 1);
    const visitorValues = results.map(r => r.visitors).sort((a, b) => a - b);
    const lowThreshold = visitorValues[Math.floor(visitorValues.length * 0.33)]; // Bottom 33%

    results.forEach(slot => {
      slot.intensity = Math.round((slot.visitors / maxVisitors) * 100);
      // Mark as opportunity if in bottom 33% of traffic but during business hours
      slot.isOpportunity = slot.visitors <= lowThreshold && slot.visitors > 0;
    });

    return results;
  } catch (error) {
    console.error("Error fetching day/time heatmap data:", error);
    return [];
  }
}

export async function sendToSlack(message: object): Promise<boolean> {
  const webhookUrl = process.env.SLACK_ANALYTICS_WEBHOOK;
  
  if (!webhookUrl) {
    console.error("SLACK_ANALYTICS_WEBHOOK not configured");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to send Slack message:", error);
    return false;
  }
}

