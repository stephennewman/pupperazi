'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to leads page (customers = leads in this context)
export default function AdminCustomers() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/leads');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}
