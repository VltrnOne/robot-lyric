// Game Boy Emulator Integration using EmulatorJS
let currentROM = null;
let emulatorLoaded = false;

// Key mapping for Game Boy controls
const keyMap = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    'KeyZ': 'A',
    'KeyX': 'B',
    'Enter': 'START',
    'ShiftLeft': 'SELECT',
    'ShiftRight': 'SELECT'
};

// Initialize emulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only show error for file:// protocol
    if (window.location.protocol === 'file:') {
        showFileProtocolError();
        return;
    }
    
    // Production ready - works on live website
    setupGameButtons();
    setupTouchControls();
    setupKeyboardControls();
    detectMobile();
    loadEmulatorJS();
});

function showFileProtocolError() {
    const emulatorDiv = document.getElementById('emulator');
    const loading = emulatorDiv.querySelector('.loading');
    
    if (loading) {
        loading.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="margin-bottom: 20px; color: #ff6b6b;">⚠️ Web Server Required</h2>
                <p style="margin-bottom: 15px; line-height: 1.6;">
                    This game cannot run when opened directly from the file system due to browser security restrictions.
                </p>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    <strong>Please use a web server to run this game.</strong>
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                    <h3 style="margin-bottom: 15px; font-size: 1.1em;">Quick Start Options:</h3>
                    <div style="margin-bottom: 10px;">
                        <strong>Option 1 - Python (Recommended):</strong><br>
                        <code style="background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 5px; display: inline-block; margin-top: 5px;">
                            cd /Users/Morpheous/InTheAir-master && python3 -m http.server 8000
                        </code><br>
                        Then open: <code style="background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 3px;">http://localhost:8000/portal.html</code>
                    </div>
                    <div style="margin-top: 15px;">
                        <strong>Option 2 - Node.js:</strong><br>
                        <code style="background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 5px; display: inline-block; margin-top: 5px;">
                            npx http-server -p 8000
                        </code>
                    </div>
                </div>
                <button onclick="location.reload()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; margin-top: 10px;">
                    Reload After Starting Server
                </button>
            </div>
        `;
        loading.style.display = 'block';
    }
}

function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.getElementById('touchControls').classList.add('active');
    }
}

function loadEmulatorJS() {
    const container = document.getElementById('emulatorjs-container');
    const loading = document.querySelector('.loading');
    
    // Make sure container is visible and ready
    if (container) {
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px';
    }
    
    // Show loading message
    if (loading) {
        loading.textContent = 'Loading EmulatorJS...';
    }
    
    // Use relative path for ROM file - works better in production
    // The path is relative to the game's index.html location
    const romUrl = 'pokered/pokered.gbc';
    
    console.log('Loading ROM from:', romUrl);
    console.log('Current location:', window.location.href);
    
    // Configure EmulatorJS - set ALL variables BEFORE loading script
    window.EJS_player = '#emulatorjs-container';
    window.EJS_core = 'gb';
    window.EJS_gameUrl = romUrl; // Use relative path
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_color = '#667eea';
    window.EJS_startOnLoaded = true;
    window.EJS_fullscreenOnLoaded = false;
    window.EJS_gameName = 'Pokemon Red';
    window.EJS_gameType = 'gb';
    
    // Load EmulatorJS script from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.crossOrigin = 'anonymous';
    script.async = false; // Load synchronously to ensure config is read
    
    script.onload = () => {
        emulatorLoaded = true;
        console.log('EmulatorJS script loaded');
        
        // Wait for EmulatorJS to initialize
        let checkCount = 0;
        const maxChecks = 30;
        
        const checkInitialization = setInterval(() => {
            checkCount++;
            
            // Check if container has content (iframe or canvas)
            if (container && (container.children.length > 0 || 
                container.querySelector('iframe') || 
                container.querySelector('canvas') ||
                container.innerHTML.trim() !== '')) {
                console.log('EmulatorJS initialized successfully!');
                clearInterval(checkInitialization);
                if (loading) {
                    loading.style.display = 'none';
                }
            } else if (checkCount >= maxChecks) {
                console.error('EmulatorJS failed to initialize after waiting');
                clearInterval(checkInitialization);
                showError('EmulatorJS loaded but failed to initialize. Please check the browser console for details. The ROM file may not be accessible.');
            }
        }, 500);
    };
    
    script.onerror = () => {
        console.error('Failed to load EmulatorJS from CDN');
        showError('Failed to load emulator library. Please check your internet connection and try again.');
    };
    
    document.head.appendChild(script);
}

function setupGameButtons() {
    document.getElementById('loadRed').addEventListener('click', () => {
        document.getElementById('loadRed').classList.add('active');
        document.getElementById('loadBlue').classList.remove('active');
        loadGame('pokered.gbc');
    });
    
    document.getElementById('loadBlue').addEventListener('click', () => {
        document.getElementById('loadBlue').classList.add('active');
        document.getElementById('loadRed').classList.remove('active');
        loadGame('pokeblue.gbc');
    });
}

function loadGame(romFile) {
    if (!emulatorLoaded) {
        // Wait for emulator to load
        setTimeout(() => loadGame(romFile), 100);
        return;
    }
    
    currentROM = romFile;
    const container = document.getElementById('emulatorjs-container');
    const loading = document.querySelector('.loading');
    
    // Update loading message
    if (loading) {
        loading.textContent = `Loading ${romFile}...`;
        loading.style.display = 'block';
    }
    
    // Get absolute URL for ROM file
    const baseUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');
    const romUrl = `${baseUrl}/pokered/${romFile}`;
    
    console.log('Loading ROM from:', romUrl);
    
    // Clear container
    if (container) {
        container.innerHTML = '';
    }
    
    // Update EmulatorJS configuration
    window.EJS_gameUrl = romUrl; // Use absolute URL
    window.EJS_gameName = romFile.replace('.gbc', '').replace('.gb', '');
    
    // Remove old script
    const oldScripts = document.querySelectorAll('script[src*="loader.js"]');
    oldScripts.forEach(script => script.remove());
    
    // Reload EmulatorJS with new ROM
    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.crossOrigin = 'anonymous';
    script.async = false;
    
    script.onload = () => {
        console.log('Game loaded:', romFile);
        
        // Wait for initialization
        let checkCount = 0;
        const maxChecks = 30;
        
        const checkInitialization = setInterval(() => {
            checkCount++;
            
            if (container && (container.children.length > 0 || 
                container.querySelector('iframe') || 
                container.querySelector('canvas'))) {
                console.log('Game initialized successfully!');
                clearInterval(checkInitialization);
                if (loading) {
                    loading.style.display = 'none';
                }
            } else if (checkCount >= maxChecks) {
                console.error('Game failed to initialize');
                clearInterval(checkInitialization);
                showError('Failed to load game. Please check the browser console for details.');
            }
        }, 500);
    };
    
    script.onerror = () => {
        showError('Failed to load game. Please try again.');
    };
    
    document.head.appendChild(script);
}

function showError(message) {
    const emulatorDiv = document.getElementById('emulator');
    const loading = emulatorDiv.querySelector('.loading');
    const container = document.getElementById('emulatorjs-container');
    
    if (loading) {
        loading.innerHTML = `
            <div style="color: red; text-align: center; padding: 20px;">
                <h3 style="margin-bottom: 10px;">Error</h3>
                <p>${message}</p>
                <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                    Check browser console (F12) for more details
                </p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    Reload Page
                </button>
            </div>
        `;
        loading.style.display = 'block';
    }
    if (container) {
        container.style.display = 'none';
    }
}

function setupTouchControls() {
    const touchButtons = document.querySelectorAll('.dpad-btn, .action-btn');
    
    touchButtons.forEach(button => {
        const handlePress = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = button.getAttribute('data-key');
            if (key && keyMap[key]) {
                pressKey(keyMap[key]);
            }
            button.style.transform = 'scale(0.9)';
            button.style.opacity = '0.8';
        };
        
        const handleRelease = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const key = button.getAttribute('data-key');
            if (key && keyMap[key]) {
                releaseKey(keyMap[key]);
            }
            button.style.transform = '';
            button.style.opacity = '';
        };
        
        button.addEventListener('touchstart', handlePress, { passive: false });
        button.addEventListener('touchend', handleRelease, { passive: false });
        button.addEventListener('touchcancel', handleRelease, { passive: false });
        
        // Also support mouse clicks for desktop testing
        button.addEventListener('mousedown', handlePress);
        button.addEventListener('mouseup', handleRelease);
        button.addEventListener('mouseleave', handleRelease);
    });
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // Don't prevent default if typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (keyMap[e.code]) {
            e.preventDefault();
            pressKey(keyMap[e.code]);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (keyMap[e.code]) {
            e.preventDefault();
            releaseKey(keyMap[e.code]);
        }
    });
}

function pressKey(keyName) {
    // Send key press to EmulatorJS
    if (window.EJS_controls && typeof window.EJS_controls.setKey === 'function') {
        try {
            window.EJS_controls.setKey(keyName, true);
        } catch (e) {
            console.log('Error setting key:', e);
        }
    }
}

function releaseKey(keyName) {
    // Send key release to EmulatorJS
    if (window.EJS_controls && typeof window.EJS_controls.setKey === 'function') {
        try {
            window.EJS_controls.setKey(keyName, false);
        } catch (e) {
            console.log('Error releasing key:', e);
        }
    }
}

// Prevent context menu on long press for mobile
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.dpad-btn, .action-btn')) {
        e.preventDefault();
    }
});

// Handle visibility change to pause/resume emulation
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause emulation
        if (typeof window.EJS_pause === 'function') {
            try {
                window.EJS_pause();
            } catch (e) {
                console.log('Error pausing:', e);
            }
        }
    } else {
        // Resume emulation
        if (typeof window.EJS_resume === 'function') {
            try {
                window.EJS_resume();
            } catch (e) {
                console.log('Error resuming:', e);
            }
        }
    }
});

// Listen for messages from parent window (portal)
window.addEventListener('message', (event) => {
    // Handle messages from portal iframe
    if (event.data && event.data.type === 'request-fullscreen') {
        // Request fullscreen if needed
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }
});

// Notify parent window when game is ready
if (window.parent !== window) {
    setTimeout(() => {
        window.parent.postMessage({
            type: 'game-ready',
            game: 'pokemon-red-blue'
        }, '*');
    }, 2000);
}
