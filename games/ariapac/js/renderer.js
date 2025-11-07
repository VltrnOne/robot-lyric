/**
 * AriaPac - Renderer
 * Handles all canvas rendering and visual effects
 */

class Renderer {
    constructor() {
        this.bgCanvas = document.getElementById('bg-layer');
        this.entityCanvas = document.getElementById('entity-layer');
        this.uiCanvas = document.getElementById('ui-layer');

        this.bgCtx = this.bgCanvas.getContext('2d');
        this.entityCtx = this.entityCanvas.getContext('2d');
        this.uiCtx = this.uiCanvas.getContext('2d');

        this.bgDirty = true;
        this.uiDirty = true;

        this.animationTime = 0;

        this.initCanvases();
    }

    initCanvases() {
        // Set canvas dimensions
        [this.bgCanvas, this.entityCanvas, this.uiCanvas].forEach(canvas => {
            canvas.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
        });

        // Enable image smoothing for better appearance
        [this.bgCtx, this.entityCtx, this.uiCtx].forEach(ctx => {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        });
    }

    render(gameState, deltaTime) {
        this.animationTime += deltaTime;

        // Render background (maze) - only when dirty
        if (this.bgDirty) {
            this.renderBackground(gameState.maze);
            this.bgDirty = false;
        }

        // Clear entity layer
        this.entityCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Render pellets (with animation)
        this.renderPellets(gameState.maze);

        // Render player
        if (gameState.player) {
            this.renderPlayer(gameState.player);
        }

        // Render dinosaurs
        if (gameState.dinosaurs) {
            gameState.dinosaurs.forEach(dino => this.renderDinosaur(dino));
        }

        // Render power-ups
        if (gameState.powerups) {
            gameState.powerups.forEach(powerup => this.renderPowerup(powerup));
        }

        // Render effects
        if (gameState.effects) {
            gameState.effects.forEach(effect => this.renderEffect(effect));
        }

        // Debug rendering
        if (DEBUG.ENABLED) {
            this.renderDebug(gameState);
        }
    }

    renderBackground(maze) {
        this.bgCtx.fillStyle = COLORS.BACKGROUND;
        this.bgCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Render maze walls
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const tile = maze[y][x];

                if (tile === TileType.WALL) {
                    this.renderWall(x, y);
                }
            }
        }
    }

    renderWall(gridX, gridY) {
        const x = gridX * TILE_SIZE;
        const y = gridY * TILE_SIZE;

        // Main wall color
        this.bgCtx.fillStyle = COLORS.WALL;
        this.bgCtx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        // Border for depth
        this.bgCtx.strokeStyle = COLORS.WALL_BORDER;
        this.bgCtx.lineWidth = 2;
        this.bgCtx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);

        // Inner highlight for 3D effect
        this.bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.bgCtx.lineWidth = 1;
        this.bgCtx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }

    renderPellets(maze) {
        const pulsePhase = (this.animationTime % 1000) / 1000; // 0 to 1

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                const tile = maze[y][x];
                const centerX = x * TILE_SIZE + TILE_SIZE / 2;
                const centerY = y * TILE_SIZE + TILE_SIZE / 2;

                if (tile === TileType.PELLET) {
                    this.renderPellet(centerX, centerY);
                } else if (tile === TileType.POWER_PELLET) {
                    this.renderPowerPellet(centerX, centerY, pulsePhase);
                }
            }
        }
    }

    renderPellet(x, y) {
        this.entityCtx.fillStyle = COLORS.PELLET;
        this.entityCtx.beginPath();
        this.entityCtx.arc(x, y, 3, 0, Math.PI * 2);
        this.entityCtx.fill();
    }

    renderPowerPellet(x, y, pulsePhase) {
        const baseRadius = 8;
        const pulseAmount = 2;
        const radius = baseRadius + Math.sin(pulsePhase * Math.PI * 2) * pulseAmount;

        // Glow effect
        const gradient = this.entityCtx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, COLORS.POWER_PELLET);
        gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');

        this.entityCtx.fillStyle = gradient;
        this.entityCtx.beginPath();
        this.entityCtx.arc(x, y, radius * 2, 0, Math.PI * 2);
        this.entityCtx.fill();

        // Solid center
        this.entityCtx.fillStyle = COLORS.POWER_PELLET;
        this.entityCtx.beginPath();
        this.entityCtx.arc(x, y, radius, 0, Math.PI * 2);
        this.entityCtx.fill();
    }

    renderPlayer(player) {
        const ctx = this.entityCtx;

        // Sprint trail effect
        if (player.isSprinting && player.stamina > 0) {
            ctx.fillStyle = COLORS.SPRINT_TRAIL;
            ctx.beginPath();
            ctx.arc(player.x + player.size / 2, player.y + player.size / 2, player.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Player body
        ctx.fillStyle = COLORS.PLAYER;
        ctx.beginPath();
        ctx.arc(player.x + player.size / 2, player.y + player.size / 2, player.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Player accent (hat indicator)
        ctx.fillStyle = COLORS.PLAYER_ACCENT;
        ctx.fillRect(player.x + player.size / 3, player.y + 2, player.size / 3, 6);

        // Direction indicator
        this.renderDirectionIndicator(player);

        // Invincibility effect
        if (player.isInvincible) {
            const blinkPhase = Math.floor(this.animationTime / 100) % 2;
            if (blinkPhase === 0) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(player.x + player.size / 2, player.y + player.size / 2, player.size / 2 + 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    renderDirectionIndicator(entity) {
        const ctx = this.entityCtx;
        const centerX = entity.x + entity.size / 2;
        const centerY = entity.y + entity.size / 2;
        const indicatorSize = 4;

        ctx.fillStyle = '#ffffff';

        switch (entity.direction) {
            case Direction.UP:
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - entity.size / 2 - 2);
                ctx.lineTo(centerX - indicatorSize, centerY - entity.size / 2 + indicatorSize);
                ctx.lineTo(centerX + indicatorSize, centerY - entity.size / 2 + indicatorSize);
                ctx.fill();
                break;
            case Direction.DOWN:
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + entity.size / 2 + 2);
                ctx.lineTo(centerX - indicatorSize, centerY + entity.size / 2 - indicatorSize);
                ctx.lineTo(centerX + indicatorSize, centerY + entity.size / 2 - indicatorSize);
                ctx.fill();
                break;
            case Direction.LEFT:
                ctx.beginPath();
                ctx.moveTo(centerX - entity.size / 2 - 2, centerY);
                ctx.lineTo(centerX - entity.size / 2 + indicatorSize, centerY - indicatorSize);
                ctx.lineTo(centerX - entity.size / 2 + indicatorSize, centerY + indicatorSize);
                ctx.fill();
                break;
            case Direction.RIGHT:
                ctx.beginPath();
                ctx.moveTo(centerX + entity.size / 2 + 2, centerY);
                ctx.lineTo(centerX + entity.size / 2 - indicatorSize, centerY - indicatorSize);
                ctx.lineTo(centerX + entity.size / 2 - indicatorSize, centerY + indicatorSize);
                ctx.fill();
                break;
        }
    }

    renderDinosaur(dinosaur) {
        const ctx = this.entityCtx;
        const config = DINOSAUR_CONFIG[dinosaur.type];

        // Frozen effect
        if (dinosaur.isFrozen) {
            ctx.fillStyle = COLORS.FREEZE;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(dinosaur.x + dinosaur.size / 2, dinosaur.y + dinosaur.size / 2, dinosaur.size / 2 + 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Dinosaur body
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(dinosaur.x + dinosaur.size / 2, dinosaur.y + dinosaur.size / 2, dinosaur.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Type-specific features
        this.renderDinosaurFeatures(dinosaur, config);

        // Active indicator (if player-controlled)
        if (dinosaur.isActive) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(dinosaur.x + dinosaur.size / 2, dinosaur.y + dinosaur.size / 2, dinosaur.size / 2 + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Direction indicator
        this.renderDirectionIndicator(dinosaur);

        // Ability active effect
        if (dinosaur.abilityActive) {
            this.renderAbilityEffect(dinosaur, config);
        }
    }

    renderDinosaurFeatures(dinosaur, config) {
        const ctx = this.entityCtx;
        const centerX = dinosaur.x + dinosaur.size / 2;
        const centerY = dinosaur.y + dinosaur.size / 2;

        // Simple visual distinction
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

        switch (dinosaur.type) {
            case DinosaurType.RAPTOR:
                // Small spikes
                ctx.fillRect(centerX - 2, centerY - dinosaur.size / 2, 4, 6);
                break;
            case DinosaurType.PTERODACTYL:
                // Wings
                ctx.fillRect(centerX - dinosaur.size / 2 - 4, centerY, 4, 8);
                ctx.fillRect(centerX + dinosaur.size / 2, centerY, 4, 8);
                break;
            case DinosaurType.TRICERATOPS:
                // Horns
                ctx.fillRect(centerX - 6, centerY - dinosaur.size / 2 - 2, 3, 6);
                ctx.fillRect(centerX + 3, centerY - dinosaur.size / 2 - 2, 3, 6);
                break;
            case DinosaurType.TREX:
                // Crown-like top
                ctx.fillRect(centerX - 4, centerY - dinosaur.size / 2 - 2, 8, 4);
                break;
        }
    }

    renderAbilityEffect(dinosaur, config) {
        const ctx = this.entityCtx;
        const centerX = dinosaur.x + dinosaur.size / 2;
        const centerY = dinosaur.y + dinosaur.size / 2;

        switch (dinosaur.type) {
            case DinosaurType.PTERODACTYL:
                // Sonar pulse rings
                const pulsePhase = (this.animationTime % 500) / 500;
                ctx.strokeStyle = COLORS.SONAR_PULSE;
                ctx.lineWidth = 2;
                for (let i = 0; i < 3; i++) {
                    const radius = (pulsePhase + i * 0.33) * config.abilityRange * TILE_SIZE;
                    ctx.globalAlpha = 1 - (pulsePhase + i * 0.33);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                break;

            case DinosaurType.TREX:
                // Roar waves
                const roarPhase = (this.animationTime % 300) / 300;
                ctx.strokeStyle = 'rgba(255, 140, 0, 0.6)';
                ctx.lineWidth = 3;
                ctx.globalAlpha = 1 - roarPhase;
                ctx.beginPath();
                ctx.arc(centerX, centerY, roarPhase * config.abilityRange * TILE_SIZE, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
                break;
        }
    }

    renderPowerup(powerup) {
        const ctx = this.entityCtx;
        const pulsePhase = (this.animationTime % 800) / 800;
        const scale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.2;

        ctx.save();
        ctx.translate(powerup.x, powerup.y);
        ctx.scale(scale, scale);

        // Powerup icon (simple colored square for now)
        ctx.fillStyle = powerup.color || '#ffffff';
        ctx.fillRect(-8, -8, 16, 16);

        ctx.restore();
    }

    renderEffect(effect) {
        const ctx = this.entityCtx;

        switch (effect.type) {
            case 'freeze':
                this.renderFreezeEffect(effect);
                break;
            case 'score_popup':
                this.renderScorePopup(effect);
                break;
            case 'particle':
                this.renderParticle(effect);
                break;
        }
    }

    renderFreezeEffect(effect) {
        const ctx = this.entityCtx;
        const progress = effect.progress; // 0 to 1

        ctx.globalAlpha = 1 - progress;
        ctx.fillStyle = COLORS.FREEZE;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 20 * (1 + progress), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    renderScorePopup(effect) {
        const ctx = this.entityCtx;
        const progress = effect.progress;

        ctx.save();
        ctx.globalAlpha = 1 - progress;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = COLORS.SCORE;
        ctx.textAlign = 'center';
        ctx.fillText(`+${effect.score}`, effect.x, effect.y - progress * 30);
        ctx.restore();
    }

    renderParticle(effect) {
        const ctx = this.entityCtx;
        ctx.fillStyle = effect.color;
        ctx.globalAlpha = 1 - effect.progress;
        ctx.fillRect(effect.x - 2, effect.y - 2, 4, 4);
        ctx.globalAlpha = 1;
    }

    renderDebug(gameState) {
        const ctx = this.uiCtx;

        if (DEBUG.SHOW_GRID) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;

            for (let x = 0; x <= GRID_WIDTH; x++) {
                ctx.beginPath();
                ctx.moveTo(x * TILE_SIZE, 0);
                ctx.lineTo(x * TILE_SIZE, CANVAS_HEIGHT);
                ctx.stroke();
            }

            for (let y = 0; y <= GRID_HEIGHT; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * TILE_SIZE);
                ctx.lineTo(CANVAS_WIDTH, y * TILE_SIZE);
                ctx.stroke();
            }
        }

        if (DEBUG.SHOW_COLLISION_BOXES && gameState.player) {
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(gameState.player.x, gameState.player.y, gameState.player.size, gameState.player.size);

            if (gameState.dinosaurs) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                gameState.dinosaurs.forEach(dino => {
                    ctx.strokeRect(dino.x, dino.y, dino.size, dino.size);
                });
            }
        }

        if (DEBUG.SHOW_FPS) {
            ctx.font = '14px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`FPS: ${gameState.fps || 0}`, 10, 20);
        }
    }

    markBackgroundDirty() {
        this.bgDirty = true;
    }

    clear() {
        this.bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.entityCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.uiCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    resize() {
        // Handle responsive canvas resizing
        const container = document.getElementById('game-container');
        const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

        let width = container.clientWidth;
        let height = width / aspectRatio;

        if (height > container.clientHeight) {
            height = container.clientHeight;
            width = height * aspectRatio;
        }

        [this.bgCanvas, this.entityCanvas, this.uiCanvas].forEach(canvas => {
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        });

        this.bgDirty = true;
    }
}
