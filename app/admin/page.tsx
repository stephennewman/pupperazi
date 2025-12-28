'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface DashboardStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byStatus: Record<string, number>;
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

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const response = await fetch('/api/admin/leads/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRecentLeads(data.recentLeads || []);
      } else {
        setError(data.error || 'Failed to load data');
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Today's Leads</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.today || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.thisWeek || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.thisMonth || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.total || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                New
              </span>
              <span className="font-semibold">{stats?.byStatus?.new || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Contacted
              </span>
              <span className="font-semibold">{stats?.byStatus?.contacted || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Booked
              </span>
              <span className="font-semibold">{stats?.byStatus?.booked || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                Closed
              </span>
              <span className="font-semibold">{stats?.byStatus?.closed || 0}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/leads')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition-colors"
            >
              <span className="text-2xl mb-2 block">📋</span>
              <span className="font-semibold text-purple-900">View All Leads</span>
              <p className="text-sm text-purple-700 mt-1">Manage customer inquiries</p>
            </button>
            <button
              onClick={() => router.push('/admin/leads?status=new')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition-colors"
            >
              <span className="text-2xl mb-2 block">🆕</span>
              <span className="font-semibold text-blue-900">New Leads</span>
              <p className="text-sm text-blue-700 mt-1">{stats?.byStatus?.new || 0} awaiting response</p>
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
