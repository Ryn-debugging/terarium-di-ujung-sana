/**************************************************************************
 * INTERACTIVE MINI-GAMES & SELF-CARE MICRO-INTERACTIONS
 **************************************************************************/
let activeMiniGameCleanup = null;

function cleanupActiveMiniGame() {
    if (typeof activeMiniGameCleanup === 'function') {
        activeMiniGameCleanup();
    }
    activeMiniGameCleanup = null;
    audio.stopRadioPreview();
}

// --- SELF-CARE 1: KOMPOR SUP HANGAT (3x Aduk, Terbatas per Malam) ---
function openSoupMicroGame() {
    if (gameState.soupCharges <= 0) {
        openModal(`
            <div>
                <span class="m-kicker amber">Kompor Kecil Kamar 304</span>
                <h2 class="m-title">Panci Sup Sudah Kosong</h2>
                <p class="m-desc">Bahan sup hangat untuk malam ini sudah habis (2 porsi per malam). Kamu masih bisa merawat Terarium Lumut untuk menenangkan pikiran.</p>
                <button onclick="closeModal()" class="m-btn secondary">Mengerti</button>
            </div>
        `);
        return;
    }

    let stirs = 0;
    const needed = 3;

    const render = () => {
        openModal(`
            <div style="text-align:center;">
                <span class="m-kicker amber">Self-Care • Sisa ${gameState.soupCharges} Porsi Malam Ini</span>
                <h2 class="m-title" style="padding-right:0;">Aduk Sup Hangat</h2>
                <p class="m-desc">Aduk perlahan hingga aroma hangat memenuhi kamar dan memulihkan batas mental.</p>
                <div class="m-card" style="padding:20px;">
                    <div style="font-size:48px; margin-bottom:8px; transition:transform 0.2s;" id="soup-bowl-icon">🍲</div>
                    <div class="bar-track" style="height:12px; margin-bottom:10px;">
                        <div class="bar-fill-mental" style="width:${(stirs / needed) * 100}%;"></div>
                    </div>
                    <div class="font-mono-tech" style="font-size:12px; color:#fde68a; margin-bottom:14px;">
                        Adukan: ${stirs} / ${needed}
                    </div>
                    <button id="btn-stir-soup" class="m-btn amber">
                        ${stirs >= needed ? '✓ Sup Siap Dinikmati!' : '🥄 Aduk Panci Sup'}
                    </button>
                </div>
            </div>
        `);

        const btn = document.getElementById('btn-stir-soup');
        if (btn) {
            btn.addEventListener('click', () => {
                audio.playSFX('water');
                stirs++;
                const icon = document.getElementById('soup-bowl-icon');
                if (icon) icon.style.transform = `rotate(${stirs % 2 === 0 ? -10 : 10}deg) scale(1.08)`;
                if (stirs >= needed) {
                    gameState.soupCharges--;
                    gameState.maxResilience = 100;
                    gameState.resilience = Math.min(100, gameState.resilience + 30);
                    gameState.sensoryLoad = Math.max(0, gameState.sensoryLoad - 16);
                    gameState.selfCareTimer = 0;
                    audio.playSFX('chime');
                    saveGameProgress();
                    closeModal();
                    showToast('+30 Mental & Batas Mental pulih penuh! Sup terasa hangat.', '🍲');
                    setMonologue(
                        'Uap hangat sup membuat dadaku terasa lebih lapang dan bertenaga.',
                        `Sisa sup malam ini: ${gameState.soupCharges} porsi.`
                    );
                    updateHUD();
                } else {
                    render();
                }
            });
        }
    };
    render();
}

// --- SELF-CARE 2: TERARIUM LUMUT (3x Semprot Kabut Embun + Cooldown) ---
function openTerrariumCareMicroGame() {
    if (gameState.terrariumCooldown > 0) {
        const secs = Math.ceil(gameState.terrariumCooldown);
        showToast(`Lumut masih lembap. Tunggu ${secs} detik sebelum menyemprot lagi.`, '🌿');
        return;
    }

    let sprays = 0;
    const needed = 3;

    const render = () => {
        openModal(`
            <div style="text-align:center;">
                <span class="m-kicker emerald">Suaka Kamar 304</span>
                <h2 class="m-title" style="padding-right:0;">Rawat Terarium Lumut</h2>
                <p class="m-desc">Semprotkan kabut embun halus ke dalam kaca agar lumut tetap hijau dan pikiranmu tenang.</p>
                <div class="m-card" style="padding:20px;">
                    <div style="font-size:48px; margin-bottom:8px;">🌿</div>
                    <div class="bar-track" style="height:12px; margin-bottom:10px;">
                        <div class="bar-fill-mental" style="width:${(sprays / needed) * 100}%;"></div>
                    </div>
                    <div class="font-mono-tech" style="font-size:12px; color:#a7f3d0; margin-bottom:14px;">
                        Semprotan Embun: ${sprays} / ${needed}
                    </div>
                    <button id="btn-spray-moss" class="m-btn emerald">
                        💦 Semprot Embun Halus
                    </button>
                </div>
            </div>
        `);

        const btn = document.getElementById('btn-spray-moss');
        if (btn) {
            btn.addEventListener('click', () => {
                audio.playSFX('spray');
                sprays++;
                if (sprays >= needed) {
                    gameState.terrariumCooldown = 22;
                    gameState.resilience = Math.min(gameState.maxResilience, gameState.resilience + 20);
                    gameState.sensoryLoad = Math.max(0, gameState.sensoryLoad - 18);
                    audio.playSFX('chime');
                    saveGameProgress();
                    closeModal();
                    showToast('+20 Mental, -18% Cemas. Lumut berkilau terkena embun.', '🌿');
                    setMonologue(
                        'Butiran embun di kaca terarium selalu menenangkan napasku.',
                        '+20 Mental & -18% Cemas Sosial.'
                    );
                    updateHUD();
                } else {
                    render();
                }
            });
        }
    };
    render();
}

// --- MINI-GAME 1 (MALAM 1): TUNING FREKUENSI RADIO KERONCONG (88.4 MHz) ---
function startRadioTuningGame() {
    cleanupActiveMiniGame();
    let currentFreq = 96.5;
    const targetFreq = 88.4;
    let lockProgress = 0; // 0 to 1.4 seconds

    openModal(`
        <div>
            <span class="m-kicker amber">Reparasi Malam 1 • Radio Bu Ratna</span>
            <h2 class="m-title">Kalibrasi Gelombang Keroncong</h2>
            <p class="m-desc">Putar tuas frekuensi perlahan ke sekitar <strong>88.4 MHz</strong> hingga gelombang sinyal stabil berwarna hijau.</p>

            <div class="radio-dial-wrap">
                <div class="freq-readout" id="radio-freq-display">96.5 MHz</div>
                <canvas id="radio-scope-canvas" width="420" height="84" style="width:100%; height:84px; background:#030712; border-radius:10px; border:1px solid #1e293b; margin-bottom:10px;"></canvas>
                <input id="radio-slider" type="range" min="82.0" max="104.0" step="0.1" value="96.5" class="custom-slider">
                <div style="display:flex; justify-content:space-between; gap:8px; margin-top:8px;">
                    <button id="btn-freq-down" class="m-btn secondary sm">◀ -0.2 MHz</button>
                    <span id="radio-signal-status" class="font-mono-tech" style="font-size:12px; color:#94a3b8; align-self:center;">Sinyal: Static</span>
                    <button id="btn-freq-up" class="m-btn secondary sm">+0.2 MHz ▶</button>
                </div>
            </div>

            <div style="margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                    <span style="color:#a7f3d0;">Kunci Solder & Stabilisasi</span>
                    <span id="radio-lock-pct" class="font-mono-tech" style="color:#fde68a;">0%</span>
                </div>
                <div class="bar-track" style="height:12px;">
                    <div id="radio-lock-bar" class="bar-fill-mental" style="width:0%;"></div>
                </div>
            </div>
        </div>
    `);

    audio.startRadioPreview();

    const slider = document.getElementById('radio-slider');
    const freqDisplay = document.getElementById('radio-freq-display');
    const statusLabel = document.getElementById('radio-signal-status');
    const lockBar = document.getElementById('radio-lock-bar');
    const lockPct = document.getElementById('radio-lock-pct');
    const scopeCanvas = document.getElementById('radio-scope-canvas');
    const scopeCtx = scopeCanvas ? scopeCanvas.getContext('2d') : null;

    const updateFreqVal = (val) => {
        currentFreq = Math.max(82, Math.min(104, Number(val)));
        if (slider) slider.value = currentFreq.toFixed(1);
        if (freqDisplay) freqDisplay.textContent = `${currentFreq.toFixed(1)} MHz`;
    };

    slider.addEventListener('input', (e) => updateFreqVal(e.target.value));
    document.getElementById('btn-freq-down').addEventListener('click', () => updateFreqVal(currentFreq - 0.2));
    document.getElementById('btn-freq-up').addEventListener('click', () => updateFreqVal(currentFreq + 0.2));

    let lastTick = performance.now();
    let animId = null;

    const tick = (now) => {
        if (!gameState.modalOpen) {
            cleanupActiveMiniGame();
            return;
        }
        const dt = Math.min(0.05, (now - lastTick) / 1000);
        lastTick = now;

        const diff = Math.abs(currentFreq - targetFreq);
        const clarity = Math.max(0, 1 - diff / 4.5);
        const inZone = diff <= 0.45;

        audio.updateRadioTuning(clarity, dt);

        if (inZone) {
            lockProgress += dt;
            statusLabel.textContent = 'Sinyal Jernih! Tahan...';
            statusLabel.style.color = '#34d399';
            freqDisplay.style.color = '#34d399';
        } else {
            lockProgress = Math.max(0, lockProgress - dt * 0.7);
            statusLabel.textContent = diff < 1.8 ? 'Mendekati sinyal...' : 'Sinyal: Static';
            statusLabel.style.color = diff < 1.8 ? '#fbbf24' : '#94a3b8';
            freqDisplay.style.color = '#fbbf24';
        }

        const pct = Math.min(100, (lockProgress / 1.4) * 100);
        lockBar.style.width = `${pct}%`;
        lockPct.textContent = `${Math.round(pct)}%`;

        // Draw live oscilloscope waveform
        if (scopeCtx) {
            const w = scopeCanvas.width;
            const h = scopeCanvas.height;
            scopeCtx.clearRect(0, 0, w, h);
            scopeCtx.strokeStyle = inZone ? '#34d399' : (diff < 1.8 ? '#fbbf24' : '#64748b');
            scopeCtx.lineWidth = 2.2;
            scopeCtx.beginPath();
            for (let x = 0; x < w; x += 4) {
                const sine = Math.sin((x * 0.045) + now * 0.008) * (10 + clarity * 16);
                const noise = (Math.random() - 0.5) * (1 - clarity) * 32;
                const y = h / 2 + sine + noise;
                if (x === 0) scopeCtx.moveTo(x, y);
                else scopeCtx.lineTo(x, y);
            }
            scopeCtx.stroke();
        }

        if (lockProgress >= 1.4) {
            cleanupActiveMiniGame();
            completeRepairCraft('itemRatna', 'Radio Keroncong Tua (301)', 'Sekarang antar diam-diam ke keset Pintu 301.');
            return;
        }
        animId = requestAnimationFrame(tick);
    };

    activeMiniGameCleanup = () => {
        if (animId) cancelAnimationFrame(animId);
    };
    animId = requestAnimationFrame(tick);
}

// --- MINI-GAME 2 (MALAM 2): SAMBUNG KABEL SIRKUIT & BAUT PENGAIT DAMAR ---
function startFlashlightWiringGame() {
    cleanupActiveMiniGame();
    const wires = [
        { id: 'pos', label: '+ Kutub Merah', color: '#f43f5e' },
        { id: 'neg', label: '- Ground Biru', color: '#38bdf8' },
        { id: 'led', label: '⚡ Driver LED', color: '#fbbf24' }
    ];
    // Randomized right-side PCB terminal order per session (Fisher-Yates)
    const rightPool = [
        { id: 'led', label: 'Pin Bohlam LED' },
        { id: 'pos', label: 'Pin Daya (+)' },
        { id: 'neg', label: 'Pin Massa (-)' }
    ];
    for (let i = rightPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rightPool[i], rightPool[j]] = [rightPool[j], rightPool[i]];
    }
    if (rightPool.every((r, idx) => r.id === wires[idx].id)) {
        [rightPool[0], rightPool[1]] = [rightPool[1], rightPool[0]];
    }
    const rightOrder = rightPool;

    let selectedLeft = null;
    const connected = { pos: false, neg: false, led: false };
    let boltsTightened = 0;
    let errorMsg = '';

    const render = () => {
        const allWired = connected.pos && connected.neg && connected.led;
        openModal(`
            <div>
                <span class="m-kicker amber">Reparasi Malam 2 • Senter & Tas Damar</span>
                <h2 class="m-title">Sambung Jalur Sirkuit Senter</h2>
                <p class="m-desc">${allWired
                    ? 'Sirkuit menyala! Sekarang kencangkan 3 baut pengait baja tas kurir.'
                    : 'Ketuk terminal kiri lalu cocokkan dengan pin kanan sesuai jalurnya.'}</p>

                ${!allWired ? `
                    <div class="wire-grid">
                        <div class="wire-col">
                            ${wires.map(w => `
                                <button data-left="${w.id}" class="wire-node ${selectedLeft === w.id ? 'selected' : ''} ${connected[w.id] ? 'connected' : ''}"
                                    style="border-color:${connected[w.id] ? '#10b981' : (selectedLeft === w.id ? w.color : '#334155')}; color:${connected[w.id] ? '#6ee7b7' : '#f8fafc'};">
                                    ${connected[w.id] ? '✓ ' : ''}${w.label}
                                </button>
                            `).join('')}
                        </div>
                        <div style="text-align:center;">
                            <svg viewBox="0 0 110 126" style="width:100%; max-width:110px; height:126px; display:block; margin:0 auto;">
                                ${wires.map((w, idx) => {
                                    if (!connected[w.id]) return '';
                                    const rIdx = rightOrder.findIndex(r => r.id === w.id);
                                    const y1 = 22 + idx * 42;
                                    const y2 = 22 + rIdx * 42;
                                    return `<path d="M 4 ${y1} C 55 ${y1}, 55 ${y2}, 106 ${y2}" stroke="${w.color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
                                }).join('')}
                            </svg>
                        </div>
                        <div class="wire-col">
                            ${rightOrder.map(r => `
                                <button data-right="${r.id}" class="wire-node ${connected[r.id] ? 'connected' : ''}"
                                    style="border-color:${connected[r.id] ? '#10b981' : '#334155'};">
                                    ${r.label}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <p style="font-size:13px; text-align:center; min-height:20px; color:${errorMsg ? '#fb7185' : '#94a3b8'};">
                        ${errorMsg || 'Pilih kabel dari kolom kiri terlebih dahulu.'}
                    </p>
                ` : `
                    <div class="m-card done" style="text-align:center; padding:18px;">
                        <div style="font-size:38px; margin-bottom:6px;">🔦</div>
                        <p style="font-size:14px; color:#d1fae5; margin:0 0 12px;">Senter LED terang benderang! Kencangkan baut pengait tas baja:</p>
                        <div class="font-mono-tech" style="font-size:13px; color:#fde68a; margin-bottom:12px;">Baut Pengait: ${boltsTightened} / 3</div>
                        <button id="btn-tighten-bolt" class="m-btn amber">🔧 Kencangkan Baut Pengait</button>
                    </div>
                `}
            </div>
        `);

        if (!allWired) {
            document.querySelectorAll('[data-left]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-left');
                    if (connected[id]) return;
                    selectedLeft = id;
                    errorMsg = '';
                    render();
                });
            });
            document.querySelectorAll('[data-right]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const rid = btn.getAttribute('data-right');
                    if (connected[rid] || !selectedLeft) return;
                    if (selectedLeft === rid) {
                        connected[rid] = true;
                        selectedLeft = null;
                        errorMsg = '';
                        audio.playSFX('spark');
                    } else {
                        audio.playSFX('door');
                        errorMsg = 'Korsleting kecil! Cocokkan jalur warna/pin yang sama.';
                        selectedLeft = null;
                    }
                    render();
                });
            });
        } else {
            const boltBtn = document.getElementById('btn-tighten-bolt');
            if (boltBtn) {
                boltBtn.addEventListener('click', () => {
                    audio.playSFX('solder');
                    boltsTightened++;
                    if (boltsTightened >= 3) {
                        completeRepairCraft('itemDamar', 'Senter Kurir Modifikasi (302)', 'Antar ke keset Pintu 302 untuk Mas Damar.');
                    } else {
                        render();
                    }
                });
            }
        }
    };
    render();
}

// --- MINI-GAME 3 (MALAM 3): MERAKIT TERARIUM LENTERA SENSOR HUJAN SORA ---
function startTerrariumCraftGame() {
    cleanupActiveMiniGame();
    let step = 1; // 1: layers, 2: humidity, 3: piezo LED test
    let layersDone = { stones: false, soil: false, moss: false };
    let humidity = 30;
    let sensorAttached = false;
    let resonanceHits = 0;
    let rhythmFeedback = 'Sentuh tombol saat lingkaran air menyentuh zona hijau!';
    let animId = null;

    const stopPiezoLoop = () => {
        if (animId) cancelAnimationFrame(animId);
        animId = null;
    };

    const render = () => {
        stopPiezoLoop();
        const layersReady = layersDone.stones && layersDone.soil && layersDone.moss;
        const humIdeal = humidity >= 65 && humidity <= 80;

        openModal(`
            <div>
                <span class="m-kicker emerald">Reparasi Malam 3 • Terarium Lentera Sora</span>
                <h2 class="m-title">Rakit Lentera Sensor Hujan (${step}/3)</h2>

                ${step === 1 ? `
                    <p class="m-desc">Langkah 1: Susun lapisan dasar di dalam botol kaca yang sudah kau bersihkan.</p>
                    <div class="m-card" style="display:flex; flex-direction:column; gap:8px;">
                        <button id="btn-layer-stones" class="m-btn ${layersDone.stones ? 'emerald' : 'secondary'}">
                            ${layersDone.stones ? '✓ Batu Sungai Kerikil Terpasang' : '🪨 1. Masukkan Batu Kerikil Drainase'}
                        </button>
                        <button id="btn-layer-soil" class="m-btn ${layersDone.soil ? 'emerald' : 'secondary'}" ${layersDone.stones ? '' : 'disabled'}>
                            ${layersDone.soil ? '✓ Tanah Humus Subur Terpasang' : '🌱 2. Taburkan Tanah Humus'}
                        </button>
                        <button id="btn-layer-moss" class="m-btn ${layersDone.moss ? 'emerald' : 'secondary'}" ${layersDone.soil ? '' : 'disabled'}>
                            ${layersDone.moss ? '✓ Lumut Hijau Terpasang' : '🌿 3. Tanam Lumut Hutan Mini'}
                        </button>
                    </div>
                    ${layersReady ? `<button id="btn-next-step2" class="m-btn primary">Lanjut Atur Kelembapan →</button>` : ''}
                ` : step === 2 ? `
                    <p class="m-desc">Langkah 2: Semprot embun hingga kelembapan masuk zona ideal <strong>65% – 80%</strong>.</p>
                    <div class="m-card" style="text-align:center;">
                        <div class="font-mono-tech" style="font-size:26px; font-weight:700; color:${humIdeal ? '#34d399' : (humidity > 80 ? '#fb7185' : '#fbbf24')}; margin-bottom:8px;">
                            Kelembapan: ${humidity}%
                        </div>
                        <div class="bar-track" style="height:14px; margin-bottom:12px;">
                            <div style="position:absolute; left:65%; width:15%; top:0; bottom:0; background:rgba(16,185,129,0.28); border-inline:1px solid #34d399;"></div>
                            <div class="bar-fill-mental" style="width:${humidity}%;"></div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button id="btn-mist-add" class="m-btn sky" style="flex:1;">💦 Semprot (+14%)</button>
                            <button id="btn-mist-dry" class="m-btn secondary" style="flex:1;">🧻 Seka Kaca (-9%)</button>
                        </div>
                    </div>
                    <button id="btn-next-step3" class="m-btn primary" ${humIdeal ? '' : 'disabled'}>
                        ${humIdeal ? 'Lanjut Pasang Sensor Hujan →' : 'Sesuaikan ke 65% – 80% dulu'}
                    </button>
                ` : `
                    <p class="m-desc">Langkah 3: Kalibrasi sensor piezo agar Sora bisa <strong>melihat detak rintik hujan lewat pendar cahaya</strong>.</p>
                    <div class="m-card" style="text-align:center;">
                        ${!sensorAttached ? `
                            <div style="font-size:44px; margin-bottom:10px;">🫙</div>
                            <button id="btn-attach-piezo" class="m-btn amber">⚡ Solder Sensor Piezo & LED Hangat</button>
                        ` : `
                            <canvas id="piezo-rhythm-canvas" width="240" height="128" style="width:100%; max-width:240px; height:128px; margin:0 auto 10px; display:block; background:#030712; border-radius:12px; border:1px solid #1e293b;"></canvas>
                            <div class="font-mono-tech" style="font-size:12px; color:#6ee7b7; margin-bottom:6px;">Resonansi Terkalibrasi: ${resonanceHits} / 3</div>
                            <p id="piezo-feedback" style="font-size:12.5px; color:#fde68a; margin:0 0 10px;">${rhythmFeedback}</p>
                            <button id="btn-test-tap" class="m-btn emerald">💧 Ketuk Kaca Saat Cincin Hijau</button>
                        `}
                    </div>
                `}
            </div>
        `);

        if (step === 1) {
            document.getElementById('btn-layer-stones').addEventListener('click', () => {
                audio.playSFX('door'); layersDone.stones = true; render();
            });
            document.getElementById('btn-layer-soil').addEventListener('click', () => {
                audio.playSFX('water'); layersDone.soil = true; render();
            });
            document.getElementById('btn-layer-moss').addEventListener('click', () => {
                audio.playSFX('chime'); layersDone.moss = true; render();
            });
            const nextBtn = document.getElementById('btn-next-step2');
            if (nextBtn) nextBtn.addEventListener('click', () => { step = 2; render(); });
        } else if (step === 2) {
            document.getElementById('btn-mist-add').addEventListener('click', () => {
                audio.playSFX('spray');
                humidity = Math.min(100, humidity + 14);
                render();
            });
            document.getElementById('btn-mist-dry').addEventListener('click', () => {
                audio.playSFX('hide');
                humidity = Math.max(15, humidity - 9);
                render();
            });
            const next3 = document.getElementById('btn-next-step3');
            if (next3) next3.addEventListener('click', () => { step = 3; render(); });
        } else {
            if (!sensorAttached) {
                document.getElementById('btn-attach-piezo').addEventListener('click', () => {
                    audio.playSFX('solder');
                    sensorAttached = true;
                    render();
                });
            } else {
                const pCanvas = document.getElementById('piezo-rhythm-canvas');
                const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
                let phase = 0.35; // start near sweet spot so first beat feels responsive
                let lastT = performance.now();

                const isInSweetSpot = () => {
                    const ringR = 54 - (phase % 1) * 46;
                    return ringR >= 16 && ringR <= 38;
                };

                const tickRhythm = (now) => {
                    if (!gameState.modalOpen || step !== 3 || !sensorAttached) {
                        stopPiezoLoop();
                        return;
                    }
                    const dt = Math.min(0.05, (now - lastT) / 1000);
                    lastT = now;
                    phase = (phase + dt * 0.68) % 1;

                    if (pCtx) {
                        const w = pCanvas.width;
                        const h = pCanvas.height;
                        pCtx.clearRect(0, 0, w, h);

                        // Target emerald zone (r = 18..36)
                        pCtx.beginPath();
                        pCtx.arc(w / 2, h / 2, 27, 0, Math.PI * 2);
                        pCtx.strokeStyle = 'rgba(16, 185, 129, 0.32)';
                        pCtx.lineWidth = 14;
                        pCtx.stroke();

                        // Glowing center moss LED core
                        pCtx.beginPath();
                        pCtx.arc(w / 2, h / 2, 8 + resonanceHits * 2, 0, Math.PI * 2);
                        pCtx.fillStyle = isInSweetSpot() ? '#34d399' : '#10b981';
                        pCtx.fill();

                        // Converging raindrop ripple
                        const r = 54 - phase * 46;
                        const inZone = isInSweetSpot();
                        pCtx.beginPath();
                        pCtx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
                        pCtx.strokeStyle = inZone ? '#fde68a' : '#38bdf8';
                        pCtx.lineWidth = inZone ? 3.5 : 2;
                        pCtx.stroke();
                    }
                    animId = requestAnimationFrame(tickRhythm);
                };

                activeMiniGameCleanup = stopPiezoLoop;
                animId = requestAnimationFrame(tickRhythm);

                document.getElementById('btn-test-tap').addEventListener('click', () => {
                    if (isInSweetSpot()) {
                        audio.playSFX('chime');
                        resonanceHits++;
                        rhythmFeedback = '✨ Resonansi akurat! Lentera memantulkan cahaya hijau hangat.';
                        if (resonanceHits >= 3) {
                            stopPiezoLoop();
                            completeRepairCraft('itemSora', 'Terarium Lentera Kecil (305)', 'Sekarang antar diam-diam ke keset Pintu 305 untuk Sora.');
                        } else {
                            render();
                        }
                    } else {
                        audio.playSFX('water');
                        rhythmFeedback = 'Sedikit meleset—tunggu cincin air biru menyala emas di zona hijau!';
                        const fb = document.getElementById('piezo-feedback');
                        if (fb) fb.textContent = rhythmFeedback;
                    }
                });
            }
        }
    };
    render();
}

function completeRepairCraft(craftedKey, itemTitle, nextInstruction) {
    audio.playSFX('chime');
    gameState.crafted[craftedKey] = true;
    gameState.resilience = Math.min(gameState.maxResilience, gameState.resilience + 12);
    saveGameProgress();
    closeModal();
    showToast(`${itemTitle} selesai dirakit! (+12 Mental)`, '🔧');
    setMonologue(`Selesai... ${itemTitle} kini siap kuletakkan di depan pintunya.`, nextInstruction);
    updateHUD();
}
