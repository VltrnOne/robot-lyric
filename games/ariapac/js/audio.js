/**
 * AriaPac - Audio System
 * Comprehensive sound engine using Web Audio API
 * All sounds are procedurally generated - no external files needed
 */

class AudioSystem {
    constructor() {
        // Initialize Web Audio API
        this.audioContext = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;

        // Volume settings (0.0 to 1.0)
        this.volumes = {
            master: 0.7,
            music: 0.5,
            sfx: 0.6
        };

        // Mute state
        this.isMuted = false;

        // Music state
        this.backgroundMusic = null;
        this.musicOscillators = [];

        // Active sound effects
        this.activeSounds = [];

        // Sound cooldowns (prevent spam)
        this.soundCooldowns = new Map();

        // Initialize audio context on first user interaction
        this.initialized = false;
        this.pendingSounds = [];

        // Load saved settings
        this.loadSettings();
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes
            this.masterGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();

            // Connect gain nodes
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);

            // Set initial volumes
            this.updateVolumes();

            this.initialized = true;
            console.log('Audio system initialized!');

            // Play any pending sounds
            this.pendingSounds.forEach(sound => this.playSound(sound.name, sound.options));
            this.pendingSounds = [];

        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    /**
     * Ensure audio context is initialized
     */
    ensureInitialized(soundName, options = {}) {
        if (!this.initialized) {
            this.pendingSounds.push({ name: soundName, options });
            this.init();
            return false;
        }

        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        return true;
    }

    /**
     * Update all volume levels
     */
    updateVolumes() {
        if (!this.initialized) return;

        const masterVol = this.isMuted ? 0 : this.volumes.master;
        this.masterGain.gain.setValueAtTime(masterVol, this.audioContext.currentTime);
        this.musicGain.gain.setValueAtTime(this.volumes.music, this.audioContext.currentTime);
        this.sfxGain.gain.setValueAtTime(this.volumes.sfx, this.audioContext.currentTime);
    }

    /**
     * Set volume for a specific channel
     */
    setVolume(channel, value) {
        this.volumes[channel] = Math.max(0, Math.min(1, value));
        this.updateVolumes();
        this.saveSettings();
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolumes();
        this.saveSettings();
        return this.isMuted;
    }

    /**
     * Check if a sound is on cooldown
     */
    isOnCooldown(soundName, cooldownMs = 50) {
        const lastPlayed = this.soundCooldowns.get(soundName) || 0;
        const now = Date.now();

        if (now - lastPlayed < cooldownMs) {
            return true;
        }

        this.soundCooldowns.set(soundName, now);
        return false;
    }

    /**
     * Main sound play method
     */
    playSound(soundName, options = {}) {
        if (!this.ensureInitialized(soundName, options)) return;
        if (this.isMuted) return;

        // Check cooldown
        const cooldown = options.cooldown || 50;
        if (this.isOnCooldown(soundName, cooldown)) return;

        // Play specific sound
        switch (soundName) {
            case 'pellet':
                this.playPelletSound(options);
                break;
            case 'powerPellet':
                this.playPowerPelletSound(options);
                break;
            case 'freezeCollect':
                this.playFreezeCollectSound(options);
                break;
            case 'freezeActivate':
                this.playFreezeActivateSound(options);
                break;
            case 'sprintBoost':
                this.playSprintBoostSound(options);
                break;
            case 'extraLife':
                this.playExtraLifeSound(options);
                break;
            case 'raptorPounce':
                this.playRaptorPounceSound(options);
                break;
            case 'pterodactylSonar':
                this.playPterodactylSonarSound(options);
                break;
            case 'triceratopsCharge':
                this.playTriceratopsChargeSound(options);
                break;
            case 'trexRoar':
                this.playTRexRoarSound(options);
                break;
            case 'playerHit':
                this.playPlayerHitSound(options);
                break;
            case 'levelComplete':
                this.playLevelCompleteSound(options);
                break;
            case 'gameOver':
                this.playGameOverSound(options);
                break;
            case 'menuClick':
                this.playMenuClickSound(options);
                break;
            case 'menuHover':
                this.playMenuHoverSound(options);
                break;
            default:
                console.warn('Unknown sound:', soundName);
        }
    }

    /**
     * Create a basic oscillator
     */
    createOscillator(frequency, type = 'sine', destination = null) {
        const osc = this.audioContext.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        if (!destination) {
            destination = this.sfxGain;
        }

        return osc;
    }

    /**
     * Create envelope (ADSR)
     */
    createEnvelope(destination, attack, decay, sustain, release, peak = 1.0) {
        const envelope = this.audioContext.createGain();
        envelope.connect(destination);

        const now = this.audioContext.currentTime;
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(peak, now + attack);
        envelope.gain.linearRampToValueAtTime(sustain, now + attack + decay);

        return envelope;
    }

    /**
     * Apply panning based on position (spatial audio)
     */
    createPanner(x, playerX) {
        const panner = this.audioContext.createStereoPanner();

        // Calculate pan (-1 to 1) based on relative position
        const maxDistance = 800; // Screen width approximation
        const distance = x - playerX;
        const pan = Math.max(-1, Math.min(1, distance / maxDistance));

        panner.pan.setValueAtTime(pan, this.audioContext.currentTime);
        return panner;
    }

    // ==================== SOUND EFFECTS ====================

    /**
     * Pellet collection sound (bleep)
     */
    playPelletSound(options = {}) {
        const now = this.audioContext.currentTime;

        const osc = this.createOscillator(800, 'sine');
        const gain = this.audioContext.createGain();

        // Apply spatial audio if position provided
        if (options.x !== undefined && options.playerX !== undefined) {
            const panner = this.createPanner(options.x, options.playerX);
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(this.sfxGain);
        } else {
            osc.connect(gain);
            gain.connect(this.sfxGain);
        }

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    /**
     * Power pellet collection sound (power-up)
     */
    playPowerPelletSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Create three oscillators for a richer sound
        const frequencies = [400, 600, 800];

        frequencies.forEach((freq, index) => {
            const osc = this.createOscillator(freq, 'sine');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            const delay = index * 0.05;
            gain.gain.setValueAtTime(0.2, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);

            osc.start(now + delay);
            osc.stop(now + delay + 0.2);
        });
    }

    /**
     * Freeze power-up collection (chime)
     */
    playFreezeCollectSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Ascending chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
            const osc = this.createOscillator(freq, 'sine');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            const delay = index * 0.08;
            gain.gain.setValueAtTime(0.15, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);

            osc.start(now + delay);
            osc.stop(now + delay + 0.15);
        });
    }

    /**
     * Freeze activation sound (ice sound)
     */
    playFreezeActivateSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Crystalline sound using multiple frequencies
        const baseFreq = 1200;

        for (let i = 0; i < 5; i++) {
            const osc = this.createOscillator(baseFreq + (i * 300), 'sine');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            const delay = i * 0.02;
            gain.gain.setValueAtTime(0.1, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.3);

            osc.start(now + delay);
            osc.stop(now + delay + 0.3);
        }

        // Add white noise for ice crackle
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = this.audioContext.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain);

        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        noise.start(now);
    }

    /**
     * Sprint boost collection
     */
    playSprintBoostSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Upward sweep
        const osc = this.createOscillator(200, 'sawtooth');
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Extra life collection
     */
    playExtraLifeSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Happy ascending melody
        const melody = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6

        melody.forEach((freq, index) => {
            const osc = this.createOscillator(freq, 'square');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            const delay = index * 0.1;
            gain.gain.setValueAtTime(0.12, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);

            osc.start(now + delay);
            osc.stop(now + delay + 0.15);
        });
    }

    /**
     * Raptor pounce sound (quick aggressive sound)
     */
    playRaptorPounceSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Aggressive swoosh + screech
        const osc1 = this.createOscillator(150, 'sawtooth');
        const osc2 = this.createOscillator(450, 'square');

        const gain = this.audioContext.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        // Frequency sweep
        osc1.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
    }

    /**
     * Pterodactyl sonar sound (ping/echo)
     */
    playPterodactylSonarSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Sonar ping
        for (let i = 0; i < 3; i++) {
            const osc = this.createOscillator(1200 - (i * 200), 'sine');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            const delay = i * 0.15;
            gain.gain.setValueAtTime(0.15 - (i * 0.04), now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);

            osc.start(now + delay);
            osc.stop(now + delay + 0.1);
        }
    }

    /**
     * Triceratops charge sound (heavy rumble)
     */
    playTriceratopsChargeSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Low rumbling charge
        const osc1 = this.createOscillator(60, 'sawtooth');
        const osc2 = this.createOscillator(90, 'square');

        const gain = this.audioContext.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        // Build up
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
    }

    /**
     * T-Rex roar sound (deep powerful roar)
     */
    playTRexRoarSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Deep roar with harmonics
        const osc1 = this.createOscillator(80, 'sawtooth');
        const osc2 = this.createOscillator(120, 'square');
        const osc3 = this.createOscillator(240, 'triangle');

        const gain = this.audioContext.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(this.sfxGain);

        // Roar envelope
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        // Frequency modulation for growl effect
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.linearRampToValueAtTime(100, now + 0.2);
        osc1.frequency.linearRampToValueAtTime(70, now + 0.8);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
        osc3.stop(now + 0.8);
    }

    /**
     * Player hit sound (damage)
     */
    playPlayerHitSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Harsh descending sound
        const osc = this.createOscillator(600, 'sawtooth');
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);

        // Add noise for impact
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = this.audioContext.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain);

        noiseGain.gain.setValueAtTime(0.2, now);

        noise.start(now);
    }

    /**
     * Level complete sound (victory fanfare)
     */
    playLevelCompleteSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Victory fanfare
        const melody = [
            { freq: 523.25, time: 0 },    // C5
            { freq: 659.25, time: 0.15 },  // E5
            { freq: 783.99, time: 0.3 },   // G5
            { freq: 1046.50, time: 0.45 }, // C6
            { freq: 783.99, time: 0.6 },   // G5
            { freq: 1046.50, time: 0.75 }  // C6
        ];

        melody.forEach(note => {
            const osc = this.createOscillator(note.freq, 'square');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            gain.gain.setValueAtTime(0.2, now + note.time);
            gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.25);

            osc.start(now + note.time);
            osc.stop(now + note.time + 0.25);
        });
    }

    /**
     * Game over sound (defeat)
     */
    playGameOverSound(options = {}) {
        const now = this.audioContext.currentTime;

        // Descending sad melody
        const melody = [
            { freq: 523.25, time: 0 },    // C5
            { freq: 493.88, time: 0.2 },  // B4
            { freq: 440.00, time: 0.4 },  // A4
            { freq: 392.00, time: 0.6 },  // G4
            { freq: 349.23, time: 0.8 },  // F4
            { freq: 329.63, time: 1.0 }   // E4
        ];

        melody.forEach(note => {
            const osc = this.createOscillator(note.freq, 'sine');
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            gain.gain.setValueAtTime(0.15, now + note.time);
            gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.3);

            osc.start(now + note.time);
            osc.stop(now + note.time + 0.3);
        });
    }

    /**
     * Menu click sound
     */
    playMenuClickSound(options = {}) {
        const now = this.audioContext.currentTime;

        const osc = this.createOscillator(600, 'sine');
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    /**
     * Menu hover sound
     */
    playMenuHoverSound(options = {}) {
        const now = this.audioContext.currentTime;

        const osc = this.createOscillator(400, 'sine');
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // ==================== BACKGROUND MUSIC ====================

    /**
     * Start background music (jungle theme)
     */
    startBackgroundMusic() {
        if (!this.initialized) {
            this.init().then(() => this.startBackgroundMusic());
            return;
        }

        this.stopBackgroundMusic();

        // Create a simple ambient jungle loop
        this.createAmbientLoop();
        this.createMelodyLoop();
    }

    /**
     * Create ambient background loop
     */
    createAmbientLoop() {
        const now = this.audioContext.currentTime;

        // Create a low drone
        const drone1 = this.createOscillator(110, 'sine'); // A2
        const drone2 = this.createOscillator(165, 'sine'); // E3

        const droneGain = this.audioContext.createGain();
        drone1.connect(droneGain);
        drone2.connect(droneGain);
        droneGain.connect(this.musicGain);

        droneGain.gain.setValueAtTime(0.08, now);

        drone1.start(now);
        drone2.start(now);

        this.musicOscillators.push(drone1, drone2);
    }

    /**
     * Create melodic loop
     */
    createMelodyLoop() {
        const now = this.audioContext.currentTime;

        // Simple repeating melody pattern (pentatonic scale for jungle vibe)
        const pattern = [
            { note: 220.00, duration: 0.5 },  // A3
            { note: 246.94, duration: 0.5 },  // B3
            { note: 293.66, duration: 0.5 },  // D4
            { note: 329.63, duration: 0.5 },  // E4
            { note: 293.66, duration: 0.5 },  // D4
            { note: 246.94, duration: 0.5 },  // B3
            { note: 220.00, duration: 1.0 },  // A3
            { note: 0, duration: 0.5 }        // Rest
        ];

        let currentTime = now;

        // Schedule notes
        pattern.forEach(({ note, duration }) => {
            if (note > 0) {
                const osc = this.createOscillator(note, 'triangle');
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.musicGain);

                // Envelope
                gain.gain.setValueAtTime(0, currentTime);
                gain.gain.linearRampToValueAtTime(0.06, currentTime + 0.05);
                gain.gain.linearRampToValueAtTime(0.04, currentTime + duration - 0.05);
                gain.gain.linearRampToValueAtTime(0, currentTime + duration);

                osc.start(currentTime);
                osc.stop(currentTime + duration);

                this.musicOscillators.push(osc);
            }

            currentTime += duration;
        });

        // Loop the melody
        const totalDuration = pattern.reduce((sum, { duration }) => sum + duration, 0);

        this.backgroundMusic = setTimeout(() => {
            if (this.initialized && !this.isMuted) {
                this.createMelodyLoop();
            }
        }, totalDuration * 1000);
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        // Clear timeout
        if (this.backgroundMusic) {
            clearTimeout(this.backgroundMusic);
            this.backgroundMusic = null;
        }

        // Stop all music oscillators
        this.musicOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Already stopped
            }
        });

        this.musicOscillators = [];
    }

    // ==================== SETTINGS ====================

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const settings = {
            volumes: this.volumes,
            isMuted: this.isMuted
        };

        localStorage.setItem('ariapac_audio_settings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const saved = localStorage.getItem('ariapac_audio_settings');

        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.volumes = settings.volumes || this.volumes;
                this.isMuted = settings.isMuted || false;
            } catch (e) {
                console.error('Failed to load audio settings:', e);
            }
        }
    }

    /**
     * Cleanup and dispose
     */
    dispose() {
        this.stopBackgroundMusic();

        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Create global audio system instance
window.audioSystem = new AudioSystem();
