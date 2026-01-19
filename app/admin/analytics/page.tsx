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
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface TrendData {
  current: number;
  previous: number;
  change: number;
  direction: 'up' | 'down' | 'flat';
}

interface AnalyticsData {
  period: string;
  totalUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  avgSessionDuration: string;
  avgSessionDurationSeconds: number;
  bounceRate: string;
  bounceRateValue: number;
  topPages: { page: string; views: number }[];
  topSources: { source: string; users: number }[];
  topCities: { city: string; users: number }[];
  appointmentClicks: number;
  phoneClicks: number;
  formOpens: number;
  formStarts: number;
  formSubmits: number;
  formAbandons: number;
  trends?: {
    totalUsers: TrendData;
    pageViews: TrendData;
    sessions: TrendData;
    appointmentClicks: TrendData;
    phoneClicks: TrendData;
    formSubmits: TrendData;
  };
}

interface ConversionDataPoint {
  date: string;
  label: string;
  appointmentClicks: number;
  formSubmits: number;
  conversionRate: number;
}

interface AnalyticsResponse {
  success: boolean;
  configured: boolean;
  daily?: AnalyticsData;
  weekly?: AnalyticsData;
  monthly?: AnalyticsData;
  conversionChart?: {
    daily: ConversionDataPoint[];
    weekly: ConversionDataPoint[];
  };
  error?: string;
}

const COLORS = ['#8B5CF6', '#A855F7', '#C084FC', '#D8B4FE', '#EDE9FE'];

function TrendBadge({ trend, inverse = false }: { trend?: TrendData; inverse?: boolean }) {
  if (!trend) return null;
  
  const isPositive = trend.direction === 'up';
  const isGood = inverse ? !isPositive : isPositive;
  
  if (trend.direction === 'flat' || trend.change === 0) {
    return (
      <span className="text-xs text-gray-500 ml-2">→ no change</span>
    );
  }
  
  return (
    <span className={`text-xs ml-2 px-2 py-0.5 rounded-full font-medium ${
      isGood 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {isPositive ? '↑' : '↓'} {trend.change.toFixed(0)}%
    </span>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [conversionChartView, setConversionChartView] = useState<'7days' | '14days'>('7days');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }

    fetchAnalytics(token);
  }, [router]);

  const fetchAnalytics = async (token: string) => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/portal-login');
        return;
      }

      const result = await response.json();
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || 'Failed to load analytics');
      }
    } catch {
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = data?.[activeTab];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Analytics" subtitle="Website traffic and performance" activeTab="analytics">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!data?.configured ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <span className="text-4xl mb-4 block">📊</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Analytics Not Configured</h2>
          <p className="text-gray-600">Add GA credentials to see traffic data</p>
          <p className="text-sm text-gray-500 mt-2">Required: GA_CLIENT_EMAIL, GA_PRIVATE_KEY, GA_PROPERTY_ID</p>
        </div>
      ) : (
        <>
          {/* Period Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Period Label */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'daily' ? '📅 Daily Report' : activeTab === 'weekly' ? '📈 Weekly Report' : '🎯 Monthly Report'}
            </h2>
            <p className="text-sm text-gray-500">{currentData?.period}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData?.totalUsers.toLocaleString() || 0}</p>
              <TrendBadge trend={currentData?.trends?.totalUsers} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">New Visitors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData?.newUsers.toLocaleString() || 0}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Page Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData?.pageViews.toLocaleString() || 0}</p>
              <TrendBadge trend={currentData?.trends?.pageViews} />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData?.sessions.toLocaleString() || 0}</p>
              <TrendBadge trend={currentData?.trends?.sessions} />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData?.avgSessionDuration || '0m 0s'}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentData?.bounceRate || '0%'}</p>
            </div>
          </div>

          {/* CTA Performance */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 CTA Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">Appointment Clicks</p>
                <p className="text-3xl font-bold mt-1">{currentData?.appointmentClicks || 0}</p>
                <TrendBadge trend={currentData?.trends?.appointmentClicks} />
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">Phone Clicks</p>
                <p className="text-3xl font-bold mt-1">{currentData?.phoneClicks || 0}</p>
                <TrendBadge trend={currentData?.trends?.phoneClicks} />
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">Form Submits</p>
                <p className="text-3xl font-bold mt-1">{currentData?.formSubmits || 0}</p>
                <TrendBadge trend={currentData?.trends?.formSubmits} />
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">Form Opens</p>
                <p className="text-3xl font-bold mt-1">{currentData?.formOpens || 0}</p>
              </div>
            </div>
          </div>

          {/* Conversion Funnel Chart */}
          {data?.conversionChart && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📈 Appointment Clicks → Form Fills</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConversionChartView('7days')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      conversionChartView === '7days'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setConversionChartView('14days')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      conversionChartView === '14days'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Last 14 Days
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Summary Stats */}
                {(() => {
                  const chartData = conversionChartView === '7days' 
                    ? data.conversionChart?.weekly 
                    : data.conversionChart?.daily;
                  const totalClicks = chartData?.reduce((sum, d) => sum + d.appointmentClicks, 0) || 0;
                  const totalFills = chartData?.reduce((sum, d) => sum + d.formSubmits, 0) || 0;
                  const avgConversion = totalClicks > 0 ? Math.round((totalFills / totalClicks) * 100) : 0;

                  return (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">{totalClicks}</p>
                        <p className="text-sm text-purple-700">Total Appointment Clicks</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{totalFills}</p>
                        <p className="text-sm text-green-700">Total Form Fills</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{avgConversion}%</p>
                        <p className="text-sm text-blue-700">Avg Conversion Rate</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Stacked Bar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={conversionChartView === '7days' ? data.conversionChart?.weekly : data.conversionChart?.daily}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        formatter={(value: number, name: string) => {
                          const displayName = name === 'appointmentClicks' ? 'Appointment Clicks' : 'Form Fills';
                          return [value, displayName];
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend 
                        formatter={(value) => value === 'appointmentClicks' ? 'Appointment Clicks' : 'Form Fills'}
                      />
                      <Bar 
                        dataKey="appointmentClicks" 
                        name="appointmentClicks"
                        fill="#8B5CF6" 
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                      />
                      <Bar 
                        dataKey="formSubmits" 
                        name="formSubmits"
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Conversion Rate Line */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">📉 Daily Conversion Rate</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={conversionChartView === '7days' ? data.conversionChart?.weekly : data.conversionChart?.daily}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="conversionRate" 
                          stroke="#F59E0B" 
                          strokeWidth={2}
                          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#F59E0B' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  Updated daily from Google Analytics
                </p>
              </div>
            </div>
          )}

          {/* Form Funnel */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Form Funnel</h3>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">📂</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{currentData?.formOpens || 0}</p>
                  <p className="text-xs text-gray-500">Form Opens</p>
                </div>
                <div className="text-center relative">
                  <div className="absolute left-0 top-8 w-full h-0.5 bg-gray-200 -z-10"></div>
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">✏️</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{currentData?.formStarts || 0}</p>
                  <p className="text-xs text-gray-500">Form Starts</p>
                </div>
                <div className="text-center relative">
                  <div className="absolute left-0 top-8 w-full h-0.5 bg-gray-200 -z-10"></div>
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{currentData?.formSubmits || 0}</p>
                  <p className="text-xs text-gray-500">Submissions</p>
                </div>
                <div className="text-center relative">
                  <div className="absolute left-0 top-8 w-full h-0.5 bg-gray-200 -z-10"></div>
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">❌</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">{currentData?.formAbandons || 0}</p>
                  <p className="text-xs text-gray-500">Abandons</p>
                </div>
              </div>
              
              {/* Conversion Rate */}
              {currentData && currentData.formOpens > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">Form Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {((currentData.formSubmits / currentData.formOpens) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Top Pages and Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Pages */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Top Pages</h3>
              {currentData?.topPages && currentData.topPages.length > 0 ? (
                <>
                  <div className="space-y-3 mb-4">
                    {currentData.topPages.map((page, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-700">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-700 font-mono truncate max-w-[200px]">{page.page}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{page.views}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentData.topPages} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <YAxis 
                          type="category" 
                          dataKey="page" 
                          tick={{ fontSize: 10, fill: '#6B7280' }}
                          width={100}
                          tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + '...' : value}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="views" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>

            {/* Top Sources */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🌐 Traffic Sources</h3>
              {currentData?.topSources && currentData.topSources.length > 0 ? (
                <div className="flex items-center gap-8">
                  <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentData.topSources}
                          dataKey="users"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                        >
                          {currentData.topSources.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {currentData.topSources.map((source, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          ></span>
                          <span className="text-sm text-gray-700">{source.source || 'Direct'}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{source.users}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Top Cities</h3>
            {currentData?.topCities && currentData.topCities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {currentData.topCities.map((city, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{city.users}</p>
                    <p className="text-sm text-gray-600 mt-1">{city.city}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </div>

          {/* Data freshness note */}
          <div className="text-center text-xs text-gray-400">
            Data from Google Analytics • pupperazipetspa.com
          </div>
        </>
      )}
    </AdminLayout>
  );
}
