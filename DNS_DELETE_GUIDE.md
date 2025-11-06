# 🗑️ DNS Records to Delete - Quick Guide

## ❌ DELETE These Records:

### 1. www A Record
- **Type**: `A`
- **Name**: `www.vltrngames.com.`
- **Value**: `35.215.113.148`
- **Action**: Click trash icon to DELETE

### 2. Duplicate Root A Record (if exists)
- **Type**: `A`
- **Name**: `vltrngames.com.`
- **Value**: `35.215.113.148` (NOT the GitHub Pages IPs)
- **Action**: Click trash icon to DELETE

## ✅ KEEP These Records:

### GitHub Pages A Records (REQUIRED)
- **Type**: `A`
- **Name**: `vltrngames.com.`
- **Value**: `185.199.108.153` ✅ KEEP
- **Value**: `185.199.109.153` ✅ KEEP
- **Value**: `185.199.110.153` ✅ KEEP
- **Value**: `185.199.111.153` ✅ KEEP

### Service Records (Keep if you use them)
- `ssh.vltrngames.com.` → `35.215.113.148` ✅ KEEP (if you use SSH)
- `mail.vltrngames.com.` → `35.215.113.148` ✅ KEEP (if you use email)
- `autodiscover.vltrngames.com.` → `35.215.113.148` ✅ KEEP (if you use email)
- `autoconfig.vltrngames.com.` → `35.215.113.148` ✅ KEEP (if you use email)
- `ftp.vltrngames.com.` → `35.215.113.148` ✅ KEEP (if you use FTP)

## ➕ CREATE This Record:

After deleting the www A record:
- **Type**: `CNAME`
- **Name**: `www`
- **Resolves to**: `VltrnOne.github.io`
- **TTL**: `24 hours`

---

**Only delete the www A record and any duplicate root A records pointing to 35.215.113.148!**

