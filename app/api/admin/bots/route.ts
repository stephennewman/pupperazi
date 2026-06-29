import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEADS_SUPABASE_URL =
  process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';

const supabase = LEADS_SUPABASE_KEY
  ? createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY)
  : null;

interface BotRow {
  created_at: string;
  bot_name: string;
  path: string | null;
  country: string | null;
  ip: string | null;
  user_agent: string | null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '') || null;

  if (!validateToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ success: true, configured: false });
  }

  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Pull recent rows (last 90 days) for aggregation, plus an all-time total.
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const [allTimeCountRes, rowsRes, recentRes] = await Promise.all([
      supabase
        .from('pupperazi_bot_hits')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('pupperazi_bot_hits')
        .select('created_at, bot_name, path, country, ip')
        .gte('created_at', ninetyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(20000),
      supabase
        .from('pupperazi_bot_hits')
        .select('created_at, bot_name, path, country, ip, user_agent')
        .order('created_at', { ascending: false })
        .limit(25),
    ]);

    const rows = (rowsRes.data || []) as BotRow[];

    const inRange = (since: Date) =>
      rows.filter((r) => new Date(r.created_at) >= since).length;

    // Counts by bot (all-time uses the 90-day window aggregation as a proxy;
    // the headline total is the true all-time count).
    const byBotMap: Record<string, { total: number; last30: number }> = {};
    for (const r of rows) {
      const created = new Date(r.created_at);
      if (!byBotMap[r.bot_name]) byBotMap[r.bot_name] = { total: 0, last30: 0 };
      byBotMap[r.bot_name].total += 1;
      if (created >= thirtyDaysAgo) byBotMap[r.bot_name].last30 += 1;
    }
    const byBot = Object.entries(byBotMap)
      .map(([name, v]) => ({ name, total: v.total, last30: v.last30 }))
      .sort((a, b) => b.total - a.total);

    // Daily trend for the last 30 days.
    const daily: { date: string; label: string; count: number; chatgpt: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i
      );
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const dayRows = rows.filter((r) => {
        const d = new Date(r.created_at);
        return d >= dayStart && d < dayEnd;
      });
      daily.push({
        date: dayStart.toISOString().split('T')[0],
        label: dayStart.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        count: dayRows.length,
        chatgpt: dayRows.filter((r) => r.bot_name === 'ChatGPT-User').length,
      });
    }

    // Top paths (last 90 days).
    const pathMap: Record<string, number> = {};
    for (const r of rows) {
      const p = r.path || '(unknown)';
      pathMap[p] = (pathMap[p] || 0) + 1;
    }
    const topPaths = Object.entries(pathMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      configured: true,
      totals: {
        allTime: allTimeCountRes.count || 0,
        last30: inRange(thirtyDaysAgo),
        last7: inRange(sevenDaysAgo),
        today: inRange(todayStart),
      },
      byBot,
      daily,
      topPaths,
      recent: recentRes.data || [],
    });
  } catch (error) {
    console.error('Bot stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot stats' },
      { status: 500 }
    );
  }
}
