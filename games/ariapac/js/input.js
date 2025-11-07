/**
 * AriaPac - Input Handler
 * Manages keyboard input for both players with buffering and state tracking
 */

class InputHandler {
    constructor() {
        this.keysPressed = new Set();
        this.keysJustPressed = new Set();
        this.keysJustReleased = new Set();

        this.player1Input = {
            direction: Direction.NONE,
            nextDirection: Direction.NONE,
            isSprinting: false,
            freezeActivated: null
        };

        this.player2Input = {
            direction: Direction.NONE,
            nextDirection: Direction.NONE,
            abilityActivated: false,
            switchDinosaur: null
        };

        this.inputBuffer = [];
        this.bufferMaxAge = COLLISION_CONFIG.INPUT_BUFFER_TIME;

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Prevent default behavior for game keys
        window.addEventListener('keydown', (e) => {
            if (this.isGameKey(e.key)) {
                e.preventDefault();
            }
        });
    }

    handleKeyDown(e) {
        const key = e.key;

        // Track all pressed keys
        if (!this.keysPressed.has(key)) {
            this.keysPressed.add(key);
            this.keysJustPressed.add(key);
            this.addToBuffer(key, Date.now());
        }

        // Process game-specific inputs
        this.processPlayer1Input(key);
        this.processPlayer2Input(key);
        this.processSystemInput(key);
    }

    handleKeyUp(e) {
        const key = e.key;

        if (this.keysPressed.has(key)) {
            this.keysPressed.delete(key);
            this.keysJustReleased.add(key);
        }

        // Handle continuous inputs (sprint)
        if (key === KEYS.PLAYER1.SPRINT) {
            this.player1Input.isSprinting = false;
        }
    }

    processPlayer1Input(key) {
        // Movement
        if (KEYS.PLAYER1.UP.includes(key)) {
            this.player1Input.nextDirection = Direction.UP;
        } else if (KEYS.PLAYER1.DOWN.includes(key)) {
            this.player1Input.nextDirection = Direction.DOWN;
        } else if (KEYS.PLAYER1.LEFT.includes(key)) {
            this.player1Input.nextDirection = Direction.LEFT;
        } else if (KEYS.PLAYER1.RIGHT.includes(key)) {
            this.player1Input.nextDirection = Direction.RIGHT;
        }

        // Sprint
        if (key === KEYS.PLAYER1.SPRINT) {
            this.player1Input.isSprinting = true;
        }

        // Freeze power-ups
        if (key === KEYS.PLAYER1.FREEZE_RED) {
            this.player1Input.freezeActivated = FreezeType.RED;
        } else if (key === KEYS.PLAYER1.FREEZE_BLUE) {
            this.player1Input.freezeActivated = FreezeType.BLUE;
        } else if (key === KEYS.PLAYER1.FREEZE_GREEN) {
            this.player1Input.freezeActivated = FreezeType.GREEN;
        } else if (key === KEYS.PLAYER1.FREEZE_ORANGE) {
            this.player1Input.freezeActivated = FreezeType.ORANGE;
        }
    }

    processPlayer2Input(key) {
        // Movement
        if (KEYS.PLAYER2.UP.includes(key)) {
            this.player2Input.nextDirection = Direction.UP;
        } else if (KEYS.PLAYER2.DOWN.includes(key)) {
            this.player2Input.nextDirection = Direction.DOWN;
        } else if (KEYS.PLAYER2.LEFT.includes(key)) {
            this.player2Input.nextDirection = Direction.LEFT;
        } else if (KEYS.PLAYER2.RIGHT.includes(key)) {
            this.player2Input.nextDirection = Direction.RIGHT;
        }

        // Dinosaur selection
        if (KEYS.PLAYER2.SELECT_RAPTOR.includes(key)) {
            this.player2Input.switchDinosaur = DinosaurType.RAPTOR;
        } else if (KEYS.PLAYER2.SELECT_PTERODACTYL.includes(key)) {
            this.player2Input.switchDinosaur = DinosaurType.PTERODACTYL;
        } else if (KEYS.PLAYER2.SELECT_TRICERATOPS.includes(key)) {
            this.player2Input.switchDinosaur = DinosaurType.TRICERATOPS;
        } else if (KEYS.PLAYER2.SELECT_TREX.includes(key)) {
            this.player2Input.switchDinosaur = DinosaurType.TREX;
        }

        // Ability activation
        if (key === KEYS.PLAYER2.ABILITY) {
            this.player2Input.abilityActivated = true;
        }

        // Cycle through dinosaurs
        if (key === KEYS.PLAYER2.CYCLE) {
            this.player2Input.switchDinosaur = 'cycle';
        }
    }

    processSystemInput(key) {
        // System keys are handled by game.js
        // Just track them here
        if (key === KEYS.SYSTEM.PAUSE) {
            // Pause handled by game
        } else if (key === KEYS.SYSTEM.FULLSCREEN) {
            // Fullscreen handled by game
        }
    }

    isGameKey(key) {
        // Check if key is used by the game (to prevent default browser behavior)
        const allKeys = [
            ...KEYS.PLAYER1.UP,
            ...KEYS.PLAYER1.DOWN,
            ...KEYS.PLAYER1.LEFT,
            ...KEYS.PLAYER1.RIGHT,
            KEYS.PLAYER1.SPRINT,
            KEYS.PLAYER1.FREEZE_RED,
            KEYS.PLAYER1.FREEZE_BLUE,
            KEYS.PLAYER1.FREEZE_GREEN,
            KEYS.PLAYER1.FREEZE_ORANGE,
            ...KEYS.PLAYER2.UP,
            ...KEYS.PLAYER2.DOWN,
            ...KEYS.PLAYER2.LEFT,
            ...KEYS.PLAYER2.RIGHT,
            KEYS.PLAYER2.ABILITY,
            ...KEYS.PLAYER2.SELECT_RAPTOR,
            ...KEYS.PLAYER2.SELECT_PTERODACTYL,
            ...KEYS.PLAYER2.SELECT_TRICERATOPS,
            ...KEYS.PLAYER2.SELECT_TREX,
            KEYS.PLAYER2.CYCLE,
            KEYS.SYSTEM.PAUSE
        ];

        return allKeys.includes(key);
    }

    addToBuffer(key, timestamp) {
        this.inputBuffer.push({ key, timestamp });

        // Clean old inputs
        this.cleanBuffer(timestamp);
    }

    cleanBuffer(currentTime) {
        this.inputBuffer = this.inputBuffer.filter(
            input => (currentTime - input.timestamp) < this.bufferMaxAge
        );
    }

    getBufferedInput(maxAge = this.bufferMaxAge) {
        const currentTime = Date.now();
        return this.inputBuffer.filter(
            input => (currentTime - input.timestamp) < maxAge
        );
    }

    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }

    isKeyJustPressed(key) {
        return this.keysJustPressed.has(key);
    }

    isKeyJustReleased(key) {
        return this.keysJustReleased.has(key);
    }

    getPlayer1Input() {
        return { ...this.player1Input };
    }

    getPlayer2Input() {
        return { ...this.player2Input };
    }

    clearFrameInputs() {
        // Clear single-frame inputs
        this.keysJustPressed.clear();
        this.keysJustReleased.clear();
        this.player1Input.freezeActivated = null;
        this.player2Input.abilityActivated = false;
        this.player2Input.switchDinosaur = null;
    }

    reset() {
        this.keysPressed.clear();
        this.keysJustPressed.clear();
        this.keysJustReleased.clear();
        this.inputBuffer = [];

        this.player1Input = {
            direction: Direction.NONE,
            nextDirection: Direction.NONE,
            isSprinting: false,
            freezeActivated: null
        };

        this.player2Input = {
            direction: Direction.NONE,
            nextDirection: Direction.NONE,
            abilityActivated: false,
            switchDinosaur: null
        };
    }
}
