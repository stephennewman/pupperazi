import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

// AI bot/crawler user-agents we want to track.
// Order matters: the first matching pattern wins, so list more specific
// signatures before broader ones.
const AI_BOT_PATTERNS: { pattern: string; name: string }[] = [
  { pattern: 'chatgpt-user', name: 'ChatGPT-User' },
  { pattern: 'oai-searchbot', name: 'OAI-SearchBot' },
  { pattern: 'gptbot', name: 'GPTBot' },
  { pattern: 'claude-user', name: 'Claude-User' },
  { pattern: 'claude-web', name: 'Claude-Web' },
  { pattern: 'claudebot', name: 'ClaudeBot' },
  { pattern: 'anthropic-ai', name: 'Anthropic-AI' },
  { pattern: 'perplexitybot', name: 'PerplexityBot' },
  { pattern: 'perplexity-user', name: 'Perplexity-User' },
  { pattern: 'google-extended', name: 'Google-Extended' },
  { pattern: 'bytespider', name: 'Bytespider' },
  { pattern: 'meta-externalagent', name: 'Meta-AI' },
  { pattern: 'meta-externalfetcher', name: 'Meta-AI' },
  { pattern: 'amazonbot', name: 'Amazonbot' },
  { pattern: 'applebot-extended', name: 'Applebot-Extended' },
  { pattern: 'ccbot', name: 'CCBot' },
  { pattern: 'cohere-ai', name: 'Cohere-AI' },
  { pattern: 'duckassistbot', name: 'DuckAssistBot' },
  { pattern: 'youbot', name: 'YouBot' },
  { pattern: 'diffbot', name: 'Diffbot' },
];

const SUPABASE_URL =
  process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';

function detectBot(userAgent: string): string | null {
  const ua = userAgent.toLowerCase();
  for (const { pattern, name } of AI_BOT_PATTERNS) {
    if (ua.includes(pattern)) return name;
  }
  return null;
}

async function logBotHit(request: NextRequest, botName: string): Promise<void> {
  if (!SUPABASE_KEY) return;

  const ua = request.headers.get('user-agent') || '';
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/pupperazi_bot_hits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        bot_name: botName,
        user_agent: ua.slice(0, 1000),
        path: request.nextUrl.pathname,
        method: request.method,
        host: request.headers.get('host'),
        referer: request.headers.get('referer'),
        ip,
        country: request.headers.get('x-vercel-ip-country'),
      }),
    });
  } catch {
    // Never let logging failures affect the response.
  }
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const userAgent = request.headers.get('user-agent');
  if (userAgent) {
    const botName = detectBot(userAgent);
    if (botName) {
      // Fire-and-forget: don't block the response on the DB write.
      event.waitUntil(logBotHit(request, botName));
    }
  }
  return NextResponse.next();
}

export const config = {
  // Run on page requests only: skip Next internals and any path with a
  // file extension (static assets, images, sitemap.xml, robots.txt, etc.).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)'],
};
