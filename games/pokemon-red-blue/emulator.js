// Game Boy Emulator Integration using GameBoy.js (trekawek)
let gameboy = null;
let currentROM = null;
let canvas = null;
let ctx = null;
let animationFrame = null;
let romData = null;

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
    
    // Wait for GameBoy.js to load
    waitForGameBoy(() => {
        initializeEmulator();
    });
});

function waitForGameBoy(callback, attempts = 0) {
    if (typeof GameBoy !== 'undefined') {
        callback();
    } else if (attempts < 20) {
        setTimeout(() => waitForGameBoy(callback, attempts + 1), 100);
    } else {
        showError('GameBoy.js library failed to load. Please check your internet connection and refresh the page.');
    }
}

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

function initializeEmulator() {
    const emulatorDiv = document.getElementById('emulator');
    const container = document.getElementById('emulatorjs-container');
    const loading = emulatorDiv.querySelector('.loading');
    
    // Create canvas for emulator
    container.innerHTML = '<canvas id="gameCanvas" width="160" height="144"></canvas>';
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas styling
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.backgroundColor = '#000';
    
    // Load default game
    loadGame('pokered.gbc');
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
    const loading = document.querySelector('.loading');
    
    if (loading) {
        loading.textContent = `Loading ${romFile}...`;
        loading.style.display = 'block';
    }
    
    currentROM = romFile;
    const romPath = `pokered/${romFile}`;
    
    // Stop previous emulation
    if (gameboy) {
        try {
            if (gameboy.stop) gameboy.stop();
            if (gameboy.pause) gameboy.pause();
        } catch (e) {
            console.log('Error stopping previous emulator:', e);
        }
        gameboy = null;
    }
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    
    // Load ROM file
    fetch(romPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ROM: ${response.status} ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(romBuffer => {
            console.log('ROM loaded:', romFile, 'Size:', romBuffer.byteLength);
            romData = new Uint8Array(romBuffer);
            
            // Initialize GameBoy.js emulator
            if (typeof GameBoy !== 'undefined') {
                try {
                    // GameBoy.js (trekawek) API
                    gameboy = new GameBoy();
                    
                    // Load ROM
                    gameboy.loadROM(romData);
                    
                    // Set canvas
                    gameboy.setCanvas(canvas);
                    
                    // Start emulation
                    gameboy.start();
                    
                    // Start emulation loop
                    startEmulation();
                    
                    if (loading) {
                        loading.style.display = 'none';
                    }
                    
                    console.log('Game started:', romFile);
                } catch (e) {
                    console.error('Error initializing GameBoy.js:', e);
                    showError('Failed to initialize emulator: ' + e.message + '. Please check the browser console for details.');
                }
            } else {
                showError('GameBoy.js library not loaded. Please refresh the page.');
            }
        })
        .catch(error => {
            console.error('Error loading ROM:', error);
            showError(`Failed to load ROM file: ${error.message}. Please ensure the ROM files are deployed correctly.`);
        });
}

function startEmulation() {
    if (!gameboy || !canvas) return;
    
    function emulationLoop() {
        if (gameboy) {
            try {
                // GameBoy.js handles the emulation loop internally
                // We just need to make sure it's running
                if (gameboy.isRunning && !gameboy.isRunning()) {
                    gameboy.start();
                }
                
                // Update frame if needed
                if (gameboy.updateFrame) {
                    gameboy.updateFrame();
                }
            } catch (e) {
                console.error('Emulation error:', e);
            }
        }
        animationFrame = requestAnimationFrame(emulationLoop);
    }
    
    emulationLoop();
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
    if (gameboy) {
        try {
            if (gameboy.setKey) {
                gameboy.setKey(keyName, true);
            } else if (gameboy.keyDown) {
                gameboy.keyDown(keyName);
            } else if (gameboy.pressKey) {
                gameboy.pressKey(keyName);
            }
        } catch (e) {
            console.log('Error setting key:', e);
        }
    }
}

function releaseKey(keyName) {
    if (gameboy) {
        try {
            if (gameboy.setKey) {
                gameboy.setKey(keyName, false);
            } else if (gameboy.keyUp) {
                gameboy.keyUp(keyName);
            } else if (gameboy.releaseKey) {
                gameboy.releaseKey(keyName);
            }
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
        if (gameboy && gameboy.pause) {
            try {
                gameboy.pause();
            } catch (e) {
                console.log('Error pausing:', e);
            }
        }
    } else {
        // Resume emulation
        if (gameboy && gameboy.resume) {
            try {
                gameboy.resume();
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
