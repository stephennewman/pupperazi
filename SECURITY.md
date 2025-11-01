# Security Documentation

## 🔒 Security Measures Implemented

### Authentication & Authorization

1. **Admin Authentication**
   - Token-based authentication for all admin API routes
   - Tokens expire after 24 hours
   - Password-protected admin access
   - All `/api/admin/*` routes require valid authentication token

2. **Route Protection**
   - `/api/admin/appointments` - Requires auth
   - `/api/admin/customers` - Requires auth
   - `/api/admin/dashboard` - Requires auth
   - `/api/admin/auth` - Public (login endpoint)

### Environment Variables

**Critical:** Ensure these environment variables are set in Vercel:

#### Required for Core Functionality
```env
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
RESEND_API_KEY=<your_resend_api_key>
ADMIN_PASSWORD=<strong_password_here>
```

⚠️ **IMPORTANT:** Set a strong `ADMIN_PASSWORD` in Vercel. Do not use the default!

#### Optional
- `ADMIN_EMAIL` - Additional admin email for notifications
- `SLICKTEXT_API_KEY` - For SMS notifications
- `SLICKTEXT_BRAND_ID` - SlickText brand ID
- Stripe keys (if using payments)
- Analytics keys (if using analytics)

### Data Protection

1. **Input Validation**
   - All user inputs validated with Zod schemas
   - SQL injection protection via Supabase client
   - XSS protection via React (auto-escaping)

2. **Sensitive Data**
   - No API keys in repository
   - All secrets in environment variables
   - `.env` files properly gitignored

### Best Practices

1. **Rate Limiting** (Recommended for Production)
   - Consider adding rate limiting to:
     - `/api/booking` - Prevent booking spam
     - `/api/contact` - Prevent email spam
     - `/api/admin/auth` - Prevent brute force

2. **Monitoring** (Recommended)
   - Monitor failed admin login attempts
   - Track API usage patterns
   - Alert on suspicious activity

3. **Token Management**
   - Tokens stored in memory (cleared on server restart)
   - Consider Redis for production persistence
   - Automatic cleanup of expired tokens

## 🚨 Security Checklist Before Launch

- [ ] Strong `ADMIN_PASSWORD` set in Vercel
- [ ] All required environment variables configured
- [ ] No hardcoded secrets in codebase
- [ ] Test admin login works
- [ ] Test unauthorized access is blocked
- [ ] Verify HTTPS is enabled (Vercel default)
- [ ] Review who has access to Vercel dashboard
- [ ] Test all admin routes require authentication

## 🔐 Admin Access

### How to Access Admin Panel

1. Navigate to `/admin/login`
2. Enter the admin password (set in `ADMIN_PASSWORD` env var)
3. Token is stored in localStorage
4. Token is sent with all admin API requests
5. Token expires after 24 hours

### How to Secure Admin Access

1. Use a strong password (20+ characters, mixed case, numbers, symbols)
2. Don't share the password via unsecured channels
3. Rotate password periodically
4. Monitor access logs in Vercel

## 🛡️ Incident Response

If you suspect unauthorized access:

1. Immediately change `ADMIN_PASSWORD` in Vercel
2. Deploy new version (triggers server restart, invalidates all tokens)
3. Review Vercel logs for suspicious activity
4. Check database for unauthorized changes
5. Consider enabling Vercel's firewall rules

## 📞 Security Contact

For security issues, contact:
- stephen.p.newman@gmail.com
- PupperaziPetSpa@gmail.com

---

Last Updated: November 1, 2025

