# ROBOT LYRIC by Lyric and Aria - Live Web Game 🤖

A Flappy Bird-style game featuring a flying robot with progressive difficulty, built with HTML5 Canvas and JavaScript, converted from the original Unity project.

## 🎮 How to Play

1. **Enter Your Name**: First time players must enter their name
2. **Choose Settings**: Click ⚙️ Settings to customize background and view leaderboard
3. **Start Flying**: Click "Start Game" or press SPACE to begin
4. **Avoid Obstacles**: Click or press SPACE to make the robot fly
5. **Collect Power-ups**: 
   - 🪙 **Coins**: Give you 3 seconds of invincibility (1 per coin, spendable)
   - 🚀 **Rockets**: Slow down gameplay + full directional control for 3 seconds
6. **Rocket Controls**: When rocket is active, use WASD or Arrow Keys (game slows down!)
7. **Level Up**: Score points to advance levels and increase difficulty
8. **Compete**: Your scores are saved to the leaderboard!

## 🚀 Running the Game Live

The game is now live and running! Here's how to access it:

### Option 1: Local Server (Currently Running)
```bash
# The game is already running on:
http://localhost:3000
```

### Option 2: Start Your Own Server
```bash
# Navigate to the project directory
cd /Users/Morpheous/InTheAir-master

# Start a local server (choose one):
python3 -m http.server 8000
# OR
npx http-server -p 3000
# OR
node -e "require('http').createServer((req,res)=>res.end(require('fs').readFileSync('index.html'))).listen(3000)"
```

### Option 3: Open Directly
Simply open `index.html` in any modern web browser.

## 🎯 Game Features

- **🤖 Robot Character**: Detailed robot design with animated glowing eyes and antenna
- **📈 Progressive Difficulty**: Game speed increases with each level (every 5 points)
- **🎯 Level System**: Visual level progression with celebratory level-up effects
- **🪙 Coin System**: Collect floating coins for 3 seconds of invincibility (1 per coin, spendable)
- **🚀 Rocket Power-ups**: Slow down gameplay + gain full directional control for 3 seconds
- **✨ Invincibility**: Coins provide 3 seconds of complete collision immunity
- **🎨 Multiple Backgrounds**: Choose from 4 beautiful themes (Day, Sunset, Aurora, Night)
- **👤 Player Names**: Customize your player name that persists across sessions
- **🏆 Leaderboard**: Local high score tracking with top 10 players
- **⚙️ Settings Menu**: Easy access to customize your experience
- **Smooth Physics**: Realistic gravity and jump mechanics optimized for robot flight
- **Random Obstacles**: Procedurally generated obstacles at random heights
- **Score System**: Points awarded for each obstacle passed
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful Graphics**: Dynamic backgrounds, animated clouds, and smooth animations
- **Game Over Screen**: Clean restart interface showing final score and level

## 🛠 Technical Details

- **Pure HTML5/JavaScript**: No external dependencies
- **Canvas-based Rendering**: Smooth 60fps gameplay
- **Object-Oriented Design**: Clean, maintainable code structure
- **Responsive Controls**: Mouse and keyboard support
- **Cross-Platform**: Works on any modern browser

## 🎨 Game Mechanics

- **Robot Physics**: Gravity pulls the robot down, click/space to jump
- **Progressive Speed**: Starting speed is slower, increases by 0.8 units per level
- **Obstacle Generation**: New obstacles spawn every 2.5 seconds initially, faster at higher levels
- **Level Progression**: Advance to next level every 5 points with visual celebration
- **Collision Detection**: Precise collision detection for game over conditions
- **Scoring**: +1 point for each obstacle successfully passed
- **Visual Feedback**: Robot rotates based on velocity, animated glowing eyes, smooth animations

## 🌐 Deployment

The game is ready for deployment to any web hosting service:

1. **GitHub Pages**: Upload to a GitHub repository and enable Pages
2. **Netlify**: Drag and drop the folder to Netlify
3. **Vercel**: Connect your GitHub repository
4. **Any Web Host**: Upload the `index.html` file to any web server

## 📱 Mobile Support

The game works great on mobile devices:
- Touch to fly
- Responsive design adapts to different screen sizes
- Smooth performance on modern mobile browsers

## 🎵 Audio (Future Enhancement)

The original Unity game had audio features. To add audio to this web version:
1. Add audio files to the project
2. Use the Web Audio API to play sounds
3. Add sound effects for jumping, scoring, and game over

---

**Enjoy playing ROBOT LYRIC!** 🤖✨

*Created by Lyric and Aria*

The game is now live and ready to play at `http://localhost:3003`

## 🆕 What's New in This Version:

- **🤖 Robot Character**: Replaced the plane with a detailed robot featuring:
  - Animated glowing blue eyes
  - Metallic body with chest panel
  - Antenna with glowing tip
  - Robot arms and legs
  - Smooth rotation and movement

- **📈 Progressive Difficulty System**:
  - **Level 1**: Slower starting speed (2.0 units/sec)
  - **Level 2+**: Speed increases by 0.8 units per level
  - **Obstacle Generation**: Starts at 2.5 seconds, gets faster with each level
  - **Visual Level-Up**: Golden "LEVEL X!" celebration effect

- **🎨 Background Themes**:
  - **Day Theme**: Classic blue sky with green landscape
  - **Sunset Theme**: Warm orange and pink gradient
  - **Aurora Theme**: Colorful northern lights effect
  - **Night Theme**: Dark space-like atmosphere
  - **Dynamic UI**: Text colors adapt to background theme

- **👤 Player Personalization**:
  - **Custom Names**: Set your player name (persists across sessions)
  - **Name Display**: Shows your name at the top of the screen
  - **Settings Menu**: Easy access via ⚙️ button or ESC key

- **🏆 Leaderboard System**:
  - **Local High Scores**: Tracks top 10 players
  - **Score Persistence**: Scores saved in browser storage
  - **Current Player Highlight**: Your entries are highlighted
  - **Rank Display**: Shows rank, name, score, and level

- **🎯 Enhanced Gameplay**:
  - Level display in top-left corner
  - Player name display at top center
  - Settings button in top-right corner
  - Power-up status display (shields and rocket timer)
  - Game over screen shows both score and final level
  - Smoother physics optimized for robot movement
  - More challenging progression system

- **🪙 Coin & Invincibility System**:
  - **Floating Coins**: Randomly placed and moving around the map
  - **3-Second Invincibility**: Each coin gives 3 seconds of complete collision immunity
  - **Spendable Protection**: Shield count decreases when used (like a currency)
  - **Visual Effects**: "🛡️ SHIELD!" and "✨ INVINCIBLE!" notifications
  - **Stackable**: Collect multiple coins to build up shield count
  - **UI Display**: Shield count and invincibility timer shown in top-right corner
  - **Pass Through**: Robot can pass through all obstacles during invincibility
  - **Purple Aura**: Visual invincibility effect around the robot

- **🚀 Rocket Power-up System**:
  - **Rocket Collection**: Collect floating rockets for special abilities
  - **Slow Motion**: Game speed reduces to 30% during rocket mode
  - **Full Control**: WASD or Arrow keys for complete directional control
  - **3-Second Duration**: Rocket power lasts for exactly 3 seconds
  - **Visual Effects**: "🚀 ROCKET POWER!" and "⏰ SLOW MOTION!" notifications
  - **Timer Display**: Countdown timer shows remaining rocket time
  - **Enhanced Movement**: Fly up, down, left, right with precise control
  - **Strategic Use**: Perfect for navigating through tight spaces
