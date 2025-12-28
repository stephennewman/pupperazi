# Environment Variables Configuration

## Required Variables

### Supabase Database (REQUIRED)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Used for: Database operations, customer data, appointments, bookings

### Email Service (REQUIRED)
```env
RESEND_API_KEY=your_resend_api_key
```
Used for: Booking confirmations, contact form submissions, admin notifications

### Admin Security (REQUIRED)
```env
ADMIN_PASSWORD=your_strong_password_here
```
⚠️ **CRITICAL**: Use a strong password (20+ characters)
Used for: Admin panel authentication

## Optional Variables

### Additional Email Recipients
```env
ADMIN_EMAIL=admin@pupperazipetspa.com
```
Used for: Additional admin notification recipient

### SMS Notifications (Optional)
```env
SLICKTEXT_API_KEY=your_slicktext_api_key
SLICKTEXT_BRAND_ID=your_slicktext_brand_id
```
Used for: Lead capture SMS notifications

### Payment Processing (Optional)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```
Used for: Online payment processing (if enabled)

### Google Analytics Reporting (Optional)
```env
GA_PROPERTY_ID=your_ga4_property_id
GA_CLIENT_EMAIL=your_service_account_email
GA_PRIVATE_KEY=your_service_account_private_key
```
Used for: Automated analytics reports to Slack
Note: Requires Google Cloud service account with GA4 Data API access

### Slack Integration (Optional)
```env
SLACK_ANALYTICS_WEBHOOK=https://hooks.slack.com/services/xxx/xxx/xxx
```
Used for: Sending daily/weekly/monthly analytics reports to Slack

### Cron Security (Required for Analytics Reports)
```env
CRON_SECRET=your_secure_random_string
```
Used for: Securing cron job endpoints

## Setup Instructions

### In Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable with its value
3. Select environments: Production, Preview, Development
4. Save and redeploy

### For Local Development:

1. Create `.env.local` file in project root
2. Copy the required variables above
3. Replace with your actual values
4. File is gitignored automatically

## Security Notes

- Never commit `.env` or `.env.local` files to git
- Never share API keys in Slack, email, or public channels
- Rotate keys periodically
- Use different keys for development vs production
- Vercel encrypts all environment variables at rest

## Verification

To verify your environment variables are set:

```bash
vercel env ls
```

This will list all configured environment variables (values hidden).

