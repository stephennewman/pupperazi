// Quick test script to send email via Resend API
// Run with: node test-email.js

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('🧪 Testing Resend email...');
    console.log('API Key present:', !!process.env.RESEND_API_KEY);
    console.log('API Key length:', process.env.RESEND_API_KEY?.length);

    const appointmentDetails = `
APPOINTMENT REQUEST (TEST)

Customer Status: New Customer
Pet Information: Max - Golden Retriever
Requested Date/Time: Tomorrow at 2:00 PM

Additional Notes: This is a test email from the appointment request form.
    `.trim();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📋 New Contact Form Submission</h1>
          <p style="color: #e8eaf6; margin: 10px 0 0 0; font-size: 14px;">Pupperazi Pet Spa</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin: 0 0 20px 0;">Contact Information</h2>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Name:</strong> Test User</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> test@example.com</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> 555-1234</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> Grooming</p>
            <p style="margin: 5px 0;"><strong>Contact Method:</strong> Either Phone or Email</p>
          </div>

          <h3 style="color: #333; margin: 20px 0 10px 0;">Message:</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">
${appointmentDetails}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p style="margin: 0;">Submitted via Pupperazi Pet Spa website</p>
            <p style="margin: 5px 0 0 0;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Pupperazi Pet Spa <contact@krezzo.com>',
      to: ['stephen.p.newman@gmail.com'],
      subject: 'TEST - New Contact Form: Grooming - Test User',
      html: htmlContent,
      replyTo: 'test@example.com',
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data?.id);
    console.log('\n📧 Check stephen.p.newman@gmail.com for the test email');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmail();

