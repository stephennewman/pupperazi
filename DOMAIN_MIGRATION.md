# Domain Migration Checklist

## 🌐 Current Domain (MIGRATED)
**https://pupperazipetspa.com** ✅

## 🎯 Previous Staging Domain
**https://pupperazi.krezzo.com** (now redirects)

---

## ⚠️ When You Switch Domains - Update These Files:

### 1. **`app/sitemap.ts`** (Line 4)
```typescript
const baseUrl = 'https://pupperazipetspa.com'
```

### 2. **`app/robots.ts`** (Line 4)
```typescript
const baseUrl = 'https://pupperazipetspa.com'
```

### 3. **`app/layout.tsx`** (Lines 39, 46)
```typescript
metadataBase: new URL("https://pupperazipetspa.com"),
// ...
url: "https://pupperazipetspa.com",
```

### 4. **Structured Data in All Pages:**
Update in these files:
- `app/page.tsx` (lines 29-31)
- `app/grooming/page.tsx` (line 17)
- `app/our-services/page.tsx` (line 17)
- `app/appointments/page.tsx` (line 18)
- `app/wash-n-go-baths/page.tsx` (line 17)
- `app/map-hours/page.tsx` (line 16)
- `app/about-us/page.tsx` (line 18)
- `app/puppy-grooming-palm-harbor/page.tsx` (line 13)
- `app/dog-grooming-palm-harbor-fl/page.tsx` (line 14)
- `app/best-dog-groomer-palm-harbor/page.tsx` (line 13)

### 5. **`PRICING_AND_HOURS.md`** (Line 96)
```markdown
**Website:** pupperazipetspa.com
```

### 6. **`qr-code-generator.html`** (Line 65)
```html
value="https://pupperazipetspa.com/photo-booth"
```

---

## 🔧 Quick Find & Replace (After Domain Switch)

Use your IDE's find & replace:

**Find:** `https://pupperazi.krezzo.com`  
**Replace with:** `https://pupperazipetspa.com`

**Find:** `pupperazi.krezzo.com`  
**Replace with:** `pupperazipetspa.com`

---

## ✅ Post-Migration Checklist

After switching domains:

1. **Update DNS Records**
   - Point new domain to Vercel
   - Set up HTTPS/SSL certificate
   - Verify domain in Vercel dashboard

2. **301 Redirects (IMPORTANT!)**
   - Set up permanent redirects from krezzo.com → pupperazipetspa.com
   - This preserves SEO rankings and traffic
   - Configure in Vercel dashboard or DNS provider

3. **Update Google Search Console**
   - Add new domain as property
   - Submit new sitemap: `https://pupperazipetspa.com/sitemap.xml`
   - Keep old property active for 6 months (for redirect monitoring)

4. **Update Google Business Profile**
   - Change website URL to new domain
   - Verify consistency across all listings

5. **Update Social Media**
   - Facebook: Update website link
   - Instagram: Update bio link
   - All other platforms

6. **Update Email Signatures**
   - Staff email signatures
   - Automated email footers

7. **Test Everything**
   - Visit: https://pupperazipetspa.com/sitemap.xml
   - Visit: https://pupperazipetspa.com/robots.txt
   - Test all major pages
   - Verify structured data: https://search.google.com/test/rich-results
   - Check mobile responsiveness

8. **Monitor (First 2 Weeks)**
   - Watch Google Search Console for crawl errors
   - Monitor traffic analytics
   - Check that old URLs redirect properly
   - Verify no broken links

---

## 📊 SEO Impact

**Expected:**
- Short-term (1-2 weeks): Slight ranking fluctuations
- Medium-term (1 month): Rankings stabilize
- Long-term: Stronger brand domain = better SEO

**Minimize Impact:**
- ✅ Use 301 redirects (not 302)
- ✅ Keep old domain active for 6+ months
- ✅ Update all citations/directories
- ✅ Submit new sitemap immediately

---

## 🆘 Need Help?

All URLs in the codebase currently point to **pupperazi.krezzo.com** (your current domain). When you're ready to switch, just run a global find & replace as shown above, then follow the post-migration checklist.

