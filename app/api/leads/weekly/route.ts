import { NextResponse } from "next/server";
import { getLeadsStats, getAllLeads } from "@/lib/leads-storage";

const SLACK_WEBHOOK = process.env.SLACK_ANALYTICS_WEBHOOK;

interface LeadWithUTM {
  name?: string;
  email: string;
  phone?: string;
  is_new_customer?: string;
  source?: string;
  status?: string;
  created_at?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

async function sendLeadsReportToSlack(stats: {
  total: number;
  thisWeek: number;
  thisMonth: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  recentLeads: LeadWithUTM[];
}) {
  if (!SLACK_WEBHOOK) {
    console.warn("SLACK_ANALYTICS_WEBHOOK not configured");
    return false;
  }

  const today = new Date();
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const periodText = `${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  // Build source breakdown
  const sourceBreakdown = Object.entries(stats.bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => `• ${source || "Direct"}: ${count}`)
    .join("\n") || "No data";

  // Build status breakdown
  const statusBreakdown = Object.entries(stats.byStatus)
    .map(([status, count]) => {
      const emoji =
        status === "new"
          ? "🆕"
          : status === "contacted"
          ? "📞"
          : status === "booked"
          ? "✅"
          : "📋";
      return `${emoji} ${status}: ${count}`;
    })
    .join(" | ") || "No data";

  // Build recent leads list (last 5)
  const recentLeadsList = stats.recentLeads
    .slice(0, 5)
    .map((lead) => {
      const date = lead.created_at
        ? new Date(lead.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "";
      const source = lead.utm_source || lead.source || "Direct";
      return `• ${lead.name || "Unknown"} (${date}) - via ${source}`;
    })
    .join("\n") || "No recent leads";

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📊 Pupperazi - Weekly Leads Report",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Period:* ${periodText}`,
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
          text: `*📥 Leads This Week*\n${stats.thisWeek}`,
        },
        {
          type: "mrkdwn",
          text: `*📅 Leads This Month*\n${stats.thisMonth}`,
        },
        {
          type: "mrkdwn",
          text: `*📊 Total All Time*\n${stats.total}`,
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
        text: `*📈 Status Breakdown*\n${statusBreakdown}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🌐 Traffic Sources (This Week)*\n${sourceBreakdown}`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🆕 Recent Leads*\n${recentLeadsList}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Lead data from Pupperazi Pet Spa • pupperazipetspa.com",
        },
      ],
    },
  ];

  try {
    const response = await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send Slack message:", error);
    return false;
  }
}

export async function GET(request: Request) {
  // Verify cron secret for production
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Allow without auth in development or if no secret configured
    if (process.env.NODE_ENV === "production" && cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Get lead statistics
    const stats = await getLeadsStats();

    // Get recent leads for the report
    const recentLeads = (await getAllLeads(20)) as LeadWithUTM[];

    // Calculate source breakdown from recent leads
    const bySource: Record<string, number> = {};
    recentLeads.forEach((lead) => {
      const source = lead.utm_source || lead.source || "direct";
      bySource[source] = (bySource[source] || 0) + 1;
    });

    const reportData = {
      ...stats,
      bySource,
      recentLeads,
    };

    // Send to Slack
    const slackSent = await sendLeadsReportToSlack(reportData);

    return NextResponse.json({
      success: true,
      slackSent,
      stats: {
        total: stats.total,
        thisWeek: stats.thisWeek,
        thisMonth: stats.thisMonth,
        byStatus: stats.byStatus,
        bySource,
      },
    });
  } catch (error) {
    console.error("Weekly leads report error:", error);
    return NextResponse.json(
      { error: "Failed to generate leads report" },
      { status: 500 }
    );
  }
}


