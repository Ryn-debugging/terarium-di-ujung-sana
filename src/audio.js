/**************************************************************************
 * PROCEDURAL WEB AUDIO ENGINE v3.0
 * (Sequenced Keroncong Melody, Spatial Audio, Visibility Suspend, SFX)
 **************************************************************************/
const KERONCONG_MELODY = [
    293.66, 329.63, 349.23, 440.00, 392.00, 349.23,
    329.63, 293.66, 261.63, 293.66, 329.63, 293.66
];

class SoundscapeEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isStarted = false;
        this.isHidden = false;
        this.rainGain = null;
        this.rainFilter = null;
        this.noiseBuffer = null;
        this.pianoTimer = null;
        this.heartbeatTimer = null;

        this.keroncongCooldown = 0;
        this.keroncongStep = 0;
        this.radioStep = 0;
        this.radioNoteTimer = 0;
        this.playerStepTimer = 0;

        // Interactive Radio Tuning Nodes
        this.radioStaticNode = null;
        this.radioStaticGain = null;
        this.radioMusicOsc = null;
        this.radioMusicGain = null;

        this.bindLifecycleHandlers();
    }

    bindLifecycleHandlers() {
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                this.isHidden = document.hidden;
                if (!this.ctx) return;
                if (document.hidden) {
                    this.stopRadioPreview();
                    this.ctx.suspend().catch(() => {});
                } else if (!this.isMuted) {
                    this.ctx.resume().catch(() => {});
                }
            });
        }
    }

    init() {
        if (this.isStarted) {
            if (this.ctx && this.ctx.state === 'suspended' && !this.isHidden) {
                this.ctx.resume().catch(() => {});
            }
            return;
        }
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        this.ctx = new AudioCtx();
        this.isStarted = true;

        // Build reusable 3-second brown/pink-tinted noise buffer
        const bufferSize = this.ctx.sampleRate * 3;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.0;
        }

        const rainSource = this.ctx.createBufferSource();
        rainSource.buffer = this.noiseBuffer;
        rainSource.loop = true;

        this.rainFilter = this.ctx.createBiquadFilter();
        this.rainFilter.type = 'lowpass';
        this.rainFilter.frequency.value = 620;

        this.rainGain = this.ctx.createGain();
        this.rainGain.gain.value = 0.11;

        rainSource.connect(this.rainFilter);
        this.rainFilter.connect(this.rainGain);
        this.rainGain.connect(this.ctx.destination);
        rainSource.start(0);

        this.pianoTimer = setInterval(() => this.playAmbientNote(), 3900);
        this.heartbeatTimer = setInterval(() => this.checkHeartbeat(), 850);
    }

    connectWithPan(node, panVal = 0) {
        if (!this.ctx) return;
        const clampedPan = Math.max(-1, Math.min(1, panVal));
        if (typeof this.ctx.createStereoPanner === 'function') {
            const panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(clampedPan, this.ctx.currentTime);
            node.connect(panner);
            panner.connect(this.ctx.destination);
        } else {
            node.connect(this.ctx.destination);
        }
    }

    updateEnvironment(area, night = 1, isDawn = false) {
        if (!this.isStarted || !this.ctx) return;
        const now = this.ctx.currentTime;
        if (this.isMuted) {
            this.rainGain.gain.setTargetAtTime(0, now, 0.2);
            return;
        }

        if (isDawn) {
            this.rainFilter.frequency.setTargetAtTime(420, now, 1.2);
            this.rainGain.gain.setTargetAtTime(0.035, now, 1.2);
            return;
        }

        const nightBoost = night === 3 ? 1.28 : night === 2 ? 1.15 : 1.0;
        if (area === 'room304') {
            this.rainFilter.frequency.setTargetAtTime(620 * nightBoost, now, 0.5);
            this.rainGain.gain.setTargetAtTime(0.10 * nightBoost, now, 0.5);
        } else if (area === 'hallway') {
            this.rainFilter.frequency.setTargetAtTime(1320 * nightBoost, now, 0.5);
            this.rainGain.gain.setTargetAtTime(0.18 * nightBoost, now, 0.5);
        } else if (area === 'rooftop') {
            this.rainFilter.frequency.setTargetAtTime(2500, now, 0.5);
            this.rainGain.gain.setTargetAtTime(0.30, now, 0.5);
        }
    }

    playAmbientNote() {
        if (!this.isStarted || this.isMuted || this.isHidden || !this.ctx) return;
        if (typeof gameState !== 'undefined' && gameState.sensoryLoad > 74) return;

        const isDawn = typeof gameState !== 'undefined' && (gameState.isDawn || (gameState.cutscene && gameState.cutscene.progress > 0.6 && gameState.cutscene.type === 'threshold'));
        const nightNotes = [146.83, 174.61, 220.00, 261.63, 293.66, 329.63, 349.23, 440.00];
        const dawnNotes = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33];
        const pool = isDawn ? dawnNotes : nightNotes;
        const freq = pool[Math.floor(Math.random() * pool.length)];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = isDawn ? 'sine' : (Math.random() > 0.45 ? 'sine' : 'triangle');
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isDawn ? 850 : 490, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(isDawn ? 0.06 : 0.048, now + 0.38);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 3.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 3.6);
    }

    checkHeartbeat() {
        if (!this.isStarted || this.isMuted || this.isHidden || !this.ctx) return;
        if (typeof gameState === 'undefined' || gameState.sensoryLoad < 45) return;

        const intensity = Math.min(1, (gameState.sensoryLoad - 40) / 60);
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(58, now);
        osc.frequency.exponentialRampToValueAtTime(31, now + 0.17);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.19 * intensity, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
    }

    playSpatialFootstep(pan, proximity) {
        if (!this.isStarted || this.isMuted || this.isHidden || !this.ctx || !this.noiseBuffer) return;
        const now = this.ctx.currentTime;
        const vol = Math.max(0.015, Math.min(0.16, proximity * 0.16));

        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(160 + Math.random() * 45, now);
        filter.Q.value = 1.6;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.14);

        src.connect(filter);
        filter.connect(gain);
        this.connectWithPan(gain, pan);

        src.start(now, Math.random() * 1.5, 0.16);
    }

    tickPlayerFootstep(dt, moving, isHiding, area) {
        if (!moving || isHiding || area === 'room304') {
            this.playerStepTimer = 0.05;
            return;
        }
        this.playerStepTimer -= dt;
        if (this.playerStepTimer <= 0) {
            this.playerStepTimer = 0.34;
            this.playSpatialFootstep(0, 0.26);
        }
    }

    tickProximityKeroncong(dt, playerX) {
        if (!this.isStarted || this.isMuted || this.isHidden || !this.ctx) return;
        const dist = Math.abs(playerX - 120);
        if (dist > 260) return;

        this.keroncongCooldown -= dt;
        if (this.keroncongCooldown > 0) return;
        this.keroncongCooldown = 0.52;

        const vol = (1 - dist / 260) * 0.048;
        const pan = Math.max(-1, Math.min(1, (120 - playerX) / 260));
        const freq = KERONCONG_MELODY[this.keroncongStep % KERONCONG_MELODY.length];
        this.keroncongStep++;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(780, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.56);

        osc.connect(filter);
        filter.connect(gain);
        this.connectWithPan(gain, pan);
        osc.start(now);
        osc.stop(now + 0.58);
    }

    playThunder() {
        if (!this.isStarted || this.isMuted || this.isHidden || !this.ctx || !this.noiseBuffer) return;
        const now = this.ctx.currentTime;
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, now);
        filter.frequency.exponentialRampToValueAtTime(55, now + 2.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.24, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now, 0, 2.7);
    }

    // Live audio feedback for Night 1 Radio Tuning mini-game
    startRadioPreview() {
        this.stopRadioPreview();
        if (!this.isStarted || this.isMuted || !this.ctx || !this.noiseBuffer) return;

        const now = this.ctx.currentTime;
        const staticSrc = this.ctx.createBufferSource();
        staticSrc.buffer = this.noiseBuffer;
        staticSrc.loop = true;

        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1800;

        this.radioStaticGain = this.ctx.createGain();
        this.radioStaticGain.gain.setValueAtTime(0.08, now);

        staticSrc.connect(bp);
        bp.connect(this.radioStaticGain);
        this.radioStaticGain.connect(this.ctx.destination);
        staticSrc.start(now);
        this.radioStaticNode = staticSrc;

        this.radioMusicOsc = this.ctx.createOscillator();
        this.radioMusicOsc.type = 'triangle';
        this.radioMusicOsc.frequency.setValueAtTime(KERONCONG_MELODY[0], now);

        this.radioMusicGain = this.ctx.createGain();
        this.radioMusicGain.gain.setValueAtTime(0.001, now);

        this.radioMusicOsc.connect(this.radioMusicGain);
        this.radioMusicGain.connect(this.ctx.destination);
        this.radioMusicOsc.start(now);
        this.radioStep = 0;
        this.radioNoteTimer = 0;
    }

    updateRadioTuning(clarity, dt = 0.016) {
        if (!this.ctx || !this.radioStaticGain || !this.radioMusicGain) return;
        const now = this.ctx.currentTime;
        this.radioStaticGain.gain.setTargetAtTime((1 - clarity * 0.9) * 0.08, now, 0.06);
        this.radioMusicGain.gain.setTargetAtTime(clarity * 0.062, now, 0.06);

        this.radioNoteTimer -= dt;
        if (this.radioMusicOsc && this.radioNoteTimer <= 0) {
            this.radioNoteTimer = 0.42;
            const note = KERONCONG_MELODY[this.radioStep % KERONCONG_MELODY.length];
            this.radioMusicOsc.frequency.setTargetAtTime(note, now, 0.03);
            this.radioStep++;
        }
    }

    stopRadioPreview() {
        try {
            if (this.radioStaticNode) { this.radioStaticNode.stop(); this.radioStaticNode.disconnect(); }
            if (this.radioMusicOsc) { this.radioMusicOsc.stop(); this.radioMusicOsc.disconnect(); }
        } catch (_) {}
        this.radioStaticNode = null;
        this.radioMusicOsc = null;
        this.radioStaticGain = null;
        this.radioMusicGain = null;
    }

    playSFX(type) {
        if (!this.isStarted || this.isMuted || this.isHidden || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        let dur = 0.4;

        if (type === 'water' || type === 'spray') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(type === 'spray' ? 680 : 480, now);
            osc.frequency.exponentialRampToValueAtTime(980, now + 0.14);
            gain.gain.setValueAtTime(0.055, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
            dur = 0.25;
        } else if (type === 'breath') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(293.66, now);
            osc.frequency.linearRampToValueAtTime(220.0, now + 0.9);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.07, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            dur = 1.05;
        } else if (type === 'solder' || type === 'spark') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(type === 'spark' ? 720 : 440, now);
            osc.frequency.exponentialRampToValueAtTime(type === 'spark' ? 1180 : 660, now + 0.16);
            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            dur = 0.2;
        } else if (type === 'door') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            dur = 0.26;
        } else if (type === 'creak') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(340, now);
            osc.frequency.linearRampToValueAtTime(275, now + 0.28);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
            dur = 0.35;
        } else if (type === 'hide') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(240, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            dur = 0.22;
        } else if (type === 'panic') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(190, now);
            osc.frequency.exponentialRampToValueAtTime(95, now + 0.7);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
            dur = 0.8;
        } else if (type === 'chime' || type === 'gift' || type === 'umbrella') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.setValueAtTime(type === 'gift' ? 783.99 : 880, now + 0.13);
            if (type === 'gift') osc.frequency.setValueAtTime(1046.5, now + 0.26);
            gain.gain.setValueAtTime(0.065, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
            dur = 0.9;
        }

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + dur);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) this.stopRadioPreview();
        if (typeof gameState !== 'undefined') {
            this.updateEnvironment(gameState.area, gameState.night, gameState.isDawn);
        }
        return this.isMuted;
    }
}

const audio = new SoundscapeEngine();
