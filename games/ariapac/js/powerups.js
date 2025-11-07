/**
 * AriaPac - Power-up System
 * Manages freeze power-ups, special items, and their effects
 */

class PowerupManager {
    constructor() {
        this.inventory = {
            [FreezeType.RED]: 0,
            [FreezeType.BLUE]: 0,
            [FreezeType.GREEN]: 0,
            [FreezeType.ORANGE]: 0
        };

        this.activePowerups = []; // Spawned powerups on the map
        this.effects = []; // Visual effects

        this.sprintBoostTimer = 0;
        this.pelletsCollectedSinceLastLife = 0;
    }

    update(deltaTime, gameState) {
        // Update spawned powerups
        this.activePowerups = this.activePowerups.filter(powerup => {
            powerup.lifetime -= deltaTime;
            powerup.animationTime = (powerup.animationTime || 0) + deltaTime;
            return powerup.lifetime > 0;
        });

        // Update visual effects
        this.effects = this.effects.filter(effect => {
            effect.lifetime -= deltaTime;
            effect.progress = 1 - (effect.lifetime / effect.maxLifetime);

            // Update position for moving effects
            if (effect.velocity) {
                effect.x += effect.velocity.x * deltaTime / 16;
                effect.y += effect.velocity.y * deltaTime / 16;
            }

            return effect.lifetime > 0;
        });

        // Sprint boost timer
        if (this.sprintBoostTimer > 0) {
            this.sprintBoostTimer -= deltaTime;
        }
    }

    addToInventory(freezeType) {
        const config = FREEZE_CONFIG[freezeType];
        if (this.inventory[freezeType] < config.maxInventory) {
            this.inventory[freezeType]++;
            this.updateUI();
            return true;
        }
        return false;
    }

    useFreeze(freezeType, dinosaurs) {
        if (this.inventory[freezeType] <= 0) {
            return false;
        }

        const config = FREEZE_CONFIG[freezeType];
        const targetType = config.target;

        // Find and freeze target dinosaur
        let frozen = false;
        dinosaurs.forEach(dinosaur => {
            if (dinosaur.type === targetType && !dinosaur.isFrozen) {
                dinosaur.freeze(config.duration);
                frozen = true;

                // Create freeze effect
                this.createFreezeEffect(dinosaur.x + dinosaur.size / 2, dinosaur.y + dinosaur.size / 2, config.color);
            }
        });

        if (frozen) {
            this.inventory[freezeType]--;
            this.updateUI();
            return true;
        }

        return false;
    }

    handlePowerPelletCollection(x, y) {
        // Randomly generate a freeze power-up
        const freezeTypes = Object.values(FreezeType);
        const randomType = freezeTypes[Math.floor(Math.random() * freezeTypes.length)];

        this.addToInventory(randomType);

        // Play collection sound
        audioSystem.playSound('freezeCollect');

        // Create collection effect
        this.createCollectionEffect(x, y, FREEZE_CONFIG[randomType].color);

        return randomType;
    }

    spawnSprintBoost(maze) {
        const position = maze.getRandomWalkablePosition();

        this.activePowerups.push({
            type: 'sprint_boost',
            x: position.x,
            y: position.y,
            color: '#ffd700',
            lifetime: 15000, // 15 seconds before despawn
            animationTime: 0
        });
    }

    spawnExtraLife(maze) {
        const position = maze.getRandomWalkablePosition();

        this.activePowerups.push({
            type: 'extra_life',
            x: position.x,
            y: position.y,
            color: '#ff4444',
            lifetime: 20000, // 20 seconds before despawn
            animationTime: 0
        });
    }

    checkPowerupCollection(player, maze) {
        const collected = [];

        this.activePowerups = this.activePowerups.filter(powerup => {
            const distance = Math.sqrt(
                Math.pow(player.x + player.size / 2 - powerup.x, 2) +
                Math.pow(player.y + player.size / 2 - powerup.y, 2)
            );

            if (distance < player.size) {
                collected.push(powerup);
                this.createCollectionEffect(powerup.x, powerup.y, powerup.color);
                return false; // Remove from active powerups
            }

            return true;
        });

        // Process collected powerups
        collected.forEach(powerup => {
            if (powerup.type === 'sprint_boost') {
                this.activateSprintBoost();
            } else if (powerup.type === 'extra_life') {
                return 'extra_life'; // Signal to game to add life
            }
        });

        return collected.length > 0 ? collected : null;
    }

    activateSprintBoost() {
        this.sprintBoostTimer = POWERUP_CONFIG.SPRINT_BOOST.duration;
    }

    isSprintBoosted() {
        return this.sprintBoostTimer > 0;
    }

    trackPelletCollection() {
        this.pelletsCollectedSinceLastLife++;

        // Check if we should spawn extra life
        if (this.pelletsCollectedSinceLastLife >= POWERUP_CONFIG.EXTRA_LIFE.spawnEveryPellets) {
            this.pelletsCollectedSinceLastLife = 0;
            return true; // Signal to spawn extra life
        }

        return false;
    }

    createFreezeEffect(x, y, color) {
        this.effects.push({
            type: 'freeze',
            x: x,
            y: y,
            color: color,
            lifetime: 500,
            maxLifetime: 500,
            progress: 0
        });

        // Add particle burst
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const speed = 2;

            this.effects.push({
                type: 'particle',
                x: x,
                y: y,
                color: color,
                lifetime: 600,
                maxLifetime: 600,
                progress: 0,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                }
            });
        }
    }

    createCollectionEffect(x, y, color) {
        // Sparkle effect
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random();

            this.effects.push({
                type: 'particle',
                x: x,
                y: y,
                color: color,
                lifetime: 400,
                maxLifetime: 400,
                progress: 0,
                velocity: {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                }
            });
        }
    }

    createScorePopup(x, y, score) {
        this.effects.push({
            type: 'score_popup',
            x: x,
            y: y,
            score: score,
            lifetime: 1000,
            maxLifetime: 1000,
            progress: 0
        });
    }

    getInventory() {
        return { ...this.inventory };
    }

    getActivePowerups() {
        return [...this.activePowerups];
    }

    getEffects() {
        return [...this.effects];
    }

    updateUI() {
        // Update HUD display
        document.getElementById('red-freeze-count').textContent = this.inventory[FreezeType.RED];
        document.getElementById('blue-freeze-count').textContent = this.inventory[FreezeType.BLUE];
        document.getElementById('green-freeze-count').textContent = this.inventory[FreezeType.GREEN];
        document.getElementById('orange-freeze-count').textContent = this.inventory[FreezeType.ORANGE];
    }

    reset() {
        this.inventory = {
            [FreezeType.RED]: 0,
            [FreezeType.BLUE]: 0,
            [FreezeType.GREEN]: 0,
            [FreezeType.ORANGE]: 0
        };

        this.activePowerups = [];
        this.effects = [];
        this.sprintBoostTimer = 0;
        this.pelletsCollectedSinceLastLife = 0;

        this.updateUI();
    }
}
