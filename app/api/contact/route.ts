import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend with API key (only if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service: z.enum(['general', 'grooming', 'boarding', 'other']).refine((val) => val, {
    message: 'Please select a service type'
  }),
  contactMethod: z.enum(['phone', 'email', 'either']).refine((val) => val, {
    message: 'Please select a preferred contact method'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const { name, email, phone, service, contactMethod, message } = validatedData;

    // Format service for display
    const serviceDisplay = {
      general: 'General Inquiry',
      grooming: 'Dog Grooming',
      boarding: 'Pet Boarding',
      other: 'Other Services'
    }[service];

    // Format contact method for display
    const contactDisplay = {
      phone: 'Phone Call',
      email: 'Email',
      either: 'Either Phone or Email'
    }[contactMethod];

    // Create HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🐾 New Contact Form Submission</h1>
          <p style="color: #e8eaf6; margin: 10px 0 0 0; font-size: 14px;">Pupperazi Pet Spa</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="margin-bottom: 25px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 18px;">Contact Information</h2>

            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">Name:</strong>
              <span style="margin-left: 10px;">${name}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">Email:</strong>
              <a href="mailto:${email}" style="margin-left: 10px; color: #667eea; text-decoration: none;">${email}</a>
            </div>

            ${phone ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">Phone:</strong>
              <a href="tel:${phone}" style="margin-left: 10px; color: #667eea; text-decoration: none;">${phone}</a>
            </div>
            ` : ''}

            <div style="margin-bottom: 15px;">
              <strong style="color: #667eea;">Service Interest:</strong>
              <span style="margin-left: 10px;">${serviceDisplay}</span>
            </div>

            <div style="margin-bottom: 25px;">
              <strong style="color: #667eea;">Preferred Contact Method:</strong>
              <span style="margin-left: 10px;">${contactDisplay}</span>
            </div>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Message:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
              <p style="margin: 0; line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              This message was sent from the Pupperazi Pet Spa contact form<br>
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

    // Send email using Resend (if available)
    if (!resend) {
      console.log('Resend not configured, skipping email sending');
      return NextResponse.json({ 
        success: true, 
        message: 'Message received! We\'ll get back to you soon.' 
      });
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Pupperazi Pet Spa <contact@krezzo.com>',
      to: [
        'stephen.p.newman@gmail.com', // Primary business email
        process.env.ADMIN_EMAIL || 'admin@pupperazi.com' // Admin notification
      ],
      subject: `New Contact Form: ${serviceDisplay} - ${name}`,
      html: htmlContent,
      replyTo: email, // Allow replies to go back to the customer
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      id: data?.id
    });

  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Please check your form data.',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
