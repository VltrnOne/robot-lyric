/**
 * AriaPac - Mobile Controls Handler
 * Manages touch controls and mobile optimizations
 */

class MobileHandler {
    constructor(inputHandler) {
        this.inputHandler = inputHandler;
        this.isMobile = this.detectMobile();
        this.isPortrait = window.innerHeight > window.innerWidth;
        this.activeKeys = new Map(); // Track which keys are currently pressed
        this.controlsVisible = false;

        if (this.isMobile) {
            this.init();
        }
    }

    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }

    init() {
        console.log('Initializing mobile controls...');

        // Setup canvas for mobile
        this.setupMobileCanvas();

        // Setup touch controls
        this.setupTouchControls();

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.isPortrait = window.innerHeight > window.innerWidth;
                this.setupMobileCanvas();
            }, 100);
        });

        window.addEventListener('resize', () => {
            this.isPortrait = window.innerHeight > window.innerWidth;
            this.setupMobileCanvas();
        });

        // Prevent default touch behaviors
        this.preventDefaultTouchBehaviors();

        console.log('Mobile controls initialized!');
    }

    setupMobileCanvas() {
        const gameContainer = document.getElementById('game-container');
        const canvases = [
            document.getElementById('bg-layer'),
            document.getElementById('entity-layer'),
            document.getElementById('ui-layer')
        ];

        if (!gameContainer || !canvases[0]) return;

        // Calculate available space
        const header = document.getElementById('game-header');
        const hud = document.getElementById('player-hud');
        const mobileControls = document.getElementById('mobile-controls');

        const headerHeight = header ? header.offsetHeight : 0;
        // Don't include HUD height on mobile - it overlays the canvas
        const hudHeight = 0; // HUD will overlay, not push content
        const controlsHeight = this.controlsVisible ? 200 : 0;

        const availableWidth = window.innerWidth - 10;
        const availableHeight = window.innerHeight - headerHeight - hudHeight - controlsHeight - 20;

        // Calculate scale to fit
        const scaleX = availableWidth / CANVAS_WIDTH;
        const scaleY = availableHeight / CANVAS_HEIGHT;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

        const scaledWidth = CANVAS_WIDTH * scale;
        const scaledHeight = CANVAS_HEIGHT * scale;

        // Apply to all canvases
        canvases.forEach(canvas => {
            if (canvas) {
                canvas.style.width = `${scaledWidth}px`;
                canvas.style.height = `${scaledHeight}px`;
            }
        });

        console.log(`Canvas scaled to ${scaledWidth}x${scaledHeight} (${Math.round(scale * 100)}%)`);
    }

    setupTouchControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (!mobileControls) return;

        // Get all control buttons
        const buttons = mobileControls.querySelectorAll('button[data-key]');

        buttons.forEach(button => {
            const key = button.getAttribute('data-key');

            // Handle touch start
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!this.activeKeys.has(key)) {
                    this.simulateKeyPress(key, true);
                    this.activeKeys.set(key, true);
                    button.classList.add('active');
                }
            }, { passive: false });

            // Handle touch end
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (this.activeKeys.has(key)) {
                    this.simulateKeyPress(key, false);
                    this.activeKeys.delete(key);
                    button.classList.remove('active');
                }
            }, { passive: false });

            // Handle touch cancel (when touch leaves button)
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (this.activeKeys.has(key)) {
                    this.simulateKeyPress(key, false);
                    this.activeKeys.delete(key);
                    button.classList.remove('active');
                }
            }, { passive: false });

            // Also support mouse for testing on desktop
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (!this.activeKeys.has(key)) {
                    this.simulateKeyPress(key, true);
                    this.activeKeys.set(key, true);
                    button.classList.add('active');
                }
            });

            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                if (this.activeKeys.has(key)) {
                    this.simulateKeyPress(key, false);
                    this.activeKeys.delete(key);
                    button.classList.remove('active');
                }
            });

            button.addEventListener('mouseleave', (e) => {
                if (this.activeKeys.has(key)) {
                    this.simulateKeyPress(key, false);
                    this.activeKeys.delete(key);
                    button.classList.remove('active');
                }
            });
        });

        // Setup mobile pause button
        const mobilePauseBtn = document.getElementById('mobile-pause-btn');
        if (mobilePauseBtn) {
            mobilePauseBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.simulateKeyPress('Escape', true);
                setTimeout(() => this.simulateKeyPress('Escape', false), 100);
            }, { passive: false });

            mobilePauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.simulateKeyPress('Escape', true);
                setTimeout(() => this.simulateKeyPress('Escape', false), 100);
            });
        }
    }

    simulateKeyPress(key, isDown) {
        const eventType = isDown ? 'keydown' : 'keyup';
        const event = new KeyboardEvent(eventType, {
            key: key,
            code: this.getKeyCode(key),
            bubbles: true,
            cancelable: true
        });

        window.dispatchEvent(event);
    }

    getKeyCode(key) {
        const keyCodeMap = {
            'w': 'KeyW',
            'a': 'KeyA',
            's': 'KeyS',
            'd': 'KeyD',
            'i': 'KeyI',
            'j': 'KeyJ',
            'k': 'KeyK',
            'l': 'KeyL',
            'u': 'KeyU',
            'o': 'KeyO',
            'p': 'KeyP',
            '[': 'BracketLeft',
            '1': 'Digit1',
            '2': 'Digit2',
            '3': 'Digit3',
            '4': 'Digit4',
            ' ': 'Space',
            'Shift': 'ShiftLeft',
            'Escape': 'Escape'
        };

        return keyCodeMap[key] || key;
    }

    preventDefaultTouchBehaviors() {
        // Prevent pull-to-refresh
        document.body.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent long-press context menu
        window.addEventListener('contextmenu', (e) => {
            if (this.isMobile) {
                e.preventDefault();
            }
        });
    }

    showControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls && this.isMobile) {
            mobileControls.classList.remove('hidden');
            this.controlsVisible = true;
            this.setupMobileCanvas();
        }
    }

    hideControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.classList.add('hidden');
            this.controlsVisible = false;

            // Release all active keys
            this.activeKeys.forEach((_, key) => {
                this.simulateKeyPress(key, false);
            });
            this.activeKeys.clear();

            // Remove active class from all buttons
            const buttons = mobileControls.querySelectorAll('button');
            buttons.forEach(btn => btn.classList.remove('active'));

            this.setupMobileCanvas();
        }
    }

    toggleControls() {
        if (this.controlsVisible) {
            this.hideControls();
        } else {
            this.showControls();
        }
    }

    getIsMobile() {
        return this.isMobile;
    }

    getIsPortrait() {
        return this.isPortrait;
    }
}

// Initialize mobile handler when DOM is ready
let mobileHandler = null;

function initMobileHandler(inputHandler) {
    if (!mobileHandler) {
        mobileHandler = new MobileHandler(inputHandler);
    }
    return mobileHandler;
}
