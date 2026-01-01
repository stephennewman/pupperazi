import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    site: CheckResult;
    database: CheckResult;
    email: CheckResult;
  };
  responseTime: number;
}

interface CheckResult {
  status: "ok" | "warning" | "error";
  message: string;
  latency?: number;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    // Simple query to test connection
    const { error } = await supabase.from("leads").select("id").limit(1);
    const latency = Date.now() - start;
    
    if (error) {
      return {
        status: "error",
        message: `Database error: ${error.message}`,
        latency,
      };
    }
    
    return {
      status: latency > 1000 ? "warning" : "ok",
      message: latency > 1000 ? "Database slow" : "Connected",
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

async function checkEmail(): Promise<CheckResult> {
  // Check if Resend API key is configured
  const hasResendKey = !!process.env.RESEND_API_KEY;
  
  if (!hasResendKey) {
    return {
      status: "error",
      message: "Resend API key not configured",
    };
  }
  
  return {
    status: "ok",
    message: "Email service configured",
  };
}

export async function GET() {
  const startTime = Date.now();
  
  // Run all checks in parallel
  const [databaseCheck, emailCheck] = await Promise.all([
    checkDatabase(),
    checkEmail(),
  ]);

  const siteCheck: CheckResult = {
    status: "ok",
    message: "Site responding",
  };

  // Determine overall status
  const checks = { site: siteCheck, database: databaseCheck, email: emailCheck };
  const checkResults = Object.values(checks);
  
  let overallStatus: HealthCheck["status"] = "healthy";
  if (checkResults.some(c => c.status === "error")) {
    overallStatus = "unhealthy";
  } else if (checkResults.some(c => c.status === "warning")) {
    overallStatus = "degraded";
  }

  const health: HealthCheck = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
    responseTime: Date.now() - startTime,
  };

  // Return appropriate status code
  const statusCode = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}


