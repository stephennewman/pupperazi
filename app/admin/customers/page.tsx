'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface RepeatCustomer {
  email: string;
  name: string;
  phone: string;
  totalAppointments: number;
  appointmentsLast90Days: number;
  appointmentsLast30Days: number;
  firstVisit: string;
  lastVisit: string;
  petInfo: string[];
  avgDaysBetweenVisits: number | null;
}

interface Summary {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  activeIn90Days: number;
  activeIn30Days: number;
  avgAppointmentsPerCustomer: string;
}

type SortField = 'name' | 'totalAppointments' | 'appointmentsLast90Days' | 'appointmentsLast30Days' | 'lastVisit' | 'avgDaysBetweenVisits';
type SortDirection = 'asc' | 'desc';

export default function AdminCustomers() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<RepeatCustomer[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalAppointments');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filter, setFilter] = useState<'all' | 'repeat' | 'active90' | 'active30'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }
    fetchCustomers(token);
  }, [router]);

  const fetchCustomers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/customers/repeat', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/portal-login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to load data');
      }
    } catch {
      setError('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCustomers = [...customers]
    .filter(c => {
      // Apply filter
      if (filter === 'repeat' && c.totalAppointments < 2) return false;
      if (filter === 'active90' && c.appointmentsLast90Days === 0) return false;
      if (filter === 'active30' && c.appointmentsLast30Days === 0) return false;
      
      // Apply search
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          c.petInfo.some(p => p.toLowerCase().includes(search))
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aVal: string | number = 0;
      let bVal: string | number = 0;

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'totalAppointments':
          aVal = a.totalAppointments;
          bVal = b.totalAppointments;
          break;
        case 'appointmentsLast90Days':
          aVal = a.appointmentsLast90Days;
          bVal = b.appointmentsLast90Days;
          break;
        case 'appointmentsLast30Days':
          aVal = a.appointmentsLast30Days;
          bVal = b.appointmentsLast30Days;
          break;
        case 'lastVisit':
          aVal = new Date(a.lastVisit).getTime();
          bVal = new Date(b.lastVisit).getTime();
          break;
        case 'avgDaysBetweenVisits':
          aVal = a.avgDaysBetweenVisits || 999;
          bVal = b.avgDaysBetweenVisits || 999;
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-purple-600 ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Customers" subtitle="Track repeat customers and visit patterns" activeTab="customers">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalCustomers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Repeat Customers</p>
            <p className="text-2xl font-bold text-purple-600">{summary.repeatCustomers}</p>
            <p className="text-xs text-gray-400">{summary.repeatRate}% of total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Active (90 days)</p>
            <p className="text-2xl font-bold text-green-600">{summary.activeIn90Days}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Active (30 days)</p>
            <p className="text-2xl font-bold text-blue-600">{summary.activeIn30Days}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Avg Appts/Customer</p>
            <p className="text-2xl font-bold text-amber-600">{summary.avgAppointmentsPerCustomer}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-4 text-white">
            <p className="text-sm opacity-90">Repeat Rate</p>
            <p className="text-2xl font-bold">{summary.repeatRate}%</p>
            <p className="text-xs opacity-75">2+ visits</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, phone, or pet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setFilter('repeat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'repeat' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Repeat ({customers.filter(c => c.totalAppointments >= 2).length})
            </button>
            <button
              onClick={() => setFilter('active90')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active90' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active 90d
            </button>
            <button
              onClick={() => setFilter('active30')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active30' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active 30d
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Customer <SortIcon field="name" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pet(s)
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalAppointments')}
                >
                  Total <SortIcon field="totalAppointments" />
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('appointmentsLast90Days')}
                >
                  Last 90d <SortIcon field="appointmentsLast90Days" />
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('appointmentsLast30Days')}
                >
                  Last 30d <SortIcon field="appointmentsLast30Days" />
                </th>
                <th 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('avgDaysBetweenVisits')}
                >
                  Avg Days <SortIcon field="avgDaysBetweenVisits" />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastVisit')}
                >
                  Last Visit <SortIcon field="lastVisit" />
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                sortedCustomers.map((customer, idx) => (
                  <tr key={customer.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-sm text-gray-400">{customer.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        {customer.petInfo.slice(0, 2).map((pet, i) => (
                          <p key={i} className="text-sm text-gray-600 truncate">{pet}</p>
                        ))}
                        {customer.petInfo.length > 2 && (
                          <p className="text-xs text-gray-400">+{customer.petInfo.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        customer.totalAppointments >= 5 ? 'bg-purple-100 text-purple-700' :
                        customer.totalAppointments >= 2 ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {customer.totalAppointments}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-medium ${
                        customer.appointmentsLast90Days > 0 ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {customer.appointmentsLast90Days}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-medium ${
                        customer.appointmentsLast30Days > 0 ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {customer.appointmentsLast30Days}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {customer.avgDaysBetweenVisits ? (
                        <span className={`text-sm ${
                          customer.avgDaysBetweenVisits <= 45 ? 'text-green-600' :
                          customer.avgDaysBetweenVisits <= 60 ? 'text-amber-600' :
                          'text-gray-500'
                        }`}>
                          {customer.avgDaysBetweenVisits}d
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(customer.lastVisit)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <a
                          href={`mailto:${customer.email}`}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Send email"
                        >
                          ✉️
                        </a>
                        {customer.phone && (
                          <>
                            <a
                              href={`tel:${customer.phone}`}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Call"
                            >
                              📞
                            </a>
                            <a
                              href={`sms:${customer.phone}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Text"
                            >
                              💬
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
          Showing {sortedCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <h3 className="font-semibold text-amber-900 mb-3">🔔 Re-engagement Opportunity</h3>
          <p className="text-amber-800 text-sm mb-3">
            Customers who haven't visited in 60+ days but were previously active:
          </p>
          <p className="text-2xl font-bold text-amber-700">
            {customers.filter(c => {
              if (c.totalAppointments < 2) return false;
              const daysSince = (Date.now() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24);
              return daysSince >= 60;
            }).length}
          </p>
          <p className="text-xs text-amber-600 mt-1">Consider sending a "We miss you!" email</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-semibold text-green-900 mb-3">⭐ VIP Customers</h3>
          <p className="text-green-800 text-sm mb-3">
            Customers with 3+ appointments (loyal regulars):
          </p>
          <p className="text-2xl font-bold text-green-700">
            {customers.filter(c => c.totalAppointments >= 3).length}
          </p>
          <p className="text-xs text-green-600 mt-1">Consider a loyalty reward or referral program</p>
        </div>
      </div>
    </AdminLayout>
  );
}
