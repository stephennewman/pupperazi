import { NextResponse } from "next/server";
import { getAnalyticsData, formatSlackMessage, sendToSlack } from "@/lib/googleAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Test endpoint - can be called manually to verify setup
export async function GET(request: Request) {
  // Allow test calls with query param or cron secret
  const url = new URL(request.url);
  const testKey = url.searchParams.get("key");
  const authHeader = request.headers.get("authorization");
  
  const isAuthorized = 
    testKey === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Test with yesterday's data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = yesterday.toISOString().split("T")[0];
    const endDate = startDate;

    const periodLabel = `Test - ${yesterday.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}`;

    const data = await getAnalyticsData(startDate, endDate, periodLabel);
    const message = formatSlackMessage(data, "daily");
    
    // Check if we should send to Slack
    const sendSlack = url.searchParams.get("send") === "true";
    let sent = false;
    
    if (sendSlack) {
      sent = await sendToSlack(message);
    }

    return NextResponse.json({
      success: true,
      slackSent: sent,
      period: periodLabel,
      data,
      message, // Include the Slack message format for debugging
    });
  } catch (error) {
    console.error("Test analytics error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate test report",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

