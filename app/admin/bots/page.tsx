'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ByBot {
  name: string;
  total: number;
  last30: number;
}

interface DailyPoint {
  date: string;
  label: string;
  count: number;
  chatgpt: number;
}

interface RecentHit {
  created_at: string;
  bot_name: string;
  path: string | null;
  country: string | null;
  ip: string | null;
  user_agent: string | null;
}

interface BotData {
  success: boolean;
  configured: boolean;
  totals?: { allTime: number; last30: number; last7: number; today: number };
  byBot?: ByBot[];
  daily?: DailyPoint[];
  topPaths?: { path: string; count: number }[];
  recent?: RecentHit[];
}

export default function AdminBots() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<BotData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }

    fetch('/api/admin/bots', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/portal-login');
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => setError('Failed to load bot data'))
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const chatgptTotal =
    data?.byBot?.find((b) => b.name === 'ChatGPT-User')?.total ?? 0;

  return (
    <AdminLayout
      title="AI Bots"
      subtitle="AI crawler & assistant traffic"
      activeTab="bots"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {data && !data.configured && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6">
          Bot logging isn&apos;t configured. Set <code>LEADS_SUPABASE_ANON_KEY</code>{' '}
          in the environment to start recording AI bot hits.
        </div>
      )}

      {data && data.configured && data.totals && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="ChatGPT-User (all time)" value={chatgptTotal} accent />
            <StatCard label="All AI bots (all time)" value={data.totals.allTime} />
            <StatCard label="Last 7 days" value={data.totals.last7} />
            <StatCard label="Today" value={data.totals.today} />
          </div>

          {/* Daily trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Daily AI bot hits (last 30 days)
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Total bot hits vs. ChatGPT-User specifically.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="All AI bots" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chatgpt" name="ChatGPT-User" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* By bot */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                By bot <span className="text-sm font-normal text-gray-400">(last 90 days)</span>
              </h2>
              {data.byBot && data.byBot.length > 0 ? (
                <div className="space-y-2">
                  {data.byBot.map((b) => (
                    <div
                      key={b.name}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-700">{b.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">{b.last30} last 30d</span>
                        <span className="text-sm font-bold text-gray-900 w-12 text-right">
                          {b.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint />
              )}
            </div>

            {/* Top paths */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Top pages crawled{' '}
                <span className="text-sm font-normal text-gray-400">(last 90 days)</span>
              </h2>
              {data.topPaths && data.topPaths.length > 0 ? (
                <div className="space-y-2">
                  {data.topPaths.map((p) => (
                    <div
                      key={p.path}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-700 truncate mr-4">{p.path}</span>
                      <span className="text-sm font-bold text-gray-900">{p.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint />
              )}
            </div>
          </div>

          {/* Recent hits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent hits</h2>
            {data.recent && data.recent.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                      <th className="py-2 pr-4 font-medium">When</th>
                      <th className="py-2 pr-4 font-medium">Bot</th>
                      <th className="py-2 pr-4 font-medium">Path</th>
                      <th className="py-2 pr-4 font-medium">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((r, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">
                          {new Date(r.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                            {r.bot_name}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-700 truncate max-w-xs">{r.path}</td>
                        <td className="py-2 pr-4 text-gray-500">{r.country || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyHint />
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl shadow-sm border p-5 ${
        accent
          ? 'bg-purple-600 border-purple-600 text-white'
          : 'bg-white border-gray-100 text-gray-900'
      }`}
    >
      <p className={`text-sm ${accent ? 'text-purple-100' : 'text-gray-500'}`}>{label}</p>
      <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
    </div>
  );
}

function EmptyHint() {
  return (
    <p className="text-sm text-gray-400 py-4">
      No AI bot hits recorded yet. Data appears here once the new middleware is
      deployed and crawlers visit the site.
    </p>
  );
}
