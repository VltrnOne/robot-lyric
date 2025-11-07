# Pokemon Red & Blue - Deployment Guide

## ✅ Production Ready

The Pokemon Red & Blue game is configured to work on your live website (vltrngames.com) and is accessible from any device.

## 🌐 How It Works

### EmulatorJS Integration
- Uses **EmulatorJS CDN** (`https://cdn.emulatorjs.org/stable/data/`)
- No local emulator files needed - loads from CDN
- Works on desktop, mobile, and tablets
- Supports both Pokemon Red and Blue ROMs

### ROM Files
- ROM files are stored in `pokered/` directory
- Files: `pokered.gbc` and `pokeblue.gbc`
- Served via relative paths (works in production)
- Accessible from any device once deployed

## 🚀 Deployment Checklist

### Before Deploying
- [x] ROM files exist in `games/pokemon-red-blue/pokered/`
- [x] EmulatorJS loads from CDN (no local files needed)
- [x] Relative paths configured for production
- [x] Mobile controls enabled
- [x] Error handling for file:// protocol

### After Deploying
1. **Test on Desktop:**
   - Visit: `https://vltrngames.com/portal.html`
   - Click "Pokemon Red & Blue" game card
   - Verify game loads and is playable
   - Test keyboard controls

2. **Test on Mobile:**
   - Visit: `https://vltrngames.com/portal.html` on mobile device
   - Click "Pokemon Red & Blue" game card
   - Verify touch controls work
   - Test game switching (Red/Blue)

3. **Verify ROM Loading:**
   - Check browser console for errors
   - Ensure ROM files load successfully
   - Test switching between Red and Blue

## 📱 Mobile Compatibility

- ✅ Touch controls enabled automatically
- ✅ Responsive design for all screen sizes
- ✅ On-screen D-Pad and buttons
- ✅ Works on iOS, Android, and tablets

## 🔧 Troubleshooting

### Game Not Loading?
1. Check browser console for errors
2. Verify ROM files exist: `games/pokemon-red-blue/pokered/*.gbc`
3. Check EmulatorJS CDN is accessible
4. Ensure you're accessing via HTTPS (not file://)

### ROM Files Not Found?
- Verify files are in: `games/pokemon-red-blue/pokered/`
- Check file names: `pokered.gbc` and `pokeblue.gbc`
- Ensure files are committed to Git

### EmulatorJS Not Loading?
- Check internet connection (loads from CDN)
- Verify CDN is accessible: `https://cdn.emulatorjs.org/stable/data/`
- Check browser console for CORS errors

## 🌍 Access from Any Device

Once deployed to GitHub Pages:
- **Desktop**: `https://vltrngames.com/portal.html`
- **Mobile**: `https://vltrngames.com/portal.html`
- **Tablet**: `https://vltrngames.com/portal.html`

The game works on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablets (iPad, Android tablets)
- ✅ Any device with a modern web browser

## 📝 Notes

- EmulatorJS loads from CDN (no local hosting needed)
- ROM files are served from your repository
- All paths are relative (works in production)
- No build process required - just push to GitHub

## 🎮 Features

- Full Game Boy emulation
- Switch between Red and Blue versions
- Keyboard controls (desktop)
- Touch controls (mobile)
- Responsive design
- Works on any device

---

**Ready for Production!** 🚀

