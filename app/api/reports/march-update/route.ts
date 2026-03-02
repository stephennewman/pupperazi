import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trigger = searchParams.get('trigger');
  
  if (trigger !== 'marchupdate2026') {
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
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #000000;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <h1 style="font-size: 24px; margin: 0 0 5px 0;">Pupperazi Website Update</h1>
    <p style="color: #666666; font-size: 14px; margin: 0 0 30px 0;">March 2026</p>
    
    <p style="font-size: 15px; line-height: 1.6;">Hi Pupperazi Team,</p>
    
    <p style="font-size: 15px; line-height: 1.6;">Quick update on how the website performed in February and some improvements we made this week.</p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <!-- February Highlight -->
    <h2 style="font-size: 18px; margin: 0 0 20px 0;">February Results</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 15px; text-align: center; border: 1px solid #e0e0e0;">
          <div style="font-size: 36px; font-weight: bold;">40</div>
          <div style="font-size: 13px; color: #666666;">Appointment Requests</div>
        </td>
        <td style="padding: 15px; text-align: center; border: 1px solid #e0e0e0;">
          <div style="font-size: 36px; font-weight: bold;">16</div>
          <div style="font-size: 13px; color: #666666;">New Customers</div>
        </td>
        <td style="padding: 15px; text-align: center; border: 1px solid #e0e0e0;">
          <div style="font-size: 36px; font-weight: bold;">273</div>
          <div style="font-size: 13px; color: #666666;">Website Visitors</div>
        </td>
      </tr>
    </table>

    <!-- Bar Chart -->
    <h2 style="font-size: 18px; margin: 30px 0 15px 0;">New vs. Returning Customers</h2>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
      <tr>
        <td style="width: 35px; padding: 6px 0; font-size: 13px; font-weight: 600;">Nov</td>
        <td style="padding: 6px 0;">
          <table style="width: 100%; border-collapse: collapse;"><tr>
            <td style="width: 36%; background: #000000; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">9</td>
            <td style="width: 64%; background: #999999; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">16</td>
          </tr></table>
        </td>
        <td style="width: 50px; padding: 6px 0; text-align: right; font-size: 12px; color: #666666;">25</td>
      </tr>
      <tr>
        <td style="width: 35px; padding: 6px 0; font-size: 13px; font-weight: 600;">Dec</td>
        <td style="padding: 6px 0;">
          <table style="width: 100%; border-collapse: collapse;"><tr>
            <td style="width: 39%; background: #000000; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">16</td>
            <td style="width: 61%; background: #999999; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">25</td>
          </tr></table>
        </td>
        <td style="width: 50px; padding: 6px 0; text-align: right; font-size: 12px; color: #666666;">41</td>
      </tr>
      <tr>
        <td style="width: 35px; padding: 6px 0; font-size: 13px; font-weight: 600;">Jan</td>
        <td style="padding: 6px 0;">
          <table style="width: 100%; border-collapse: collapse;"><tr>
            <td style="width: 27%; background: #000000; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">13</td>
            <td style="width: 73%; background: #999999; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">35</td>
          </tr></table>
        </td>
        <td style="width: 50px; padding: 6px 0; text-align: right; font-size: 12px; color: #666666;">48</td>
      </tr>
      <tr>
        <td style="width: 35px; padding: 6px 0; font-size: 13px; font-weight: 600;">Feb</td>
        <td style="padding: 6px 0;">
          <table style="width: 100%; border-collapse: collapse;"><tr>
            <td style="width: 40%; background: #000000; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">16</td>
            <td style="width: 60%; background: #999999; padding: 6px 0; text-align: center; color: #ffffff; font-size: 11px; font-weight: 600;">24</td>
          </tr></table>
        </td>
        <td style="width: 50px; padding: 6px 0; text-align: right; font-size: 12px; color: #666666;">40</td>
      </tr>
    </table>
    <p style="font-size: 12px; color: #666666; margin: 5px 0 0 35px;">&#9632; New &nbsp;&nbsp; <span style="color: #999999;">&#9632;</span> Returning</p>

    <p style="font-size: 14px; line-height: 1.6; margin: 20px 0;">February tied December for the most new customers in a single month (16). Returning customers make up about 60% of requests each month — strong repeat loyalty. <strong>155 total appointment requests since launch.</strong></p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <!-- Website Traffic -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0;">February Website Traffic</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Visitors</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">273</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Sessions</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">377</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Page Views</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">479</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Avg. Time on Site</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">2 min 8 sec</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Bounce Rate</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">49%</td>
      </tr>
    </table>

    <p style="font-size: 14px; line-height: 1.6;"><strong>Where visitors come from:</strong> Google organic is the #1 source (130 visitors), followed by direct traffic (125). You're also getting visits from Facebook, Bing, and DuckDuckGo. The 9 SEO landing pages we built are getting indexed and starting to pull in search traffic from people looking for grooming in Palm Harbor, Tarpon Springs, Dunedin, and Clearwater.</p>

    <p style="font-size: 14px; line-height: 1.6;"><strong>Top local cities:</strong> Palm Harbor, Tampa, Daytona Beach, and Miami. This kind of organic reach means the site is working — people are finding you through Google without any paid ads.</p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <!-- VIPs -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0;">Repeat Bookers</h2>

    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">Customers who've booked through the site multiple times:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Suzy Maldonado</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right;">3 bookings</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Alexandra Sherlock</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right;">3 bookings</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Melinda Box, Nick, Jacquelyn Meder, Deb Maroney, Johanna Rutledge, Lorri Finn</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; white-space: nowrap;">2 each</td>
      </tr>
    </table>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <!-- CTA Work -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0;">What We Improved This Week</h2>
    
    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;"><strong>Redesigned the call-to-action buttons</strong> at the top of the site to give customers more ways to reach you:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 10px; border: 1px solid #e0e0e0; vertical-align: top; width: 50%;">
          <p style="font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">Desktop</p>
          <ul style="font-size: 13px; line-height: 1.7; margin: 0; padding-left: 16px;">
            <li><strong>Request Appointment</strong> — primary button</li>
            <li><strong>Phone number</strong> — clickable to call</li>
            <li><strong>Text Us</strong> — copies number to text</li>
          </ul>
        </td>
        <td style="padding: 10px; border: 1px solid #e0e0e0; vertical-align: top; width: 50%;">
          <p style="font-size: 13px; font-weight: 600; margin: 0 0 8px 0;">Mobile</p>
          <ul style="font-size: 13px; line-height: 1.7; margin: 0; padding-left: 16px;">
            <li><strong>Call Us</strong> — taps to dial</li>
            <li><strong>Text Us</strong> — copies number</li>
            <li><strong>Request Appointment</strong> — opens form</li>
          </ul>
        </td>
      </tr>
    </table>
    
    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">On mobile, people want to call or text right away. On desktop, the form is the easiest path. Both are now optimized for that.</p>

    <p style="font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;"><strong>Added event tracking on every contact action.</strong> We now track phone call clicks, text copies, form opens, and form submissions through Google Analytics. Here's what February's data already shows:</p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Appointment button clicks</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">83</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Form opens</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">88</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Form submissions</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">32</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px;">Phone call clicks</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: right; font-weight: 600;">15</td>
      </tr>
    </table>

    <p style="font-size: 14px; line-height: 1.6;">That's a <strong>36% form completion rate</strong> (32 submissions out of 88 opens) — healthy for a service booking form. And 15 people clicked to call directly from the site. With the new Text Us button, we'll see how that channel performs going forward.</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <!-- Next Step -->
    <h2 style="font-size: 18px; margin: 0 0 15px 0;">Next Up: Search Engine Verification</h2>
    
    <p style="font-size: 14px; line-height: 1.6;">We'd like to set up <strong>Google Search Console</strong> and <strong>Bing Webmaster Tools</strong> — free tools that show exactly what keywords people search to find Pupperazi, which pages rank, and where there's room to rank higher.</p>
    
    <p style="font-size: 14px; line-height: 1.6;">To do this, we just need to add a small verification record to the domain's DNS settings through Wix. <strong>Could you share access to the Wix DNS settings</strong> for pupperazipetspa.com when you get a chance? No rush at all.</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 15px; line-height: 1.6;">Let me know if you have any questions!</p>
    
    <p style="font-size: 15px; line-height: 1.6; margin-top: 25px;">
      Best,<br>
      Stephen
    </p>
    
  </div>
</body>
</html>
`;

  try {
    const result = await resend.emails.send({
      from: 'Stephen Newman <stephen@krezzo.com>',
      to: ['stephen@krezzo.com'],
      subject: 'Pupperazi Website Update — March 2026',
      html: emailHtml,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'March update email sent!',
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
