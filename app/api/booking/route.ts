import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { customerOperations, petOperations, appointmentOperations, appointmentServiceOperations } from '@/lib/database-supabase';

// Initialize Resend with API key (only if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

// Validation schema
const bookingSchema = z.object({
  // Service information
  selectedServices: z.array(z.object({
    id: z.string(),
    name: z.string(),
    duration: z.number(),
    price: z.string(),
    description: z.string(),
    category: z.enum(['grooming', 'bath', 'addon', 'boarding'])
  })).min(1, 'At least one service must be selected'),

  // Date and time
  selectedDate: z.string().min(1, 'Date is required'),
  selectedTime: z.string().min(1, 'Time is required'),

  // Pet information
  petInfo: z.object({
    name: z.string().min(1, 'Pet name is required'),
    breed: z.string().min(1, 'Pet breed is required'),
    size: z.string().optional(),
    notes: z.string().optional()
  }),

  // Owner information
  ownerInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().optional(),
    emergencyContact: z.string().optional()
  }),

  // Preferences
  preferences: z.object({
    contactMethod: z.enum(['email', 'phone', 'either']),
    reminderPreference: z.enum(['email', 'text', 'both']),
    marketingConsent: z.boolean()
  })
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const {
      selectedServices,
      selectedDate,
      selectedTime,
      petInfo,
      ownerInfo,
      preferences
    } = validatedData;

    // Calculate total duration
    const totalDuration = selectedServices.reduce((total: number, service: any) => total + service.duration, 0);

    // Check if customer exists, create if not
    let customer = await customerOperations.getByEmail(ownerInfo.email);

    if (!customer) {
      customer = await customerOperations.create({
        firstName: ownerInfo.firstName,
        lastName: ownerInfo.lastName,
        email: ownerInfo.email,
        phone: ownerInfo.phone,
        address: ownerInfo.address || undefined,
        emergencyContact: ownerInfo.emergencyContact || undefined,
        marketingConsent: preferences.marketingConsent
      });
    }

    // Check if pet exists for this customer, create if not
    const existingPets = await petOperations.getByCustomerId(customer.id);
    let pet = existingPets.find((p: any) => p.name === petInfo.name && p.breed === petInfo.breed);

    if (!pet) {
      pet = await petOperations.create({
        customerId: customer.id,
        name: petInfo.name,
        breed: petInfo.breed,
        size: (petInfo.size || 'medium') as 'small' | 'medium' | 'large',
        notes: petInfo.notes || undefined
      });
    }

    // Generate booking ID
    const bookingId = `PP-${Date.now().toString(36).toUpperCase()}`;

    // Create appointment
    await appointmentOperations.create({
      id: bookingId,
      customerId: customer.id,
      petId: pet.id,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed', // Auto-confirm bookings
      notes: undefined, // No appointment-level notes yet
      totalDuration
    });

    // Add services to appointment
    for (const service of selectedServices) {
      await appointmentServiceOperations.addService(bookingId, service.id, 1);
    }

    // Send emails after successful database transaction
    await sendConfirmationEmails(bookingId, validatedData);

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully! Check your email for confirmation.',
      bookingId,
      appointmentDetails: {
        id: bookingId,
        pet: petInfo,
        owner: ownerInfo,
        services: selectedServices,
        date: selectedDate,
        time: selectedTime,
        duration: totalDuration
      }
    });

  } catch (error) {
    console.error('Booking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Please check your booking information.',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Booking failed. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmails(bookingId: string, data: any) {
  if (!resend) {
    console.log('Resend not configured, skipping email sending');
    return;
  }
  
  const { selectedServices, selectedDate, selectedTime, petInfo, ownerInfo, preferences } = data;

  // Calculate total duration
  const totalDuration = selectedServices.reduce((total: number, service: any) => total + service.duration, 0);

  // Format services for email
  const servicesList = selectedServices.map((service: any) =>
    `• ${service.name} (${service.price}) - ${service.duration}min`
  ).join('\n');

  // Customer confirmation email
  const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Appointment Confirmed!</h1>
        <p style="color: #e8eaf6; margin: 10px 0 0 0; font-size: 14px;">Pupperazi Pet Spa</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">Thank you, ${ownerInfo.firstName}!</h2>
          <p style="color: #666; margin: 0;">Your appointment has been successfully booked</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📅 Appointment Details</h3>
          <div style="line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Pet:</strong> ${petInfo.name} (${petInfo.breed})</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${selectedTime}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${Math.floor(totalDuration/60)}h ${totalDuration%60}m</p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">✂️ Services Booked</h3>
          <div style="line-height: 1.6; font-family: monospace; background: white; padding: 15px; border-radius: 5px;">
            ${servicesList}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            Questions? Call us at (727) 753-9302<br>
            <em>Because every pet deserves the red carpet treatment! 🐾✨</em>
          </p>
        </div>
      </div>
    </div>
  `;

  // Business notification email
  const businessEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🐾 New Appointment Booked!</h1>
        <p style="color: #e8eaf6; margin: 10px 0 0 0; font-size: 14px;">Pupperazi Pet Spa</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">📅 Appointment Summary</h2>
          <div style="line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${ownerInfo.firstName} ${ownerInfo.lastName}</p>
            <p style="margin: 5px 0;"><strong>Pet:</strong> ${petInfo.name} (${petInfo.breed})</p>
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${selectedDate} at ${selectedTime}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> ${Math.floor(totalDuration/60)}h ${totalDuration%60}m</p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👤 Customer Information</h3>
          <div style="line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${ownerInfo.firstName} ${ownerInfo.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${ownerInfo.email}">${ownerInfo.email}</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${ownerInfo.phone}">${ownerInfo.phone}</a></p>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">✂️ Services Details</h3>
          <div style="line-height: 1.6; font-family: monospace; background: white; padding: 15px; border-radius: 5px;">
            ${servicesList}
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 12px; margin: 0;">
            Appointment booked via Pupperazi Pet Spa online booking system<br>
            Timestamp: ${new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </p>
        </div>
      </div>
    </div>
  `;

  // Send emails
  const [customerEmail, businessEmail] = await Promise.all([
    resend.emails.send({
      from: 'Pupperazi Pet Spa <contact@krezzo.com>',
      to: ownerInfo.email,
      subject: `Appointment Confirmed - ${petInfo.name} on ${selectedDate}`,
      html: customerEmailHtml,
      replyTo: 'PupperaziPetSpa@gmail.com'
    }),
    resend.emails.send({
      from: 'Pupperazi Pet Spa <contact@krezzo.com>',
      to: ['PupperaziPetSpa@gmail.com'],
      subject: `New Booking: ${ownerInfo.firstName} ${ownerInfo.lastName} - ${petInfo.name}`,
      html: businessEmailHtml,
      replyTo: ownerInfo.email
    })
  ]);

  if (customerEmail.error || businessEmail.error) {
    console.error('Email sending errors:', {
      customer: customerEmail.error,
      business: businessEmail.error
    });
    throw new Error('Email delivery failed');
  }

  console.log('Booking emails sent successfully:', {
    customer: customerEmail.data?.id,
    business: businessEmail.data?.id
  });
}