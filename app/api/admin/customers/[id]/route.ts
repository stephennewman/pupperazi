import { NextRequest, NextResponse } from 'next/server';
import { customerOperations, petOperations, appointmentOperations } from '@/lib/database-supabase';

interface Appointment {
  id: string;
  customer_id: number;
  pet_id: number;
  date: string;
  time: string;
  status: string;
  pet_name: string;
  services_list: string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  emergency_contact: string | null;
  marketing_consent: number;
  created_at: string;
}

interface Pet {
  id: number;
  customer_id: number;
  name: string;
  breed: string;
  size: string;
  notes: string | null;
  created_at: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);

    const customer = await customerOperations.getById(customerId);

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get customer's pets
    const pets = await petOperations.getByCustomerId(customerId);

    // Get customer's appointments (simplified version)
    const allAppointments = await appointmentOperations.getAll();
    const appointments = allAppointments
      .filter((apt: any) => apt.customer_id === customerId)
      .slice(0, 10); // Limit to last 10 appointments

    const transformedCustomer = {
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      emergencyContact: customer.emergency_contact,
      marketingConsent: Boolean(customer.marketing_consent),
      pets: pets.map((pet: any) => ({
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        size: pet.size,
        notes: pet.notes,
        createdAt: pet.created_at
      })),
      appointments: appointments.map((apt: any) => ({
        id: apt.id,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        petName: apt.pet_name,
        services: apt.services_list ? apt.services_list.split(', ') : []
      })),
      createdAt: customer.created_at
    };

    return NextResponse.json({
      success: true,
      data: transformedCustomer
    });

  } catch (error) {
    console.error('Customer detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to load customer details' },
      { status: 500 }
    );
  }
}
