'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_new_customer: string;
  pet_info: string;
  requested_datetime: string;
  message: string;
  status: string;
  source: string;
  created_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  is_test?: boolean;
}

export default function AdminLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Read status filter from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      if (status) setStatusFilter(status);
    }
  }, []);

  const fetchLeads = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/portal-login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setLeads(data.leads || []);
      } else {
        setError(data.error || 'Failed to load leads');
      }
    } catch {
      setError('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }
    fetchLeads(token);
  }, [router, fetchLeads]);

  useEffect(() => {
    let filtered = leads;

    // Filter by customer type
    if (statusFilter === 'new_customer') {
      filtered = filtered.filter(lead => lead.is_new_customer === 'yes');
    } else if (statusFilter === 'returning') {
      filtered = filtered.filter(lead => lead.is_new_customer === 'no');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        (lead.name?.toLowerCase() || '').includes(term) ||
        (lead.email?.toLowerCase() || '').includes(term) ||
        (lead.phone || '').includes(term) ||
        (lead.pet_info?.toLowerCase() || '').includes(term)
      );
    }

    setFilteredLeads(filtered);
  }, [leads, statusFilter, searchTerm]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Appointments" subtitle="Manage appointment requests" activeTab="appointments">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, phone, or pet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'new_customer', 'returning'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'new_customer' ? '⭐ New Customers' : '🔄 Returning'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">{leads.filter(l => l.is_new_customer === 'yes').length}</p>
          <p className="text-sm text-purple-600">⭐ New Customers</p>
        </div>
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-teal-700">{leads.filter(l => l.is_new_customer === 'no').length}</p>
          <p className="text-sm text-teal-600">🔄 Returning</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-gray-700">{leads.length}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No appointments match your filters.' 
                      : 'No appointments yet. They\'ll appear here when customers submit the form.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {lead.name || 'Unknown'}
                          {lead.is_test && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                              TEST
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        {lead.phone && <p className="text-sm text-gray-500">{lead.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{lead.pet_info || '-'}</p>
                      {lead.requested_datetime && (
                        <p className="text-xs text-gray-500 mt-1">
                          Requested: {lead.requested_datetime}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        lead.is_new_customer === 'yes' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {lead.is_new_customer === 'yes' ? '⭐ New' : '🔄 Returning'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/admin/leads/${lead.id}`)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium cursor-pointer"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mt-4">
        Showing {filteredLeads.length} of {leads.length} appointments
      </p>
    </AdminLayout>
  );
}

