import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Load env from .env.local if running locally
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL || 'https://xsncgdnctnbzvokmxlex.supabase.co';
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_ANON_KEY || '';
const supabase = createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY);

interface AppointmentStats {
  total: number;
  newCustomers: number;
  returningCustomers: number;
  newCustomerPct: number;
}

interface MonthData {
  name: string;
  stats: AppointmentStats;
  topBreeds: { breed: string; count: number }[];
}

async function getMonthStats(startDate: string, endDate: string): Promise<AppointmentStats> {
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

async function getTotalAppointments(): Promise<number> {
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
      <div class="stat-label">Total Appointments</div>
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
      <td>Total Appointments</td>
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
    <strong>💡 All-Time Total:</strong> ${totalAllTime} appointment requests since launch (Nov 1, 2025)
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

  <h2>🆕 What's New on Your Website</h2>
  
  <div class="feature-list">
    <div class="feature-item">
      <strong>📊 Admin Dashboard & CRM</strong><br>
      <span style="color: #6B7280;">Full appointment management portal with real-time stats, customer tracking, and interactive charts</span><br>
      <span style="font-size: 12px; color: #9CA3AF;">Access: pupperazipetspa.com/admin/portal-login</span>
    </div>
    <div class="feature-item">
      <strong>📈 Interactive Analytics Charts</strong><br>
      <span style="color: #6B7280;">Daily, weekly, and monthly trend charts • Week-to-week comparison • New vs returning customer breakdowns</span>
    </div>
    <div class="feature-item">
      <strong>🔄 Repeat Customer Tracking</strong><br>
      <span style="color: #6B7280;">See which customers have multiple appointments in the last 90 days — your VIP clients!</span>
    </div>
    <div class="feature-item">
      <strong>🔍 9 SEO Landing Pages</strong><br>
      <span style="color: #6B7280;">Breed-specific: Goldendoodle, Golden Retriever, Shih Tzu, Yorkie, French Bulldog, Husky</span><br>
      <span style="color: #6B7280;">Local cities: Tarpon Springs, Dunedin, Clearwater</span>
    </div>
    <div class="feature-item">
      <strong>📱 CTA & Conversion Tracking</strong><br>
      <span style="color: #6B7280;">Tracking form opens, submissions, phone clicks, and appointment request buttons</span>
    </div>
    <div class="feature-item">
      <strong>📬 Automated Reports</strong><br>
      <span style="color: #6B7280;">Weekly appointment summaries to Slack • Monthly recap emails (like this one!)</span>
    </div>
  </div>

  <div class="cta-box">
    <h3>🚀 Coming in Q1 2026</h3>
    <p style="margin-bottom: 15px;">We're building some exciting new features to help you grow:</p>
    <p><strong>📅 Online Scheduling</strong> — Let customers book directly on your calendar</p>
    <p><strong>🔔 Smart Grooming Reminders</strong> — Automated emails based on breed grooming schedules<br>
    <span style="font-size: 14px; opacity: 0.9;">"Hi! It's been 6 weeks since Scout's last groom. Time for a fresh cut?"</span></p>
    <p><strong>💳 Book at Checkout</strong> — Prompt customers to schedule their next appointment at payment</p>
  </div>

  <h2 style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin-top: 30px;">📝 Your Homework</h2>
  
  <div class="section" style="background: #FFFBEB; padding: 20px; border-radius: 12px; border: 2px solid #F59E0B;">
    <p style="margin-top: 0;"><strong>To unlock even more insights, we need your help with a few things:</strong></p>
    
    <p><strong>1. ⭐ Google Search Console Access</strong><br>
    <span style="color: #6B7280;">This will show us exactly what keywords people are typing to find you. We can then create content to capture more of these searches.</span><br>
    <span style="font-size: 13px; color: #92400E;">→ Go to search.google.com/search-console and add us as a user, or share view access</span></p>
    
    <p><strong>2. 📸 5-10 Recent Grooming Photos</strong><br>
    <span style="color: #6B7280;">Before/after shots of Goldendoodles, Yorkies, and other popular breeds. We'll add these to the SEO pages to improve engagement and rankings.</span><br>
    <span style="font-size: 13px; color: #92400E;">→ Text or email them over whenever you get a chance!</span></p>
    
    <p><strong>3. 💬 Google Reviews Push</strong><br>
    <span style="color: #6B7280;">After each appointment, send customers your Google review link. More reviews = higher rankings = more new customers.</span><br>
    <span style="font-size: 13px; color: #92400E;">→ Copy/paste this text: "Thanks for coming in! If you have a moment, we'd love a review: [your Google link]"</span></p>
    
    <p style="margin-bottom: 0;"><strong>4. 📋 Your Typical Grooming Schedule by Breed</strong><br>
    <span style="color: #6B7280;">For the smart reminders feature — how often should each breed come in? (e.g., Goldendoodles every 6-8 weeks, Yorkies every 4-6 weeks)</span><br>
    <span style="font-size: 13px; color: #92400E;">→ Just reply to this email with your recommendations!</span></p>
  </div>

  <h2>💡 Recommendations</h2>
  
  <div class="section">
    <p><strong>1. Check your admin dashboard weekly</strong> — See who's requested appointments, track your new customer rate, and spot trends. Takes 2 minutes!</p>
    
    <p><strong>2. Respond quickly to new requests</strong> — ASAP requests convert best when you reply within 2-4 hours. The dashboard shows you who's new.</p>
    
    <p><strong>3. Saturdays are gold</strong> — Most requested day by returning customers. Consider a waitlist or priority booking for your regulars.</p>
    
    <p><strong>4. Valentine's Day promo?</strong> — People want their pups looking good for photos! A "Puppy Love" special in early February could drive bookings.</p>
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

async function main() {
  console.log('🐾 Generating Pupperazi Monthly Recap...\n');

  const now = new Date();
  
  // December 2025 data (the month we want to report on)
  const currentMonthStart = new Date(2025, 11, 1); // December 1, 2025
  const currentMonthEnd = new Date(2026, 0, 1); // January 1, 2026
  
  // November 2025 data (previous month)
  const previousMonthStart = new Date(2025, 10, 1); // November 1, 2025
  const previousMonthEnd = new Date(2025, 11, 1); // December 1, 2025

  console.log('📊 Fetching stats...');
  
  const [currentStats, previousStats, currentBreeds, totalAppointments] = await Promise.all([
    getMonthStats(currentMonthStart.toISOString(), currentMonthEnd.toISOString()),
    getMonthStats(previousMonthStart.toISOString(), previousMonthEnd.toISOString()),
    getBreedAnalysis(currentMonthStart.toISOString(), currentMonthEnd.toISOString()),
    getTotalAppointments(),
  ]);

  console.log('\n📈 December 2025 Stats:');
  console.log(`   Total: ${currentStats.total}`);
  console.log(`   New Customers: ${currentStats.newCustomers}`);
  console.log(`   Returning: ${currentStats.returningCustomers}`);
  console.log(`   New Customer %: ${currentStats.newCustomerPct}%`);

  console.log('\n📈 November 2025 Stats:');
  console.log(`   Total: ${previousStats.total}`);
  console.log(`   New Customers: ${previousStats.newCustomers}`);
  console.log(`   Returning: ${previousStats.returningCustomers}`);
  console.log(`   New Customer %: ${previousStats.newCustomerPct}%`);

  console.log('\n🐕 Top Breeds (December):');
  currentBreeds.forEach(b => console.log(`   ${b.breed}: ${b.count}`));

  console.log(`\n📊 All-time total: ${totalAppointments}`);

  const currentMonth: MonthData = {
    name: 'December',
    stats: currentStats,
    topBreeds: currentBreeds,
  };

  const previousMonth: MonthData = {
    name: 'November',
    stats: previousStats,
    topBreeds: [],
  };

  const emailHTML = generateEmailHTML(currentMonth, previousMonth, totalAppointments, now);

  console.log('\n📧 Sending email to stephen@outcomeview.com...');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Pupperazi Reports <reports@pupperazipetspa.com>',
      to: ['stephen@outcomeview.com'],
      subject: `🐾 Pupperazi Monthly Recap: December 2025 Results`,
      html: emailHTML,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log(`   Email ID: ${data?.id}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
    process.exit(1);
  }
}

main();

// Force redeploy Thu Jan  1 09:22:43 EST 2026
