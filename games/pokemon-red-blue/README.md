# Pokemon Red & Blue - Web Edition

A web-based version of Pokemon Red and Blue integrated into the VLTRN Games portal.

## Files

- `index.html` - Main game interface
- `styles.css` - Styling and responsive design
- `emulator.js` - Emulator integration and controls
- `pokered/` - Pokemon Red/Blue disassembly and ROM files
  - `pokered.gbc` - Compiled Pokemon Red ROM
  - `pokeblue.gbc` - Compiled Pokemon Blue ROM

## Features

- 🎮 Play Pokemon Red and Blue in your browser
- 📱 Mobile-responsive design with touch controls
- ⌨️ Keyboard controls for desktop
- 🔄 Easy game switching between Red and Blue
- 🎨 Modern, clean UI

## Controls

### Keyboard (Desktop)
- **Arrow Keys**: D-Pad (Up, Down, Left, Right)
- **Z**: A button
- **X**: B button
- **Enter**: Start
- **Shift**: Select

### Touch (Mobile)
- Use the on-screen D-Pad and action buttons
- Buttons are optimized for touch input

## Integration

This game is integrated into the main portal at `portal.html`. It appears as a game card in the games grid and can be opened in the portal's game container.

## Notes

- ROM files are included in the `pokered/` directory
- The emulator placeholder needs to be replaced with an actual Game Boy emulator library for full functionality
- Save states and other advanced features can be added once the emulator is integrated

## Credits

- Pokemon Red/Blue disassembly: [pret/pokered](https://github.com/pret/pokered)
- Integration: VLTRN Games
