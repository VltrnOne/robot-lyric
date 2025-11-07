// Game Boy Emulator Integration using EmulatorJS
let currentROM = null;
let emulatorLoaded = false;
let gameStarted = false;

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
    // Check if running via file:// protocol (won't work due to CORS)
    // Allow localhost and production domains
    const isLocalDev = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');
    const isProduction = window.location.protocol === 'https:' || 
                        window.location.hostname.includes('vltrngames.com') ||
                        window.location.hostname.includes('github.io');
    
    if (window.location.protocol === 'file:' && !isLocalDev && !isProduction) {
        showFileProtocolError();
        return;
    }
    
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
    // Check if already loaded
    if (window.EJS_player) {
        emulatorLoaded = true;
        loadGame('pokered.gbc');
        return;
    }
    
    // Show loading message
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.textContent = 'Loading EmulatorJS...';
    }
    
    // Load EmulatorJS script from CDN
    // This works on production sites and loads from a reliable CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
        emulatorLoaded = true;
        console.log('EmulatorJS loaded successfully');
        // Wait a bit for EmulatorJS to fully initialize
        setTimeout(() => {
            loadGame('pokered.gbc');
        }, 500);
    };
    script.onerror = () => {
        console.error('Failed to load EmulatorJS from CDN');
        // Try alternative CDN or show helpful error
        showError('Failed to load emulator library. Please check your internet connection and try again. If the problem persists, the CDN may be temporarily unavailable.');
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
    const emulatorDiv = document.getElementById('emulator');
    const container = document.getElementById('emulatorjs-container');
    const loading = emulatorDiv.querySelector('.loading');
    
    // Update loading message
    if (loading) {
        loading.textContent = `Loading ${romFile}...`;
        loading.style.display = 'block';
    }
    
    // Clear and prepare container
    if (container) {
        container.style.display = 'block';
        container.innerHTML = ''; // Clear previous content
    }
    
    // Configure EmulatorJS
    window.EJS_player = '#emulatorjs-container';
    window.EJS_core = 'gb'; // Game Boy core (supports .gb and .gbc)
    
    // Use relative path for ROM - works in both local dev and production
    const romPath = `pokered/${romFile}`;
    window.EJS_gameUrl = romPath;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_color = '#667eea';
    window.EJS_startOnLoaded = true;
    window.EJS_fullscreenOnLoaded = false;
    window.EJS_gameName = romFile.replace('.gbc', '').replace('.gb', '');
    
    // Production settings for better compatibility
    window.EJS_defaultControls = {
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        A: 'KeyZ',
        B: 'KeyX',
        START: 'Enter',
        SELECT: 'ShiftLeft'
    };
    
    // Set up default controls
    window.EJS_controls = {
        UP: 'ArrowUp',
        DOWN: 'ArrowDown',
        LEFT: 'ArrowLeft',
        RIGHT: 'ArrowRight',
        A: 'KeyZ',
        B: 'KeyX',
        START: 'Enter',
        SELECT: 'ShiftLeft'
    };
    
    // Start the game
    try {
        // Check if EJS_startGame exists
        if (typeof window.EJS_startGame === 'function') {
            window.EJS_startGame();
            gameStarted = true;
            console.log('Game started:', romFile);
            // Hide loading after a short delay
            setTimeout(() => {
                if (loading) loading.style.display = 'none';
            }, 1000);
        } else {
            // If EJS_startGame doesn't exist, wait a bit more or reload
            console.log('EJS_startGame not found, waiting for initialization...');
            let attempts = 0;
            const maxAttempts = 10;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof window.EJS_startGame === 'function') {
                    clearInterval(checkInterval);
                    window.EJS_startGame();
                    gameStarted = true;
                    console.log('Game started after wait:', romFile);
                    if (loading) loading.style.display = 'none';
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.error('EJS_startGame not available after waiting');
                    showError('Failed to initialize emulator. The EmulatorJS library may not have loaded correctly. Please refresh the page.');
                }
            }, 200);
        }
    } catch (e) {
        console.error('Error starting game:', e);
        showError('Failed to start game: ' + e.message + '. Please check the browser console for more details.');
    }
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
    // Try multiple methods as EmulatorJS API may vary
    let keyPressed = false;
    
    // Method 1: Direct EJS_controls
    if (window.EJS_controls && typeof window.EJS_controls.setKey === 'function') {
        try {
            window.EJS_controls.setKey(keyName, true);
            keyPressed = true;
        } catch (e) {
            console.log('Error setting key (method 1):', e);
        }
    }
    
    // Method 2: EJS object
    if (!keyPressed && window.EJS && typeof window.EJS.setKey === 'function') {
        try {
            window.EJS.setKey(keyName, true);
            keyPressed = true;
        } catch (e) {
            console.log('Error setting key (method 2):', e);
        }
    }
    
    // Method 3: Dispatch keyboard event to container
    if (!keyPressed) {
        const container = document.getElementById('emulatorjs-container');
        if (container) {
            const iframe = container.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    const keyEvent = new KeyboardEvent('keydown', {
                        key: keyName,
                        code: getKeyCode(keyName),
                        bubbles: true
                    });
                    iframe.contentWindow.dispatchEvent(keyEvent);
                } catch (e) {
                    console.log('Error dispatching key event:', e);
                }
            }
        }
    }
}

function releaseKey(keyName) {
    // Send key release to EmulatorJS
    let keyReleased = false;
    
    // Method 1: Direct EJS_controls
    if (window.EJS_controls && typeof window.EJS_controls.setKey === 'function') {
        try {
            window.EJS_controls.setKey(keyName, false);
            keyReleased = true;
        } catch (e) {
            console.log('Error releasing key (method 1):', e);
        }
    }
    
    // Method 2: EJS object
    if (!keyReleased && window.EJS && typeof window.EJS.setKey === 'function') {
        try {
            window.EJS.setKey(keyName, false);
            keyReleased = true;
        } catch (e) {
            console.log('Error releasing key (method 2):', e);
        }
    }
    
    // Method 3: Dispatch keyboard event to container
    if (!keyReleased) {
        const container = document.getElementById('emulatorjs-container');
        if (container) {
            const iframe = container.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    const keyEvent = new KeyboardEvent('keyup', {
                        key: keyName,
                        code: getKeyCode(keyName),
                        bubbles: true
                    });
                    iframe.contentWindow.dispatchEvent(keyEvent);
                } catch (e) {
                    console.log('Error dispatching key release event:', e);
                }
            }
        }
    }
}

function getKeyCode(keyName) {
    const keyCodeMap = {
        'UP': 'ArrowUp',
        'DOWN': 'ArrowDown',
        'LEFT': 'ArrowLeft',
        'RIGHT': 'ArrowRight',
        'A': 'KeyZ',
        'B': 'KeyX',
        'START': 'Enter',
        'SELECT': 'ShiftLeft'
    };
    return keyCodeMap[keyName] || keyName;
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
    }, 1000);
}
