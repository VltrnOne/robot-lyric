/**
 * AriaPac - Player (Safari Explorer) Class
 * Handles player movement, collision, stamina, and state
 */

class SafariExplorer {
    constructor(x, y, level = 1) {
        this.x = x - PLAYER_CONFIG.SIZE / 2;
        this.y = y - PLAYER_CONFIG.SIZE / 2;
        this.size = PLAYER_CONFIG.SIZE;

        this.direction = Direction.NONE;
        this.nextDirection = Direction.NONE;

        this.baseSpeed = PLAYER_CONFIG.BASE_SPEED;
        this.speed = this.calculateSpeed(level);

        this.lives = PLAYER_CONFIG.LIVES;
        this.stamina = PLAYER_CONFIG.MAX_STAMINA;
        this.isSprinting = false;

        this.isInvincible = false;
        this.invincibilityTimer = 0;

        this.animationFrame = 0;
        this.animationTimer = 0;

        this.score = 0;
    }

    calculateSpeed(level) {
        return this.baseSpeed * (1 + (level - 1) * PLAYER_CONFIG.SPEED_INCREASE_PER_LEVEL);
    }

    update(deltaTime, input, maze, powerupManager) {
        // Handle input
        this.handleInput(input, powerupManager);

        // Update stamina
        this.updateStamina(deltaTime, powerupManager);

        // Update invincibility
        if (this.isInvincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
            }
        }

        // Try to change direction
        if (this.nextDirection !== Direction.NONE) {
            if (this.canMove(this.nextDirection, maze)) {
                this.direction = this.nextDirection;
            }
        }

        // Move in current direction
        if (this.direction !== Direction.NONE) {
            this.move(maze);
        }

        // Update animation
        this.updateAnimation(deltaTime);
    }

    handleInput(input, powerupManager) {
        // Movement
        this.nextDirection = input.nextDirection;

        // Sprint
        this.isSprinting = input.isSprinting && this.stamina > 0;

        // Freeze power-ups
        if (input.freezeActivated) {
            // Handled by game, but we track it
        }
    }

    updateStamina(deltaTime, powerupManager) {
        const staminaBoost = powerupManager.isSprintBoosted() ? POWERUP_CONFIG.SPRINT_BOOST.effect : 0;
        const maxStamina = PLAYER_CONFIG.MAX_STAMINA * (1 + staminaBoost);

        if (this.isSprinting && this.stamina > 0) {
            this.stamina -= PLAYER_CONFIG.STAMINA_DRAIN_RATE * (deltaTime / 16);
            if (this.stamina < 0) {
                this.stamina = 0;
                this.isSprinting = false;
            }
        } else if (!this.isSprinting && this.stamina < maxStamina) {
            this.stamina += PLAYER_CONFIG.STAMINA_REGEN_RATE * (deltaTime / 16);
            if (this.stamina > maxStamina) {
                this.stamina = maxStamina;
            }
        }

        // Update stamina bar UI
        this.updateStaminaUI();
    }

    updateStaminaUI() {
        const staminaBar = document.getElementById('stamina-bar-fill');
        const percentage = (this.stamina / PLAYER_CONFIG.MAX_STAMINA) * 100;
        staminaBar.style.width = `${percentage}%`;

        // Color coding
        if (percentage > 50) {
            staminaBar.style.backgroundColor = '#4CAF50'; // Green
        } else if (percentage > 25) {
            staminaBar.style.backgroundColor = '#FFC107'; // Yellow
        } else {
            staminaBar.style.backgroundColor = '#F44336'; // Red
        }
    }

    canMove(direction, maze) {
        const vector = DirectionVector[direction];
        const moveSpeed = this.getCurrentSpeed();

        const newX = this.x + vector.x * moveSpeed;
        const newY = this.y + vector.y * moveSpeed;

        return maze.canMoveTo(newX, newY, this.size);
    }

    move(maze) {
        const vector = DirectionVector[this.direction];
        const moveSpeed = this.getCurrentSpeed();

        const newX = this.x + vector.x * moveSpeed;
        const newY = this.y + vector.y * moveSpeed;

        if (maze.canMoveTo(newX, newY, this.size)) {
            this.x = newX;
            this.y = newY;

            // Handle tunnel wrapping
            const wrapped = maze.handleTunnelWrap(this.x, this.y);
            this.x = wrapped.x;
            this.y = wrapped.y;
        } else {
            // Try to align to grid for smoother cornering
            this.alignToGrid(this.direction);
        }
    }

    alignToGrid(direction) {
        // Align perpendicular to movement direction for smoother cornering
        if (direction === Direction.LEFT || direction === Direction.RIGHT) {
            const gridY = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
            const diff = gridY - this.y;
            if (Math.abs(diff) < 4) {
                this.y = gridY;
            }
        } else if (direction === Direction.UP || direction === Direction.DOWN) {
            const gridX = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
            const diff = gridX - this.x;
            if (Math.abs(diff) < 4) {
                this.x = gridX;
            }
        }
    }

    getCurrentSpeed() {
        let currentSpeed = this.speed;

        if (this.isSprinting && this.stamina > 0) {
            currentSpeed *= PLAYER_CONFIG.SPRINT_MULTIPLIER;
        }

        return currentSpeed;
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;

        if (this.animationTimer >= ANIMATION_CONFIG.PLAYER_MOVE.speed) {
            this.animationFrame = (this.animationFrame + 1) % ANIMATION_CONFIG.PLAYER_MOVE.frames;
            this.animationTimer = 0;
        }
    }

    collectPellet(pelletData, powerupManager) {
        this.score += pelletData.score;

        if (pelletData.type === 'pellet') {
            const shouldSpawnLife = powerupManager.trackPelletCollection();
            return shouldSpawnLife;
        } else if (pelletData.type === 'power_pellet') {
            // Power pellet handled by powerup manager
            return false;
        }

        return false;
    }

    hit() {
        if (this.isInvincible) {
            return false;
        }

        this.lives--;
        this.isInvincible = true;
        this.invincibilityTimer = PLAYER_CONFIG.INVINCIBILITY_DURATION;

        // Update lives UI
        document.getElementById('lives-display').textContent = this.lives;

        return true;
    }

    addLife() {
        if (this.lives < PLAYER_CONFIG.MAX_LIVES) {
            this.lives++;
            document.getElementById('lives-display').textContent = this.lives;
        }
    }

    reset(x, y) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.direction = Direction.NONE;
        this.nextDirection = Direction.NONE;
        this.isInvincible = true;
        this.invincibilityTimer = PLAYER_CONFIG.INVINCIBILITY_DURATION;
    }

    levelUp(newLevel) {
        this.speed = this.calculateSpeed(newLevel);
    }

    isDead() {
        return this.lives <= 0;
    }

    getPosition() {
        return {
            x: this.x + this.size / 2,
            y: this.y + this.size / 2
        };
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size
        };
    }
}
