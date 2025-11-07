/**
 * AriaPac - Game Constants and Configuration
 * Contains all game constants, enums, and configuration values
 */

// ==================== CANVAS & GRID ====================
const TILE_SIZE = 32; // pixels per tile
const GRID_WIDTH = 28; // tiles
const GRID_HEIGHT = 31; // tiles
const CANVAS_WIDTH = GRID_WIDTH * TILE_SIZE; // 896px
const CANVAS_HEIGHT = GRID_HEIGHT * TILE_SIZE; // 992px

// ==================== GAME STATES ====================
const GameState = {
    LOADING: 'loading',
    MENU: 'menu',
    INSTRUCTIONS: 'instructions',
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over'
};

// ==================== TILE TYPES ====================
const TileType = {
    EMPTY: 0,
    WALL: 1,
    PELLET: 2,
    POWER_PELLET: 3,
    SPAWN_PLAYER: 4,
    SPAWN_ENEMY: 5
};

// ==================== DIRECTIONS ====================
const Direction = {
    NONE: 'none',
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

const DirectionVector = {
    [Direction.UP]: { x: 0, y: -1 },
    [Direction.DOWN]: { x: 0, y: 1 },
    [Direction.LEFT]: { x: -1, y: 0 },
    [Direction.RIGHT]: { x: 1, y: 0 },
    [Direction.NONE]: { x: 0, y: 0 }
};

// ==================== PLAYER CONSTANTS ====================
const PLAYER_CONFIG = {
    BASE_SPEED: 3, // pixels per frame at 60fps
    SPEED_INCREASE_PER_LEVEL: 0.05, // 5% increase per level
    SPRINT_MULTIPLIER: 1.5,
    MAX_STAMINA: 100,
    STAMINA_DRAIN_RATE: 1, // per frame while sprinting
    STAMINA_REGEN_RATE: 0.5, // per frame while not sprinting
    SIZE: 28, // pixels (fits in 32px tile)
    LIVES: 3,
    MAX_LIVES: 5,
    INVINCIBILITY_DURATION: 2000 // ms after being hit
};

// ==================== DINOSAUR TYPES ====================
const DinosaurType = {
    RAPTOR: 'raptor',
    PTERODACTYL: 'pterodactyl',
    TRICERATOPS: 'triceratops',
    TREX: 'trex'
};

// ==================== DINOSAUR CONFIGURATIONS ====================
const DINOSAUR_CONFIG = {
    [DinosaurType.RAPTOR]: {
        name: 'Raptor',
        color: '#dc143c', // Crimson red
        speedMultiplier: 1.1, // 110% of player speed
        size: 24,
        abilityName: 'Pounce',
        abilityCooldown: 8000, // ms
        abilityDuration: 0, // instant
        abilityRange: 3 // tiles
    },
    [DinosaurType.PTERODACTYL]: {
        name: 'Pterodactyl',
        color: '#4169e1', // Royal blue
        speedMultiplier: 0.9, // 90% of player speed
        size: 26,
        abilityName: 'Sonar Pulse',
        abilityCooldown: 12000, // ms
        abilityDuration: 3000, // ms
        abilityRange: 5 // tiles
    },
    [DinosaurType.TRICERATOPS]: {
        name: 'Triceratops',
        color: '#228b22', // Forest green
        speedMultiplier: 0.7, // 70% of player speed
        size: 30,
        abilityName: 'Stampede',
        abilityCooldown: 15000, // ms
        abilityDuration: 2000, // ms
        speedBoost: 2.0 // 200% speed during stampede
    },
    [DinosaurType.TREX]: {
        name: 'T-Rex',
        color: '#ff8c00', // Dark orange
        speedMultiplier: 0.85, // 85% of player speed
        size: 32,
        abilityName: 'Roar',
        abilityCooldown: 20000, // ms
        abilityDuration: 2000, // ms
        abilityRange: 5 // tiles
    }
};

// ==================== FREEZE POWER-UP TYPES ====================
const FreezeType = {
    RED: 'red', // Anti-Raptor
    BLUE: 'blue', // Anti-Pterodactyl
    GREEN: 'green', // Anti-Triceratops
    ORANGE: 'orange' // Anti-T-Rex
};

const FREEZE_CONFIG = {
    [FreezeType.RED]: {
        color: '#ff0000',
        duration: 5000, // ms
        target: DinosaurType.RAPTOR,
        maxInventory: 2
    },
    [FreezeType.BLUE]: {
        color: '#0088ff',
        duration: 5000, // ms
        target: DinosaurType.PTERODACTYL,
        maxInventory: 2
    },
    [FreezeType.GREEN]: {
        color: '#00ff00',
        duration: 4000, // ms (shorter due to resistance)
        target: DinosaurType.TRICERATOPS,
        maxInventory: 2
    },
    [FreezeType.ORANGE]: {
        color: '#ff6600',
        duration: 6000, // ms
        target: DinosaurType.TREX,
        maxInventory: 2
    }
};

// ==================== POWER-UP SPAWN CONFIGURATION ====================
const POWERUP_CONFIG = {
    SPRINT_BOOST: {
        spawnInterval: 30000, // ms
        duration: 10000, // ms
        effect: 0.5 // 50% stamina boost
    },
    EXTRA_LIFE: {
        spawnEveryPellets: 50,
        effect: 1 // +1 life
    }
};

// ==================== SCORING ====================
const SCORE = {
    PELLET: 10,
    POWER_PELLET: 50,
    FREEZE_DINOSAUR: 200,
    LEVEL_COMPLETE: 1000,
    TIME_BONUS_MULTIPLIER: 10, // per second remaining
    PERFECT_LEVEL_BONUS: 2000, // all pellets without death
    NO_DEATH_BONUS: 5000 // complete level without dying
};

// ==================== LEVEL CONFIGURATION ====================
const LEVEL_CONFIG = {
    1: {
        dinosaurCount: 3,
        dinosaurTypes: [DinosaurType.RAPTOR, DinosaurType.PTERODACTYL, DinosaurType.TRICERATOPS],
        speedMultiplier: 1.0,
        powerPellets: 4,
        aiDifficulty: 'basic'
    },
    2: {
        dinosaurCount: 3,
        dinosaurTypes: [DinosaurType.RAPTOR, DinosaurType.PTERODACTYL, DinosaurType.TRICERATOPS],
        speedMultiplier: 1.0,
        powerPellets: 4,
        aiDifficulty: 'basic'
    },
    3: {
        dinosaurCount: 4,
        dinosaurTypes: [DinosaurType.RAPTOR, DinosaurType.PTERODACTYL, DinosaurType.TRICERATOPS, DinosaurType.TREX],
        speedMultiplier: 1.05,
        powerPellets: 4,
        aiDifficulty: 'intermediate'
    },
    4: {
        dinosaurCount: 4,
        dinosaurTypes: [DinosaurType.RAPTOR, DinosaurType.PTERODACTYL, DinosaurType.TRICERATOPS, DinosaurType.TREX],
        speedMultiplier: 1.05,
        powerPellets: 4,
        aiDifficulty: 'intermediate'
    },
    5: {
        dinosaurCount: 4,
        dinosaurTypes: [DinosaurType.RAPTOR, DinosaurType.PTERODACTYL, DinosaurType.TRICERATOPS, DinosaurType.TREX],
        speedMultiplier: 1.1,
        powerPellets: 3,
        aiDifficulty: 'advanced'
    },
    // Default for levels 6+
    default: {
        dinosaurCount: 4,
        dinosaurTypes: [DinosaurType.RAPTOR, DinosaurType.PTERODACTYL, DinosaurType.TRICERATOPS, DinosaurType.TREX],
        speedMultiplier: 1.2,
        powerPellets: 2,
        aiDifficulty: 'expert'
    }
};

// ==================== AI BEHAVIOR ====================
const AIBehavior = {
    CHASE: 'chase', // Direct pursuit of player
    PATROL: 'patrol', // Follow patrol path
    AMBUSH: 'ambush', // Wait at strategic location
    SCATTER: 'scatter', // Move to corners
    COORDINATE: 'coordinate' // Team-based positioning
};

// ==================== ANIMATION FRAMES ====================
const ANIMATION_CONFIG = {
    PLAYER_MOVE: {
        frames: 4,
        speed: 100 // ms per frame
    },
    DINOSAUR_MOVE: {
        frames: 4,
        speed: 150
    },
    PELLET_PULSE: {
        frames: 8,
        speed: 80
    },
    POWER_PELLET_GLOW: {
        frames: 12,
        speed: 60
    },
    FREEZE_EFFECT: {
        frames: 6,
        speed: 100
    }
};

// ==================== COLORS ====================
const COLORS = {
    // Jungle Theme
    BACKGROUND: '#1a2e1a',
    WALL: '#3d5a3d',
    WALL_BORDER: '#2a4a2a',
    PELLET: '#ffd700',
    POWER_PELLET: '#ff6b35',

    // Player
    PLAYER: '#d4a574',
    PLAYER_ACCENT: '#8b4513',

    // Dinosaurs
    RAPTOR: '#dc143c',
    PTERODACTYL: '#4169e1',
    TRICERATOPS: '#228b22',
    TREX: '#ff8c00',

    // UI
    TEXT: '#ffffff',
    TEXT_SHADOW: '#000000',
    SCORE: '#ffd700',
    LIVES: '#ff4444',
    HUD_BG: 'rgba(0, 0, 0, 0.7)',

    // Effects
    FREEZE: '#00ffff',
    SPRINT_TRAIL: 'rgba(255, 215, 0, 0.3)',
    SONAR_PULSE: 'rgba(65, 105, 225, 0.4)'
};

// ==================== SOUND EFFECTS (IDs for future implementation) ====================
const SOUNDS = {
    PELLET_COLLECT: 'pellet_collect',
    POWER_PELLET_COLLECT: 'power_pellet_collect',
    FREEZE_ACTIVATE: 'freeze_activate',
    DINOSAUR_FROZEN: 'dinosaur_frozen',
    ABILITY_USE: 'ability_use',
    PLAYER_DEATH: 'player_death',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over',
    ROAR: 'roar',
    SPRINT: 'sprint'
};

// ==================== KEYBOARD MAPPINGS ====================
const KEYS = {
    // Player 1
    PLAYER1: {
        UP: ['w', 'W', 'ArrowUp'],
        DOWN: ['s', 'S', 'ArrowDown'],
        LEFT: ['a', 'A', 'ArrowLeft'],
        RIGHT: ['d', 'D', 'ArrowRight'],
        SPRINT: 'Shift',
        FREEZE_RED: '1',
        FREEZE_BLUE: '2',
        FREEZE_GREEN: '3',
        FREEZE_ORANGE: '4'
    },
    // Player 2
    PLAYER2: {
        UP: ['i', 'I'],
        DOWN: ['k', 'K'],
        LEFT: ['j', 'J'],
        RIGHT: ['l', 'L'],
        ABILITY: ' ', // Space
        SELECT_RAPTOR: ['u', 'U'],
        SELECT_PTERODACTYL: ['o', 'O'],
        SELECT_TRICERATOPS: ['p', 'P'],
        SELECT_TREX: ['[', '{'],
        CYCLE: 'Tab'
    },
    // System
    SYSTEM: {
        PAUSE: 'Escape',
        FULLSCREEN: 'F11'
    }
};

// ==================== COLLISION DETECTION ====================
const COLLISION_CONFIG = {
    PLAYER_ENEMY_RADIUS: 16, // pixels
    SECTOR_SIZE: 8, // tiles per sector for spatial partitioning
    INPUT_BUFFER_TIME: 100 // ms
};

// ==================== PERFORMANCE SETTINGS ====================
const PERFORMANCE = {
    TARGET_FPS: 60,
    FRAME_TIME: 1000 / 60, // ~16.67ms
    MAX_DELTA_TIME: 50 // Cap delta time to prevent large jumps
};

// ==================== DEBUG MODE ====================
const DEBUG = {
    ENABLED: false, // Set to true for debug visualizations
    SHOW_GRID: false,
    SHOW_COLLISION_BOXES: false,
    SHOW_AI_PATHS: false,
    SHOW_FPS: false
};

// ==================== EXPORT FOR MODULE USAGE ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TILE_SIZE,
        GRID_WIDTH,
        GRID_HEIGHT,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        GameState,
        TileType,
        Direction,
        DirectionVector,
        PLAYER_CONFIG,
        DinosaurType,
        DINOSAUR_CONFIG,
        FreezeType,
        FREEZE_CONFIG,
        POWERUP_CONFIG,
        SCORE,
        LEVEL_CONFIG,
        AIBehavior,
        ANIMATION_CONFIG,
        COLORS,
        SOUNDS,
        KEYS,
        COLLISION_CONFIG,
        PERFORMANCE,
        DEBUG
    };
}
