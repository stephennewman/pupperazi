import { NextRequest, NextResponse } from 'next/server';
import { appointmentOperations } from '@/lib/database-supabase';

interface AppointmentWithServices {
  id: string;
  customer_id: number;
  pet_id: number;
  date: string;
  time: string;
  status: string;
  notes: string | null;
  total_duration: number;
  created_at: string;
  services_data?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  emergency_contact: string | null;
  pet_name: string;
  pet_breed: string;
  pet_size: string;
  pet_notes: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appointmentId } = await params;

    const appointment = await appointmentOperations.getById(appointmentId);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Parse services data
    let services = [];
    if (appointment.services_data) {
      try {
        const servicesData = appointment.services_data.split('|');
        for (let i = 0; i < servicesData.length; i += 5) {
          if (servicesData[i]) {
            services.push({
              id: servicesData[i],
              name: servicesData[i + 1] || '',
              price: servicesData[i + 2] || '',
              duration: parseInt(servicesData[i + 3]) || 0,
              category: servicesData[i + 4] || ''
            });
          }
        }
      } catch (error) {
        console.error('Error parsing services data:', error);
        services = [];
      }
    }

    const transformedAppointment = {
      id: appointment.id,
      customerName: `${appointment.first_name} ${appointment.last_name}`,
      customerEmail: appointment.email,
      customerPhone: appointment.phone,
      customerAddress: appointment.address,
      customerEmergencyContact: appointment.emergency_contact,
      petName: appointment.pet_name,
      petBreed: appointment.pet_breed,
      petSize: appointment.pet_size,
      petNotes: appointment.pet_notes,
      services: services,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes,
      totalDuration: appointment.total_duration,
      createdAt: appointment.created_at
    };

    return NextResponse.json({
      success: true,
      data: transformedAppointment
    });

  } catch (error) {
    console.error('Appointment detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to load appointment details' },
      { status: 500 }
    );
  }
}
