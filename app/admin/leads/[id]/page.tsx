'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  utm_term?: string;
  utm_content?: string;
  notes?: string;
  is_test?: boolean;
}

export default function LeadDetail() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const fetchLead = useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/portal-login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setLead(data.lead);
        setNotes(data.lead.notes || '');
      } else {
        setError(data.error || 'Failed to load lead');
      }
    } catch {
      setError('Failed to load lead details');
    } finally {
      setIsLoading(false);
    }
  }, [leadId, router]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }
    fetchLead(token);
  }, [router, fetchLead]);

  const updateLead = async (updates: Partial<Lead>) => {
    const token = localStorage.getItem('adminToken');
    if (!token || !lead) return;

    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setLead(data.lead);
        setSaveMessage('Saved!');
        setTimeout(() => setSaveMessage(''), 2000);
      } else {
        setSaveMessage('Failed to save');
      }
    } catch {
      setSaveMessage('Failed to save');
    } finally {
      setIsSaving(false);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
          <p className="mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <AdminLayout title="Appointment Not Found" subtitle="" activeTab="appointments">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Appointment not found'}
        </div>
        <button
          onClick={() => router.push('/admin/leads')}
          className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to Appointments
        </button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Appointment Details" subtitle={lead.name || 'Customer Inquiry'} activeTab="appointments">
      {/* Back button */}
      <button
        onClick={() => router.push('/admin/leads')}
        className="mb-6 text-purple-600 hover:text-purple-700 font-medium flex items-center"
      >
        ← Back to Appointments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Name</label>
                <p className="text-gray-900 font-medium">{lead.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Customer Type</label>
                <p className="text-gray-900">
                  {lead.is_new_customer === 'yes' ? '🆕 New Customer' : '🔄 Returning Customer'}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <a href={`mailto:${lead.email}`} className="text-purple-600 hover:text-purple-700 font-medium">
                  {lead.email}
                </a>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone</label>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                    {lead.phone}
                  </a>
                ) : (
                  <p className="text-gray-400">Not provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Pet & Appointment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet & Appointment Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Pet Information</label>
                <p className="text-gray-900">{lead.pet_info || 'Not provided'}</p>
              </div>
              {lead.requested_datetime && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Requested Date/Time</label>
                  <p className="text-gray-900">{lead.requested_datetime}</p>
                </div>
              )}
              {lead.message && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{lead.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Internal Notes</h3>
              {saveMessage && (
                <span className={`text-sm ${saveMessage === 'Saved!' ? 'text-green-600' : 'text-red-600'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 min-h-[120px]"
            />
            <button
              onClick={() => updateLead({ notes })}
              disabled={isSaving}
              className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-2">
              {['new', 'contacted', 'booked', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateLead({ status })}
                  disabled={isSaving || lead.status === status}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    lead.status === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {status === 'new' && '🆕 '}
                  {status === 'contacted' && '📞 '}
                  {status === 'booked' && '✅ '}
                  {status === 'closed' && '📁 '}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Exclude from Stats */}
          <div className={`rounded-xl shadow-sm border p-6 ${lead.is_test ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Exclude from Stats</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mark this as a test record to exclude it from all dashboard statistics and reports.
            </p>
            <button
              onClick={() => updateLead({ is_test: !lead.is_test })}
              disabled={isSaving}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                lead.is_test
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {lead.is_test ? '🚫 Excluded (Click to Include)' : '✓ Included (Click to Exclude)'}
            </button>
            {lead.is_test && (
              <p className="text-xs text-orange-700 mt-2 text-center">
                This record is excluded from all stats
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${lead.email}`}
                className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                ✉️ Send Email
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  📞 Call Customer
                </a>
              )}
              {lead.phone && (
                <a
                  href={`sms:${lead.phone}`}
                  className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  💬 Send Text
                </a>
              )}
            </div>
          </div>

          {/* Source Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Source & Tracking</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Source</span>
                <span className="text-gray-900 font-medium">{lead.source || 'Direct'}</span>
              </div>
              {lead.utm_source && (
                <div className="flex justify-between">
                  <span className="text-gray-500">UTM Source</span>
                  <span className="text-gray-900">{lead.utm_source}</span>
                </div>
              )}
              {lead.utm_medium && (
                <div className="flex justify-between">
                  <span className="text-gray-500">UTM Medium</span>
                  <span className="text-gray-900">{lead.utm_medium}</span>
                </div>
              )}
              {lead.utm_campaign && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Campaign</span>
                  <span className="text-gray-900">{lead.utm_campaign}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100">
                <span className="text-gray-500">Submitted</span>
                <p className="text-gray-900 mt-1">{formatDate(lead.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

