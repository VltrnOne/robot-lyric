/**
 * AriaPac - Main Game Engine
 * Core game loop, state management, and coordination
 */

class AriaPacGame {
    constructor() {
        this.state = GameState.LOADING;
        this.previousState = null;

        this.level = 1;
        this.score = 0;
        this.highScore = this.loadHighScore();

        this.maze = null;
        this.player = null;
        this.dinosaurManager = null;
        this.powerupManager = null;
        this.inputHandler = null;
        this.renderer = null;

        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.fpsCounter = 0;
        this.fpsTimer = 0;

        this.sprintBoostSpawnTimer = 0;
        this.gameStartTime = 0;
        this.levelStartTime = 0;

        this.roarEffect = {
            active: false,
            duration: 0
        };

        this.init();
    }

    init() {
        console.log('Initializing AriaPac...');

        // Create core systems
        this.inputHandler = new InputHandler();
        this.renderer = new Renderer();
        this.powerupManager = new PowerupManager();

        // Initialize mobile handler
        this.mobileHandler = initMobileHandler(this.inputHandler);

        // Setup UI event listeners
        this.setupUIEvents();
        this.setupAudioControls();

        // Load game state
        this.loadGameState();

        // Resize canvas
        window.addEventListener('resize', () => this.renderer.resize());
        this.renderer.resize();

        // Change to menu state
        this.changeState(GameState.MENU);

        console.log('AriaPac initialized!');
    }

    setupUIEvents() {
        // Menu buttons
        document.getElementById('start-game-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.startGame();
        });
        document.getElementById('instructions-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.showInstructions();
        });
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.changeState(GameState.MENU);
        });

        // Pause menu
        document.getElementById('resume-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.resume();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.restartLevel();
        });
        document.getElementById('quit-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.quitToMenu();
        });

        // Level complete
        document.getElementById('next-level-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.nextLevel();
        });

        // Game over
        document.getElementById('play-again-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.startGame();
        });
        document.getElementById('menu-btn').addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            this.changeState(GameState.MENU);
        });

        // System buttons
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('mute-btn').addEventListener('click', () => this.toggleMute());

        // Add hover sounds to all buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                audioSystem.playSound('menuHover', { cooldown: 100 });
            });
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.key === KEYS.SYSTEM.PAUSE && this.state === GameState.PLAYING) {
                this.pause();
            } else if (e.key === KEYS.SYSTEM.PAUSE && this.state === GameState.PAUSED) {
                this.resume();
            }
        });
    }

    setupAudioControls() {
        // Audio settings panel
        const audioSettingsBtn = document.getElementById('audio-settings-btn');
        const audioSettingsPanel = document.getElementById('audio-settings-panel');
        const closeAudioSettings = document.getElementById('close-audio-settings');

        audioSettingsBtn.addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            audioSettingsPanel.classList.toggle('hidden');
        });

        closeAudioSettings.addEventListener('click', () => {
            audioSystem.playSound('menuClick');
            audioSettingsPanel.classList.add('hidden');
        });

        // Volume sliders
        const masterVolume = document.getElementById('master-volume');
        const musicVolume = document.getElementById('music-volume');
        const sfxVolume = document.getElementById('sfx-volume');

        // Load saved values
        masterVolume.value = audioSystem.volumes.master * 100;
        musicVolume.value = audioSystem.volumes.music * 100;
        sfxVolume.value = audioSystem.volumes.sfx * 100;

        document.getElementById('master-volume-value').textContent = Math.round(masterVolume.value) + '%';
        document.getElementById('music-volume-value').textContent = Math.round(musicVolume.value) + '%';
        document.getElementById('sfx-volume-value').textContent = Math.round(sfxVolume.value) + '%';

        // Master volume
        masterVolume.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            audioSystem.setVolume('master', value);
            document.getElementById('master-volume-value').textContent = Math.round(e.target.value) + '%';
        });

        // Music volume
        musicVolume.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            audioSystem.setVolume('music', value);
            document.getElementById('music-volume-value').textContent = Math.round(e.target.value) + '%';
        });

        // SFX volume
        sfxVolume.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            audioSystem.setVolume('sfx', value);
            document.getElementById('sfx-volume-value').textContent = Math.round(e.target.value) + '%';
            // Play test sound
            audioSystem.playSound('menuClick');
        });
    }

    changeState(newState) {
        console.log(`State change: ${this.state} -> ${newState}`);

        this.previousState = this.state;
        this.state = newState;

        // Hide all overlays
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });

        // Get player HUD element
        const playerHud = document.getElementById('player-hud');

        // Show appropriate overlay and manage HUD visibility
        switch (newState) {
            case GameState.MENU:
                document.getElementById('menu-overlay').classList.add('active');
                audioSystem.stopBackgroundMusic();
                if (this.mobileHandler) this.mobileHandler.hideControls();
                if (playerHud) playerHud.classList.remove('visible'); // Hide HUD in menu
                break;
            case GameState.INSTRUCTIONS:
                document.getElementById('instructions-overlay').classList.add('active');
                if (this.mobileHandler) this.mobileHandler.hideControls();
                if (playerHud) playerHud.classList.remove('visible'); // Hide HUD in instructions
                break;
            case GameState.PLAYING:
                this.startGameLoop();
                audioSystem.startBackgroundMusic();
                if (this.mobileHandler) this.mobileHandler.showControls();
                if (playerHud) playerHud.classList.add('visible'); // Show HUD when playing
                break;
            case GameState.PAUSED:
                document.getElementById('pause-overlay').classList.add('active');
                if (playerHud) playerHud.classList.add('visible'); // Keep HUD visible when paused
                break;
            case GameState.LEVEL_COMPLETE:
                this.handleLevelComplete();
                if (playerHud) playerHud.classList.add('visible'); // Keep HUD visible for level complete
                break;
            case GameState.GAME_OVER:
                this.handleGameOver();
                if (this.mobileHandler) this.mobileHandler.hideControls();
                if (playerHud) playerHud.classList.remove('visible'); // Hide HUD in game over
                break;
        }
    }

    startGame() {
        this.level = 1;
        this.score = 0;
        this.gameStartTime = Date.now();

        // Initialize audio on first user interaction
        audioSystem.init();

        this.initLevel(this.level);
        this.changeState(GameState.PLAYING);
    }

    initLevel(level) {
        console.log(`Initializing level ${level}...`);

        this.level = level;
        this.levelStartTime = Date.now();

        // Create maze
        this.maze = new Maze();

        // Create player
        this.player = new SafariExplorer(this.maze.playerSpawn.x, this.maze.playerSpawn.y, level);
        this.player.score = this.score;

        // Create dinosaurs
        this.dinosaurManager = new DinosaurManager(level);
        this.dinosaurManager.createDinosaurs(this.maze.enemySpawns, level);

        // Reset powerup manager
        this.powerupManager.reset();

        // Reset timers
        this.sprintBoostSpawnTimer = POWERUP_CONFIG.SPRINT_BOOST.spawnInterval;

        // Update UI
        this.updateUI();

        // Mark background dirty
        this.renderer.markBackgroundDirty();

        console.log(`Level ${level} initialized!`);
    }

    startGameLoop() {
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    gameLoop() {
        // Calculate delta time
        const currentTime = performance.now();
        this.deltaTime = Math.min(currentTime - this.lastFrameTime, PERFORMANCE.MAX_DELTA_TIME);
        this.lastFrameTime = currentTime;

        // Update FPS counter
        this.updateFPS(this.deltaTime);

        // Only update game if playing
        if (this.state === GameState.PLAYING) {
            this.update(this.deltaTime);
            this.render();
        }

        // Continue loop if not in menu or game over
        if (this.state !== GameState.MENU && this.state !== GameState.GAME_OVER) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update(deltaTime) {
        // Get input
        const player1Input = this.inputHandler.getPlayer1Input();
        const player2Input = this.inputHandler.getPlayer2Input();

        // Handle dinosaur switching
        if (player2Input.switchDinosaur) {
            if (player2Input.switchDinosaur === 'cycle') {
                this.dinosaurManager.cycleDinosaur();
            } else {
                this.dinosaurManager.switchDinosaur(player2Input.switchDinosaur);
            }
        }

        // Update player
        this.player.update(deltaTime, player1Input, this.maze, this.powerupManager);

        // Handle freeze activation
        if (player1Input.freezeActivated) {
            const success = this.powerupManager.useFreeze(
                player1Input.freezeActivated,
                this.dinosaurManager.getDinosaurs()
            );

            if (success) {
                audioSystem.playSound('freezeActivate');
                this.score += SCORE.FREEZE_DINOSAUR;
                this.player.score = this.score;
                this.powerupManager.createScorePopup(
                    this.player.x + this.player.size / 2,
                    this.player.y,
                    SCORE.FREEZE_DINOSAUR
                );
            }
        }

        // Update dinosaurs
        this.dinosaurManager.update(deltaTime, player2Input, this.player, this.maze);

        // Update powerup manager
        this.powerupManager.update(deltaTime, this.getGameState());

        // Update roar effect
        if (this.roarEffect.active) {
            this.roarEffect.duration -= deltaTime;
            if (this.roarEffect.duration <= 0) {
                this.roarEffect.active = false;
            }
        }

        // Check collisions
        this.checkCollisions();

        // Check pellet collection
        this.checkPelletCollection();

        // Check powerup collection
        this.checkPowerupCollection();

        // Update spawn timers
        this.updateSpawnTimers(deltaTime);

        // Check win/loss conditions
        this.checkWinLossConditions();

        // Update UI
        this.updateUI();

        // Clear frame-specific inputs
        this.inputHandler.clearFrameInputs();
    }

    checkCollisions() {
        // Player-Dinosaur collision
        if (this.dinosaurManager.checkCollisions(this.player)) {
            this.handlePlayerHit();
        }
    }

    checkPelletCollection() {
        const pelletData = this.maze.collectPellet(this.player.x, this.player.y);

        if (pelletData) {
            const shouldSpawnLife = this.player.collectPellet(pelletData, this.powerupManager);
            this.score = this.player.score;

            // Play collection sound with spatial audio
            if (pelletData.type === 'power_pellet') {
                audioSystem.playSound('powerPellet', {
                    x: this.player.x,
                    playerX: this.player.x
                });
            } else {
                audioSystem.playSound('pellet', {
                    x: this.player.x,
                    playerX: this.player.x
                });
            }

            // Create score popup
            this.powerupManager.createScorePopup(
                this.player.x + this.player.size / 2,
                this.player.y,
                pelletData.score
            );

            // Handle power pellet
            if (pelletData.type === 'power_pellet') {
                this.powerupManager.handlePowerPelletCollection(
                    this.player.x + this.player.size / 2,
                    this.player.y + this.player.size / 2
                );
            }

            // Spawn extra life if needed
            if (shouldSpawnLife) {
                this.powerupManager.spawnExtraLife(this.maze);
            }
        }
    }

    checkPowerupCollection() {
        const collected = this.powerupManager.checkPowerupCollection(this.player, this.maze);

        if (collected) {
            collected.forEach(powerup => {
                if (powerup.type === 'extra_life') {
                    audioSystem.playSound('extraLife');
                    this.player.addLife();
                } else if (powerup.type === 'sprint_boost') {
                    audioSystem.playSound('sprintBoost');
                }
            });
        }
    }

    updateSpawnTimers(deltaTime) {
        // Sprint boost spawn timer
        this.sprintBoostSpawnTimer -= deltaTime;
        if (this.sprintBoostSpawnTimer <= 0) {
            this.powerupManager.spawnSprintBoost(this.maze);
            this.sprintBoostSpawnTimer = POWERUP_CONFIG.SPRINT_BOOST.spawnInterval;
        }
    }

    checkWinLossConditions() {
        // Player loses all lives
        if (this.player.isDead()) {
            this.changeState(GameState.GAME_OVER);
            return;
        }

        // Player collected all pellets
        if (this.maze.pelletCount <= 0) {
            this.changeState(GameState.LEVEL_COMPLETE);
            return;
        }
    }

    handlePlayerHit() {
        const wasHit = this.player.hit();

        if (wasHit) {
            audioSystem.playSound('playerHit');
            console.log('Player hit! Lives remaining:', this.player.lives);

            if (!this.player.isDead()) {
                // Reset positions
                this.player.reset(this.maze.playerSpawn.x, this.maze.playerSpawn.y);
                this.dinosaurManager.reset(this.maze.enemySpawns);
            }
        }
    }

    handleLevelComplete() {
        audioSystem.playSound('levelComplete');
        audioSystem.stopBackgroundMusic();

        const levelTime = (Date.now() - this.levelStartTime) / 1000; // seconds
        const timeBonus = Math.floor((60 - Math.min(levelTime, 60)) * SCORE.TIME_BONUS_MULTIPLIER);

        this.score += SCORE.LEVEL_COMPLETE + timeBonus;

        // Update UI
        document.getElementById('time-stat').textContent = this.formatTime(levelTime);
        document.getElementById('pellets-stat').textContent = '0/0'; // All collected
        document.getElementById('bonus-stat').textContent = timeBonus;

        document.getElementById('level-complete-overlay').classList.add('active');

        // Check high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    handleGameOver() {
        audioSystem.playSound('gameOver');
        audioSystem.stopBackgroundMusic();

        const winner = this.player.isDead() ? 'Dinosaurs Win!' : 'Safari Explorer Wins!';
        const levelsCompleted = this.level - 1;

        document.getElementById('winner-text').textContent = winner;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('levels-completed').textContent = levelsCompleted;

        document.getElementById('game-over-overlay').classList.add('active');

        // Check high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    nextLevel() {
        this.level++;
        this.score = this.player.score;
        this.initLevel(this.level);
        this.changeState(GameState.PLAYING);
    }

    render() {
        const gameState = this.getGameState();
        this.renderer.render(gameState, this.deltaTime);
    }

    getGameState() {
        return {
            maze: this.maze ? this.maze.grid : [],
            player: this.player,
            dinosaurs: this.dinosaurManager ? this.dinosaurManager.getDinosaurs() : [],
            powerups: this.powerupManager ? this.powerupManager.getActivePowerups() : [],
            effects: this.powerupManager ? this.powerupManager.getEffects() : [],
            fps: this.fps,
            level: this.level,
            score: this.score
        };
    }

    updateUI() {
        document.getElementById('level-display').textContent = this.level;
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('high-score-display').textContent = this.highScore;
        document.getElementById('lives-display').textContent = this.player ? this.player.lives : 0;
    }

    updateFPS(deltaTime) {
        this.fpsCounter++;
        this.fpsTimer += deltaTime;

        if (this.fpsTimer >= 1000) {
            this.fps = Math.round(this.fpsCounter * 1000 / this.fpsTimer);
            this.fpsCounter = 0;
            this.fpsTimer = 0;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    pause() {
        if (this.state === GameState.PLAYING) {
            this.changeState(GameState.PAUSED);
        }
    }

    resume() {
        if (this.state === GameState.PAUSED) {
            this.changeState(GameState.PLAYING);
        }
    }

    restartLevel() {
        this.score = this.player.score;
        this.initLevel(this.level);
        this.changeState(GameState.PLAYING);
    }

    quitToMenu() {
        this.changeState(GameState.MENU);
    }

    showInstructions() {
        this.changeState(GameState.INSTRUCTIONS);
    }

    toggleFullscreen() {
        const container = document.getElementById('game-container');

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleMute() {
        const isMuted = audioSystem.toggleMute();
        const btn = document.getElementById('mute-btn');
        btn.textContent = isMuted ? '🔇' : '🔊';
    }

    saveHighScore() {
        localStorage.setItem('ariapac_highscore', this.highScore.toString());
    }

    loadHighScore() {
        const saved = localStorage.getItem('ariapac_highscore');
        return saved ? parseInt(saved, 10) : 0;
    }

    saveGameState() {
        const saveData = {
            highScore: this.highScore
        };
        localStorage.setItem('ariapac_save', JSON.stringify(saveData));
    }

    loadGameState() {
        const saved = localStorage.getItem('ariapac_save');
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                this.highScore = saveData.highScore || 0;
            } catch (e) {
                console.error('Failed to load save data:', e);
            }
        }
    }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating game...');
    window.game = new AriaPacGame();
});
