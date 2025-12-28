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
    
    // Last month
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const startDate = lastMonth.toISOString().split("T")[0];
    const endDate = lastDayOfLastMonth.toISOString().split("T")[0];

    const periodLabel = lastMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const data = await getAnalyticsData(startDate, endDate, periodLabel);
    const message = formatSlackMessage(data, "monthly");
    const sent = await sendToSlack(message);

    return NextResponse.json({
      success: sent,
      period: periodLabel,
      data,
    });
  } catch (error) {
    console.error("Monthly analytics error:", error);
    return NextResponse.json(
      { error: "Failed to generate monthly report" },
      { status: 500 }
    );
  }
}

