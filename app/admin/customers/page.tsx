'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: string;
  totalBookings: number;
  lastBooking: string;
  totalSpent: number;
  pets?: Array<{
    name: string;
    breed: string;
    size: string;
    notes?: string;
  }>;
  appointments?: Array<{
    id: string;
    date: string;
    time: string;
    status: string;
    petName: string;
    services: string[];
  }>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
    loadCustomers();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const loadCustomers = async () => {
    try {
      let url = '/api/admin/customers';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setCustomers(result.data);
      } else {
        console.error('Failed to load customers:', result.error);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadCustomerDetails = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`);
      const result = await response.json();

      if (result.success) {
        setSelectedCustomer(result.data);
      } else {
        console.error('Failed to load customer details:', result.error);
        alert('Failed to load customer details');
      }
    } catch (error) {
      console.error('Error loading customer details:', error);
      alert('Network error loading customer details');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Customer Management</h1>
                <p className="text-sm text-gray-500">View and manage customer information</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminNavigation activeTab="customers" />
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Customers</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => loadCustomerDetails(customer.id.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total Bookings</p>
                          <p className="font-semibold text-gray-900">{customer.totalBookings}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Total Spent</p>
                          <p className="font-semibold text-purple-600">${customer.totalSpent}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last booking: {new Date(customer.lastBooking).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${customer.phone}`);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call customer"
                      >
                        📞
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${customer.email}`);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Email customer"
                      >
                        ✉️
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>Pets: {customer.pets?.map(pet => pet.name).join(', ') || 'None'}</span>
                    <span>Customer ID: {customer.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">👤 Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  {selectedCustomer.address && <p><strong>Address:</strong> {selectedCustomer.address}</p>}
                  {selectedCustomer.emergencyContact && <p><strong>Emergency Contact:</strong> {selectedCustomer.emergencyContact}</p>}
                  <p><strong>Total Spent:</strong> ${selectedCustomer.totalSpent || 0}</p>
                  <p><strong>Total Bookings:</strong> {selectedCustomer.totalBookings || 0}</p>
                </div>
              </div>

              {/* Pets */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🐕 Pets</h3>
                <div className="space-y-3">
                  {selectedCustomer.pets && selectedCustomer.pets.length > 0 ? (
                    selectedCustomer.pets.map((pet, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pet.name}</span>
                          <span className="text-sm text-gray-600">{pet.breed} ({pet.size})</span>
                        </div>
                        {pet.notes && (
                          <p className="text-sm text-gray-600 mt-1">{pet.notes}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No pets found</p>
                  )}
                </div>
              </div>

              {/* Recent Appointments */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">📅 Recent Appointments</h3>
                <div className="space-y-3">
                  {selectedCustomer.appointments && selectedCustomer.appointments.length > 0 ? (
                    selectedCustomer.appointments.slice(0, 5).map((appointment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.date} at {appointment.time}</p>
                            <p className="text-sm text-gray-600">{appointment.petName}</p>
                            <p className="text-sm text-gray-500">{appointment.services.join(', ')}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No appointments found</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => window.open(`tel:${selectedCustomer.phone}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  📞 Call Customer
                </button>

                <button
                  onClick={() => window.open(`mailto:${selectedCustomer.email}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  ✉️ Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
