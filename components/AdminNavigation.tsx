'use client';

import { useRouter, usePathname } from 'next/navigation';

interface AdminNavigationProps {
  activeTab?: 'dashboard' | 'appointments' | 'calendar' | 'customers' | 'settings';
}

export default function AdminNavigation({ activeTab }: AdminNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from pathname if not provided
  const getActiveTab = () => {
    if (activeTab) return activeTab;

    if (pathname === '/admin') return 'dashboard';
    if (pathname?.includes('/admin/leads')) return 'customers';
    if (pathname?.includes('/admin/appointments')) return 'appointments';
    if (pathname?.includes('/admin/calendar')) return 'calendar';
    if (pathname?.includes('/admin/customers')) return 'customers';
    if (pathname?.includes('/admin/settings')) return 'settings';

    return 'dashboard';
  };

  const currentActiveTab = getActiveTab();

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { key: 'customers', label: 'Leads', icon: '📋', path: '/admin/leads' },
    { key: 'appointments', label: 'Appointments', icon: '📅', path: '/admin/appointments' },
    { key: 'calendar', label: 'Calendar', icon: '📆', path: '/admin/calendar' },
    { key: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  return (
    <div className="mb-8">
      <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
        {navigationItems.map((item) => (
          <button
            key={item.key}
            onClick={() => router.push(item.path)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium text-sm transition-colors cursor-pointer ${
              currentActiveTab === item.key
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
