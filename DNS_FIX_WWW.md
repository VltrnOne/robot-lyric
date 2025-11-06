# 🔧 Fix www.vltrngames.com DNS Configuration

## ❌ Current Issue

GitHub Pages is showing a warning:
- **`www.vltrngames.com` is improperly configured**
- It's currently set as an **A record** but should be a **CNAME record**

## ✅ Solution: Fix www Subdomain

### Step 1: Check for Existing www A Record

1. Go to SiteGround DNS Zone Editor: https://tools.siteground.com
2. Look in the "Manage DNS Records" table
3. **Check if there's an A record for `www.vltrngames.com`**
   - If you see a record with:
     - **Type**: `A`
     - **Name**: `www.vltrngames.com.` or `www`
     - **Value**: Any IP address
   - **DELETE this A record first** (click the trash can icon)

### Step 2: Create CNAME for www

1. In SiteGround DNS Zone Editor, click **"Create New Record"**
2. Select the **"CNAME"** tab
3. Fill in the form:
   - **Name**: `www` (just `www`, not `www.vltrngames.com`)
   - **Resolves to**: `vltrnone.github.io` (lowercase - DNS is case-insensitive, but use lowercase to match existing)
   - **TTL**: `24 hours` (or your preference)
4. Click **"CREATE"**

### Step 3: Verify in GitHub

1. Go to: https://github.com/VltrnOne/robot-lyric/settings/pages
2. Click **"Check again"** button next to the warning
3. Wait a few minutes for DNS to propagate
4. The warning should disappear once DNS propagates

### Step 4: Enable HTTPS

Once the www CNAME is properly configured:
1. The **"Enforce HTTPS"** checkbox should become available
2. Check the box ✅
3. Click **"Save"**
4. Wait for SSL certificate to be issued (can take a few hours)

## 📋 Current DNS Status

✅ **Correct:**
- `vltrngames.com` → A records pointing to GitHub Pages IPs (185.199.108.153, etc.)

❌ **Needs Fix:**
- `www.vltrngames.com` → Should be CNAME pointing to `VltrnOne.github.io`

## ⏱️ Timeline

- DNS propagation: Usually 1-2 hours, can take up to 24 hours
- HTTPS certificate: Can take a few hours after DNS is correct

## 🎮 After Fix

Once fixed, your game will be accessible at:
- **Main Game**: https://vltrngames.com/ ✅ (already working)
- **www version**: https://www.vltrngames.com/ ✅ (will work after fix)
- **HTTPS**: Both will work with HTTPS once certificate is issued

## 🔍 Verify DNS

After making changes, verify:
```bash
# Check www subdomain
dig www.vltrngames.com
# Should show CNAME pointing to VltrnOne.github.io

# Check root domain
dig vltrngames.com
# Should show A records with GitHub Pages IPs
```

Or use online tools:
- https://www.whatsmydns.net/#CNAME/www.vltrngames.com
- https://www.whatsmydns.net/#A/vltrngames.com

---

**Once you delete the www A record and create the CNAME, the warning will disappear!** 🚀

