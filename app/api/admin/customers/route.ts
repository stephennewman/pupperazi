import { NextRequest, NextResponse } from 'next/server';
import { customerOperations } from '@/lib/database-supabase';
import { requireAuth } from '@/lib/auth';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  emergency_contact: string | null;
  pet_count: number;
  appointment_count: number;
  total_spent: number;
  created_at: string;
}

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let customers = await customerOperations.getAll();

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter((customer: any) =>
        customer.first_name?.toLowerCase().includes(searchLower) ||
        customer.last_name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower)
      );
    }

    // Transform data for frontend
    const transformedCustomers = customers.map((customer: any) => ({
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      emergencyContact: customer.emergency_contact,
      totalBookings: customer.appointment_count || 0,
      lastBooking: customer.appointment_count > 0 ? 'Recent' : 'Never', // Would need to get actual last booking date
      totalSpent: customer.total_spent || 0,
      createdAt: customer.created_at
    }));

    return NextResponse.json({
      success: true,
      data: transformedCustomers
    });

  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json(
      { error: 'Failed to load customers' },
      { status: 500 }
    );
  }
});
