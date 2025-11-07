# Quick Start Guide

## Running the Game Portal

The games in this portal require a web server to run properly due to browser security restrictions (CORS). You cannot open the HTML files directly from the file system.

### Option 1: Using the Start Script (Easiest)

```bash
cd /Users/Morpheous/InTheAir-master
./start-server.sh
```

Then open your browser and go to: **http://localhost:8000/portal.html**

### Option 2: Using Python

```bash
cd /Users/Morpheous/InTheAir-master
python3 -m http.server 8000
```

Then open: **http://localhost:8000/portal.html**

### Option 3: Using Node.js

```bash
cd /Users/Morpheous/InTheAir-master
npx http-server -p 8000
```

Then open: **http://localhost:8000/portal.html**

## Why a Web Server is Required

- Browser security (CORS) prevents loading files via `file://` protocol
- EmulatorJS and ROM files need to be served via HTTP/HTTPS
- This is a standard requirement for web-based emulators

## Troubleshooting

### "Failed to initialize emulator"
- Make sure you're accessing via `http://localhost:8000/portal.html` (not `file://`)
- Check that the server is running
- Check browser console for detailed error messages

### "Failed to load ROM"
- Verify ROM files exist in `games/pokemon-red-blue/pokered/`
- Check that files are named correctly: `pokered.gbc` and `pokeblue.gbc`
- Ensure the server has read permissions

### Port Already in Use
If port 8000 is already in use, use a different port:
```bash
python3 -m http.server 8080
```
Then access: `http://localhost:8080/portal.html`

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

