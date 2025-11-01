# 🚀 DNS Records to Update in Wix

## Status: Ready to Launch! ✅

Everything is deployed and ready. You just need to update DNS in Wix.

---

## 📋 Step-by-Step Instructions

### **Step 1: Log into Wix**
Go to: https://www.wix.com/my-account/domains/

### **Step 2: Select Your Domain**
Click on `pupperazipetspa.com` → Manage DNS Records

### **Step 3: DELETE These Old A Records**

❌ Remove:
```
pupperazipetspa.com → 185.230.63.171
pupperazipetspa.com → 185.230.63.186
pupperazipetspa.com → 185.230.63.107
```

### **Step 4: ADD This New A Record**

✅ Add:
```
Type: A
Host name: pupperazipetspa.com (or @ or leave blank)
Value: 76.76.21.21
TTL: 1 Hour (3600 seconds)
```

### **Step 5: UPDATE www CNAME Record**

Find this existing record:
```
www.pupperazipetspa.com → cdn1.wixdns.net
```

Change it to:
```
Type: A
Host name: www.pupperazipetspa.com (or www)
Value: 76.76.21.21
TTL: 1 Hour (3600 seconds)
```

**Note:** Vercel recommends using an A record for www as well (same IP).

### **Step 6: Save Changes**

Click "Save" or "Update" in Wix DNS settings.

---

## ⏱️ What Happens Next

### Immediate (0-5 minutes):
- DNS records updated in Wix
- Vercel starts detecting the change

### Within 1-2 Hours:
- 50% of users will see new site
- SSL certificate automatically issued by Vercel

### Within 4-8 Hours:
- 95% of users see new site
- DNS fully propagated

### Within 24-48 Hours:
- 100% global propagation complete

---

## ✅ How to Verify It Worked

### Check DNS Propagation:
https://dnschecker.org/#A/pupperazipetspa.com

Should show: `76.76.21.21`

### Check SSL Certificate:
Visit: https://pupperazipetspa.com

Should show: 🔒 Green padlock (within 5-10 minutes)

### Check Site Works:
- Homepage loads
- Booking form works
- Contact form works
- All pages accessible

---

## 🔄 Rollback Plan (If Needed)

If something breaks:

1. Go back to Wix DNS settings
2. Change A record back to: `185.230.63.171`
3. Wait 1-2 hours for propagation
4. Old Wix site will return

---

## 📞 Support

If you run into issues:
- DNS not propagating: Wait 2-4 hours
- SSL certificate error: Wait 10 minutes, Vercel auto-issues it
- Site not loading: Check DNS at dnschecker.org
- Email me: stephen.p.newman@gmail.com

---

## 🎉 Current Status

✅ **Code Updated:** All URLs changed to pupperazipetspa.com  
✅ **Security Fixed:** Admin routes protected, no secrets in code  
✅ **Build Successful:** No errors  
✅ **Deployed to Vercel:** Production ready  
✅ **Domains Added:** pupperazipetspa.com + www  
✅ **Environment Variables:** Set in Vercel  

**👉 YOU'RE NEXT:** Update DNS in Wix (Steps above)

---

Last Updated: November 1, 2025

