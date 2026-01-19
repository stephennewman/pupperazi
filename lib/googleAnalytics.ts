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

export async function getConversionFunnelByDay(
  startDate: string,
  endDate: string
): Promise<ConversionDataPoint[]> {
  const client = getAnalyticsClient();

  try {
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

    // Fetch form submits by date
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

    // Build a map of date -> appointment clicks
    const appointmentMap: Record<string, number> = {};
    appointmentResponse.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const count = parseInt(row.metricValues?.[0]?.value || "0");
      appointmentMap[date] = count;
    });

    // Build a map of date -> form submits
    const formSubmitMap: Record<string, number> = {};
    formSubmitResponse.rows?.forEach((row) => {
      const date = row.dimensionValues?.[0]?.value || "";
      const count = parseInt(row.metricValues?.[0]?.value || "0");
      formSubmitMap[date] = count;
    });

    // Generate all dates in range
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

