# 🔒 HTTPS Troubleshooting Guide

## ❌ Still Can't Enable HTTPS?

If the "Enforce HTTPS" checkbox is still greyed out, let's troubleshoot step by step.

## ✅ Step 1: Verify DNS Configuration

### Check Root Domain (vltrngames.com)
```bash
dig vltrngames.com
# or use online tool: https://www.whatsmydns.net/#A/vltrngames.com
```

**Should show 4 A records:**
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Check www Subdomain
```bash
dig www.vltrngames.com
# or use online tool: https://www.whatsmydns.net/#CNAME/www.vltrngames.com
```

**Should show CNAME:**
- `www.vltrngames.com` → `vltrnone.github.io`

## ✅ Step 2: Check GitHub Pages Settings

1. Go to: https://github.com/VltrnOne/robot-lyric/settings/pages
2. Look for any warnings or errors
3. Check if it says "DNS check successful" for both root and www
4. Click "Check again" button if available

## ✅ Step 3: Verify CNAME File

Make sure the CNAME file in your repository contains:
```
vltrngames.com
```

Check: https://github.com/VltrnOne/robot-lyric/blob/main/CNAME

## ✅ Step 4: Common Issues & Solutions

### Issue 1: DNS Not Fully Propagated
**Symptom:** DNS shows correct records in some locations but not others

**Solution:**
- Wait 1-2 hours (can take up to 24 hours)
- Check propagation: https://www.whatsmydns.net/
- Both root domain AND www subdomain must propagate globally

### Issue 2: www CNAME Not Created
**Symptom:** www.vltrngames.com shows A record instead of CNAME

**Solution:**
1. Go to SiteGround DNS Zone Editor
2. Delete any A record for `www.vltrngames.com`
3. Create CNAME record:
   - Name: `www`
   - Resolves to: `vltrnone.github.io`

### Issue 3: GitHub Hasn't Detected Correct DNS
**Symptom:** DNS is correct but GitHub still shows warning

**Solution:**
1. Go to GitHub Pages settings
2. Click "Check again" button
3. Wait 10-15 minutes
4. Refresh the page

### Issue 4: SSL Certificate Not Issued Yet
**Symptom:** DNS is correct, no warnings, but HTTPS still disabled

**Solution:**
- This is normal! SSL certificates can take 2-24 hours to be issued
- GitHub automatically issues certificates once DNS is correct
- Just wait - the checkbox will become enabled automatically

## ✅ Step 5: Manual Verification

### Test Both Domains
1. Visit: http://vltrngames.com/ (should work)
2. Visit: http://www.vltrngames.com/ (should redirect or work)
3. Both should show your game

### Check SSL Certificate Status
Visit: https://www.ssllabs.com/ssltest/analyze.html?d=vltrngames.com

**If certificate exists:**
- You'll see a valid SSL certificate
- HTTPS should be available soon

**If no certificate:**
- DNS might not be fully propagated
- Wait a few more hours

## ⏱️ Timeline Expectations

1. **DNS Propagation**: 1-2 hours (can take up to 24 hours)
2. **GitHub Detection**: Usually within 1-2 hours after DNS is correct
3. **SSL Certificate Issuance**: 2-24 hours after GitHub detects correct DNS
4. **HTTPS Available**: Total 3-26 hours typically

## 🔍 Quick Checklist

- [ ] Root domain has 4 A records pointing to GitHub Pages IPs
- [ ] www subdomain has CNAME pointing to vltrnone.github.io
- [ ] CNAME file exists in repository with `vltrngames.com`
- [ ] DNS has propagated globally (check whatsmydns.net)
- [ ] GitHub Pages shows "DNS check successful"
- [ ] No warnings in GitHub Pages settings
- [ ] Waited at least 2-3 hours after DNS changes

## 🆘 Still Not Working?

If you've checked everything and it's been more than 24 hours:

1. **Double-check DNS:**
   - Verify both root and www are correct
   - Use multiple DNS checkers: https://www.whatsmydns.net/

2. **Check GitHub Pages:**
   - Remove custom domain
   - Wait 5 minutes
   - Re-add custom domain
   - Click "Check again"

3. **Verify CNAME file:**
   - Make sure it's in the root of the repository
   - Contains exactly: `vltrngames.com`
   - No extra spaces or characters

4. **Contact GitHub Support:**
   - If DNS is correct and it's been 24+ hours
   - GitHub Pages support: https://support.github.com/

---

**Most common issue: Just need to wait for DNS propagation and SSL certificate issuance!** ⏰

