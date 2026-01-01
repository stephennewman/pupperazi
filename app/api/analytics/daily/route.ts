import { NextResponse } from "next/server";
import { getAnalyticsData, formatSlackMessage, sendToSlack } from "@/lib/googleAnalytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = yesterday.toISOString().split("T")[0];
    const endDate = startDate;

    const periodLabel = yesterday.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const data = await getAnalyticsData(startDate, endDate, periodLabel);
    const message = formatSlackMessage(data, "daily");
    const sent = await sendToSlack(message);

    return NextResponse.json({
      success: sent,
      period: periodLabel,
      data,
    });
  } catch (error) {
    console.error("Daily analytics error:", error);
    return NextResponse.json(
      { error: "Failed to generate daily report" },
      { status: 500 }
    );
  }
}


