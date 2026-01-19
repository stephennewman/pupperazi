'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface AdditionalInfo {
  dateRequested: string | null;
  timeRequested: string | null;
  newCustomer: string | null;
  message: string | null;
}

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
  additionalInfo: AdditionalInfo[];
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setFilter('repeat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'repeat' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Repeat ({customers.filter(c => c.totalAppointments >= 2).length})
            </button>
            <button
              onClick={() => setFilter('active90')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'active90' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active 90d
            </button>
            <button
              onClick={() => setFilter('active30')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Additional Info
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
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
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
                    <td className="px-4 py-3">
                      <div className="min-w-[140px] max-w-[200px] text-xs break-words">
                        {customer.additionalInfo && customer.additionalInfo.length > 0 && (
                          <>
                            {customer.additionalInfo[customer.additionalInfo.length - 1]?.dateRequested && (
                              <p className="text-gray-600">
                                <span className="font-medium">Date:</span> {customer.additionalInfo[customer.additionalInfo.length - 1].dateRequested}
                              </p>
                            )}
                            {customer.additionalInfo[customer.additionalInfo.length - 1]?.timeRequested && (
                              <p className="text-gray-600">
                                <span className="font-medium">Time:</span> {customer.additionalInfo[customer.additionalInfo.length - 1].timeRequested}
                              </p>
                            )}
                            {customer.additionalInfo[customer.additionalInfo.length - 1]?.newCustomer && (
                              <p className="text-gray-500">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                                  customer.additionalInfo[customer.additionalInfo.length - 1].newCustomer === 'yes' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {customer.additionalInfo[customer.additionalInfo.length - 1].newCustomer === 'yes' ? 'New' : 'Returning'}
                                </span>
                              </p>
                            )}
                            {customer.additionalInfo[customer.additionalInfo.length - 1]?.message && (
                              <p className="text-gray-400 whitespace-normal break-words">
                                {customer.additionalInfo[customer.additionalInfo.length - 1].message}
                              </p>
                            )}
                          </>
                        )}
                        {(!customer.additionalInfo || customer.additionalInfo.length === 0 || 
                          (!customer.additionalInfo[customer.additionalInfo.length - 1]?.dateRequested && 
                           !customer.additionalInfo[customer.additionalInfo.length - 1]?.timeRequested && 
                           !customer.additionalInfo[customer.additionalInfo.length - 1]?.newCustomer && 
                           !customer.additionalInfo[customer.additionalInfo.length - 1]?.message)) && (
                          <span className="text-gray-300">-</span>
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

      {/* Doggy Breed Power Rankings */}
      <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="font-semibold text-purple-900 mb-4 text-lg">🏆 Doggy Breed Power Rankings</h3>
        <p className="text-purple-700 text-sm mb-4">Most popular breeds based on customer pet info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(() => {
            // SEO pages that exist for breeds
            const breedSeoPages: Record<string, string> = {
              'Golden Retriever': '/golden-retriever-grooming-palm-harbor',
              'Goldendoodle': '/goldendoodle-grooming-palm-harbor',
              'French Bulldog': '/french-bulldog-grooming-palm-harbor',
              'Husky': '/husky-grooming-palm-harbor',
              'Shih Tzu': '/shih-tzu-grooming-palm-harbor',
              'Yorkie': '/yorkie-grooming-palm-harbor',
              'Labradoodle': '/labradoodle-grooming-palm-harbor',
              'Poodle': '/poodle-grooming-palm-harbor',
              'Dachshund': '/dachshund-grooming-palm-harbor',
              'Corgi': '/corgi-grooming-palm-harbor',
            };
            
            // Parse all pet info to extract and count breeds
            const breedCounts = new Map<string, number>();
            
            customers.forEach(customer => {
              customer.petInfo.forEach(petStr => {
                // Common patterns: "Name - Breed", "Name (Breed)", "Breed", "Name, Breed"
                const normalized = petStr.toLowerCase().trim();
                
                // Skip empty or very short entries
                if (normalized.length < 2) return;
                
                // Common breed keywords to look for
                const knownBreeds = [
                  'goldendoodle', 'doodle', 'labradoodle', 'bernedoodle', 'aussiedoodle',
                  'golden retriever', 'golden', 'labrador', 'lab',
                  'poodle', 'standard poodle', 'toy poodle', 'mini poodle',
                  'french bulldog', 'frenchie', 'bulldog', 'english bulldog',
                  'german shepherd', 'shepherd',
                  'husky', 'siberian husky',
                  'shih tzu', 'shihtzu',
                  'yorkie', 'yorkshire terrier', 'yorkshire',
                  'maltese', 'maltipoo',
                  'chihuahua',
                  'beagle',
                  'boxer',
                  'rottweiler',
                  'dachshund', 'weiner', 'wiener',
                  'corgi', 'pembroke', 'welsh corgi',
                  'schnauzer', 'mini schnauzer',
                  'cocker spaniel', 'spaniel',
                  'boston terrier', 'terrier',
                  'pomeranian', 'pom',
                  'pit bull', 'pitbull', 'bully',
                  'australian shepherd', 'aussie',
                  'border collie', 'collie',
                  'cavalier', 'cavalier king charles',
                  'great dane', 'dane',
                  'doberman',
                  'havanese',
                  'bichon', 'bichon frise',
                  'shiba', 'shiba inu',
                  'akita',
                  'bernese', 'bernese mountain',
                  'samoyed',
                  'newfoundland',
                  'vizsla',
                  'weimaraner',
                  'pug',
                  'basset', 'basset hound',
                  'bloodhound',
                  'mastiff',
                  'cane corso',
                  'mixed', 'mix', 'mutt',
                ];
                
                // Find matching breeds in the pet string
                let foundBreed = false;
                for (const breed of knownBreeds) {
                  if (normalized.includes(breed)) {
                    // Normalize similar breeds
                    let displayBreed = breed;
                    if (['golden', 'golden retriever'].includes(breed)) displayBreed = 'Golden Retriever';
                    else if (['doodle', 'goldendoodle'].includes(breed)) displayBreed = 'Goldendoodle';
                    else if (['labradoodle'].includes(breed)) displayBreed = 'Labradoodle';
                    else if (['bernedoodle'].includes(breed)) displayBreed = 'Bernedoodle';
                    else if (['aussiedoodle'].includes(breed)) displayBreed = 'Aussiedoodle';
                    else if (['labrador', 'lab'].includes(breed)) displayBreed = 'Labrador';
                    else if (['french bulldog', 'frenchie'].includes(breed)) displayBreed = 'French Bulldog';
                    else if (['english bulldog', 'bulldog'].includes(breed)) displayBreed = 'Bulldog';
                    else if (['shih tzu', 'shihtzu'].includes(breed)) displayBreed = 'Shih Tzu';
                    else if (['yorkie', 'yorkshire terrier', 'yorkshire'].includes(breed)) displayBreed = 'Yorkie';
                    else if (['husky', 'siberian husky'].includes(breed)) displayBreed = 'Husky';
                    else if (['german shepherd', 'shepherd'].includes(breed)) displayBreed = 'German Shepherd';
                    else if (['poodle', 'standard poodle', 'toy poodle', 'mini poodle'].includes(breed)) displayBreed = 'Poodle';
                    else if (['corgi', 'pembroke', 'welsh corgi'].includes(breed)) displayBreed = 'Corgi';
                    else if (['pit bull', 'pitbull', 'bully'].includes(breed)) displayBreed = 'Pit Bull';
                    else if (['australian shepherd', 'aussie'].includes(breed)) displayBreed = 'Australian Shepherd';
                    else if (['cavalier', 'cavalier king charles'].includes(breed)) displayBreed = 'Cavalier King Charles';
                    else if (['pomeranian', 'pom'].includes(breed)) displayBreed = 'Pomeranian';
                    else if (['schnauzer', 'mini schnauzer'].includes(breed)) displayBreed = 'Schnauzer';
                    else if (['dachshund', 'weiner', 'wiener'].includes(breed)) displayBreed = 'Dachshund';
                    else if (['bichon', 'bichon frise'].includes(breed)) displayBreed = 'Bichon Frise';
                    else if (['shiba', 'shiba inu'].includes(breed)) displayBreed = 'Shiba Inu';
                    else if (['bernese', 'bernese mountain'].includes(breed)) displayBreed = 'Bernese Mountain Dog';
                    else if (['great dane', 'dane'].includes(breed)) displayBreed = 'Great Dane';
                    else if (['mixed', 'mix', 'mutt'].includes(breed)) displayBreed = 'Mixed Breed';
                    else if (['maltipoo'].includes(breed)) displayBreed = 'Maltipoo';
                    else if (['border collie', 'collie'].includes(breed)) displayBreed = 'Border Collie';
                    else if (['cocker spaniel', 'spaniel'].includes(breed)) displayBreed = 'Cocker Spaniel';
                    else if (['boston terrier'].includes(breed)) displayBreed = 'Boston Terrier';
                    else if (['basset', 'basset hound'].includes(breed)) displayBreed = 'Basset Hound';
                    else displayBreed = breed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    
                    breedCounts.set(displayBreed, (breedCounts.get(displayBreed) || 0) + 1);
                    foundBreed = true;
                    break; // Only count first match per pet
                  }
                }
                
                // If no known breed found, try to extract from common patterns
                if (!foundBreed && normalized.length > 3) {
                  // Try "Name - Breed" pattern
                  const dashMatch = petStr.match(/[-–]\s*(.+)$/);
                  if (dashMatch) {
                    const breed = dashMatch[1].trim();
                    if (breed.length > 2 && breed.length < 40) {
                      const displayBreed = breed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                      breedCounts.set(displayBreed, (breedCounts.get(displayBreed) || 0) + 1);
                    }
                  }
                }
              });
            });
            
            // Sort by count descending and take top entries
            const sortedBreeds = Array.from(breedCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15);
            
            const maxCount = sortedBreeds[0]?.[1] || 1;
            
            if (sortedBreeds.length === 0) {
              return <p className="text-purple-500 text-sm col-span-full">No breed data available yet</p>;
            }
            
            return sortedBreeds.map(([breed, count], idx) => {
              const hasSeoPage = breed in breedSeoPages;
              const seoUrl = breedSeoPages[breed];
              
              return (
                <div key={breed} className={`flex items-center gap-3 rounded-lg p-3 ${hasSeoPage ? 'bg-green-50/80' : 'bg-white/60'}`}>
                  <span className={`font-bold text-lg w-8 text-center ${
                    idx === 0 ? 'text-yellow-500' :
                    idx === 1 ? 'text-gray-400' :
                    idx === 2 ? 'text-amber-600' :
                    'text-purple-400'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 truncate">{breed}</p>
                      {hasSeoPage ? (
                        <a 
                          href={seoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium hover:bg-green-200 transition-colors"
                          title={`View SEO page: ${seoUrl}`}
                        >
                          SEO ✓
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium" title="No SEO landing page exists for this breed">
                          No SEO
                        </span>
                      )}
                    </div>
                    <div className="mt-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-purple-700 ml-2">{count}</span>
                </div>
              );
            });
          })()}
        </div>
        
        {/* SEO Coverage Summary */}
        {(() => {
          const breedSeoPages: Record<string, string> = {
            'Golden Retriever': '/golden-retriever-grooming-palm-harbor',
            'Goldendoodle': '/goldendoodle-grooming-palm-harbor',
            'French Bulldog': '/french-bulldog-grooming-palm-harbor',
            'Husky': '/husky-grooming-palm-harbor',
            'Shih Tzu': '/shih-tzu-grooming-palm-harbor',
            'Yorkie': '/yorkie-grooming-palm-harbor',
            'Labradoodle': '/labradoodle-grooming-palm-harbor',
            'Poodle': '/poodle-grooming-palm-harbor',
            'Dachshund': '/dachshund-grooming-palm-harbor',
            'Corgi': '/corgi-grooming-palm-harbor',
          };
          
          // Recalculate breed counts for summary
          const breedCounts = new Map<string, number>();
          customers.forEach(customer => {
            customer.petInfo.forEach(petStr => {
              const normalized = petStr.toLowerCase().trim();
              if (normalized.length < 2) return;
              
              const breedMappings: [string[], string][] = [
                [['golden', 'golden retriever'], 'Golden Retriever'],
                [['doodle', 'goldendoodle'], 'Goldendoodle'],
                [['french bulldog', 'frenchie'], 'French Bulldog'],
                [['husky', 'siberian husky'], 'Husky'],
                [['shih tzu', 'shihtzu'], 'Shih Tzu'],
                [['yorkie', 'yorkshire terrier', 'yorkshire'], 'Yorkie'],
                [['labradoodle'], 'Labradoodle'],
                [['bernedoodle'], 'Bernedoodle'],
                [['aussiedoodle'], 'Aussiedoodle'],
                [['labrador', 'lab'], 'Labrador'],
                [['poodle', 'standard poodle', 'toy poodle', 'mini poodle'], 'Poodle'],
                [['german shepherd', 'shepherd'], 'German Shepherd'],
                [['corgi', 'pembroke', 'welsh corgi'], 'Corgi'],
                [['maltipoo'], 'Maltipoo'],
                [['maltese'], 'Maltese'],
                [['dachshund', 'weiner', 'wiener'], 'Dachshund'],
                [['pomeranian', 'pom'], 'Pomeranian'],
                [['chihuahua'], 'Chihuahua'],
                [['beagle'], 'Beagle'],
                [['boxer'], 'Boxer'],
                [['bichon', 'bichon frise'], 'Bichon Frise'],
                [['schnauzer', 'mini schnauzer'], 'Schnauzer'],
                [['pit bull', 'pitbull', 'bully'], 'Pit Bull'],
                [['australian shepherd', 'aussie'], 'Australian Shepherd'],
                [['cavalier', 'cavalier king charles'], 'Cavalier King Charles'],
                [['border collie', 'collie'], 'Border Collie'],
                [['boston terrier'], 'Boston Terrier'],
              ];
              
              for (const [keywords, displayBreed] of breedMappings) {
                if (keywords.some(k => normalized.includes(k))) {
                  breedCounts.set(displayBreed, (breedCounts.get(displayBreed) || 0) + 1);
                  break;
                }
              }
            });
          });
          
          const topBreeds = Array.from(breedCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15);
          const withSeo = topBreeds.filter(([breed]) => breed in breedSeoPages);
          const withoutSeo = topBreeds.filter(([breed]) => !(breed in breedSeoPages));
          const coveragePercent = topBreeds.length > 0 ? Math.round((withSeo.length / topBreeds.length) * 100) : 0;
          const missedCustomers = withoutSeo.reduce((sum, [, count]) => sum + count, 0);
          
          return (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{withSeo.length}/{topBreeds.length}</p>
                  <p className="text-xs text-green-700">Top Breeds with SEO</p>
                  <p className="text-lg font-semibold text-green-600">{coveragePercent}% coverage</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{withoutSeo.length}</p>
                  <p className="text-xs text-red-700">Missing SEO Pages</p>
                  <p className="text-sm text-red-600">{missedCustomers} potential customers</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-1">Top Missing:</p>
                  {withoutSeo.slice(0, 3).map(([breed, count]) => (
                    <p key={breed} className="text-xs text-purple-600">{breed} ({count})</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
        
        <p className="text-xs text-purple-500 mt-4">
          Based on {customers.reduce((sum, c) => sum + c.petInfo.length, 0)} pet entries from {customers.length} customers
        </p>
      </div>

      {/* Day & Time Power Rankings */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Day of Week Power Rankings */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-4 text-lg">📅 Requested Day Power Rankings</h3>
          <p className="text-blue-700 text-sm mb-4">Most requested appointment days</p>
          
          {(() => {
            const dayCounts = new Map<string, number>();
            const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const shortDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            
            // Helper function to extract day from a string
            const extractDay = (text: string): string | null => {
              if (!text) return null;
              const normalized = text.toLowerCase();
              
              // Check for full day names
              for (const day of dayOrder) {
                if (normalized.includes(day.toLowerCase())) {
                  return day;
                }
              }
              
              // Check for short day names (but be careful with partial matches)
              for (let i = 0; i < shortDays.length; i++) {
                // Use word boundary to avoid false matches
                const regex = new RegExp(`\\b${shortDays[i]}\\b|\\b${shortDays[i]}s?day\\b`, 'i');
                if (regex.test(normalized)) {
                  return dayOrder[i];
                }
              }
              
              // Try to parse as a date
              const parsed = new Date(text);
              if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 2020) {
                const dayIdx = parsed.getDay();
                return dayOrder[dayIdx === 0 ? 6 : dayIdx - 1];
              }
              
              // Check for "next week", "this week" patterns with day
              const nextDayMatch = normalized.match(/next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
              if (nextDayMatch) {
                return nextDayMatch[1].charAt(0).toUpperCase() + nextDayMatch[1].slice(1).toLowerCase();
              }
              
              return null;
            };
            
            customers.forEach(customer => {
              customer.additionalInfo?.forEach(info => {
                // Check dateRequested field
                const dayFromDate = extractDay(info.dateRequested || '');
                if (dayFromDate) {
                  dayCounts.set(dayFromDate, (dayCounts.get(dayFromDate) || 0) + 1);
                }
                
                // Also parse the message field for day mentions
                if (info.message) {
                  const dayFromMessage = extractDay(info.message);
                  if (dayFromMessage && !dayFromDate) { // Only count if not already counted from dateRequested
                    dayCounts.set(dayFromMessage, (dayCounts.get(dayFromMessage) || 0) + 1);
                  }
                }
              });
            });
            
            // Sort by count descending
            const sortedDays = Array.from(dayCounts.entries())
              .sort((a, b) => b[1] - a[1]);
            
            const maxCount = sortedDays[0]?.[1] || 1;
            const totalRequests = sortedDays.reduce((sum, [, count]) => sum + count, 0);
            
            if (sortedDays.length === 0) {
              return <p className="text-blue-500 text-sm">No day preference data available yet</p>;
            }
            
            return (
              <>
                <div className="space-y-2">
                  {sortedDays.map(([day, count], idx) => (
                    <div key={day} className="flex items-center gap-3 bg-white/60 rounded-lg p-2.5">
                      <span className={`font-bold text-base w-7 text-center ${
                        idx === 0 ? 'text-yellow-500' :
                        idx === 1 ? 'text-gray-400' :
                        idx === 2 ? 'text-amber-600' :
                        'text-blue-400'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-800">{day}</p>
                          <span className="text-xs text-blue-600">{Math.round((count / totalRequests) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-blue-700 ml-2 w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-500 mt-3">
                  Based on {totalRequests} date requests (from form fields + messages)
                </p>
              </>
            );
          })()}
        </div>

        {/* Time of Day Power Rankings */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
          <h3 className="font-semibold text-amber-900 mb-4 text-lg">🕐 Requested Time Power Rankings</h3>
          <p className="text-amber-700 text-sm mb-4">Most requested appointment times</p>
          
          {(() => {
            const timeCounts = new Map<string, number>();
            
            // Helper function to extract time slot from text
            const extractTimeSlot = (text: string): string | null => {
              if (!text) return null;
              const normalized = text.toLowerCase();
              
              // Check for specific time patterns (e.g., "2pm", "10:00 am", "3:30pm")
              const specificTimeMatch = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.?|p\.m\.?)/i);
              if (specificTimeMatch) {
                let hour = parseInt(specificTimeMatch[1]);
                const isPM = /pm|p\.m\.?/i.test(specificTimeMatch[3]);
                
                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
                
                if (hour >= 7 && hour < 9) return 'Early Morning (7-9am)';
                if (hour >= 9 && hour < 11) return 'Mid Morning (9-11am)';
                if (hour >= 11 && hour < 12) return 'Late Morning (11am-12pm)';
                if (hour >= 12 && hour < 13) return 'Noon (12-1pm)';
                if (hour >= 13 && hour < 15) return 'Early Afternoon (1-3pm)';
                if (hour >= 15 && hour < 17) return 'Late Afternoon (3-5pm)';
                if (hour >= 17) return 'Evening (5pm+)';
              }
              
              // Check for general time-of-day keywords
              if (normalized.includes('early morning') || /\b[7-8]\s*(am)?\b/.test(normalized)) {
                return 'Early Morning (7-9am)';
              }
              if (normalized.includes('morning') || normalized.includes('am')) {
                if (/\b(9|10)\b/.test(normalized)) return 'Mid Morning (9-11am)';
                if (/\b11\b/.test(normalized)) return 'Late Morning (11am-12pm)';
                return 'Morning';
              }
              if (normalized.includes('noon') || normalized.includes('midday') || /\b12\s*(pm)?\b/.test(normalized)) {
                return 'Noon (12-1pm)';
              }
              if (normalized.includes('early afternoon') || /\b[1-2]\s*(pm)?\b/.test(normalized)) {
                return 'Early Afternoon (1-3pm)';
              }
              if (normalized.includes('late afternoon') || /\b[3-4]\s*(pm)?\b/.test(normalized)) {
                return 'Late Afternoon (3-5pm)';
              }
              if (normalized.includes('afternoon') || normalized.includes('pm')) {
                return 'Afternoon';
              }
              if (normalized.includes('evening') || /\b[5-7]\s*(pm)?\b/.test(normalized)) {
                return 'Evening (5pm+)';
              }
              if (normalized.includes('flexible') || normalized.includes('any time') || normalized.includes('anytime') || normalized.includes('whenever')) {
                return 'Flexible/Any Time';
              }
              if (normalized.includes('asap') || normalized.includes('soon') || normalized.includes('earliest') || normalized.includes('first available')) {
                return 'ASAP/Earliest Available';
              }
              
              return null;
            };
            
            customers.forEach(customer => {
              customer.additionalInfo?.forEach(info => {
                // Check timeRequested field
                const timeFromField = extractTimeSlot(info.timeRequested || '');
                if (timeFromField) {
                  timeCounts.set(timeFromField, (timeCounts.get(timeFromField) || 0) + 1);
                }
                
                // Check dateRequested field (often contains combined date/time like "Tuesday at 2pm")
                if (!timeFromField && info.dateRequested) {
                  const timeFromDate = extractTimeSlot(info.dateRequested);
                  if (timeFromDate) {
                    timeCounts.set(timeFromDate, (timeCounts.get(timeFromDate) || 0) + 1);
                  }
                }
                
                // Also parse the message field for time mentions
                if (info.message && !timeFromField) {
                  const timeFromMessage = extractTimeSlot(info.message);
                  if (timeFromMessage) {
                    timeCounts.set(timeFromMessage, (timeCounts.get(timeFromMessage) || 0) + 1);
                  }
                }
              });
            });
            
            // Sort by count descending
            const sortedTimes = Array.from(timeCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10); // Limit to top 10
            
            const maxCount = sortedTimes[0]?.[1] || 1;
            const totalRequests = sortedTimes.reduce((sum, [, count]) => sum + count, 0);
            
            if (sortedTimes.length === 0) {
              return <p className="text-amber-500 text-sm">No time preference data available yet</p>;
            }
            
            return (
              <>
                <div className="space-y-2">
                  {sortedTimes.map(([time, count], idx) => (
                    <div key={time} className="flex items-center gap-3 bg-white/60 rounded-lg p-2.5">
                      <span className={`font-bold text-base w-7 text-center ${
                        idx === 0 ? 'text-yellow-500' :
                        idx === 1 ? 'text-gray-400' :
                        idx === 2 ? 'text-amber-600' :
                        'text-amber-400'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-800 text-sm truncate">{time}</p>
                          <span className="text-xs text-amber-600">{Math.round((count / totalRequests) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-amber-700 ml-2 w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-500 mt-3">
                  Based on {totalRequests} time requests (from form fields + messages)
                </p>
              </>
            );
          })()}
        </div>
      </div>
    </AdminLayout>
  );
}
