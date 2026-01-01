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
    
    // Last week (7 days ending yesterday)
    const endDateObj = new Date(today);
    endDateObj.setDate(endDateObj.getDate() - 1);
    
    const startDateObj = new Date(endDateObj);
    startDateObj.setDate(startDateObj.getDate() - 6);

    const startDate = startDateObj.toISOString().split("T")[0];
    const endDate = endDateObj.toISOString().split("T")[0];

    const periodLabel = `${startDateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;

    const data = await getAnalyticsData(startDate, endDate, periodLabel);
    const message = formatSlackMessage(data, "weekly");
    const sent = await sendToSlack(message);

    return NextResponse.json({
      success: sent,
      period: periodLabel,
      data,
    });
  } catch (error) {
    console.error("Weekly analytics error:", error);
    return NextResponse.json(
      { error: "Failed to generate weekly report" },
      { status: 500 }
    );
  }
}


