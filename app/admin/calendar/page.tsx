'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function AdminCalendar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/portal-login');
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Calendar" subtitle="View schedule" activeTab="calendar">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📆</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Calendar Coming Soon</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          This feature is under development. Soon you'll have a full calendar view of all appointments and availability.
        </p>
        <button
          onClick={() => router.push('/admin')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </AdminLayout>
  );
}
