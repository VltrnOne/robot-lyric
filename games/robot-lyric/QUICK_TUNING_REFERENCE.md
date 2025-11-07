# ROBOT LYRIC - QUICK TUNING REFERENCE CARD

## 🎮 CORE PHYSICS VALUES (Lines ~1048-1051)

```javascript
this.gravity = 0.65;              // ⬆️ Higher = faster fall | ⬇️ Lower = floatier
this.jumpForce = -10.5;           // ⬆️ Higher abs = higher jump
this.terminalVelocity = 12;       // ⬆️ Higher = faster max fall
this.baseObstacleSpeed = 3.5;     // ⬆️ Higher = harder start
```

**Sweet Spot Ranges:**
- Gravity: 0.5 - 0.8
- Jump Force: -9 to -12
- Terminal Velocity: 10 - 15
- Base Speed: 2.5 - 4.5

---

## 📊 DIFFICULTY SCALING (Lines ~1055-1062, ~2266-2272)

```javascript
// Gap Sizing
this.baseObstacleGap = 220;       // Starting gap (desktop)
this.minObstacleGap = 160;        // Minimum gap (desktop)

// In checkLevelUp() function:
this.obstacleSpeed = this.baseObstacleSpeed + (this.level - 1) * 1.2;
this.obstacleInterval = Math.max(1200, 2500 - (this.level - 1) * 250);
const gapReduction = Math.min((this.level - 1) * 5, ...);
```

**Quick Adjustments:**
- Speed scaling multiplier: **1.2** (higher = harder progression)
- Spawn interval reduction: **250ms** per level (higher = faster)
- Gap reduction: **5px** per level (higher = harder)

---

## ⚡ POWER-UP FREQUENCIES (Lines ~1117-1120)

```javascript
this.coinInterval = 5000;          // Every 5 seconds
this.rocketInterval = 12000;       // Every 12 seconds
this.rocketBoostInterval = 18000;  // Every 18 seconds
// Oil cans: 15000 (line ~1042)
// Super coins: 30000 (line ~1026)
```

---

## 🎨 GAME JUICE INTENSITIES (Lines ~2052, ~2769, ~2282)

```javascript
// In jump() function:
this.screenShake.intensity = 3;    // Jump shake

// In useShield() function:
this.screenShake.intensity = 6;    // Collision shake

// In checkLevelUp() function:
this.screenShake.intensity = 8;    // Level up shake
```

**Particle Count Per Jump:** 5 (line ~2055)

---

## 🎯 PRESET CONFIGURATIONS

### EASY MODE
```javascript
this.gravity = 0.55;
this.jumpForce = -10;
this.baseObstacleSpeed = 3.0;
this.baseObstacleGap = 240;
this.minObstacleGap = 180;
// Speed scaling: 1.0
// Interval reduction: 200
```

### NORMAL MODE (Current)
```javascript
this.gravity = 0.65;
this.jumpForce = -10.5;
this.baseObstacleSpeed = 3.5;
this.baseObstacleGap = 220;
this.minObstacleGap = 160;
// Speed scaling: 1.2
// Interval reduction: 250
```

### HARD MODE
```javascript
this.gravity = 0.75;
this.jumpForce = -11;
this.baseObstacleSpeed = 4.0;
this.baseObstacleGap = 200;
this.minObstacleGap = 140;
// Speed scaling: 1.4
// Interval reduction: 300
```

---

## 🔧 COMMON ISSUES & FIXES

### "Game feels too floaty"
- ⬆️ Increase `gravity` by 0.05-0.1
- ⬆️ Increase `terminalVelocity` by 1-2

### "Robot falls too fast"
- ⬇️ Decrease `gravity` by 0.05-0.1
- ⬇️ Decrease `terminalVelocity` by 1-2

### "Jumps feel weak"
- ⬆️ Increase `jumpForce` magnitude (e.g., -10.5 → -11)

### "Jumps feel too powerful"
- ⬇️ Decrease `jumpForce` magnitude (e.g., -10.5 → -10)

### "Too hard at start"
- ⬇️ Decrease `baseObstacleSpeed` by 0.5
- ⬆️ Increase `baseObstacleGap` by 10-20px

### "Too easy at start"
- ⬆️ Increase `baseObstacleSpeed` by 0.5
- ⬇️ Decrease `baseObstacleGap` by 10-20px

### "Difficulty ramps too slow"
- ⬆️ Increase speed scaling multiplier (1.2 → 1.4)
- ⬆️ Increase spawn interval reduction (250 → 300)
- ⬆️ Increase gap reduction per level (5 → 7)

### "Difficulty ramps too fast"
- ⬇️ Decrease speed scaling multiplier (1.2 → 1.0)
- ⬇️ Decrease spawn interval reduction (250 → 200)
- ⬇️ Decrease gap reduction per level (5 → 3)

---

## 📱 MOBILE ADJUSTMENTS

**Gap Sizes (Lines ~1055-1057):**
```javascript
const isMobile = window.innerWidth <= 768 || window.screen.width <= 768;
this.baseObstacleGap = isMobile ? 260 : 220;  // +40px on mobile
this.minObstacleGap = isMobile ? 180 : 160;   // +20px on mobile
```

Mobile gets larger gaps due to less precise touch controls.

---

## 🎪 ACTIVE POWER-UPS

1. **Coins** - Every 5s (main mechanic, grants shield)
2. **Super Coins** - Every 30s (bonus coins)
3. **Rockets** - Every 12s (slow motion + control)
4. **Rocket Boosts** - Every 18s (speed boost)
5. **Oil Cans** - Every 15s (health restoration)

**Disabled:** Magnets, Freeze, Double Points

---

## 💡 TESTING CHECKLIST

- [ ] First 30 seconds feel approachable
- [ ] Level 3-5 starts feeling challenging
- [ ] Level 8-10 requires focus
- [ ] Every jump feels satisfying
- [ ] Screen shake enhances without distracting
- [ ] Can average player reach Level 5?
- [ ] Can skilled player reach Level 10?
- [ ] Difficulty curve feels natural

---

## 📞 QUICK REFERENCE LINE NUMBERS

- **Physics Init:** ~1048-1062
- **Jump Function:** ~2039-2073
- **Physics Update:** ~2148-2171
- **Difficulty Scaling:** ~2264-2282
- **Power-Up Frequency:** ~1117-1120
- **Coin Rarities:** ~1122-1128
- **Draw Function:** ~4743-4800

---

*For detailed explanations, see MECHANICS_OVERHAUL_SUMMARY.md*
