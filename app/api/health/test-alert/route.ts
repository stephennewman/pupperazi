import { NextResponse } from "next/server";
import { sendErrorAlert } from "@/lib/errorNotifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify with cron secret for security
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sent = await sendErrorAlert({
      endpoint: "/api/health/test-alert",
      error: "🧪 This is a TEST alert - your error notifications are working!",
      context: {
        type: "test",
        triggered_by: "manual_test",
        message: "If you see this in Slack, your alerts are configured correctly! ✅"
      }
    });

    return NextResponse.json({
      success: sent,
      message: sent 
        ? "✅ Test alert sent to Slack! Check your channel." 
        : "❌ Failed to send - check SLACK_ANALYTICS_WEBHOOK env var"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

