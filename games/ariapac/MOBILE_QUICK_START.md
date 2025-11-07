# AriaPac Mobile - Quick Start Guide

## How to Test Mobile Controls

### Option 1: Desktop Browser (Recommended for Quick Testing)

1. Open **Chrome** or **Edge** browser
2. Navigate to the AriaPac game folder and open `index.html`
3. Press **F12** to open DevTools
4. Press **Ctrl+Shift+M** (Windows) or **Cmd+Shift+M** (Mac) to toggle device toolbar
5. Select a mobile device from the dropdown (e.g., "iPhone 12 Pro")
6. Click **Start Game**
7. Mobile controls will appear at the bottom of the screen
8. Click the touch buttons to test controls

### Option 2: Mobile Device

1. Upload the game folder to a web server
2. Open the URL on your mobile device
3. Tap **Start Game**
4. Mobile controls will automatically appear
5. Tap buttons to control both players

## Mobile Controls Layout

```
┌─────────────────────────────────────────────────┐
│                  Game Screen                    │
│                                                 │
│               [Canvas Area]                     │
│                                                 │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│              Mobile Controls                    │
├──────────┬──────────┬──────────┬───────────────┤
│ P1 Move  │ P1 Power │ P2 Dinos │  P2 Move     │
│  D-Pad   │  Sprint  │  Ability │   D-Pad      │
│          │  Freeze  │  Select  │              │
└──────────┴──────────┴──────────┴──────────────┘
```

## Button Mapping

### Player 1 (Safari Explorer)
- **D-Pad (Left):** Movement (W/A/S/D)
- **Sprint:** Hold to sprint (Shift)
- **F1-F4:** Freeze power-ups (1/2/3/4 keys)

### Player 2 (Dinosaur Controller)
- **D-Pad (Right):** Movement (I/J/K/L)
- **Ability:** Special dinosaur ability (Space)
- **Raptor/Ptero/Trike/T-Rex:** Switch dinosaurs (U/O/P/[ keys)

### System
- **Pause Button (Top-Right):** Pause game (Escape)

## Features

- Automatic mobile detection
- Responsive canvas scaling
- Portrait and landscape support
- Visual button feedback
- Prevents unwanted scrolling/zooming
- Full 2-player support on one device

## Troubleshooting

**Controls don't appear:**
- Make sure you clicked "Start Game"
- Check browser console for errors
- Try refreshing the page

**Buttons don't respond:**
- Make sure game state is "Playing"
- Try tapping buttons more firmly
- Check that JavaScript is enabled

**Canvas is too small:**
- Rotate device to landscape for better view
- Zoom is disabled, so try larger device
- Check that controls aren't covering too much space

**Performance issues:**
- Close background apps
- Use a newer device (2018+)
- Try landscape mode for better performance

## Testing Checklist

- [ ] Game loads on mobile
- [ ] Controls appear when game starts
- [ ] Player 1 D-pad works
- [ ] Player 2 D-pad works
- [ ] Sprint button works
- [ ] Freeze powers activate
- [ ] Dinosaur switching works
- [ ] Ability button works
- [ ] Pause button works
- [ ] Portrait mode displays correctly
- [ ] Landscape mode displays correctly
- [ ] Rotation updates canvas
- [ ] No scrolling occurs
- [ ] No zooming occurs
- [ ] Performance is smooth

## File Locations

- **Game:** `/Users/Morpheous/InTheAir-master/games/ariapac/index.html`
- **Mobile JS:** `/Users/Morpheous/InTheAir-master/games/ariapac/js/mobile.js`
- **Full Report:** `/Users/Morpheous/InTheAir-master/games/ariapac/MOBILE_FIX_REPORT.md`

## Support

If issues persist:
1. Check the browser console (F12) for error messages
2. Review MOBILE_FIX_REPORT.md for detailed information
3. Verify all files are present and properly linked
4. Test on a different device/browser

---

**Ready to Play!**
Open the game on a mobile device or use Chrome DevTools mobile emulation to start playing!
