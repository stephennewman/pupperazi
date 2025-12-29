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
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardStats {
  total: number;
  today: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  byStatus: Record<string, number>;
}

interface CustomerAcquisition {
  currentMonth: {
    name: string;
    total: number;
    newCustomers: number;
    returningCustomers: number;
    newCustomerPct: number;
  };
  previousMonth: {
    name: string;
    total: number;
    newCustomers: number;
    returningCustomers: number;
    newCustomerPct: number;
  };
  trend: number;
}

interface WeeklyMetrics {
  currentWeek: {
    total: number;
    newCustomers: number;
    returningCustomers: number;
    newCustomerPct: number;
    dailyAvg: number;
  };
  previousWeek: {
    total: number;
    newCustomers: number;
    returningCustomers: number;
    newCustomerPct: number;
    dailyAvg: number;
  };
  weekOverWeekChange: number;
  weekOverWeekNewCustomerChange: number;
}

interface RecentLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  created_at: string;
  utm_source?: string;
}

interface TrafficData {
  configured: boolean;
  today?: {
    visitors: number;
    pageViews: number;
    appointmentClicks: number;
    phoneClicks: number;
  };
  week?: {
    visitors: number;
    pageViews: number;
    appointmentClicks: number;
    phoneClicks: number;
    avgSessionDuration: string;
    bounceRate: string;
  };
  month?: {
    visitors: number;
    pageViews: number;
    topPages: { page: string; views: number }[];
    topSources: { source: string; users: number }[];
    topCities: { city: string; users: number }[];
  };
}

interface ChartDataPoint {
  week?: string;
  label?: string;
  month?: string;
  day?: string;
  date?: string;
  total: number;
  new: number;
  returning: number;
}

interface WeekToWeekDataPoint {
  day: string;
  date: string;
  thisWeek: number | null;
  lastWeek: number;
  thisWeekNew: number | null;
  lastWeekNew: number;
}

interface ChartData {
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
  daily: ChartDataPoint[];
  weekToWeek: WeekToWeekDataPoint[];
}

const CHART_COLORS = {
  total: '#8B5CF6',
  new: '#A855F7',
  returning: '#14B8A6',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [acquisition, setAcquisition] = useState<CustomerAcquisition | null>(null);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [activeChart, setActiveChart] = useState<'weekly' | 'monthly' | 'daily'>('weekly');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      // Fetch leads stats and traffic data in parallel
      const [leadsResponse, trafficResponse] = await Promise.all([
        fetch('/api/admin/leads/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/traffic', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (leadsResponse.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/portal-login');
        return;
      }

      const leadsData = await leadsResponse.json();
      if (leadsData.success) {
        setStats(leadsData.stats);
        setRecentLeads(leadsData.recentLeads || []);
        if (leadsData.customerAcquisition) {
          setAcquisition(leadsData.customerAcquisition);
        }
        if (leadsData.weeklyMetrics) {
          setWeeklyMetrics(leadsData.weeklyMetrics);
        }
        if (leadsData.chartData) {
          setChartData(leadsData.chartData);
        }
      } else {
        setError(leadsData.error || 'Failed to load data');
      }

      // Traffic data (may not be configured)
      const trafficData = await trafficResponse.json();
      if (trafficData.success || trafficData.configured === false) {
        setTraffic(trafficData);
      }
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your business" activeTab="dashboard">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Leads Stats Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Leads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.today || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.thisWeek || 0}</p>
                {weeklyMetrics && (
                  <p className={`text-xs mt-1 ${weeklyMetrics.weekOverWeekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyMetrics.weekOverWeekChange >= 0 ? '↑' : '↓'} {Math.abs(weeklyMetrics.weekOverWeekChange)}% vs last week
                  </p>
                )}
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.thisMonth || 0}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total || 0}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🐾</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Metrics */}
      {weeklyMetrics && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Weekly Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* This Week vs Last Week */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm p-5 text-white">
              <p className="text-sm font-medium opacity-90">This Week</p>
              <p className="text-3xl font-bold mt-1">{weeklyMetrics.currentWeek.total}</p>
              <p className="text-xs opacity-75 mt-2">vs {weeklyMetrics.previousWeek.total} last week</p>
              <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${weeklyMetrics.weekOverWeekChange >= 0 ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                {weeklyMetrics.weekOverWeekChange >= 0 ? '↑' : '↓'} {Math.abs(weeklyMetrics.weekOverWeekChange)}%
              </div>
            </div>

            {/* Daily Average */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Daily Avg (This Week)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{weeklyMetrics.currentWeek.dailyAvg}</p>
              <p className="text-xs text-gray-500 mt-2">vs {weeklyMetrics.previousWeek.dailyAvg}/day last week</p>
            </div>

            {/* New Customers This Week */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">New Customers</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold text-purple-600">{weeklyMetrics.currentWeek.newCustomers}</p>
                <p className="text-sm text-gray-500 mb-1">/ {weeklyMetrics.currentWeek.total}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">{weeklyMetrics.currentWeek.newCustomerPct}% of this week's leads</p>
            </div>

            {/* Returning Customers This Week */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Returning Customers</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold text-teal-600">{weeklyMetrics.currentWeek.returningCustomers}</p>
                <p className="text-sm text-gray-500 mb-1">/ {weeklyMetrics.currentWeek.total}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">{100 - weeklyMetrics.currentWeek.newCustomerPct}% of this week's leads</p>
            </div>
          </div>

          {/* Week-over-Week Comparison */}
          <div className="mt-4 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Week-over-Week Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Last Week Total</p>
                <p className="text-xl font-bold text-gray-700">{weeklyMetrics.previousWeek.total}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Last Week New</p>
                <p className="text-xl font-bold text-purple-600">{weeklyMetrics.previousWeek.newCustomers}</p>
                <p className="text-xs text-gray-400">{weeklyMetrics.previousWeek.newCustomerPct}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Last Week Returning</p>
                <p className="text-xl font-bold text-teal-600">{weeklyMetrics.previousWeek.returningCustomers}</p>
              </div>
              <div className={`text-center p-3 rounded-lg ${weeklyMetrics.weekOverWeekNewCustomerChange >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                <p className="text-xs text-gray-500 mb-1">New Customer Rate Δ</p>
                <p className={`text-xl font-bold ${weeklyMetrics.weekOverWeekNewCustomerChange >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {weeklyMetrics.weekOverWeekNewCustomerChange >= 0 ? '+' : ''}{weeklyMetrics.weekOverWeekNewCustomerChange}%
                </p>
              </div>
            </div>
          </div>

          {/* Week to Week Chart */}
          {chartData?.weekToWeek && (
            <div className="mt-4 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">📅 This Week vs Last Week (by Day)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.weekToWeek} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="day" 
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
                      formatter={(value, name) => {
                        if (value === null) return ['—', name];
                        return [value, name];
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return payload[0].payload.date;
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="thisWeek" 
                      name="This Week" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="lastWeek" 
                      name="Last Week" 
                      fill="#CBD5E1" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500"></div>
                  <span className="text-gray-600">This Week: <span className="font-semibold">{weeklyMetrics.currentWeek.total}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-300"></div>
                  <span className="text-gray-600">Last Week: <span className="font-semibold">{weeklyMetrics.previousWeek.total}</span></span>
                </div>
                <div className={`flex items-center gap-2 px-2 py-1 rounded ${weeklyMetrics.weekOverWeekChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <span className={`font-semibold ${weeklyMetrics.weekOverWeekChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {weeklyMetrics.weekOverWeekChange >= 0 ? '↑' : '↓'} {Math.abs(weeklyMetrics.weekOverWeekChange)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts Section */}
      {chartData && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📊 Lead Trends</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChart('daily')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeChart === 'daily'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setActiveChart('weekly')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeChart === 'weekly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setActiveChart('monthly')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeChart === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Main Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {activeChart === 'daily' && 'Last 14 Days'}
              {activeChart === 'weekly' && 'Last 8 Weeks'}
              {activeChart === 'monthly' && 'Last 6 Months'}
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    activeChart === 'daily'
                      ? chartData.daily
                      : activeChart === 'weekly'
                      ? chartData.weekly
                      : chartData.monthly
                  }
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey={activeChart === 'daily' ? 'day' : activeChart === 'weekly' ? 'label' : 'month'}
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
                  />
                  <Legend />
                  <Bar
                    dataKey="new"
                    name="New Customers"
                    fill={CHART_COLORS.new}
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="returning"
                    name="Returning"
                    fill={CHART_COLORS.returning}
                    radius={[4, 4, 0, 0]}
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New vs Returning Comparison Chart */}
          <div className="mt-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">New vs Returning Customer Trends (Monthly)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthly} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="new" name="New Customers ⭐" fill="#A855F7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" name="Returning" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Customer Acquisition */}
      {acquisition && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⭐ New Customer Acquisition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Current Month */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{acquisition.currentMonth.name}</h3>
                <span className="text-sm text-gray-500">Current</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-purple-600">{acquisition.currentMonth.newCustomerPct}%</span>
                <span className="text-gray-500 text-sm mb-1">new customers</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <p className="font-semibold text-purple-700">{acquisition.currentMonth.newCustomers}</p>
                  <p className="text-purple-600 text-xs">New ⭐</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-semibold text-gray-700">{acquisition.currentMonth.returningCustomers}</p>
                  <p className="text-gray-600 text-xs">Returning</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">{acquisition.currentMonth.total} total leads</p>
            </div>

            {/* Previous Month */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{acquisition.previousMonth.name}</h3>
                <span className="text-sm text-gray-500">Previous</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-gray-600">{acquisition.previousMonth.newCustomerPct}%</span>
                <span className="text-gray-500 text-sm mb-1">new customers</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <p className="font-semibold text-purple-700">{acquisition.previousMonth.newCustomers}</p>
                  <p className="text-purple-600 text-xs">New ⭐</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-semibold text-gray-700">{acquisition.previousMonth.returningCustomers}</p>
                  <p className="text-gray-600 text-xs">Returning</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">{acquisition.previousMonth.total} total leads</p>
            </div>

            {/* Trend Card */}
            <div className={`rounded-xl shadow-sm p-5 border ${acquisition.trend >= 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Month-over-Month</h3>
                <span className="text-2xl">{acquisition.trend >= 0 ? '📈' : '📉'}</span>
              </div>
              <div className="text-center py-3">
                <span className={`text-4xl font-bold ${acquisition.trend >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {acquisition.trend >= 0 ? '+' : ''}{acquisition.trend}%
                </span>
              </div>
              <p className="text-sm text-center text-gray-600 mt-2">
                {acquisition.trend >= 0 
                  ? 'Higher new customer rate this month!' 
                  : 'More returning customers this month'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Stats Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Website Traffic</h2>
        {!traffic?.configured ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
            <p>Google Analytics not configured</p>
            <p className="text-sm mt-1">Add GA credentials to see traffic data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">Today's Visitors</p>
                <p className="text-2xl font-bold mt-1">{traffic.today?.visitors || 0}</p>
                <p className="text-xs opacity-75 mt-1">{traffic.today?.pageViews || 0} page views</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">7-Day Visitors</p>
                <p className="text-2xl font-bold mt-1">{traffic.week?.visitors || 0}</p>
                <p className="text-xs opacity-75 mt-1">{traffic.week?.pageViews || 0} page views</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">30-Day Visitors</p>
                <p className="text-2xl font-bold mt-1">{traffic.month?.visitors || 0}</p>
                <p className="text-xs opacity-75 mt-1">{traffic.month?.pageViews || 0} page views</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-sm p-5 text-white">
                <p className="text-sm font-medium opacity-90">Engagement</p>
                <p className="text-lg font-bold mt-1">{traffic.week?.avgSessionDuration || '0m 0s'}</p>
                <p className="text-xs opacity-75 mt-1">Bounce: {traffic.week?.bounceRate || '0%'}</p>
              </div>
            </div>

            {/* CTA Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">🎯 CTA Clicks (Last 7 Days)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">{traffic.week?.appointmentClicks || 0}</p>
                    <p className="text-xs text-purple-600">Appointment Clicks</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{traffic.week?.phoneClicks || 0}</p>
                    <p className="text-xs text-green-600">Phone Clicks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📍 Top Traffic Sources</h3>
                <div className="space-y-2">
                  {traffic.month?.topSources?.slice(0, 4).map((source, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{source.source || 'Direct'}</span>
                      <span className="text-sm font-medium text-gray-900">{source.users}</span>
                    </div>
                  )) || <p className="text-sm text-gray-400">No data yet</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/leads')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition-colors"
            >
              <span className="text-2xl mb-2 block">📋</span>
              <span className="font-semibold text-purple-900">View All Leads</span>
              <p className="text-sm text-purple-700 mt-1">Manage customer inquiries</p>
            </button>
            <button
              onClick={() => router.push('/admin/customers')}
              className="p-4 bg-teal-50 hover:bg-teal-100 rounded-xl text-left transition-colors"
            >
              <span className="text-2xl mb-2 block">🔄</span>
              <span className="font-semibold text-teal-900">Repeat Customers</span>
              <p className="text-sm text-teal-700 mt-1">View returning clients</p>
            </button>
            <a
              href="https://pupperazipetspa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-left transition-colors"
            >
              <span className="text-2xl mb-2 block">🌐</span>
              <span className="font-semibold text-green-900">View Website</span>
              <p className="text-sm text-green-700 mt-1">Open public site</p>
            </a>
            <button
              onClick={() => router.push('/admin/settings')}
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
            >
              <span className="text-2xl mb-2 block">⚙️</span>
              <span className="font-semibold text-gray-900">Settings</span>
              <p className="text-sm text-gray-700 mt-1">Configure admin options</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <button
              onClick={() => router.push('/admin/leads')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No leads yet. They'll appear here when customers submit the form.
                  </td>
                </tr>
              ) : (
                recentLeads.slice(0, 5).map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{lead.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{lead.email}</p>
                        {lead.phone && <p className="text-gray-500">{lead.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.utm_source || lead.source || 'Direct'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
