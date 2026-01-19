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

interface VisitorConversionDataPoint {
  date: string;
  label: string;
  totalVisitors: number;
  appointmentClicks: number;
  conversionRate: number;
}

interface DayOfWeekDataPoint {
  day: string;
  dayIndex: number;
  visitors: number;
  appointmentClicks: number;
  formSubmits: number;
  clickRate: number;
  conversionRate: number;
}

interface TimeOfDayDataPoint {
  bucket: string;
  timeRange: string;
  visitors: number;
  appointmentClicks: number;
  formSubmits: number;
  clickRate: number;
  conversionRate: number;
}

interface DayTimeSlot {
  day: string;
  dayIndex: number;
  bucket: string;
  timeRange: string;
  visitors: number;
  appointmentClicks: number;
  formSubmits: number;
  clickRate: number;
  intensity: number;
  isOpportunity: boolean;
}

interface AnalyticsDataWithChart extends AnalyticsData {
  chart: ConversionDataPoint[];
  visitorChart: VisitorConversionDataPoint[];
}

interface AnalyticsResponse {
  success: boolean;
  configured: boolean;
  daily?: AnalyticsDataWithChart;
  weekly?: AnalyticsDataWithChart;
  monthly?: AnalyticsDataWithChart;
  dayOfWeek?: DayOfWeekDataPoint[];
  timeOfDay?: TimeOfDayDataPoint[];
  dayTimeHeatmap?: DayTimeSlot[];
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

          {/* Visitor to Appointment Click Chart */}
          {currentData?.visitorChart && currentData.visitorChart.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👥 Visitors → Appointment Clicks
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({activeTab === 'daily' ? 'Last 14 Days' : activeTab === 'weekly' ? 'Last 8 Weeks' : 'Last 6 Months'})
                </span>
              </h3>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Summary Stats */}
                {(() => {
                  const chartData = currentData.visitorChart;
                  const totalVisitors = chartData.reduce((sum, d) => sum + d.totalVisitors, 0);
                  const totalClicks = chartData.reduce((sum, d) => sum + d.appointmentClicks, 0);
                  const avgConversion = totalVisitors > 0 ? Math.round((totalClicks / totalVisitors) * 100) : 0;

                  return (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{totalVisitors.toLocaleString()}</p>
                        <p className="text-sm text-blue-700">Total Visitors</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">{totalClicks}</p>
                        <p className="text-sm text-purple-700">Appointment Clicks</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <p className="text-3xl font-bold text-amber-600">{avgConversion}%</p>
                        <p className="text-sm text-amber-700">Click-Through Rate</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Stacked Bar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={currentData.visitorChart.map(d => ({
                        ...d,
                        nonClickers: d.totalVisitors - d.appointmentClicks,
                      }))}
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
                          const displayName = name === 'appointmentClicks' ? 'Clicked Appointment' : 'Did Not Click';
                          return [value.toLocaleString(), displayName];
                        }}
                        labelFormatter={(label) => `${activeTab === 'daily' ? 'Date' : activeTab === 'weekly' ? 'Week of' : 'Month'}: ${label}`}
                      />
                      <Legend 
                        formatter={(value) => value === 'appointmentClicks' ? 'Clicked Appointment' : 'Did Not Click'}
                      />
                      <Bar 
                        dataKey="nonClickers" 
                        name="nonClickers"
                        fill="#CBD5E1" 
                        stackId="visitors"
                      />
                      <Bar 
                        dataKey="appointmentClicks" 
                        name="appointmentClicks"
                        fill="#8B5CF6" 
                        stackId="visitors"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Conversion Rate Line */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    📉 {activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly'} Click-Through Rate
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={currentData.visitorChart}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="label" 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          domain={[0, 'auto']}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Click-Through Rate']}
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
              </div>
            </div>
          )}

          {/* Appointment Click to Form Fill Chart */}
          {currentData?.chart && currentData.chart.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Appointment Clicks → Form Fills
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({activeTab === 'daily' ? 'Last 14 Days' : activeTab === 'weekly' ? 'Last 8 Weeks' : 'Last 6 Months'})
                </span>
              </h3>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Summary Stats */}
                {(() => {
                  const chartData = currentData.chart;
                  const totalClicks = chartData.reduce((sum, d) => sum + d.appointmentClicks, 0);
                  const totalFills = chartData.reduce((sum, d) => sum + d.formSubmits, 0);
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
                      data={currentData.chart}
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
                        labelFormatter={(label) => `${activeTab === 'daily' ? 'Date' : activeTab === 'weekly' ? 'Week of' : 'Month'}: ${label}`}
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    📉 {activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly'} Conversion Rate
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={currentData.chart}
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

          {/* Day of Week Performance */}
          {data?.dayOfWeek && data.dayOfWeek.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📅 Day of Week Performance
                <span className="text-sm font-normal text-gray-500 ml-2">(Last 30 Days)</span>
              </h3>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Best/Worst Days */}
                {(() => {
                  const sorted = [...data.dayOfWeek].sort((a, b) => b.visitors - a.visitors);
                  const bestDay = sorted[0];
                  const worstDay = sorted[sorted.length - 1];
                  const bestConversion = [...data.dayOfWeek].sort((a, b) => b.clickRate - a.clickRate)[0];

                  return (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 mb-1">Most Visitors</p>
                        <p className="text-2xl font-bold text-green-600">{bestDay.day}</p>
                        <p className="text-xs text-green-600">{bestDay.visitors} visitors</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700 mb-1">Best Click Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{bestConversion.day}</p>
                        <p className="text-xs text-purple-600">{bestConversion.clickRate}% CTR</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-1">Fewest Visitors</p>
                        <p className="text-2xl font-bold text-gray-600">{worstDay.day}</p>
                        <p className="text-xs text-gray-600">{worstDay.visitors} visitors</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Stacked Bar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={data.dayOfWeek}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                        tickFormatter={(value) => value.slice(0, 3)}
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
                          const names: Record<string, string> = {
                            visitors: 'Visitors',
                            appointmentClicks: 'Appointment Clicks',
                            formSubmits: 'Form Fills',
                          };
                          return [value.toLocaleString(), names[name] || name];
                        }}
                      />
                      <Legend 
                        formatter={(value) => {
                          const names: Record<string, string> = {
                            visitors: 'Visitors',
                            appointmentClicks: 'Appointment Clicks',
                            formSubmits: 'Form Fills',
                          };
                          return names[value] || value;
                        }}
                      />
                      <Bar 
                        dataKey="visitors" 
                        name="visitors"
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="appointmentClicks" 
                        name="appointmentClicks"
                        fill="#8B5CF6" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="formSubmits" 
                        name="formSubmits"
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Click Rate by Day */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">📉 Click-Through Rate by Day</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={data.dayOfWeek}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6B7280' }}
                          domain={[0, 'auto']}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Click-Through Rate']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="clickRate" 
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
                  Aggregated from the last 30 days
                </p>
              </div>
            </div>
          )}

          {/* Time of Day Performance */}
          {data?.timeOfDay && data.timeOfDay.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🕐 Time of Day Performance
                <span className="text-sm font-normal text-gray-500 ml-2">(Last 30 Days)</span>
              </h3>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Best Time Slot */}
                {(() => {
                  const sortedByVisitors = [...data.timeOfDay].sort((a, b) => b.visitors - a.visitors);
                  const bestTraffic = sortedByVisitors[0];
                  const sortedByClickRate = [...data.timeOfDay].sort((a, b) => b.clickRate - a.clickRate);
                  const bestConversion = sortedByClickRate[0];
                  const sortedByFills = [...data.timeOfDay].sort((a, b) => b.formSubmits - a.formSubmits);
                  const mostFills = sortedByFills[0];

                  return (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 mb-1">Most Traffic</p>
                        <p className="text-xl font-bold text-blue-600">{bestTraffic.bucket}</p>
                        <p className="text-xs text-blue-500">{bestTraffic.timeRange}</p>
                        <p className="text-xs text-blue-600 mt-1">{bestTraffic.visitors} visitors</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700 mb-1">Best Click Rate</p>
                        <p className="text-xl font-bold text-purple-600">{bestConversion.bucket}</p>
                        <p className="text-xs text-purple-500">{bestConversion.timeRange}</p>
                        <p className="text-xs text-purple-600 mt-1">{bestConversion.clickRate}% CTR</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700 mb-1">Most Form Fills</p>
                        <p className="text-xl font-bold text-green-600">{mostFills.bucket}</p>
                        <p className="text-xs text-green-500">{mostFills.timeRange}</p>
                        <p className="text-xs text-green-600 mt-1">{mostFills.formSubmits} fills</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Bar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={data.timeOfDay}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="bucket" 
                        tick={{ fontSize: 11, fill: '#6B7280' }}
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
                          const names: Record<string, string> = {
                            visitors: 'Visitors',
                            appointmentClicks: 'Appointment Clicks',
                            formSubmits: 'Form Fills',
                          };
                          return [value.toLocaleString(), names[name] || name];
                        }}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload as TimeOfDayDataPoint | undefined;
                          return item ? `${label} (${item.timeRange})` : label;
                        }}
                      />
                      <Legend 
                        formatter={(value) => {
                          const names: Record<string, string> = {
                            visitors: 'Visitors',
                            appointmentClicks: 'Appointment Clicks',
                            formSubmits: 'Form Fills',
                          };
                          return names[value] || value;
                        }}
                      />
                      <Bar 
                        dataKey="visitors" 
                        name="visitors"
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="appointmentClicks" 
                        name="appointmentClicks"
                        fill="#8B5CF6" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="formSubmits" 
                        name="formSubmits"
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Time Breakdown Table */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">📊 Breakdown by Time Slot</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-600">Time Slot</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">Visitors</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">Clicks</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">Fills</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">CTR</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-600">Conv.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.timeOfDay.map((slot, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <span className="font-medium text-gray-900">{slot.bucket}</span>
                              <span className="text-gray-500 text-xs ml-2">({slot.timeRange})</span>
                            </td>
                            <td className="text-right py-2 px-3 text-gray-700">{slot.visitors.toLocaleString()}</td>
                            <td className="text-right py-2 px-3 text-purple-600 font-medium">{slot.appointmentClicks}</td>
                            <td className="text-right py-2 px-3 text-green-600 font-medium">{slot.formSubmits}</td>
                            <td className="text-right py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                slot.clickRate >= 10 ? 'bg-green-100 text-green-700' : 
                                slot.clickRate >= 5 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {slot.clickRate}%
                              </span>
                            </td>
                            <td className="text-right py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                slot.conversionRate >= 50 ? 'bg-green-100 text-green-700' : 
                                slot.conversionRate >= 25 ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {slot.conversionRate}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  Aggregated from the last 30 days • Times in your local timezone
                </p>
              </div>
            </div>
          )}

          {/* Day + Time Heatmap with Opportunities */}
          {data?.dayTimeHeatmap && data.dayTimeHeatmap.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Booking Opportunity Finder
                <span className="text-sm font-normal text-gray-500 ml-2">(Last 30 Days)</span>
              </h3>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {/* Opportunity Slots */}
                {(() => {
                  const opportunities = data.dayTimeHeatmap.filter(s => s.isOpportunity);
                  const topSlots = [...data.dayTimeHeatmap]
                    .filter(s => s.visitors > 0)
                    .sort((a, b) => b.visitors - a.visitors)
                    .slice(0, 3);

                  return (
                    <>
                      {opportunities.length > 0 && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                          <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                            <span>💡</span> Suggested Promo Slots (Low Traffic = Opportunity)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {opportunities.slice(0, 6).map((slot, i) => (
                              <div key={i} className="bg-white rounded-lg p-3 border border-amber-200 shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-gray-900">{slot.day}</span>
                                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                    Low traffic
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{slot.bucket} ({slot.timeRange})</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Only {slot.visitors} visitors • Consider "Book Now" promo
                                </p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-amber-700 mt-3">
                            💡 These time slots have lower organic traffic — perfect for "Book during slow hours" promotions or discounts
                          </p>
                        </div>
                      )}

                      {/* Peak Times for reference */}
                      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <span>🔥</span> Peak Times (High Demand)
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {topSlots.map((slot, i) => (
                            <div key={i} className="bg-white rounded-lg px-4 py-2 border border-green-200 shadow-sm">
                              <span className="font-semibold text-gray-900">{slot.day}</span>
                              <span className="text-gray-500 mx-2">•</span>
                              <span className="text-gray-600">{slot.bucket}</span>
                              <span className="text-green-600 font-medium ml-2">({slot.visitors} visitors)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Heatmap Grid */}
                <h4 className="text-sm font-semibold text-gray-700 mb-3">📊 Traffic Heatmap by Day & Time</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-gray-600 w-24">Day</th>
                        <th className="text-center py-2 px-3 font-medium text-gray-600">Morning<br/><span className="text-xs font-normal">8am-11am</span></th>
                        <th className="text-center py-2 px-3 font-medium text-gray-600">Lunch<br/><span className="text-xs font-normal">11am-2pm</span></th>
                        <th className="text-center py-2 px-3 font-medium text-gray-600">Afternoon<br/><span className="text-xs font-normal">2pm-6pm</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                        const daySlots = data.dayTimeHeatmap.filter(s => s.day === day);
                        return (
                          <tr key={day} className="border-t border-gray-100">
                            <td className="py-2 px-3 font-medium text-gray-900">{day.slice(0, 3)}</td>
                            {['Morning', 'Lunch', 'Afternoon'].map(bucket => {
                              const slot = daySlots.find(s => s.bucket === bucket);
                              if (!slot) return <td key={bucket} className="py-2 px-3 text-center">-</td>;
                              
                              // Color based on intensity
                              const bgColor = slot.isOpportunity
                                ? 'bg-amber-100 border-amber-300'
                                : slot.intensity > 70
                                ? 'bg-green-200 border-green-400'
                                : slot.intensity > 40
                                ? 'bg-blue-100 border-blue-300'
                                : 'bg-gray-100 border-gray-300';

                              return (
                                <td key={bucket} className="py-2 px-2 text-center">
                                  <div className={`rounded-lg p-2 border ${bgColor} relative`}>
                                    <p className="font-bold text-gray-900">{slot.visitors}</p>
                                    <p className="text-xs text-gray-600">visitors</p>
                                    {slot.appointmentClicks > 0 && (
                                      <p className="text-xs text-purple-600 mt-1">{slot.appointmentClicks} clicks</p>
                                    )}
                                    {slot.isOpportunity && (
                                      <span className="absolute -top-1 -right-1 text-amber-500">💡</span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-200 border border-green-400"></div>
                    <span className="text-gray-600">High traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                    <span className="text-gray-600">Medium traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                    <span className="text-gray-600">Low traffic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
                    <span className="text-gray-600">💡 Promo opportunity</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  Based on last 30 days • Low traffic slots are opportunities for "Book Now" promotions
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
