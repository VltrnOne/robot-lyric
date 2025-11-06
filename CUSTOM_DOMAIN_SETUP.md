# 🌐 Custom Domain Setup: vltrngames.com

Your game will be accessible from **vltrngames.com** once DNS is configured.

## ✅ What's Done

- ✅ CNAME file created with `vltrngames.com`
- ✅ GitHub Pages configuration ready
- ✅ All code pushed to GitHub

## 📋 Next Steps: Configure DNS

### Option 1: Root Domain (vltrngames.com)

If you want the game at the root domain `vltrngames.com`:

1. **Go to your DNS provider** (where you manage vltrngames.com)
2. **Add/Update DNS records:**
   - **Type**: `A` records
   - **Name**: `@` (or root domain)
   - **Value**: GitHub Pages IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **TTL**: 3600 (or default)

3. **Also add CNAME record:**
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `VltrnOne.github.io`
   - **TTL**: 3600

### Option 2: Subdomain (robot-lyric.vltrngames.com)

If you want the game at a subdomain:

1. **Go to your DNS provider**
2. **Add CNAME record:**
   - **Type**: `CNAME`
   - **Name**: `robot-lyric` (or your preferred subdomain)
   - **Value**: `VltrnOne.github.io`
   - **TTL**: 3600

3. **Update CNAME file** to match:
   ```
   robot-lyric.vltrngames.com
   ```

## 🔧 Configure GitHub Pages

1. **Go to**: https://github.com/VltrnOne/robot-lyric/settings/pages

2. **Under "Custom domain"**:
   - Enter: `vltrngames.com` (or your subdomain)
   - Check: ✅ **Enforce HTTPS** (recommended)
   - Click **Save**

3. **Wait for DNS propagation** (can take up to 24 hours, usually 1-2 hours)

## 🎮 Your Game URLs

Once DNS is configured:

- **Main Game**: https://vltrngames.com/
- **Game Portal**: https://vltrngames.com/portal.html

Or if using subdomain:
- **Main Game**: https://robot-lyric.vltrngames.com/
- **Game Portal**: https://robot-lyric.vltrngames.com/portal.html

## ✅ Verify DNS Configuration

After setting up DNS, verify it's working:

```bash
# Check if DNS is resolving
dig vltrngames.com
# or
nslookup vltrngames.com
```

You should see the GitHub Pages IP addresses.

## 🔄 Auto-Updates Still Work

Even with a custom domain, auto-deployment still works:
- Push to GitHub → Auto-deploys → Live on vltrngames.com in 1-2 minutes

## 📝 Troubleshooting

### Domain Not Working?
1. Check DNS propagation: https://www.whatsmydns.net/
2. Verify CNAME file exists in repository root
3. Check GitHub Pages settings show your custom domain
4. Wait up to 24 hours for DNS to fully propagate

### HTTPS Not Working?
1. Enable "Enforce HTTPS" in GitHub Pages settings
2. Wait for SSL certificate to be issued (can take a few hours)
3. Clear browser cache

### Still Using GitHub.io URL?
- DNS might not be fully propagated yet
- Check that CNAME file is in the repository root
- Verify GitHub Pages custom domain is set correctly

---

**Your game will be live at vltrngames.com once DNS is configured!** 🚀

