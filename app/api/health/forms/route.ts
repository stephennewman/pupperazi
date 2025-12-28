import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { sendErrorAlert } from "@/lib/errorNotifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FormHealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    database: CheckResult;
    emailService: CheckResult;
    slackWebhook: CheckResult;
  };
  responseTime: number;
  message: string;
}

interface CheckResult {
  status: "ok" | "warning" | "error";
  message: string;
  latency?: number;
}

// Test database write/read capability
async function checkDatabaseWrite(): Promise<CheckResult> {
  const start = Date.now();
  try {
    // Test by checking if we can query the leads table
    const { data, error } = await supabase
      .from("leads")
      .select("id")
      .limit(1);
    
    const latency = Date.now() - start;
    
    if (error) {
      return {
        status: "error",
        message: `Database query failed: ${error.message}`,
        latency,
      };
    }
    
    return {
      status: latency > 2000 ? "warning" : "ok",
      message: latency > 2000 ? "Database responding slowly" : "Database operational",
      latency,
    };
  } catch (error) {
    return {
      status: "error",
      message: `Database unreachable: ${error instanceof Error ? error.message : "Unknown error"}`,
      latency: Date.now() - start,
    };
  }
}

// Test Resend email service
async function checkEmailService(): Promise<CheckResult> {
  const start = Date.now();
  
  if (!process.env.RESEND_API_KEY) {
    return {
      status: "error",
      message: "RESEND_API_KEY not configured",
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Use Resend's domains endpoint to verify API key is valid
    // This doesn't send an email, just validates the connection
    const { error } = await resend.domains.list();
    
    const latency = Date.now() - start;
    
    if (error) {
      return {
        status: "error",
        message: `Email service error: ${error.message}`,
        latency,
      };
    }
    
    return {
      status: latency > 3000 ? "warning" : "ok",
      message: latency > 3000 ? "Email service slow" : "Email service operational",
      latency,
    };
  } catch (error) {
    return {
      status: "error",
      message: `Email service unreachable: ${error instanceof Error ? error.message : "Unknown error"}`,
      latency: Date.now() - start,
    };
  }
}

// Test Slack webhook
async function checkSlackWebhook(): Promise<CheckResult> {
  const webhookUrl = process.env.SLACK_ERROR_WEBHOOK || process.env.SLACK_ANALYTICS_WEBHOOK;
  
  if (!webhookUrl) {
    return {
      status: "warning",
      message: "Slack webhook not configured (alerts won't be sent)",
    };
  }
  
  return {
    status: "ok",
    message: "Slack webhook configured",
  };
}

export async function GET() {
  const startTime = Date.now();
  
  // Run all checks in parallel
  const [databaseCheck, emailCheck, slackCheck] = await Promise.all([
    checkDatabaseWrite(),
    checkEmailService(),
    checkSlackWebhook(),
  ]);

  const checks = {
    database: databaseCheck,
    emailService: emailCheck,
    slackWebhook: slackCheck,
  };

  // Determine overall status
  const checkResults = Object.values(checks);
  const hasError = checkResults.some(c => c.status === "error");
  const hasWarning = checkResults.some(c => c.status === "warning");
  
  let overallStatus: FormHealthCheck["status"] = "healthy";
  let message = "All form systems operational ✅";
  
  if (hasError) {
    overallStatus = "unhealthy";
    message = "⚠️ Form submissions may fail - check details";
    
    // Send Slack alert if forms are unhealthy
    const errorDetails = checkResults
      .filter(c => c.status === "error")
      .map(c => c.message)
      .join(", ");
    
    await sendErrorAlert({
      endpoint: "/api/health/forms",
      error: `Form health check failed: ${errorDetails}`,
      context: { checks },
    });
  } else if (hasWarning) {
    overallStatus = "degraded";
    message = "Form systems degraded - monitoring";
  }

  const health: FormHealthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    responseTime: Date.now() - startTime,
    message,
  };

  // Return appropriate status code (UptimeRobot will alert on non-200)
  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(health, { status: statusCode });
}

