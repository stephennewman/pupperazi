import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for contract completion
const contractCompletionSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  contractData: z.object({
    signed: z.boolean(),
    timestamp: z.string(),
    signatureData: z.any().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contractCompletionSchema.parse(body);

    const { bookingId, contractData } = validatedData;

    // In a real implementation, you would:
    // 1. Update the appointment status in your database
    // 2. Store the contract signature data
    // 3. Generate a payment link using Stripe
    // 4. Send confirmation emails/SMS

    console.log('Contract completed for booking:', bookingId);
    console.log('Contract data:', contractData);

    // Simulate payment link generation
    const paymentLink = `https://pupperazi.com/payment?bookingId=${bookingId}&token=${Date.now()}`;

    // Store payment data for the payment page
    // In production, this would be stored in your database
    const paymentData = {
      bookingId,
      amount: 85, // This would be calculated from the services
      services: ['Bath Time Bliss', 'Nail Trim'],
      customerName: 'John Doe', // This would come from the booking data
      petName: 'Buddy',
      appointmentDate: 'December 20, 2024',
      appointmentTime: '2:00 PM',
    };

    // In production, store this in your database
    // For now, we'll use localStorage simulation
    console.log('Payment data prepared:', paymentData);

    return NextResponse.json({
      success: true,
      message: 'Contract completed successfully',
      paymentLink,
      paymentData, // In production, don't send this to client
    });

  } catch (error) {
    console.error('Contract completion error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid contract data',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to complete contract. Please try again.' },
      { status: 500 }
    );
  }
}
