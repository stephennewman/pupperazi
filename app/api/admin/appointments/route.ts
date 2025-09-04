import { NextRequest, NextResponse } from 'next/server';
import { appointmentOperations } from '@/lib/database-supabase';

interface Appointment {
  id: string;
  customer_id: number;
  pet_id: number;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  total_duration: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pet_name: string;
  pet_breed: string;
  pet_size: string;
  services_list: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let appointments = await appointmentOperations.getAll();

    // Apply status filter if provided
    if (status && status !== 'all') {
      appointments = appointments.filter((apt: any) => apt.status === status);
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      appointments = appointments.filter((apt: any) =>
        apt.first_name?.toLowerCase().includes(searchLower) ||
        apt.last_name?.toLowerCase().includes(searchLower) ||
        apt.email?.toLowerCase().includes(searchLower) ||
        apt.pet_name?.toLowerCase().includes(searchLower)
      );
    }

    // Transform data for frontend
    const transformedAppointments = appointments.map((apt: any) => ({
      id: apt.id,
      customerName: `${apt.first_name} ${apt.last_name}`,
      customerEmail: apt.email,
      customerPhone: apt.phone,
      petName: apt.pet_name,
      petBreed: apt.pet_breed,
      petSize: apt.pet_size,
      services: apt.services_list ? apt.services_list.split(', ').map((service: string) => ({
        name: service.split(' (')[0],
        price: service.split(' (')[1]?.replace(')', '') || 'N/A'
      })) : [],
      date: apt.date,
      time: apt.time,
      status: apt.status,
      notes: apt.notes || '',
      totalPrice: 'N/A', // Would need to calculate from services
      createdAt: apt.created_at
    }));

    return NextResponse.json({
      success: true,
      data: transformedAppointments
    });

  } catch (error) {
    console.error('Appointments API error:', error);
    return NextResponse.json(
      { error: 'Failed to load appointments' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      );
    }

    // Update appointment status
    await appointmentOperations.updateStatus(appointmentId, status);

    return NextResponse.json({
      success: true,
      message: 'Appointment status updated successfully'
    });

  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}
