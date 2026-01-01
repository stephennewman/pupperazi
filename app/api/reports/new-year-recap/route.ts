import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(request: NextRequest) {
  // Simple security - require manual trigger param
  const { searchParams } = new URL(request.url);
  const trigger = searchParams.get('trigger');
  
  if (trigger !== 'happynewyear2026') {
    return NextResponse.json({ error: 'Invalid trigger' }, { status: 401 });
  }

  if (!resend) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
  }

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Happy New Year from Krezzo!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 640px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Happy New Year!</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Pupperazi's First 2 Months - The Numbers Are In</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi Melissa,</p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Happy New Year! 🥳</p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">I wanted to take a moment to celebrate what we've accomplished together since launching the new Pupperazi Pet Spa website on November 1st. The results have exceeded expectations!</p>
      
      <!-- Big Number -->
      <div style="background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
        <div style="font-size: 56px; font-weight: bold; color: #7c3aed;">66</div>
        <div style="color: #6b21a8; font-size: 18px; font-weight: 600;">Appointment Requests in 2 Months</div>
      </div>
      
      <!-- Stats Table -->
      <h2 style="color: #111827; font-size: 20px; margin: 30px 0 15px 0;">📊 Month-Over-Month Growth</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; text-transform: uppercase;">Metric</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; text-transform: uppercase;">November</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; text-transform: uppercase;">December</th>
            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; text-transform: uppercase;">Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">Total Appointments</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">25</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">41</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #059669; text-align: center; font-weight: bold;">+64% 📈</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">New Customers</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">9 (36%)</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">16 (39%)</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #059669; text-align: center; font-weight: bold;">+78%</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; font-weight: 600;">Returning Customers</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">16</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">25</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #059669; text-align: center; font-weight: bold;">+56%</td>
          </tr>
        </tbody>
      </table>
      
      <p style="color: #6b7280; font-size: 14px; background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed;">
        <strong style="color: #374151;">Key Insight:</strong> Your returning customer base is strong (62% of all requests), showing excellent loyalty. At the same time, new customer acquisition nearly <strong>doubled</strong> from November to December.
      </p>
      
      <!-- Popular Breeds -->
      <h2 style="color: #111827; font-size: 20px; margin: 30px 0 15px 0;">🐾 Who's Booking?</h2>
      
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your most popular breeds requesting appointments:</p>
      <ul style="color: #374151; font-size: 15px; line-height: 1.8; padding-left: 20px;">
        <li><strong>Goldendoodles/Doodles</strong> – Multiple bookings (Gary, Molly, Cassidy, Rosie)</li>
        <li><strong>French Bulldogs</strong> – Growing segment</li>
        <li><strong>Maltese</strong> – Loyal repeat customers</li>
        <li><strong>Pomeranians</strong> – Including Wrigley!</li>
        <li><strong>Mixed breeds</strong> – Beagles, German Shepherd mixes, Morkies</li>
      </ul>
      
      <!-- Work Completed -->
      <h2 style="color: #111827; font-size: 20px; margin: 30px 0 15px 0;">🛠️ What We Built</h2>
      
      <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
        <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">Phase 1: Foundation (November)</h3>
        <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>✅ Complete website launch with booking system</li>
          <li>✅ Google Analytics integration</li>
          <li>✅ JavaScript error fixes (eliminated form abandonment)</li>
          <li>✅ Email delivery optimization</li>
        </ul>
      </div>
      
      <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Phase 2: Growth Infrastructure (December)</h3>
        <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>✅ <strong>Admin Portal / CRM</strong> — Full dashboard to view all appointments</li>
          <li>✅ <strong>Lead Database</strong> — All requests stored and tracked</li>
          <li>✅ <strong>UTM Campaign Tracking</strong> — Know which marketing channels work</li>
          <li>✅ <strong>Automated Slack Reports</strong> — Daily/weekly/monthly analytics</li>
          <li>✅ <strong>Uptime Monitoring</strong> — Site checked every 5 minutes</li>
          <li>✅ <strong>Error Notifications</strong> — Instant alerts if forms fail</li>
        </ul>
      </div>
      
      <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
        <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Phase 3: SEO Expansion (December)</h3>
        <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Created <strong>9 new landing pages</strong> targeting high-value search terms:</p>
        <ul style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px; columns: 2;">
          <li>Goldendoodle Grooming Palm Harbor</li>
          <li>Dog Grooming Tarpon Springs</li>
          <li>Dog Grooming Safety Harbor</li>
          <li>Dog Grooming Dunedin</li>
          <li>Dog Grooming Clearwater</li>
          <li>Poodle Grooming Palm Harbor</li>
          <li>Doodle Grooming Tampa Bay</li>
          <li>French Bulldog Grooming Palm Harbor</li>
          <li>Small Dog Grooming Palm Harbor</li>
        </ul>
      </div>
      
      <!-- Q1 Recommendations -->
      <h2 style="color: #111827; font-size: 20px; margin: 30px 0 15px 0;">💡 Recommendations for Q1 2026</h2>
      
      <div style="border: 2px solid #7c3aed; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
        <h3 style="color: #7c3aed; margin: 0 0 10px 0; font-size: 16px;">🎯 High Priority</h3>
        <ol style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li><strong>Automated Appointment Reminders</strong> (SMS/Email) — Reduce no-shows</li>
          <li><strong>Post-Visit Follow-Up Emails</strong> — Encourage repeat bookings & reviews</li>
          <li><strong>Google Business Profile Optimization</strong> — Update photos, respond to reviews</li>
        </ol>
      </div>
      
      <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 20px;">
        <h3 style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">📋 Medium Priority</h3>
        <ol style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li><strong>Deposit/Payment Integration</strong> — Accept payments at booking</li>
          <li><strong>Customer Reviews Section</strong> — Display Google reviews on site</li>
        </ol>
      </div>
      
      <!-- Homework -->
      <h2 style="color: #111827; font-size: 20px; margin: 30px 0 15px 0;">🎯 Your Q1 Homework</h2>
      
      <div style="background: #fdf4ff; border-radius: 8px; padding: 20px;">
        <ol style="color: #374151; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
          <li><strong>Keep booking through the website</strong> — Every submission helps us track and improve</li>
          <li><strong>Ask happy customers for Google reviews</strong> — #1 driver of local search visibility</li>
          <li><strong>Share the site on social media</strong> — Facebook, Instagram posts drive traffic</li>
          <li><strong>Send me seasonal content ideas</strong> — Valentine's Day specials? Spring shed packages?</li>
        </ol>
      </div>
      
      <!-- Admin Access -->
      <div style="background: #1f2937; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <h3 style="color: white; margin: 0 0 10px 0; font-size: 16px;">🔐 Admin Access Reminder</h3>
        <p style="color: #d1d5db; font-size: 14px; margin: 0;">Your dashboard is always available at:</p>
        <p style="color: #a78bfa; font-size: 14px; margin: 10px 0 0 0; font-family: monospace;">pupperazipetspa.com/admin/portal-login</p>
      </div>
      
      <!-- Bottom Line -->
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
        <h2 style="color: white; margin: 0 0 15px 0; font-size: 18px;">✨ The Bottom Line</h2>
        <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin: 0; line-height: 1.6;">
          In just 2 months: <strong>66 appointment requests</strong> captured, <strong>25 new customers</strong> acquired, <strong>64% growth</strong> month-over-month, and a complete CRM infrastructure in place.
        </p>
        <p style="color: #c4b5fd; font-size: 14px; margin: 15px 0 0 0;">
          The site isn't just a brochure — it's now a <strong>lead generation machine</strong> with the data to prove it.
        </p>
      </div>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Here's to an even bigger 2026! 🚀🐾</p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 30px;">
        Best,<br>
        <strong>Stephen Newman</strong><br>
        <span style="color: #6b7280;">Krezzo</span>
      </p>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">Krezzo • Building better businesses through technology</p>
    </div>
    
  </div>
</body>
</html>
`;

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['stephen@krezzo.com'],
      subject: '🎉 Happy New Year! Pupperazi\'s First 2 Months - The Numbers Are In',
      html: emailHtml,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Happy New Year email sent!',
      id: result.data?.id 
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

