# 🔒 Enable HTTPS for vltrngames.com

## ❌ Why HTTPS is Disabled

GitHub Pages shows: **"Unavailable for your site because your domain is not properly configured to support HTTPS"**

This happens because:
1. The `www` subdomain is not properly configured (it's an A record instead of CNAME)
2. GitHub Pages requires BOTH root domain AND www subdomain to be correct before enabling HTTPS

## ✅ Solution: Fix www Subdomain

### Step 1: Delete www A Record

1. Go to SiteGround DNS Zone Editor: https://tools.siteground.com
2. Find the A record for `www.vltrngames.com.` pointing to `35.215.113.148`
3. Click the **trash icon** to DELETE it

### Step 2: Create www CNAME Record

1. Click **"Create New Record"**
2. Select **"CNAME"** tab
3. Fill in:
   - **Name**: `www` (just `www`, not the full domain)
   - **Resolves to**: `vltrnone.github.io` (lowercase - DNS is case-insensitive, but use lowercase to match existing)
   - **TTL**: `24 hours`
4. Click **"CREATE"**

### Step 3: Verify DNS Configuration

After creating the CNAME, verify both domains:

**Check root domain:**
```bash
dig vltrngames.com
# Should show A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
```

**Check www subdomain:**
```bash
dig www.vltrngames.com
# Should show CNAME pointing to VltrnOne.github.io
```

Or use online tools:
- https://www.whatsmydns.net/#A/vltrngames.com
- https://www.whatsmydns.net/#CNAME/www.vltrngames.com

### Step 4: Wait for DNS Propagation

- **DNS propagation**: Usually 1-2 hours, can take up to 24 hours
- **GitHub SSL certificate**: Can take a few hours after DNS is correct

### Step 5: Check GitHub Pages Settings

1. Go to: https://github.com/VltrnOne/robot-lyric/settings/pages
2. Click **"Check again"** button (if warning appears)
3. Wait for DNS to propagate
4. The warning should disappear

### Step 6: Enable HTTPS

Once DNS is correct and propagated:
1. The **"Enforce HTTPS"** checkbox should become **enabled** (not greyed out)
2. Check the box ✅
3. Click **"Save"**
4. Wait for SSL certificate to be issued (can take a few hours)

## ⏱️ Timeline

1. **Fix DNS** (delete www A, create www CNAME): 5 minutes
2. **DNS propagation**: 1-2 hours (can take up to 24 hours)
3. **GitHub detects correct DNS**: Usually within 1-2 hours
4. **SSL certificate issued**: Can take a few hours after DNS is correct
5. **HTTPS available**: Total 2-6 hours typically

## 🔍 How to Check Progress

### Check DNS Propagation
- https://www.whatsmydns.net/#CNAME/www.vltrngames.com
- Should show CNAME pointing to `VltrnOne.github.io` globally

### Check GitHub Pages Status
- Go to: https://github.com/VltrnOne/robot-lyric/settings/pages
- Look for warnings - they should disappear once DNS is correct
- The "Enforce HTTPS" checkbox will become enabled

### Check SSL Certificate
- Visit: https://www.ssllabs.com/ssltest/analyze.html?d=vltrngames.com
- Once certificate is issued, you'll see a valid SSL certificate

## 📋 Current Status Checklist

- ✅ Root domain (`vltrngames.com`) → A records pointing to GitHub Pages IPs
- ❌ www subdomain (`www.vltrngames.com`) → Currently A record, needs to be CNAME
- ⏳ DNS propagation → Waiting
- ⏳ SSL certificate → Waiting for DNS to be correct

## 🎯 After HTTPS is Enabled

Once HTTPS is enabled, your game will be accessible at:
- **Main Game**: https://vltrngames.com/ ✅
- **www version**: https://www.vltrngames.com/ ✅
- **Game Portal**: https://vltrngames.com/portal.html ✅

Both HTTP and HTTPS will work, but HTTPS will be enforced.

---

**The key is fixing the www subdomain DNS configuration!** Once that's done and DNS propagates, HTTPS will become available. 🚀

