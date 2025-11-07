/**
 * AriaPac - Enemy (Dinosaur) Classes
 * Handles dinosaur AI, abilities, and behavior
 */

class Dinosaur {
    constructor(type, x, y, level = 1) {
        this.type = type;
        this.config = DINOSAUR_CONFIG[type];

        this.x = x - this.config.size / 2;
        this.y = y - this.config.size / 2;
        this.size = this.config.size;

        this.direction = Direction.NONE;
        this.nextDirection = Direction.NONE;

        this.baseSpeed = PLAYER_CONFIG.BASE_SPEED * this.config.speedMultiplier;
        this.speed = this.calculateSpeed(level);

        this.isActive = false; // Player-controlled
        this.isFrozen = false;
        this.freezeTimer = 0;

        this.abilityActive = false;
        this.abilityCooldownTimer = 0;
        this.abilityDurationTimer = 0;

        this.aiMode = AIBehavior.CHASE;
        this.aiTarget = null;
        this.aiPath = [];
        this.aiUpdateTimer = 0;

        this.level = level;

        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    calculateSpeed(level) {
        const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG.default;
        return this.baseSpeed * levelConfig.speedMultiplier;
    }

    update(deltaTime, input, player, maze, otherDinosaurs) {
        // Update freeze state
        if (this.isFrozen) {
            this.freezeTimer -= deltaTime;
            if (this.freezeTimer <= 0) {
                this.isFrozen = false;
                this.freezeTimer = 0;
            }
            return; // Cannot do anything while frozen
        }

        // Update ability cooldown
        if (this.abilityCooldownTimer > 0) {
            this.abilityCooldownTimer -= deltaTime;
        }

        // Update ability duration
        if (this.abilityActive) {
            this.abilityDurationTimer -= deltaTime;
            if (this.abilityDurationTimer <= 0) {
                this.deactivateAbility();
            }
        }

        // Handle input or AI
        if (this.isActive && input) {
            this.handlePlayerControl(input, player, maze);
        } else {
            this.handleAI(deltaTime, player, maze, otherDinosaurs);
        }

        // Move
        if (this.direction !== Direction.NONE) {
            this.move(maze);
        }

        // Update animation
        this.updateAnimation(deltaTime);
    }

    handlePlayerControl(input, player, maze) {
        // Movement
        this.nextDirection = input.nextDirection;

        // Try to change direction
        if (this.nextDirection !== Direction.NONE) {
            if (this.canMove(this.nextDirection, maze)) {
                this.direction = this.nextDirection;
            }
        }

        // Ability activation
        if (input.abilityActivated && this.canUseAbility()) {
            this.activateAbility(player, maze);
        }
    }

    handleAI(deltaTime, player, maze, otherDinosaurs) {
        this.aiUpdateTimer += deltaTime;

        // Update AI decision every 200ms
        if (this.aiUpdateTimer >= 200) {
            this.updateAIBehavior(player, maze, otherDinosaurs);
            this.aiUpdateTimer = 0;
        }

        // Execute current AI behavior
        switch (this.aiMode) {
            case AIBehavior.CHASE:
                this.chasePlayer(player, maze);
                break;
            case AIBehavior.PATROL:
                this.patrol(maze);
                break;
            case AIBehavior.AMBUSH:
                this.ambush(player, maze);
                break;
            case AIBehavior.SCATTER:
                this.scatter(maze);
                break;
        }
    }

    updateAIBehavior(player, maze, otherDinosaurs) {
        const distance = this.getDistanceToPlayer(player);
        const difficulty = LEVEL_CONFIG[this.level]?.aiDifficulty || 'basic';

        // Basic behavior: always chase
        if (difficulty === 'basic') {
            this.aiMode = AIBehavior.CHASE;
        }
        // Intermediate: chase when close, patrol when far
        else if (difficulty === 'intermediate') {
            if (distance < TILE_SIZE * 10) {
                this.aiMode = AIBehavior.CHASE;
            } else {
                this.aiMode = AIBehavior.PATROL;
            }
        }
        // Advanced: strategic behavior
        else {
            if (player.isInvincible) {
                this.aiMode = AIBehavior.SCATTER;
            } else if (distance < TILE_SIZE * 5) {
                this.aiMode = AIBehavior.CHASE;
            } else if (distance < TILE_SIZE * 15) {
                this.aiMode = AIBehavior.AMBUSH;
            } else {
                this.aiMode = AIBehavior.PATROL;
            }
        }
    }

    chasePlayer(player, maze) {
        const playerPos = player.getPosition();
        const myPos = this.getPosition();

        const direction = maze.getDirectionToward(myPos.x, myPos.y, playerPos.x, playerPos.y);

        if (direction !== Direction.NONE && this.canMove(direction, maze)) {
            this.direction = direction;
        } else {
            // Random valid direction if stuck
            this.chooseRandomDirection(maze);
        }
    }

    patrol(maze) {
        // Simple patrol: continue in current direction until hitting a wall
        if (!this.canMove(this.direction, maze)) {
            this.chooseRandomDirection(maze);
        }
    }

    ambush(player, maze) {
        // Try to predict player's position and intercept
        const playerPos = player.getPosition();
        const playerDir = DirectionVector[player.direction];

        // Predict where player will be
        const predictedX = playerPos.x + playerDir.x * TILE_SIZE * 3;
        const predictedY = playerPos.y + playerDir.y * TILE_SIZE * 3;

        const myPos = this.getPosition();
        const direction = maze.getDirectionToward(myPos.x, myPos.y, predictedX, predictedY);

        if (direction !== Direction.NONE && this.canMove(direction, maze)) {
            this.direction = direction;
        } else {
            this.chasePlayer(player, maze);
        }
    }

    scatter(maze) {
        // Move away to corners
        const corners = [
            { x: TILE_SIZE * 2, y: TILE_SIZE * 2 },
            { x: TILE_SIZE * (GRID_WIDTH - 2), y: TILE_SIZE * 2 },
            { x: TILE_SIZE * 2, y: TILE_SIZE * (GRID_HEIGHT - 2) },
            { x: TILE_SIZE * (GRID_WIDTH - 2), y: TILE_SIZE * (GRID_HEIGHT - 2) }
        ];

        // Find nearest corner
        const myPos = this.getPosition();
        let nearestCorner = corners[0];
        let minDist = Infinity;

        corners.forEach(corner => {
            const dist = maze.getDistance(myPos.x, myPos.y, corner.x, corner.y);
            if (dist < minDist) {
                minDist = dist;
                nearestCorner = corner;
            }
        });

        const direction = maze.getDirectionToward(myPos.x, myPos.y, nearestCorner.x, nearestCorner.y);

        if (direction !== Direction.NONE && this.canMove(direction, maze)) {
            this.direction = direction;
        }
    }

    chooseRandomDirection(maze) {
        const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
        const validDirections = directions.filter(dir => this.canMove(dir, maze));

        if (validDirections.length > 0) {
            this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
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
        }
    }

    getCurrentSpeed() {
        let currentSpeed = this.speed;

        // Stampede ability for Triceratops
        if (this.type === DinosaurType.TRICERATOPS && this.abilityActive) {
            currentSpeed *= this.config.speedBoost;
        }

        return currentSpeed;
    }

    canUseAbility() {
        return !this.abilityActive && this.abilityCooldownTimer <= 0;
    }

    activateAbility(player, maze) {
        if (!this.canUseAbility()) {
            return false;
        }

        this.abilityActive = true;
        this.abilityCooldownTimer = this.config.abilityCooldown;
        this.abilityDurationTimer = this.config.abilityDuration || 0;

        // Type-specific ability effects
        switch (this.type) {
            case DinosaurType.RAPTOR:
                audioSystem.playSound('raptorPounce');
                this.executeRaptorPounce(maze);
                break;
            case DinosaurType.PTERODACTYL:
                audioSystem.playSound('pterodactylSonar');
                this.executePterodactylSonar(player);
                break;
            case DinosaurType.TRICERATOPS:
                audioSystem.playSound('triceratopsCharge');
                // Stampede is passive (speed boost during abilityActive)
                break;
            case DinosaurType.TREX:
                audioSystem.playSound('trexRoar');
                this.executeTRexRoar(player);
                break;
        }

        return true;
    }

    executeRaptorPounce(maze) {
        // Dash forward 3 tiles
        const vector = DirectionVector[this.direction] || DirectionVector[Direction.RIGHT];
        const dashDistance = this.config.abilityRange * TILE_SIZE;

        const targetX = this.x + vector.x * dashDistance;
        const targetY = this.y + vector.y * dashDistance;

        // Check if target position is valid
        if (maze.canMoveTo(targetX, targetY, this.size)) {
            this.x = targetX;
            this.y = targetY;
        } else {
            // Move as far as possible
            let checkDistance = dashDistance;
            while (checkDistance > TILE_SIZE && !maze.canMoveTo(this.x + vector.x * checkDistance, this.y + vector.y * checkDistance, this.size)) {
                checkDistance -= TILE_SIZE;
            }
            this.x += vector.x * checkDistance;
            this.y += vector.y * checkDistance;
        }

        // Pounce is instant
        this.abilityActive = false;
    }

    executePterodactylSonar(player) {
        // Sonar is passive (reveals player position)
        // Duration handled by timer
    }

    executeTRexRoar(player) {
        // Check if player is in range
        const distance = this.getDistanceToPlayer(player);
        const range = this.config.abilityRange * TILE_SIZE;

        if (distance <= range && !player.isInvincible) {
            // Effect applied through game state
            return true;
        }

        return false;
    }

    deactivateAbility() {
        this.abilityActive = false;
        this.abilityDurationTimer = 0;
    }

    freeze(duration) {
        this.isFrozen = true;
        this.freezeTimer = duration;
    }

    setActive(isActive) {
        this.isActive = isActive;
    }

    getDistanceToPlayer(player) {
        const playerPos = player.getPosition();
        const myPos = this.getPosition();

        return Math.sqrt(
            Math.pow(playerPos.x - myPos.x, 2) +
            Math.pow(playerPos.y - myPos.y, 2)
        );
    }

    checkCollisionWithPlayer(player) {
        if (player.isInvincible || this.isFrozen) {
            return false;
        }

        const playerBounds = player.getBounds();

        return (
            this.x < playerBounds.x + playerBounds.width &&
            this.x + this.size > playerBounds.x &&
            this.y < playerBounds.y + playerBounds.height &&
            this.y + this.size > playerBounds.y
        );
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;

        if (this.animationTimer >= ANIMATION_CONFIG.DINOSAUR_MOVE.speed) {
            this.animationFrame = (this.animationFrame + 1) % ANIMATION_CONFIG.DINOSAUR_MOVE.frames;
            this.animationTimer = 0;
        }
    }

    reset(x, y) {
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.direction = Direction.NONE;
        this.isFrozen = false;
        this.freezeTimer = 0;
        this.abilityActive = false;
        this.abilityCooldownTimer = 0;
    }

    levelUp(newLevel) {
        this.level = newLevel;
        this.speed = this.calculateSpeed(newLevel);
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

    getStatusText() {
        if (this.isFrozen) {
            return 'Frozen';
        } else if (this.abilityActive) {
            return 'Ability Active';
        } else if (this.abilityCooldownTimer > 0) {
            return `Cooldown: ${Math.ceil(this.abilityCooldownTimer / 1000)}s`;
        }
        return 'Ready';
    }
}

// Dinosaur Manager for Player 2
class DinosaurManager {
    constructor(level = 1) {
        this.dinosaurs = [];
        this.activeDinosaur = null;
        this.level = level;
    }

    createDinosaurs(spawns, level) {
        this.dinosaurs = [];
        const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.default;

        config.dinosaurTypes.forEach((type, index) => {
            if (spawns[index]) {
                const dinosaur = new Dinosaur(type, spawns[index].x, spawns[index].y, level);
                this.dinosaurs.push(dinosaur);
            }
        });

        // Set first dinosaur as active
        if (this.dinosaurs.length > 0) {
            this.setActiveDinosaur(this.dinosaurs[0]);
        }
    }

    setActiveDinosaur(dinosaur) {
        // Deactivate all
        this.dinosaurs.forEach(d => d.setActive(false));

        // Activate selected
        this.activeDinosaur = dinosaur;
        dinosaur.setActive(true);

        // Update UI
        this.updateUI();
    }

    switchDinosaur(type) {
        const dinosaur = this.dinosaurs.find(d => d.type === type);
        if (dinosaur) {
            this.setActiveDinosaur(dinosaur);
        }
    }

    cycleDinosaur() {
        if (this.dinosaurs.length === 0) return;

        const currentIndex = this.dinosaurs.indexOf(this.activeDinosaur);
        const nextIndex = (currentIndex + 1) % this.dinosaurs.length;
        this.setActiveDinosaur(this.dinosaurs[nextIndex]);
    }

    update(deltaTime, input, player, maze) {
        this.dinosaurs.forEach(dinosaur => {
            const dinoInput = dinosaur === this.activeDinosaur ? input : null;
            const otherDinosaurs = this.dinosaurs.filter(d => d !== dinosaur);

            dinosaur.update(deltaTime, dinoInput, player, maze, otherDinosaurs);
        });

        // Update ability cooldown UI
        this.updateAbilityCooldownUI();
    }

    checkCollisions(player) {
        for (const dinosaur of this.dinosaurs) {
            if (dinosaur.checkCollisionWithPlayer(player)) {
                return true;
            }
        }
        return false;
    }

    updateUI() {
        if (this.activeDinosaur) {
            document.getElementById('active-dino-display').textContent = this.activeDinosaur.config.name;
            document.getElementById('active-dino-display').className = `dino-display ${this.activeDinosaur.type}`;
        }

        // Update status for each dinosaur
        this.dinosaurs.forEach(dinosaur => {
            const statusElement = document.getElementById(`${dinosaur.type}-status`);
            if (statusElement) {
                const stateSpan = statusElement.querySelector('.dino-state');
                if (stateSpan) {
                    stateSpan.textContent = dinosaur.getStatusText();
                }

                // Highlight active
                if (dinosaur === this.activeDinosaur) {
                    statusElement.classList.add('active');
                } else {
                    statusElement.classList.remove('active');
                }
            }
        });
    }

    updateAbilityCooldownUI() {
        if (!this.activeDinosaur) return;

        const cooldownBar = document.getElementById('ability-cooldown-fill');
        const cooldownProgress = this.activeDinosaur.abilityCooldownTimer > 0
            ? (this.activeDinosaur.abilityCooldownTimer / this.activeDinosaur.config.abilityCooldown)
            : 0;

        cooldownBar.style.width = `${(1 - cooldownProgress) * 100}%`;

        if (cooldownProgress === 0) {
            cooldownBar.style.backgroundColor = '#4CAF50'; // Ready (green)
        } else {
            cooldownBar.style.backgroundColor = '#FF9800'; // Cooldown (orange)
        }
    }

    reset(spawns) {
        this.dinosaurs.forEach((dinosaur, index) => {
            if (spawns[index]) {
                dinosaur.reset(spawns[index].x, spawns[index].y);
            }
        });
    }

    levelUp(newLevel) {
        this.level = newLevel;
        this.dinosaurs.forEach(dinosaur => dinosaur.levelUp(newLevel));
    }

    getDinosaurs() {
        return this.dinosaurs;
    }
}
