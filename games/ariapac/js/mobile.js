/**
 * AriaPac - Mobile Controls Handler
 * Manages touch controls, virtual joystick, and mobile optimizations
 */

class MobileHandler {
    constructor(inputHandler) {
        this.inputHandler = inputHandler;
        this.isMobile = this.detectMobile();
        this.isPortrait = window.innerHeight > window.innerWidth;
        this.activeKeys = new Map(); // Track which keys are currently pressed
        this.controlsVisible = false;
        this.selectedPlayer = null; // null = both players (desktop), 1 = P1, 2 = P2

        // Joystick state
        this.joystickActive = false;
        this.joystickStartPos = { x: 0, y: 0 };
        this.joystickCurrentPos = { x: 0, y: 0 };
        this.joystickMaxDistance = 30; // Max pixels the stick can move from center

        // Current movement direction
        this.currentDirection = null;

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

        // Setup player selection
        this.setupPlayerSelection();

        // Setup touch controls
        this.setupTouchControls();

        // Setup virtual joystick
        this.setupVirtualJoystick();

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
        const hudHeight = (hud && hud.classList.contains('visible')) ? hud.offsetHeight : 0;
        const controlsHeight = this.controlsVisible ? (mobileControls ? mobileControls.offsetHeight : 120) : 0;

        const availableWidth = window.innerWidth - 10;
        const availableHeight = window.innerHeight - headerHeight - hudHeight - controlsHeight - 10;

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

    setupPlayerSelection() {
        const playerSelection = document.getElementById('player-selection');
        const selectP1Btn = document.getElementById('select-p1-btn');
        const selectP2Btn = document.getElementById('select-p2-btn');

        if (!this.isMobile) {
            // Hide player selection on desktop
            if (playerSelection) playerSelection.classList.add('hidden');
            this.selectedPlayer = null; // Both players active
            return;
        }

        // Show player selection on mobile
        if (playerSelection) playerSelection.classList.remove('hidden');

        if (selectP1Btn) {
            selectP1Btn.addEventListener('click', () => {
                this.selectPlayer(1);
                selectP1Btn.classList.add('selected');
                if (selectP2Btn) selectP2Btn.classList.remove('selected');
            });
        }

        if (selectP2Btn) {
            selectP2Btn.addEventListener('click', () => {
                this.selectPlayer(2);
                selectP2Btn.classList.add('selected');
                if (selectP1Btn) selectP1Btn.classList.remove('selected');
            });
        }

        // Default to P1 on mobile
        if (selectP1Btn) {
            selectP1Btn.click();
        }
    }

    selectPlayer(playerNum) {
        this.selectedPlayer = playerNum;
        console.log(`Selected Player ${playerNum}`);
        this.updateVisibleControls();
    }

    updateVisibleControls() {
        // Update HUD sections visibility
        const p1Hud = document.querySelector('.p1-hud');
        const p2Hud = document.querySelector('.p2-hud');

        if (p1Hud && p2Hud) {
            if (this.selectedPlayer === 1) {
                p1Hud.classList.remove('hidden');
                p2Hud.classList.add('hidden');
            } else if (this.selectedPlayer === 2) {
                p1Hud.classList.add('hidden');
                p2Hud.classList.remove('hidden');
            } else {
                // Desktop - show both
                p1Hud.classList.remove('hidden');
                p2Hud.classList.remove('hidden');
            }
        }

        // Update mobile controls visibility
        const p1Actions = document.querySelector('.p1-actions');
        const p2Actions = document.querySelector('.p2-actions');

        if (p1Actions && p2Actions) {
            if (this.selectedPlayer === 1) {
                p1Actions.classList.remove('hidden');
                p2Actions.classList.add('hidden');
            } else if (this.selectedPlayer === 2) {
                p1Actions.classList.add('hidden');
                p2Actions.classList.remove('hidden');
            }
        }
    }

    setupTouchControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (!mobileControls) return;

        // Get all control buttons (action buttons, freeze, dino switches)
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

    setupVirtualJoystick() {
        const joystickStick = document.getElementById('joystick-stick');
        const joystickBase = document.getElementById('joystick-base');

        if (!joystickStick || !joystickBase) return;

        // Touch start
        joystickStick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.joystickActive = true;
            const touch = e.touches[0];
            const rect = joystickBase.getBoundingClientRect();
            this.joystickStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }, { passive: false });

        // Touch move
        joystickStick.addEventListener('touchmove', (e) => {
            if (!this.joystickActive) return;
            e.preventDefault();

            const touch = e.touches[0];
            this.handleJoystickMove(touch.clientX, touch.clientY);
        }, { passive: false });

        // Touch end
        joystickStick.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.joystickActive = false;
            this.resetJoystick();
        }, { passive: false });

        // Mouse support for desktop testing
        joystickStick.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.joystickActive = true;
            const rect = joystickBase.getBoundingClientRect();
            this.joystickStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.joystickActive) return;
            this.handleJoystickMove(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            if (this.joystickActive) {
                this.joystickActive = false;
                this.resetJoystick();
            }
        });
    }

    handleJoystickMove(clientX, clientY) {
        const dx = clientX - this.joystickStartPos.x;
        const dy = clientY - this.joystickStartPos.y;

        // Calculate distance from center
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Limit stick movement
        let limitedDx = dx;
        let limitedDy = dy;

        if (distance > this.joystickMaxDistance) {
            const angle = Math.atan2(dy, dx);
            limitedDx = Math.cos(angle) * this.joystickMaxDistance;
            limitedDy = Math.sin(angle) * this.joystickMaxDistance;
        }

        // Update joystick visual position
        const joystickStick = document.getElementById('joystick-stick');
        if (joystickStick) {
            joystickStick.style.transform = `translate(${limitedDx}px, ${limitedDy}px)`;
        }

        // Determine direction based on angle
        const angle = Math.atan2(dy, dx);
        const direction = this.angleToDirection(angle);

        // Update movement keys
        this.updateMovementKeys(direction);
    }

    angleToDirection(angle) {
        // Convert radians to degrees
        const degrees = angle * (180 / Math.PI);

        // Determine direction based on 8-directional input
        // But we'll simplify to 4 directions for now
        if (degrees >= -45 && degrees < 45) {
            return 'right';
        } else if (degrees >= 45 && degrees < 135) {
            return 'down';
        } else if (degrees >= 135 || degrees < -135) {
            return 'left';
        } else {
            return 'up';
        }
    }

    updateMovementKeys(direction) {
        // Get the movement keys for the selected player
        const movementKeys = this.selectedPlayer === 2
            ? { up: 'i', down: 'k', left: 'j', right: 'l' }
            : { up: 'w', down: 's', left: 'a', right: 'd' };

        // Release previous direction key
        if (this.currentDirection && this.currentDirection !== direction) {
            const prevKey = movementKeys[this.currentDirection];
            if (prevKey) {
                this.simulateKeyPress(prevKey, false);
            }
        }

        // Press new direction key
        if (direction) {
            const key = movementKeys[direction];
            if (key && this.currentDirection !== direction) {
                this.simulateKeyPress(key, true);
            }
        }

        this.currentDirection = direction;
    }

    resetJoystick() {
        // Reset visual position
        const joystickStick = document.getElementById('joystick-stick');
        if (joystickStick) {
            joystickStick.style.transform = 'translate(0, 0)';
        }

        // Release all movement keys
        if (this.currentDirection) {
            const movementKeys = this.selectedPlayer === 2
                ? { up: 'i', down: 'k', left: 'j', right: 'l' }
                : { up: 'w', down: 's', left: 'a', right: 'd' };

            const key = movementKeys[this.currentDirection];
            if (key) {
                this.simulateKeyPress(key, false);
            }
        }

        this.currentDirection = null;
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
            this.updateVisibleControls();
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

            // Reset joystick
            this.resetJoystick();

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

    getSelectedPlayer() {
        return this.selectedPlayer;
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
