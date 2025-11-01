import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend with API key (only if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// SlickText API configuration (Updated per docs)
const SLICKTEXT_API_KEY = process.env.SLICKTEXT_API_KEY;
const SLICKTEXT_BRAND_ID = process.env.SLICKTEXT_BRAND_ID;
const SLICKTEXT_BASE_URL = 'https://dev.slicktext.com/v1';

// Business notification phone number
const BUSINESS_PHONE = '+16173472721'; // 617-347-2721 // Corrected per docs

// Debug logging for SlickText configuration
console.log('SlickText Config:', {
  hasApiKey: !!SLICKTEXT_API_KEY,
  hasBrandId: !!SLICKTEXT_BRAND_ID,
  apiKeyLength: SLICKTEXT_API_KEY?.length,
  brandIdValue: SLICKTEXT_BRAND_ID
});

// Validation schema
const leadSchema = z.object({
  nameAndPhone: z.string().min(1, 'Name and phone are required').max(100, 'Entry is too long'),
  email: z.string().email('Please enter a valid email address'),
  newCustomer: z.enum(['yes', 'no']).refine(val => val === 'yes' || val === 'no', {
    message: 'Please indicate if you are a new customer'
  }),
  petsNameAndBreed: z.string().min(1, 'Pet name and breed are required').max(200, 'Entry is too long'),
  dateTimeRequested: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

// Helper function to send SMS to business phone (617-347-2721)
async function sendBusinessSMS(message: string): Promise<{ success: boolean; error?: string }> {
  return sendSMS(BUSINESS_PHONE, message, true);
}

// Helper function to send SMS to customer phone
async function sendCustomerSMS(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  return sendSMS(phone, message, false);
}

// Helper function to send SMS via SlickText
async function sendSMS(phone: string, message: string, isBusiness: boolean = false): Promise<{ success: boolean; error?: string }> {
  if (!SLICKTEXT_API_KEY) {
    console.warn('SlickText API key not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    // Always send SMS to business phone (617-347-2721) for notifications
    const formattedPhone = BUSINESS_PHONE;

    console.log('Sending SMS notification to business phone:', formattedPhone);
    console.log('Using API key (first 10 chars):', SLICKTEXT_API_KEY.substring(0, 10) + '...');

    // Check if business contact exists (should exist since we saw it in logs)
    console.log('Checking for business contact...');
    let contactId = null;

    try {
      const contactsResponse = await fetch(`${SLICKTEXT_BASE_URL}/brands/${SLICKTEXT_BRAND_ID}/contacts?mobile_number=${encodeURIComponent(formattedPhone)}`, {
        headers: {
          'Authorization': `Bearer ${SLICKTEXT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        if (contactsData.data && contactsData.data.length > 0) {
          contactId = contactsData.data[0].contact_id;
          console.log('Found business contact:', contactId);
        }
      }
    } catch (error) {
      console.log('Error checking business contacts:', error);
    }

    // Try SlickText API formats
    const apiFormats = [
      // Format 1: Send to existing business contact (preferred)
      contactId ? {
        url: `${SLICKTEXT_BASE_URL}/brands/${SLICKTEXT_BRAND_ID}/messages`,
        headers: {
          'Authorization': `Bearer ${SLICKTEXT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: {
          contact_id: contactId,
          body: message,
          channel: 'sms'
        }
      } : null,
      // Format 2: Send to business phone number directly
      {
        url: `${SLICKTEXT_BASE_URL}/brands/${SLICKTEXT_BRAND_ID}/messages`,
        headers: {
          'Authorization': `Bearer ${SLICKTEXT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: {
          to: formattedPhone,
          body: message,
          channel: 'sms'
        }
      }
    ].filter(Boolean); // Remove null entries

    for (let i = 0; i < apiFormats.length; i++) {
      const format = apiFormats[i];
      if (!format) continue;
      
      console.log(`Trying SlickText format ${i + 1}...`);

      try {
        const response = await fetch(format.url, {
          method: 'POST',
          headers: format.headers,
          body: JSON.stringify(format.body),
        });

        const responseText = await response.text();
        console.log(`Format ${i + 1} response status:`, response.status);
        console.log(`Format ${i + 1} response:`, responseText);

        if (response.ok) {
          const result = JSON.parse(responseText);
          console.log('SMS sent successfully with format', i + 1);
          return { success: true };
        }

        // If we get a specific error about authentication, try next format
        if (responseText.includes('API key') || responseText.includes('authorization')) {
          console.log(`Format ${i + 1} failed with auth error, trying next format...`);
          continue;
        }

        // If it's a different error, return it
        return { success: false, error: `SMS failed: ${response.status} - ${responseText}` };

      } catch (fetchError) {
        console.error(`Format ${i + 1} fetch error:`, fetchError);
        continue;
      }
    }

    return { success: false, error: 'All SMS API formats failed' };

  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

// Helper function to send email
async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  replyTo?: string
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    if (!resend) {
      console.log('Resend not configured, skipping email sending');
      return { success: false, error: 'Email service not configured' };
    }
    
    const { data, error } = await resend.emails.send({
      from: 'Pupperazi Pet Spa <contact@krezzo.com>',
      to: [to],
      subject: subject,
      html: htmlContent,
      replyTo: replyTo || 'contact@krezzo.com',
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Helper function to create HTML email content
function createCustomerEmailContent(leadData: z.infer<typeof leadSchema>): string {

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Pupperazi!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🐾 Welcome to Pupperazi Pet Spa!</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your interest in our services</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #4a5568; margin-top: 0;">Hi ${leadData.nameAndPhone.split(' - ')[0] || 'Valued Customer'}! 👋</h2>

        <p>Thank you for reaching out to Pupperazi Pet Spa! We're excited to help you and your furry friend(s).</p>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; margin-top: 0;">Your Information:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Customer Type:</strong> ${leadData.newCustomer === 'yes' ? 'New Customer' : 'Existing Customer'}</li>
            <li style="margin-bottom: 8px;"><strong>Pet(s):</strong> ${leadData.petsNameAndBreed}</li>
            ${leadData.dateTimeRequested ? `<li style="margin-bottom: 8px;"><strong>Requested Date/Time:</strong> ${leadData.dateTimeRequested}</li>` : ''}
            <li style="margin-bottom: 8px;"><strong>Your Message:</strong></li>
          </ul>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
            "${leadData.message}"
          </div>
        </div>

        <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38b2ac;">
          <h3 style="color: #2d3748; margin-top: 0;">What Happens Next?</h3>
          <p style="margin-bottom: 0;">Our team will review your inquiry and get back to you within 24 hours. You may also receive a text message confirmation.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://pupperazi.com" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Our Website</a>
        </div>

        <div style="border-top: 1px solid #e1e5e9; padding-top: 20px; margin-top: 30px;">
          <p style="color: #718096; font-size: 14px; margin-bottom: 10px;">
            <strong>Contact Us:</strong><br>
            📧 contact@krezzo.com<br>
            📞 (555) 123-PAWS<br>
            🏠 123 Pet Street, Pawstown, PA 12345
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">
            This email was sent to ${leadData.email}. If you no longer wish to receive emails, please reply with "unsubscribe".
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper function to create business notification email
function createBusinessEmailContent(leadData: z.infer<typeof leadSchema>): string {
  // Extract phone from nameAndPhone field
  const nameMatch = leadData.nameAndPhone.match(/^([^-\d]+)\s*-\s*(.+)$/);
  const customerPhone = nameMatch ? nameMatch[2].trim() : '';
  const customerName = nameMatch ? nameMatch[1].trim() : leadData.nameAndPhone.split(/\s+/)[0] || 'Valued Customer';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead - ${customerName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🔔 New Lead Received!</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in our services</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2d3748; margin-top: 0;">Lead Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;"><strong>Name & Phone:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;">${leadData.nameAndPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;"><a href="mailto:${leadData.email}" style="color: #667eea;">${leadData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;"><strong>Customer Type:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;">${leadData.newCustomer === 'yes' ? 'New Customer' : 'Existing Customer'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;"><strong>Pet(s) Name & Breed(s):</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;">${leadData.petsNameAndBreed}</td>
            </tr>
            ${leadData.dateTimeRequested ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;"><strong>Date & Time Requested:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e1e5e9;">${leadData.dateTimeRequested}</td>
            </tr>` : ''}
          </table>
        </div>

        <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #e53e3e;">
          <h3 style="color: #2d3748; margin-top: 0;">Customer Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #fed7d7;">
            "${leadData.message}"
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${leadData.email}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">✉️ Email Customer</a>
          ${customerPhone ? `<a href="sms:${customerPhone.replace(/\D/g, '')}" style="background: #48bb78; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">💬 Text Customer</a><a href="tel:${customerPhone.replace(/\D/g, '')}" style="background: #805ad5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">📞 Call Customer</a>` : '<span style="color: #a0aec0; font-style: italic;">No phone number provided</span>'}
        </div>

        <div style="border-top: 1px solid #e1e5e9; padding-top: 20px; margin-top: 30px;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0; text-align: center;">
            This lead was submitted on ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    const { nameAndPhone, email, newCustomer, petsNameAndBreed, dateTimeRequested, message } = validatedData;

    console.log('Processing lead for:', nameAndPhone);

    // Extract name and phone from the combined field
    const nameMatch = nameAndPhone.match(/^([^-\d]+)\s*-\s*(.+)$/);
    const customerName = nameMatch ? nameMatch[1].trim() : nameAndPhone.split(/\s+/)[0] || 'Valued Customer';
    const customerPhone = nameMatch ? nameMatch[2].trim() : '';

    // Prepare SMS message for customer (if they provided a valid phone)
    let customerSmsMessage = '';
    if (customerPhone && customerPhone.replace(/\D/g, '').length >= 10) {
      customerSmsMessage = `Hi ${customerName}! Thanks for your interest in Pupperazi Pet Spa. We'll be in touch soon about your pet's needs. Reply STOP to opt out.`;
    }

    // Prepare SMS message for business (always sent to 617-347-2721)
    const customerType = newCustomer === 'yes' ? 'New Customer' : 'Existing Customer';
    const businessSmsMessage = `🔔 NEW LEAD: ${nameAndPhone} | ${customerType} | Pets: ${petsNameAndBreed}${dateTimeRequested ? ` | Requested: ${dateTimeRequested}` : ''}. Check email for details.`;

    // Send SMS and email concurrently
    const smsPromises = [];

    // Send business SMS notification (always to 617-347-2721)
    smsPromises.push(sendBusinessSMS(businessSmsMessage));

    // Send customer SMS if they provided a valid phone
    if (customerSmsMessage) {
      smsPromises.push(sendCustomerSMS(customerPhone, customerSmsMessage));
    }

    const allPromises = [
      ...smsPromises,
      sendEmail(
        email,
        `Welcome to Pupperazi Pet Spa! 🐾`,
        createCustomerEmailContent(validatedData),
        'contact@krezzo.com'
      ),
      sendEmail(
        process.env.ADMIN_EMAIL || 'stephen.p.newman@gmail.com',
        `New Lead: ${nameAndPhone}`,
        createBusinessEmailContent(validatedData),
        email
      ),
    ];

    const results = await Promise.allSettled(allPromises);

    // Extract results based on array length
    const businessSmsResult = results[0];
    const customerSmsResult = smsPromises.length > 1 ? results[1] : null;
    const customerEmailResult = results[smsPromises.length];
    const businessEmailResult = results[smsPromises.length + 1];

    // Check results
    const businessSmsSuccess = businessSmsResult.status === 'fulfilled' && businessSmsResult.value.success;
    const customerSmsSuccess = customerSmsResult ? (customerSmsResult.status === 'fulfilled' && customerSmsResult.value.success) : false;
    const emailSuccess = customerEmailResult.status === 'fulfilled' && customerEmailResult.value.success;
    const businessEmailSuccess = businessEmailResult.status === 'fulfilled' && businessEmailResult.value.success;

    console.log('Notification results:', {
      businessSms: businessSmsSuccess ? '✅ Sent' : '❌ Failed',
      customerSms: customerSmsSuccess ? '✅ Sent' : '❌ Failed',
      customerEmail: emailSuccess ? '✅ Sent' : '❌ Failed',
      businessEmail: businessEmailSuccess ? '✅ Sent' : '❌ Failed'
    });

    // Success response (business SMS is the key notification)
    let successMessage = 'Thank you for your inquiry! ';
    if (emailSuccess) {
      successMessage += 'We\'ve sent you a confirmation email.';
    }
    if (customerSmsSuccess) {
      successMessage += ' We\'ve sent you a confirmation text message.';
    }
    if (businessSmsSuccess) {
      successMessage += ' Our team has been notified and will contact you soon.';
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
      notifications: {
        businessSms: businessSmsSuccess,
        customerSms: customerSmsSuccess,
        customerEmail: emailSuccess,
        businessEmail: businessEmailSuccess
      }
    });

  } catch (error) {
    console.error('Lead processing error:', error);

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
