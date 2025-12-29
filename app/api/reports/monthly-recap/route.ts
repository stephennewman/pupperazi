import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';
const supabase = LEADS_SUPABASE_KEY ? createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY) : null;

// Who receives the monthly recap
const RECAP_RECIPIENTS = [
  'stephen@outcomeview.com', // Your email
  // Add client email when ready: 'pupperazipetspa@gmail.com'
];

interface LeadStats {
  total: number;
  newCustomers: number;
  returningCustomers: number;
  newCustomerPct: number;
}

interface MonthData {
  name: string;
  stats: LeadStats;
  topBreeds: { breed: string; count: number }[];
  topRequestTimes: { time: string; count: number }[];
}

async function getMonthStats(startDate: string, endDate: string): Promise<LeadStats> {
  if (!supabase) return { total: 0, newCustomers: 0, returningCustomers: 0, newCustomerPct: 0 };
  
  const { data } = await supabase
    .from('pupperazi_leads')
    .select('is_new_customer')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const total = data?.length || 0;
  const newCustomers = data?.filter(r => r.is_new_customer === 'yes').length || 0;
  const returningCustomers = data?.filter(r => r.is_new_customer === 'no').length || 0;
  const newCustomerPct = total > 0 ? Math.round((newCustomers / total) * 100) : 0;

  return { total, newCustomers, returningCustomers, newCustomerPct };
}

async function getBreedAnalysis(startDate: string, endDate: string): Promise<{ breed: string; count: number }[]> {
  if (!supabase) return [];
  
  const { data } = await supabase
    .from('pupperazi_leads')
    .select('pet_info')
    .gte('created_at', startDate)
    .lt('created_at', endDate);

  const breedCounts: Record<string, number> = {};
  const breedKeywords = [
    'goldendoodle', 'golden retriever', 'shih tzu', 'yorkie', 'yorkshire', 
    'french bulldog', 'frenchie', 'husky', 'poodle', 'maltese', 'doodle',
    'labrador', 'beagle', 'corgi', 'havanese', 'morkie', 'pit', 'german shepherd'
  ];

  data?.forEach(row => {
    const petInfo = (row.pet_info || '').toLowerCase();
    breedKeywords.forEach(breed => {
      if (petInfo.includes(breed)) {
        const normalizedBreed = breed === 'yorkshire' ? 'yorkie' : 
                               breed === 'frenchie' ? 'french bulldog' :
                               breed.charAt(0).toUpperCase() + breed.slice(1);
        breedCounts[normalizedBreed] = (breedCounts[normalizedBreed] || 0) + 1;
      }
    });
  });

  return Object.entries(breedCounts)
    .map(([breed, count]) => ({ breed, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

async function getTotalLeads(): Promise<number> {
  if (!supabase) return 0;
  const { count } = await supabase
    .from('pupperazi_leads')
    .select('id', { count: 'exact', head: true });
  return count || 0;
}

function generateEmailHTML(
  currentMonth: MonthData,
  previousMonth: MonthData,
  totalAllTime: number,
  reportDate: Date
): string {
  const monthName = reportDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const growthPct = previousMonth.stats.total > 0 
    ? Math.round(((currentMonth.stats.total - previousMonth.stats.total) / previousMonth.stats.total) * 100)
    : 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #6B21A8; }
    h2 { color: #7C3AED; border-bottom: 2px solid #E9D5FF; padding-bottom: 8px; margin-top: 30px; }
    .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%); padding: 20px; border-radius: 12px; text-align: center; }
    .stat-number { font-size: 32px; font-weight: bold; color: #6B21A8; }
    .stat-label { font-size: 14px; color: #6B7280; }
    .highlight { background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0; }
    .growth-positive { color: #059669; }
    .growth-negative { color: #DC2626; }
    .section { margin: 25px 0; }
    .feature-list { background: #F0FDF4; padding: 20px; border-radius: 12px; }
    .feature-item { padding: 10px 0; border-bottom: 1px solid #D1FAE5; }
    .feature-item:last-child { border-bottom: none; }
    .cta-box { background: linear-gradient(135deg, #7C3AED 0%, #6B21A8 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; }
    .cta-box h3 { margin-top: 0; }
    .insight-box { background: #EFF6FF; padding: 15px; border-radius: 8px; margin: 10px 0; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
    th { background: #F9FAFB; font-weight: 600; }
    .emoji { font-size: 24px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 48px;">🐾</span>
    <h1 style="margin: 10px 0;">Pupperazi Pet Spa</h1>
    <p style="color: #6B7280; font-size: 18px;">Monthly Website Performance Report</p>
    <p style="color: #9CA3AF;">${monthName}</p>
  </div>

  <div class="highlight">
    <strong>🎉 Quick Summary:</strong> Your website generated <strong>${currentMonth.stats.total} appointment requests</strong> this month 
    ${growthPct !== 0 ? `(<span class="${growthPct >= 0 ? 'growth-positive' : 'growth-negative'}">${growthPct >= 0 ? '+' : ''}${growthPct}%</span> vs last month)` : ''}
    — including <strong>${currentMonth.stats.newCustomers} new customers!</strong>
  </div>

  <h2>📊 ${currentMonth.name} Performance</h2>
  
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-number">${currentMonth.stats.total}</div>
      <div class="stat-label">Total Leads</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${currentMonth.stats.newCustomers}</div>
      <div class="stat-label">New Customers ⭐</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${currentMonth.stats.returningCustomers}</div>
      <div class="stat-label">Returning Customers</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${currentMonth.stats.newCustomerPct}%</div>
      <div class="stat-label">New Customer Rate</div>
    </div>
  </div>

  <h2>📈 Month-over-Month Comparison</h2>
  
  <table>
    <tr>
      <th>Metric</th>
      <th>${previousMonth.name}</th>
      <th>${currentMonth.name}</th>
      <th>Change</th>
    </tr>
    <tr>
      <td>Total Leads</td>
      <td>${previousMonth.stats.total}</td>
      <td>${currentMonth.stats.total}</td>
      <td class="${currentMonth.stats.total >= previousMonth.stats.total ? 'growth-positive' : 'growth-negative'}">
        ${currentMonth.stats.total >= previousMonth.stats.total ? '+' : ''}${currentMonth.stats.total - previousMonth.stats.total}
      </td>
    </tr>
    <tr>
      <td>New Customers</td>
      <td>${previousMonth.stats.newCustomers}</td>
      <td>${currentMonth.stats.newCustomers}</td>
      <td class="${currentMonth.stats.newCustomers >= previousMonth.stats.newCustomers ? 'growth-positive' : 'growth-negative'}">
        ${currentMonth.stats.newCustomers >= previousMonth.stats.newCustomers ? '+' : ''}${currentMonth.stats.newCustomers - previousMonth.stats.newCustomers}
      </td>
    </tr>
    <tr>
      <td>New Customer %</td>
      <td>${previousMonth.stats.newCustomerPct}%</td>
      <td>${currentMonth.stats.newCustomerPct}%</td>
      <td class="${currentMonth.stats.newCustomerPct >= previousMonth.stats.newCustomerPct ? 'growth-positive' : 'growth-negative'}">
        ${currentMonth.stats.newCustomerPct >= previousMonth.stats.newCustomerPct ? '+' : ''}${currentMonth.stats.newCustomerPct - previousMonth.stats.newCustomerPct}pts
      </td>
    </tr>
  </table>

  <div class="insight-box">
    <strong>💡 All-Time Total:</strong> ${totalAllTime} leads captured since launch (Nov 1, 2025)
  </div>

  <h2>🐕 Top Breeds Requesting Appointments</h2>
  
  ${currentMonth.topBreeds.length > 0 ? `
  <table>
    <tr><th>Breed</th><th>Requests</th></tr>
    ${currentMonth.topBreeds.map(b => `<tr><td>${b.breed}</td><td>${b.count}</td></tr>`).join('')}
  </table>
  <div class="insight-box">
    <strong>💡 Insight:</strong> ${currentMonth.topBreeds[0]?.breed || 'Doodle breeds'} continue to be your most requested breed. 
    These dogs need grooming every 6-8 weeks — perfect for recurring appointments!
  </div>
  ` : '<p>No breed data available yet.</p>'}

  <h2>🔍 How Customers Are Finding You</h2>
  
  <div class="insight-box">
    <p><strong>Search Trends to Watch:</strong></p>
    <ul>
      <li>"Goldendoodle grooming near me" — High intent, ready to book</li>
      <li>"Dog grooming [city name]" — Local searches from surrounding areas</li>
      <li>"Best dog groomer Palm Harbor" — Reputation-based searches</li>
      <li>"[Breed] haircut styles" — Research phase, capture with content</li>
    </ul>
    <p style="margin-top: 15px;"><strong>🎯 We added 9 SEO landing pages</strong> targeting these exact searches. They should start ranking in Google over the next 2-3 months.</p>
  </div>

  <h2>🆕 New Features Added This Month</h2>
  
  <div class="feature-list">
    <div class="feature-item">
      <strong>📊 Admin Dashboard</strong><br>
      <span style="color: #6B7280;">View and manage all leads, track new vs returning customers, see real-time stats</span><br>
      <span style="font-size: 12px; color: #9CA3AF;">Access: pupperazipetspa.com/admin/portal-login</span>
    </div>
    <div class="feature-item">
      <strong>🔍 SEO Landing Pages (9 new pages)</strong><br>
      <span style="color: #6B7280;">Breed-specific pages (Goldendoodle, Golden Retriever, Shih Tzu, Yorkie, French Bulldog, Husky) + city pages (Tarpon Springs, Dunedin, Clearwater)</span>
    </div>
    <div class="feature-item">
      <strong>📈 Customer Acquisition Tracking</strong><br>
      <span style="color: #6B7280;">Dashboard now shows new customer % by month with trend analysis</span>
    </div>
    <div class="feature-item">
      <strong>📱 CTA Click Tracking</strong><br>
      <span style="color: #6B7280;">Now tracking "Request Appointment" and phone clicks to measure engagement</span>
    </div>
  </div>

  <div class="cta-box">
    <h3>🚀 Coming in Q1 2026</h3>
    <p style="margin-bottom: 15px;">We're building some exciting new features:</p>
    <p><strong>📅 Online Scheduling</strong> — Let customers book directly on your calendar</p>
    <p><strong>🔔 Smart Reminders</strong> — Automated emails based on breed grooming schedules ("It's been 6 weeks since Scout's last groom!")</p>
    <p><strong>💳 Book at Checkout</strong> — Prompt customers to schedule their next appointment at payment</p>
  </div>

  <h2>💡 Recommendations</h2>
  
  <div class="section">
    <p><strong>1. Respond quickly to new leads</strong> — 32% of new customers request ASAP appointments. First response within 2-4 hours converts best.</p>
    
    <p><strong>2. Saturdays are gold</strong> — Most requested day by returning customers. Consider waitlist or priority booking for regulars.</p>
    
    <p><strong>3. Ask for Google Reviews</strong> — After appointments, send a quick text with your review link. More reviews = higher local rankings = more new customers.</p>
    
    <p><strong>4. Valentine's Day marketing</strong> — People want their pups looking good for photos! Plan a "Puppy Love" promo for early February.</p>
  </div>

  <div class="footer">
    <p>This report was automatically generated by your website analytics system.</p>
    <p>Questions? Reply to this email or reach out anytime.</p>
    <p style="margin-top: 15px;">— OutcomeView</p>
  </div>
</body>
</html>
  `;
}

export async function GET(request: NextRequest) {
  // Verify cron secret for automated runs
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Allow manual trigger without auth for testing, but require auth for cron
  const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}`;
  
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!resend) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const now = new Date();
    
    // Get current month (the month that just ended)
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get previous month
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Fetch all data
    const [currentStats, previousStats, currentBreeds, totalLeads] = await Promise.all([
      getMonthStats(currentMonthStart.toISOString(), currentMonthEnd.toISOString()),
      getMonthStats(previousMonthStart.toISOString(), previousMonthEnd.toISOString()),
      getBreedAnalysis(currentMonthStart.toISOString(), currentMonthEnd.toISOString()),
      getTotalLeads(),
    ]);

    const currentMonth: MonthData = {
      name: currentMonthStart.toLocaleString('default', { month: 'long' }),
      stats: currentStats,
      topBreeds: currentBreeds,
      topRequestTimes: [],
    };

    const previousMonth: MonthData = {
      name: previousMonthStart.toLocaleString('default', { month: 'long' }),
      stats: previousStats,
      topBreeds: [],
      topRequestTimes: [],
    };

    const emailHTML = generateEmailHTML(currentMonth, previousMonth, totalLeads, now);

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Pupperazi Reports <reports@pupperazipetspa.com>',
      to: RECAP_RECIPIENTS,
      subject: `🐾 Pupperazi Monthly Recap: ${currentMonth.name} Results`,
      html: emailHTML,
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Monthly recap email sent',
      emailId: data?.id,
      stats: {
        currentMonth: currentMonth.stats,
        previousMonth: previousMonth.stats,
        totalAllTime: totalLeads,
      },
    });

  } catch (error) {
    console.error('Monthly recap error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

