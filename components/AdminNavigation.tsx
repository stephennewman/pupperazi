'use client';

import { useRouter, usePathname } from 'next/navigation';

interface AdminNavigationProps {
  activeTab?: 'dashboard' | 'appointments' | 'customers' | 'calendar' | 'analytics' | 'bots' | 'settings';
}

export default function AdminNavigation({ activeTab }: AdminNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab from pathname if not provided
  const getActiveTab = () => {
    if (activeTab) return activeTab;

    if (pathname === '/admin') return 'dashboard';
    if (pathname?.includes('/admin/leads')) return 'appointments';
    if (pathname?.includes('/admin/customers')) return 'customers';
    if (pathname?.includes('/admin/calendar')) return 'calendar';
    if (pathname?.includes('/admin/analytics')) return 'analytics';
    if (pathname?.includes('/admin/bots')) return 'bots';
    if (pathname?.includes('/admin/settings')) return 'settings';

    return 'dashboard';
  };

  const currentActiveTab = getActiveTab();

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { key: 'appointments', label: 'Appointments', icon: '📅', path: '/admin/leads' },
    { key: 'customers', label: 'Customers', icon: '👥', path: '/admin/customers' },
    { key: 'calendar', label: 'Calendar', icon: '📆', path: '/admin/calendar' },
    { key: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { key: 'bots', label: 'AI Bots', icon: '🤖', path: '/admin/bots' },
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
