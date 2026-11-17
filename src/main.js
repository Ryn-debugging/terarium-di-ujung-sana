/**************************************************************************
 * CORE STATE, SAVE SYSTEM, DELTA-TIME LOOP & STORY PROGRESSION
 **************************************************************************/
const SAVE_KEY = 'terarium_ujung_lorong_v2';

function createInitialState(unlockedEndings = { avoidant: false, lanterns: false, threshold: false }) {
    const rainDrops = [];
    for (let i = 0; i < 95; i++) {
        rainDrops.push({
            x: Math.random() * 1050,
            y: Math.random() * 550,
            len: 12 + Math.random() * 18,
            speed: 380 + Math.random() * 240 // px/sec
        });
    }
    const particles = [];
    for (let i = 0; i < 32; i++) {
        particles.push({
            x: 60 + Math.random() * 880,
            y: 110 + Math.random() * 340,
            r: 1.2 + Math.random() * 2.2,
            vx: (Math.random() - 0.5) * 14,
            vy: -8 - Math.random() * 14,
            alpha: 0.2 + Math.random() * 0.55,
            color: Math.random() > 0.4 ? '#34d399' : '#fbbf24'
        });
    }

    return {
        night: 1,
        area: 'room304',
        isDawn: false,
        resilience: 85,
        maxResilience: 100,
        sensoryLoad: 10,
        soupCharges: 2,
        terrariumCooldown: 0,
        selfCareTimer: 0,
        groundingAuraTimer: 0,
        curtainOpen: 0,
        lightningFlash: 0,
        thunderTimer: 6,

        playerX: 480,
        targetX: null,
        facing: 1,
        walkPhase: 0,
        moveLeft: false,
        moveRight: false,
        isHiding: false,

        clues: { ratna: false, damar: false, sora: false },
        inventory: { brokenRadio: false, brokenFlashlight: false, tornSketchGlass: false },
        crafted: { itemRatna: false, itemDamar: false, itemSora: false },
        delivered: { ratna: false, damar: false, sora: false },
        repliesCollected: { ratna: false, damar: false, sora: false },
        pendingGift: null, // 'ratna' | 'damar' | 'sora' | null

        journalNotes: [],
        unlockedEndings: { ...unlockedEndings },

        hallwayNPC: {
            x: 220,
            dir: 1,
            pauseTimer: 0,
            stepAudioTimer: 0,
            flippedThisPass: false
        },
        doorPeek: null,
        doorPeekCooldown: 8,
        revisitBonusGiven: {},

        cutscene: null,
        activeHotspot: null,
        modalOpen: false,
        rainDrops,
        particles
    };
}

let gameState = createInitialState();

function saveGameProgress() {
    try {
        const payload = {
            night: gameState.night,
            isDawn: gameState.isDawn,
            resilience: gameState.resilience,
            maxResilience: gameState.maxResilience,
            sensoryLoad: gameState.sensoryLoad,
            soupCharges: gameState.soupCharges,
            curtainOpen: gameState.curtainOpen,
            clues: gameState.clues,
            inventory: gameState.inventory,
            crafted: gameState.crafted,
            delivered: gameState.delivered,
            repliesCollected: gameState.repliesCollected,
            pendingGift: gameState.pendingGift,
            journalNotes: gameState.journalNotes,
            unlockedEndings: gameState.unlockedEndings,
            revisitBonusGiven: gameState.revisitBonusGiven
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (_) {}
}

function loadGameProgress() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || typeof data.night !== 'number') return false;

        const base = createInitialState(data.unlockedEndings || {});
        Object.assign(base, {
            night: Math.max(1, Math.min(3, data.night)),
            isDawn: Boolean(data.isDawn),
            resilience: typeof data.resilience === 'number' ? data.resilience : 85,
            maxResilience: typeof data.maxResilience === 'number' ? data.maxResilience : 100,
            sensoryLoad: typeof data.sensoryLoad === 'number' ? data.sensoryLoad : 10,
            soupCharges: typeof data.soupCharges === 'number' ? data.soupCharges : 2,
            curtainOpen: typeof data.curtainOpen === 'number' ? data.curtainOpen : 0,
            clues: { ...base.clues, ...(data.clues || {}) },
            inventory: { ...base.inventory, ...(data.inventory || {}) },
            crafted: { ...base.crafted, ...(data.crafted || {}) },
            delivered: { ...base.delivered, ...(data.delivered || {}) },
            repliesCollected: { ...base.repliesCollected, ...(data.repliesCollected || {}) },
            pendingGift: data.pendingGift || null,
            journalNotes: Array.isArray(data.journalNotes) ? data.journalNotes : [],
            revisitBonusGiven: data.revisitBonusGiven && typeof data.revisitBonusGiven === 'object' ? data.revisitBonusGiven : {}
        });
        gameState = base;
        return true;
    } catch (_) {
        return false;
    }
}

function hasProgressBeyondStart() {
    return gameState.night > 1 ||
        gameState.clues.ratna ||
        gameState.delivered.ratna ||
        gameState.isDawn;
}

function getVisibleHotspotsForArea(area) {
    const base = HOTSPOTS[area] || [];
    if (area === 'room304') {
        const hasAnyReply = gameState.repliesCollected.ratna || gameState.repliesCollected.damar || gameState.repliesCollected.sora;
        return base.filter(h => {
            if (h.id === 'door_gift') return Boolean(gameState.pendingGift);
            if (h.id === 'keepsakes') return hasAnyReply;
            return true;
        });
    }
    if (area === 'hallway') {
        const conf = NIGHT_DATA[gameState.night];
        return base.map(h => {
            if (h.id === 'trash_bin' && conf) {
                return {
                    ...h,
                    x: conf.trashX,
                    shortTitle: conf.trashShortTitle,
                    label: conf.trashLabel
                };
            }
            return h;
        });
    }
    return base;
}

// --- UI HELPERS ---
let toastTimeout = null;
function showToast(text, icon = '✨') {
    const container = document.getElementById('toast-container');
    document.getElementById('toast-text').textContent = text;
    document.getElementById('toast-icon').textContent = icon;
    container.classList.add('visible');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        container.classList.remove('visible');
    }, 3200);
}

function setMonologue(text, subText = null) {
    document.getElementById('monologue-text').textContent = text;
    if (subText !== null) document.getElementById('monologue-sub').textContent = subText;
}

function getCurrentQuestInfo() {
    if (gameState.isDawn) {
        return { step: 'Epilog Pagi', text: 'Nikmati pagi tenang di Kamar 304. Tirai telah terbuka.' };
    }
    const conf = NIGHT_DATA[gameState.night];
    if (!conf) return { step: 'Selesai', text: 'Malam telah berlalu.' };

    if (gameState.pendingGift) {
        return { step: `Malam ${conf.number} • Hadiah`, text: 'Ambil Balasan Sunyi di dekat pintu Kamar 304.' };
    }

    const clueDone = gameState.clues[conf.neighborKey];
    const invDone = gameState.inventory[conf.inventoryKey];
    const craftDone = gameState.crafted[conf.craftedKey];
    const delivDone = gameState.delivered[conf.neighborKey];

    if (!clueDone) {
        return { step: `Malam ${conf.number} • 1/4`, text: `Cek Ventilasi untuk mendengar kabar ${conf.neighborName} (${conf.roomNum}).` };
    }
    if (!invDone) {
        return { step: `Malam ${conf.number} • 2/4`, text: `Ambil barang rusak di ${conf.trashShortTitle} Lorong.` };
    }
    if (!craftDone) {
        return { step: `Malam ${conf.number} • 3/4`, text: `Perbaiki ${conf.itemTitle} di Meja Kerja Kamar 304.` };
    }
    if (!delivDone) {
        return { step: `Malam ${conf.number} • 4/4`, text: `Antar diam-diam ke Pintu ${conf.roomNum} (${conf.neighborName}).` };
    }

    if (gameState.night < 3) {
        return { step: `Malam ${conf.number} • Pulang`, text: 'Kembali masuk ke Kamar 304 untuk beristirahat.' };
    }
    return { step: 'Klimaks • Atap', text: 'Naik Tangga Atap di ujung kanan lorong untuk menemui Sora.' };
}

function updateHUD() {
    gameState.maxResilience = Math.max(40, Math.min(100, gameState.maxResilience));
    gameState.resilience = Math.max(0, Math.min(gameState.maxResilience, gameState.resilience));
    gameState.sensoryLoad = Math.max(0, Math.min(100, gameState.sensoryLoad));

    const resVal = Math.floor(gameState.resilience);
    const maxVal = Math.round(gameState.maxResilience);
    const senVal = Math.round(gameState.sensoryLoad);

    // Desktop bars
    document.getElementById('resilience-text').textContent = `${resVal} / ${maxVal}`;
    document.getElementById('resilience-bar').style.width = `${gameState.resilience}%`;
    document.getElementById('resilience-cap-lock').style.width = `${100 - gameState.maxResilience}%`;
    document.getElementById('sensory-text').textContent = `${senVal}%`;
    document.getElementById('sensory-bar').style.width = `${gameState.sensoryLoad}%`;

    // Mobile compact bars
    document.getElementById('m-resilience-text').textContent = `${resVal}`;
    document.getElementById('m-resilience-bar').style.width = `${gameState.resilience}%`;
    document.getElementById('m-sensory-text').textContent = `${senVal}%`;
    document.getElementById('m-sensory-bar').style.width = `${gameState.sensoryLoad}%`;

    const badge = document.getElementById('selfcare-badge');
    if (gameState.maxResilience >= 90) {
        badge.textContent = 'Fisik Sehat';
        badge.className = 'pill-badge';
    } else if (gameState.maxResilience >= 70) {
        badge.textContent = 'Mulai Lelah';
        badge.className = 'pill-badge warn';
    } else {
        badge.textContent = 'Butuh Sup Hangat';
        badge.className = 'pill-badge danger';
    }

    const vignette = document.getElementById('sensory-vignette');
    if (gameState.sensoryLoad > 35 && !gameState.isDawn) {
        const alpha = ((gameState.sensoryLoad - 35) / 65) * 0.78;
        vignette.style.background = `radial-gradient(circle at center, transparent ${55 - alpha * 30}%, rgba(155, 22, 38, ${alpha}) 100%)`;
        vignette.style.opacity = '1';
        vignette.classList.toggle('anxiety-high', gameState.sensoryLoad > 70);
    } else {
        vignette.style.opacity = '0';
        vignette.classList.remove('anxiety-high');
    }

    const setTrack = (id, clue, crafted, delivered, num) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (delivered) el.innerHTML = `<span style="color:#34d399;font-weight:700;">${num} ✓</span>`;
        else if (crafted) el.innerHTML = `<span style="color:#fcd34d;font-weight:700;">${num}: Antar</span>`;
        else if (clue) el.innerHTML = `<span style="color:#38bdf8;">${num}: Teramati</span>`;
        else el.innerHTML = `<span>${num}: —</span>`;
    };
    setTrack('tracker-301', gameState.clues.ratna, gameState.crafted.itemRatna, gameState.delivered.ratna, '301');
    setTrack('tracker-302', gameState.clues.damar, gameState.crafted.itemDamar, gameState.delivered.damar, '302');
    setTrack('tracker-305', gameState.clues.sora, gameState.crafted.itemSora, gameState.delivered.sora, '305');

    const replyCount = [gameState.repliesCollected.ratna, gameState.repliesCollected.damar, gameState.repliesCollected.sora].filter(Boolean).length;
    const endCount = Object.values(gameState.unlockedEndings).filter(Boolean).length;
    document.getElementById('inventory-count-badge').textContent = `${replyCount}/3`;
    document.getElementById('m-journal-badge').textContent = `${endCount}/3`;

    const q = getCurrentQuestInfo();
    document.getElementById('quest-step-badge').textContent = q.step;
    document.getElementById('quest-banner-text').textContent = q.text;
    document.getElementById('m-mission-step').textContent = q.step;
    document.getElementById('mobile-mission-text').textContent = q.text;

    const btnHide = document.getElementById('btn-toggle-hide');
    if (btnHide) {
        btnHide.classList.toggle('hide-active', gameState.isHiding);
        btnHide.style.display = gameState.area === 'hallway' ? 'inline-flex' : 'none';
    }
}

function switchArea(newArea, spawnX) {
    audio.playSFX('door');
    gameState.area = newArea;
    gameState.playerX = spawnX;
    gameState.targetX = null;
    gameState.isHiding = false;
    gameState.doorPeek = null;
    gameState.doorPeekCooldown = Math.max(5.5, gameState.doorPeekCooldown || 8);

    const body = document.body;
    const areaIcon = document.getElementById('area-icon');
    const areaTitle = document.getElementById('area-title');
    const areaSub = document.getElementById('area-subtitle');

    if (newArea === 'room304') {
        body.classList.remove('mode-outside');
        areaIcon.textContent = gameState.isDawn ? '🌅' : '🏠';
        areaTitle.textContent = 'Kamar 304';
        areaSub.textContent = gameState.isDawn ? 'Pagi yang Tenang' : `Malam ${gameState.night} • Zona Aman`;

        // Check if player returned after completing Night 1 or 2 delivery!
        const conf = NIGHT_DATA[gameState.night];
        if (!gameState.isDawn && conf && gameState.night < 3 && gameState.delivered[conf.neighborKey] && !gameState.repliesCollected[conf.neighborKey]) {
            gameState.pendingGift = conf.neighborKey;
            gameState.playerX = 845;
            saveGameProgress();
            setMonologue(
                'Tunggu... ada sesuatu terselip di bawah celah pintu Kamar 304.',
                'Periksa bingkisan hangat tepat di dekat pintu masuk kamar!'
            );
        } else if (gameState.isDawn) {
            setMonologue(
                'Sinar matahari pagi masuk menembus kaca jendela. Tirai kamarku terbuka separuh hari ini.',
                'Terima kasih telah menemani Raka di Terarium di Ujung Lorong.'
            );
        } else {
            setMonologue(
                'Pintu terkunci rapat. Di dalam kamar ini, napasku kembali tenang.',
                'Cek Ventilasi, Meja Kerja, atau rawat lumut di sini.'
            );
        }
    } else if (newArea === 'hallway') {
        body.classList.add('mode-outside');
        areaIcon.textContent = '🚪';
        areaTitle.textContent = `Lorong Lt.3`;
        areaSub.textContent = `Malam ${gameState.night} • Hati-hati`;
        setMonologue(
            'Lorong terasa dingin dan lembap. Hati-hati jika gagang pintu berderit [S].',
            'Tekan [SPASI] untuk Tarik Napas jika cemas naik.'
        );
    } else if (newArea === 'rooftop') {
        body.classList.add('mode-outside');
        areaIcon.textContent = '⛈️';
        areaTitle.textContent = 'Atap Gedung';
        areaSub.textContent = 'Puncak Badai';
        setMonologue(
            'Sora berdiri menatap tepian di tengah hujan deras. Teriakan suaraku tak akan terdengar olehnya...',
            'Dekati Sora di tepi kanan atap untuk menentukan akhir cerita.'
        );
    }

    audio.updateEnvironment(newArea, gameState.night, gameState.isDawn);
    updateHUD();
}

function toggleHide() {
    if (gameState.modalOpen || gameState.area !== 'hallway') return;
    gameState.isHiding = !gameState.isHiding;
    audio.playSFX('hide');
    if (gameState.isHiding) {
        const inCover = COVER_SPOTS.some(c => Math.abs(gameState.playerX - c.x) < 48);
        setMonologue(
            inCover
                ? 'Aku merapat di balik sudut bayangan. Langkah kakiku tak terdengar dari sini.'
                : 'Aku menunduk dan menarik tudung hoodie dalam-dalam agar tak bertatapan.',
            'Mode Sembunyi aktif (gerak lambat, cemas jauh berkurang).'
        );
    } else {
        setMonologue('Aku berdiri kembali dan bersiap melangkah.', 'Tekan [S] atau tombol Sembunyi kapan saja.');
    }
    updateHUD();
}

function triggerGrounding() {
    if (gameState.modalOpen) return;
    if (gameState.resilience < 20) {
        showToast('Mental kurang dari 20! Rawat lumut atau masak sup di Kamar 304.', '⚠️');
        return;
    }
    audio.playSFX('breath');
    gameState.resilience -= 20;
    gameState.sensoryLoad = Math.max(0, gameState.sensoryLoad - 35);
    gameState.groundingAuraTimer = 3.2; // 3.2 seconds shield

    const overlay = document.getElementById('grounding-overlay');
    overlay.style.opacity = '1';
    setTimeout(() => { overlay.style.opacity = '0'; }, 900);

    showToast('Tarik Napas: -35% Cemas | Kebal cemas 3 detik.', '🌬️');
    setMonologue(
        'Tarik napas pelan 4 detik... tahan... embuskan. Aku masih memegang kendali.',
        'Fokus tenang aktif selama 3 detik.'
    );
    updateHUD();
}

function triggerSensoryOverload() {
    audio.playSFX('panic');
    const panicEl = document.getElementById('panic-overlay');
    panicEl.style.opacity = '1';
    setTimeout(() => { panicEl.style.opacity = '0'; }, 1050);

    gameState.sensoryLoad = 42;
    gameState.maxResilience = Math.max(55, gameState.maxResilience - 10);
    gameState.resilience = Math.min(gameState.maxResilience, Math.max(20, gameState.resilience - 15));
    gameState.isHiding = false;
    switchArea('room304', 855);
    setMonologue(
        'Langkah itu terlalu dekat! Napasku tercekat dan pandanganku gelap—aku terpaksa mundur mengunci diri di Kamar 304.',
        'Cemas Memuncak! Batas Mental -10. Masak sup atau rawat terarium untuk pulih.'
    );
    showToast('Terlalu cemas! Kembali menenangkan diri di Kamar 304.', '⚡');
    saveGameProgress();
}

// --- MODAL SYSTEM ---
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');

function openModal(htmlContent) {
    gameState.modalOpen = true;
    gameState.moveLeft = false;
    gameState.moveRight = false;
    gameState.targetX = null;
    modalContent.innerHTML = htmlContent;
    modalBackdrop.classList.remove('hidden');
}

function closeModal() {
    cleanupActiveMiniGame();
    gameState.modalOpen = false;
    modalBackdrop.classList.add('hidden');
    updateHUD();
}

document.getElementById('btn-close-modal').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
});

// --- HOTSPOT DISPATCHER ---
function interactCurrentHotspot() {
    const h = gameState.activeHotspot;
    if (!h || gameState.modalOpen || (gameState.cutscene && gameState.cutscene.active)) return;

    if (h.id === 'kitchen') {
        openSoupMicroGame();
    } else if (h.id === 'terrarium') {
        openTerrariumCareMicroGame();
    } else if (h.id === 'vent_window') {
        openObservationModal();
    } else if (h.id === 'workbench') {
        openWorkbenchModal();
    } else if (h.id === 'keepsakes') {
        openKeepsakesModal();
    } else if (h.id === 'door_gift') {
        openSilentReplyModal();
    } else if (h.id === 'door_out') {
        if (gameState.pendingGift) {
            showToast('Periksa dulu bingkisan Balasan Sunyi di keset depan pintumu!', '🎁');
            return;
        }
        if (gameState.isDawn) {
            showToast('Pagi hari yang tenang. Semua tetanggamu kini baik-baik saja.', '🌅');
            return;
        }
        switchArea('hallway', 595);
    } else if (h.id === 'door_304_in') {
        switchArea('room304', 875);
    } else if (h.id === 'trash_bin') {
        openTrashScavengeModal();
    } else if (h.id === 'door_301') {
        handleNeighborDoorInteraction('ratna', '301', 'Bu Ratna', 'itemRatna', 'Radio Keroncong Tua');
    } else if (h.id === 'door_302') {
        handleNeighborDoorInteraction('damar', '302', 'Mas Damar', 'itemDamar', 'Senter Kurir Modifikasi');
    } else if (h.id === 'door_305') {
        handleNeighborDoorInteraction('sora', '305', 'Sora', 'itemSora', 'Terarium Lentera Kecil');
    } else if (h.id === 'stairs_roof') {
        if (!gameState.delivered.ratna || !gameState.delivered.damar || !gameState.delivered.sora) {
            openModal(`
                <div>
                    <span class="m-kicker amber">Tangga Atap Terkunci</span>
                    <h2 class="m-title">Selesaikan Malam Ini Terlebih Dahulu</h2>
                    <p class="m-desc">Tangga menuju atap baru akan terbuka di Malam Ketiga setelah ketiga tetanggamu terbantu.</p>
                    <div class="m-card" style="display:flex; flex-direction:column; gap:6px; font-size:13px;">
                        <div style="color:${gameState.delivered.ratna ? '#34d399' : '#94a3b8'};">${gameState.delivered.ratna ? '✓' : '○'} Malam 1 — Kamar 301 (Bu Ratna)</div>
                        <div style="color:${gameState.delivered.damar ? '#34d399' : '#94a3b8'};">${gameState.delivered.damar ? '✓' : '○'} Malam 2 — Kamar 302 (Mas Damar)</div>
                        <div style="color:${gameState.delivered.sora ? '#34d399' : '#94a3b8'};">${gameState.delivered.sora ? '✓' : '○'} Malam 3 — Kamar 305 (Sora)</div>
                    </div>
                    <button onclick="closeModal()" class="m-btn secondary">Mengerti</button>
                </div>
            `);
        } else {
            switchArea('rooftop', 160);
        }
    } else if (h.id === 'roof_door_back') {
        switchArea('hallway', 895);
    } else if (h.id === 'sora_climax') {
        openClimaxRooftopModal();
    }
}

// --- OBSERVATION MODAL (STEP 1 PER NIGHT) ---
function openObservationModal() {
    const conf = NIGHT_DATA[gameState.night];
    const observed = gameState.clues[conf.neighborKey];

    openModal(`
        <div>
            <span class="m-kicker sky">Malam ${conf.number} • Observasi Ventilasi</span>
            <h2 class="m-title">Suara di Balik Dinding (${conf.roomNum})</h2>
            <p class="m-desc">Tempelkan telingamu pelan di kisi ventilasi untuk memahami keadaan ${conf.neighborName} malam ini.</p>

            <div class="m-card ${observed ? 'done' : 'highlight'}">
                <div class="font-mono-tech" style="font-size:11px; color:#fbbf24; margin-bottom:6px;">
                    Kamar ${conf.roomNum} • ${conf.neighborName}
                </div>
                ${conf.ventQuotes.map(q => `<p style="margin:0 0 8px; font-size:14px; color:#e2e8f0; font-style:italic;">${q}</p>`).join('')}
                <div style="border-top:1px solid rgba(148,163,184,0.16); padding-top:8px; margin-top:8px; font-size:13px; color:#a7f3d0;">
                    ${observed ? `✓ Catatan: ${conf.ventSummary}` : 'Tekan tombol di bawah untuk mencatat kebutuhan tetanggamu.'}
                </div>
            </div>

            ${!observed ? `
                <button id="btn-record-clue" class="m-btn sky">👂 Dengarkan & Catat (-5 Mental)</button>
            ` : `
                <button onclick="closeModal()" class="m-btn secondary">Tutup</button>
            `}
        </div>
    `);

    const recBtn = document.getElementById('btn-record-clue');
    if (recBtn) {
        recBtn.addEventListener('click', () => {
            audio.playSFX('chime');
            gameState.resilience = Math.max(5, gameState.resilience - 5);
            gameState.clues[conf.neighborKey] = true;
            saveGameProgress();
            showToast(`Kabar ${conf.neighborName} dicatat! Periksa ${conf.trashShortTitle} di lorong.`, '👂');
            setMonologue(conf.ventSummary, `Keluar ke Lorong Lantai 3 dan periksa ${conf.trashShortTitle}.`);
            openObservationModal();
            updateHUD();
        });
    }
}

// --- SCAVENGE MODAL (STEP 2 PER NIGHT) ---
function openTrashScavengeModal() {
    const conf = NIGHT_DATA[gameState.night];
    const hasObserved = gameState.clues[conf.neighborKey];
    const hasItem = gameState.inventory[conf.inventoryKey];

    openModal(`
        <div>
            <span class="m-kicker amber">Malam ${conf.number} • ${conf.trashShortTitle} Lorong</span>
            <h2 class="m-title">Barang Bekas & Terbuang</h2>

            ${!hasObserved ? `
                <div class="m-card">
                    <p style="margin:0; font-size:14px; color:#cbd5e1;">Kau belum tahu barang apa yang harus dicari malam ini. Dengarkan suara di balik <strong>Ventilasi Kamar 304</strong> terlebih dahulu.</p>
                </div>
                <button onclick="closeModal()" class="m-btn secondary">Kembali ke Kamar 304</button>
            ` : `
                <div class="m-card ${hasItem ? 'done' : 'highlight'}">
                    <div class="font-mono-tech" style="font-size:11px; color:#fbbf24; margin-bottom:4px;">Untuk ${conf.neighborName} (${conf.roomNum})</div>
                    <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:4px;">${conf.trashTitle}</div>
                    <p style="margin:0; font-size:13px; color:#cbd5e1;">${conf.trashDesc}</p>
                </div>
                ${!hasItem ? `
                    <button id="btn-take-trash" class="m-btn amber">🖐️ Ambil Barang Rusak Ini</button>
                ` : `
                    <button onclick="closeModal()" class="m-btn secondary">Sudah Diambil — Bawa ke Meja Kerja</button>
                `}
            `}
        </div>
    `);

    const takeBtn = document.getElementById('btn-take-trash');
    if (takeBtn) {
        takeBtn.addEventListener('click', () => {
            audio.playSFX('door');
            gameState.inventory[conf.inventoryKey] = true;
            gameState.sensoryLoad = Math.min(100, gameState.sensoryLoad + 8);
            saveGameProgress();
            closeModal();
            showToast(`${conf.trashTitle} diamankan! Kembali ke Meja Kerja Kamar 304.`, '🎒');
            setMonologue('Barangnya sudah di tanganku. Aku harus segera masuk ke Kamar 304 untuk memperbaikinya.', 'Buka Meja Kerja di Kamar 304.');
            updateHUD();
        });
    }
}

// --- WORKBENCH MODAL (STEP 3 PER NIGHT -> UNIQUE MINI-GAMES!) ---
function openWorkbenchModal() {
    const conf = NIGHT_DATA[gameState.night];
    const ready = gameState.clues[conf.neighborKey] && gameState.inventory[conf.inventoryKey];
    const crafted = gameState.crafted[conf.craftedKey];

    openModal(`
        <div>
            <span class="m-kicker amber">Malam ${conf.number} • Meja Kerja Kamar 304</span>
            <h2 class="m-title">Reparasi Diam-Diam</h2>
            <p class="m-desc">Perbaiki barang milik tetanggamu dengan tenang di bawah lampu meja.</p>

            <div class="m-card ${crafted ? 'done' : 'highlight'}">
                <div class="font-mono-tech" style="font-size:11px; color:#fbbf24;">Untuk ${conf.neighborName} (Kamar ${conf.roomNum})</div>
                <div style="font-size:16px; font-weight:700; color:#fff; margin:3px 0;">${conf.itemTitle}</div>
                <p style="margin:0 0 12px; font-size:13px; color:#cbd5e1;">${conf.ventSummary}</p>

                ${crafted ? `
                    <div style="color:#34d399; font-weight:700; font-size:13px;">✓ Selesai Dirakit — Siap diantar ke Pintu ${conf.roomNum}</div>
                ` : `
                    <button id="btn-launch-craft" class="m-btn primary" ${ready ? '' : 'disabled'}>
                        ${ready ? '🔧 Mulai Merakit & Memperbaiki' : 'Ambil Bahan di Lorong Dulu'}
                    </button>
                `}
            </div>
        </div>
    `);

    const btn = document.getElementById('btn-launch-craft');
    if (btn && ready) {
        btn.addEventListener('click', () => {
            if (gameState.night === 1) startRadioTuningGame();
            else if (gameState.night === 2) startFlashlightWiringGame();
            else startTerrariumCraftGame();
        });
    }
}

// --- SUDUT KENANGAN MODAL (INSPECTABLE KEEPSAKES IN ROOM 304) ---
function openKeepsakesModal() {
    const keys = ['ratna', 'damar', 'sora'];
    const unlockedCount = keys.filter(k => gameState.repliesCollected[k]).length;

    openModal(`
        <div>
            <span class="m-kicker ${gameState.isDawn ? 'amber' : 'emerald'}">
                ${gameState.isDawn ? 'Pagi di Kamar 304 • Kenangan Hangat' : `Sudut Kenangan Kamar 304 (${unlockedCount}/3)`}
            </span>
            <h2 class="m-title">Benda-Benda Balasan Sunyi</h2>
            <p class="m-desc">
                Setiap bingkisan kecil dari tetanggamu tersimpan rapi di sudut meja ini—pengingat bahwa kamarmu tak lagi benar-benar terisolasi.
            </p>

            ${keys.map(k => {
                const item = KEEPSAKE_REFLECTIONS[k];
                const collected = Boolean(gameState.repliesCollected[k]);
                return `
                    <div class="m-card ${collected ? 'done' : ''}">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
                            <span style="font-size:22px;">${collected ? item.icon : '❔'}</span>
                            <strong style="font-size:14.5px; color:${collected ? '#fff' : '#64748b'};">
                                ${collected ? item.title : 'Bingkisan Belum Diterima'}
                            </strong>
                        </div>
                        <p style="margin:0; font-size:13px; color:${collected ? '#d1fae5' : '#64748b'}; font-style:${collected ? 'italic' : 'normal'};">
                            ${collected ? `"${item.dawnText}"` : 'Bantu tetangga di lorong dan temukan balasannya di keset pintu 304.'}
                        </p>
                    </div>
                `;
            }).join('')}

            <button onclick="closeModal()" class="m-btn secondary">Tutup</button>
        </div>
    `);
}

// --- SILENT DELIVERY AT NEIGHBOR DOOR (STEP 4 PER NIGHT + REACTIVE REVISITS) ---
function handleNeighborDoorInteraction(whoKey, roomNum, name, itemKey, itemName) {
    if (gameState.delivered[whoKey]) {
        const revisitText = DOOR_REVISIT_DATA[whoKey] && DOOR_REVISIT_DATA[whoKey][gameState.night];
        if (revisitText) {
            const bonusKey = `${whoKey}_n${gameState.night}`;
            if (!gameState.revisitBonusGiven[bonusKey]) {
                gameState.revisitBonusGiven[bonusKey] = true;
                gameState.resilience = Math.min(gameState.maxResilience, gameState.resilience + 5);
                audio.playSFX('chime');
                saveGameProgress();
                updateHUD();
                showToast(`Mengintip kabar Kamar ${roomNum} menenangkan hatimu (+5 Mental)`, '💛');
            } else {
                showToast(`Kamar ${roomNum} (${name}) tampak tenang malam ini.`, '🕊️');
            }
            setMonologue(revisitText, `Kabar hangat dari Kamar ${roomNum} (${name}).`);
            return;
        }
        showToast(`Kamar ${roomNum} (${name}) sudah menerima bantuanmu.`, '✓');
        return;
    }
    if (!gameState.crafted[itemKey]) {
        showToast(`Perbaiki ${itemName} di Meja Kerja Kamar 304 terlebih dahulu!`, '⚠️');
        setMonologue(`Aku belum membawa ${itemName} untuk ${name}.`, 'Periksa Ventilasi, barang di lorong, lalu Meja Kerja.');
        return;
    }

    openModal(`
        <div>
            <span class="m-kicker emerald">Langkah Pengantaran Sunyi</span>
            <h2 class="m-title">Pintu Kamar ${roomNum} (${name})</h2>
            <p class="m-desc">Letakkan <strong>${itemName}</strong> perlahan di atas keset tanpa mengetuk pintu, lalu segera melangkah pergi.</p>
            <button id="btn-confirm-deliver" class="m-btn emerald">🎁 Letakkan Diam-diam (-15 Mental)</button>
        </div>
    `);

    document.getElementById('btn-confirm-deliver').addEventListener('click', () => {
        if (gameState.resilience < 15) {
            showToast('Mental kurang dari 15! Isi ulang dengan Terarium/Sup di Kamar 304.', '⚠️');
            closeModal();
            return;
        }
        const conf = NIGHT_DATA[gameState.night];
        audio.playSFX('chime');
        gameState.resilience -= 15;
        gameState.sensoryLoad = Math.min(100, gameState.sensoryLoad + 10);
        gameState.delivered[whoKey] = true;
        saveGameProgress();
        closeModal();
        showToast(`${itemName} diletakkan di depan Kamar ${roomNum}!`, '✨');
        setMonologue(
            conf ? conf.deliveryReaction : 'Barang telah diletakkan dengan selamat.',
            gameState.night < 3
                ? 'Kembali masuk ke Kamar 304 untuk beristirahat.'
                : 'Semua tetangga terbantu! Naik Tangga Atap di ujung kanan lorong.'
        );
        updateHUD();
    });
}

// --- SILENT REPLY COLLECTION & NIGHT TRANSITION ---
function openSilentReplyModal() {
    const key = gameState.pendingGift;
    if (!key) return;
    const nightNum = key === 'ratna' ? 1 : key === 'damar' ? 2 : 3;
    const conf = NIGHT_DATA[nightNum];

    audio.playSFX('gift');
    openModal(`
        <div style="text-align:center;">
            <span class="m-kicker amber">Balasan Sunyi di Depan Pintu 304</span>
            <div style="font-size:44px; margin:6px 0;">${conf.replyIcon}</div>
            <h2 class="m-title" style="padding-right:0;">${conf.replyTitle}</h2>
            <div class="letter-paper" style="text-align:left;">
                ${conf.replyLetter}
            </div>
            <p class="m-desc" style="margin-bottom:14px;">${conf.replyNote}</p>
            <button id="btn-collect-reply" class="m-btn primary">
                ${nightNum < 3 ? `Simpan Kenangan & Lanjut ke Malam ${nightNum + 1} →` : 'Simpan Kenangan'}
            </button>
        </div>
    `);

    document.getElementById('btn-collect-reply').addEventListener('click', () => {
        gameState.repliesCollected[key] = true;
        gameState.pendingGift = null;
        gameState.curtainOpen = Math.max(gameState.curtainOpen, conf.curtainTarget);
        gameState.resilience = Math.min(100, gameState.resilience + 25);
        gameState.sensoryLoad = Math.max(0, gameState.sensoryLoad - 25);
        gameState.journalNotes.push({
            night: nightNum,
            from: conf.neighborName,
            title: conf.replyTitle,
            letter: conf.replyLetter
        });

        closeModal();
        if (nightNum < 3) {
            advanceToNight(nightNum + 1);
        } else {
            saveGameProgress();
            updateHUD();
        }
    });
}

function advanceToNight(nextNight) {
    const conf = NIGHT_DATA[nextNight];
    const overlay = document.getElementById('night-transition-overlay');
    document.getElementById('nt-kicker').textContent = conf.timeLabel;
    document.getElementById('nt-title').textContent = conf.title;
    document.getElementById('nt-sub').textContent = nextNight === 2
        ? 'Hujan di luar semakin deras. Lampu lorong mulai sering berkedip.'
        : 'Puncak badai malam ini. Gemuruh petir terdengar dari atap rusun.';

    overlay.classList.add('active');
    setTimeout(() => {
        gameState.night = nextNight;
        gameState.soupCharges = 2;
        gameState.terrariumCooldown = 0;
        gameState.playerX = 480;
        gameState.hallwayNPC.x = 210;
        saveGameProgress();
        switchArea('room304', 480);
        setTimeout(() => {
            overlay.classList.remove('active');
            showToast(`Memasuki Malam ${nextNight} (2 Porsi Sup Hangat tersedia)`, '🌧️');
        }, 1450);
    }, 850);
}

// --- ROOFTOP CLIMAX & VISUAL CUTSCENE ENGINE ---
function openClimaxRooftopModal() {
    const resNow = Math.floor(gameState.resilience);
    const canLanterns = gameState.resilience >= 30;
    const hasPriorReplies = Boolean(gameState.repliesCollected.ratna && gameState.repliesCollected.damar);
    const canTrueEnding = gameState.resilience >= 50 && hasPriorReplies;

    openModal(`
        <div>
            <span class="m-kicker rose">Babak Penentuan • Atap Gedung</span>
            <h2 class="m-title">Sora di Tengah Sunyi Badai</h2>
            <p class="m-desc">
                Di tengah derai hujan, Sora memeluk Terarium Lentera yang berkedip mengikuti tetesan air.
                Karena pendengarannya telah hilang, ia <strong>tak bisa mendengar teriakan maupun langkah kakimu</strong>—hanya cahaya dan kehadiran nyata yang bisa menjangkaunya.
            </p>

            <button onclick="startEndingCutscene('avoidant')" class="choice-card">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                    <strong style="font-size:15px;">Pilihan A: Beri Sinyal ke Tangga & Panggil Damar</strong>
                    <span class="pill-badge warn" style="flex-shrink:0;">Tetap Tersembunyi</span>
                </div>
                <p style="margin:0; font-size:13px; color:#cbd5e1;">Sorotkan sinyal senter ke bawah memanggil Damar, lalu mundur ke bayangan tangga sebelum terlihat.</p>
            </button>

            <button onclick="startEndingCutscene('lanterns')" class="choice-card emerald-border">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                    <strong style="font-size:15px; color:#6ee7b7;">Pilihan B: Susun Jalur Lentera Lumut</strong>
                    <span class="pill-badge ${canLanterns ? '' : 'danger'}" style="flex-shrink:0;">
                        ${canLanterns ? '✓ Mental ≥ 30' : `Butuh 30 Mental (${resNow})`}
                    </span>
                </div>
                <p style="margin:0; font-size:13px; color:#cbd5e1;">Letakkan deretan lentera lumut di lantai basah sebagai jejak visual agar Sora menoleh dan menjauh dari tepian.</p>
            </button>

            <button onclick="startEndingCutscene('threshold')" class="choice-card gold-border">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:4px;">
                    <strong style="font-size:15px; color:#fde68a;">Pilihan C: Melangkah, Buka Payung & Duduk Bersama</strong>
                    <span class="pill-badge ${canTrueEnding ? '' : 'danger'}" style="flex-shrink:0; ${canTrueEnding ? 'background:#f59e0b; color:#090b0e; border-color:#fbbf24;' : ''}">
                        ${canTrueEnding ? '✓ Ending Sejati' : `Butuh 50 Mental (${resNow})`}
                    </span>
                </div>
                <p style="margin:0; font-size:13px; color:#fef3c7;">Lawan ketakutan terbesarmu. Berjalanlah ke sampingnya, buka payung, dan temani dalam diam hingga fajar tiba.</p>
            </button>
        </div>
    `);
}

window.startEndingCutscene = function(type) {
    if (type === 'lanterns' && gameState.resilience < 30) {
        showToast('Butuh minimal 30 Mental untuk Pilihan B! Rawat lumut/sup di Kamar 304 dulu.', '⚠️');
        return;
    }
    if (type === 'threshold') {
        if (!gameState.repliesCollected.ratna || !gameState.repliesCollected.damar) {
            showToast('Kumpulkan Balasan Sunyi Malam 1 & 2 terlebih dahulu untuk membuka Ending Sejati.', '💌');
            return;
        }
        if (gameState.resilience < 50) {
            showToast('Butuh minimal 50 Mental untuk Pilihan C! Turun sebentar ke Kamar 304 untuk menyeduh sup atau merawat lumut.', '⚠️');
            return;
        }
    }

    closeModal();
    audio.playSFX(type === 'threshold' ? 'umbrella' : 'chime');

    gameState.cutscene = {
        active: true,
        type,
        progress: 0,
        dawnProgress: 0,
        focusX: type === 'threshold' ? 700 : 520,
        hideNormalRaka: type === 'threshold',
        finished: false
    };

    const bar = document.getElementById('cutscene-bar');
    const textEl = document.getElementById('cutscene-text');
    const actionsEl = document.getElementById('cutscene-actions');
    actionsEl.innerHTML = '';
    bar.classList.remove('hidden');
    document.getElementById('game-footer').classList.add('hidden');
    document.getElementById('hotspot-prompt').classList.add('hidden');

    if (type === 'avoidant') {
        textEl.textContent = 'Kau memberi kode ke arah tangga lalu mundur ke bayangan pintu. Tak lama, sorot senter Mas Damar muncul membimbing Sora turun dengan aman.';
    } else if (type === 'lanterns') {
        textEl.textContent = 'Satu per satu kau menyusun toples terarium berpendar di lantai basah. Cahaya hijau lembut itu menuntun pandangan Sora menjauh dari pagar atap.';
    } else {
        textEl.textContent = 'Dengan tangan gemetar, kau membuka payung di atas kalian berdua dan duduk diam di sampingnya... Perlahan badai mereda, dan langit mulai menguning menyambut fajar.';
    }
};

function finishCutscene(type) {
    if (!gameState.cutscene || gameState.cutscene.finished) return;
    gameState.cutscene.finished = true;

    gameState.unlockedEndings[type] = true;
    if (type === 'threshold') {
        gameState.isDawn = true;
        gameState.curtainOpen = 0.72;
        gameState.repliesCollected.sora = true;
        if (!gameState.journalNotes.some(n => n.night === 3)) {
            const c3 = NIGHT_DATA[3];
            gameState.journalNotes.push({
                night: 3,
                from: c3.neighborName,
                title: c3.replyTitle,
                letter: c3.replyLetter
            });
        }
        audio.updateEnvironment('rooftop', 3, true);
    }
    saveGameProgress();
    updateHUD();

    const endData = ENDINGS_DATA[type];
    const unlockedCount = Object.values(gameState.unlockedEndings).filter(Boolean).length;
    const actionsEl = document.getElementById('cutscene-actions');
    document.getElementById('cutscene-text').innerHTML = `
        <div class="font-mono-tech" style="font-size:11px; color:#34d399; text-transform:uppercase; margin-bottom:4px;">
            ${endData.badge} • Koleksi Akhir ${unlockedCount}/3
        </div>
        <div style="font-size:19px; font-weight:700; color:#fff; margin-bottom:6px;">${endData.title}</div>
        <div style="font-size:13px; color:#e2e8f0; margin-bottom:10px;">${endData.summary}</div>
    `;

    actionsEl.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">
            <button id="btn-retry-ending" class="m-btn secondary sm">Coba Pilihan Lain di Atap</button>
            ${type === 'threshold'
                ? `<button id="btn-dawn-epilogue" class="m-btn primary sm">🌅 Jelajahi Kamar 304 (Fajar)</button>`
                : `<button id="btn-new-cycle" class="m-btn amber sm">Mulai Ulang dari Malam 1</button>`}
        </div>
    `;

    document.getElementById('btn-retry-ending').addEventListener('click', () => {
        document.getElementById('cutscene-bar').classList.add('hidden');
        document.getElementById('game-footer').classList.remove('hidden');
        gameState.cutscene = null;
        gameState.isDawn = false;
        audio.updateEnvironment('rooftop', 3, false);
        openClimaxRooftopModal();
    });

    const dawnBtn = document.getElementById('btn-dawn-epilogue');
    if (dawnBtn) {
        dawnBtn.addEventListener('click', () => {
            document.getElementById('cutscene-bar').classList.add('hidden');
            document.getElementById('game-footer').classList.remove('hidden');
            gameState.cutscene = null;
            gameState.sensoryLoad = 0;
            gameState.resilience = 100;
            gameState.maxResilience = 100;
            switchArea('room304', 480);
            saveGameProgress();
        });
    }

    const resetBtn = document.getElementById('btn-new-cycle');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetNewRunKeepUnlocks();
        });
    }
}

function resetNewRunKeepUnlocks() {
    document.getElementById('cutscene-bar').classList.add('hidden');
    document.getElementById('game-footer').classList.remove('hidden');
    const savedUnlocks = { ...gameState.unlockedEndings };
    gameState = createInitialState(savedUnlocks);
    saveGameProgress();
    closeModal();
    switchArea('room304', 480);
    showToast('Memulai Malam 1 (Koleksi Akhir tetap tersimpan).', '🌿');
}

// --- JOURNAL, SILENT REPLIES & ENDING GALLERY MODAL ---
function openJournalModal(defaultTab = 'mission') {
    let tab = defaultTab;
    const render = () => {
        const endCount = Object.values(gameState.unlockedEndings).filter(Boolean).length;
        const notes = gameState.journalNotes;

        openModal(`
            <div>
                <span class="m-kicker amber">Buku Catatan Raka</span>
                <h2 class="m-title">Tas, Surat & Koleksi Akhir</h2>

                <div class="m-tabs">
                    <button id="jtab-mission" class="m-tab ${tab === 'mission' ? 'active' : ''}">📦 Misi & Tas</button>
                    <button id="jtab-letters" class="m-tab ${tab === 'letters' ? 'active' : ''}">💌 Balasan (${notes.length})</button>
                    <button id="jtab-endings" class="m-tab ${tab === 'endings' ? 'active' : ''}">🌅 Akhir (${endCount}/3)</button>
                </div>

                ${tab === 'mission' ? `
                    <div class="m-card">
                        <div style="font-size:13px; color:#fde68a; font-weight:700; margin-bottom:6px;">Progres 3 Malam</div>
                        <div style="display:flex; flex-direction:column; gap:7px; font-size:13px;">
                            <div style="display:flex; justify-content:space-between;">
                                <span>📻 Radio Bu Ratna (301)</span>
                                <span style="color:${gameState.delivered.ratna ? '#34d399' : '#94a3b8'};">${gameState.delivered.ratna ? '✓ Terantar' : (gameState.crafted.itemRatna ? 'Siap Antar' : 'Malam 1')}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between;">
                                <span>🔦 Senter Mas Damar (302)</span>
                                <span style="color:${gameState.delivered.damar ? '#34d399' : '#94a3b8'};">${gameState.delivered.damar ? '✓ Terantar' : (gameState.crafted.itemDamar ? 'Siap Antar' : 'Malam 2')}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between;">
                                <span>🫙 Lentera Sora (305)</span>
                                <span style="color:${gameState.delivered.sora ? '#34d399' : '#94a3b8'};">${gameState.delivered.sora ? '✓ Terantar' : (gameState.crafted.itemSora ? 'Siap Antar' : 'Malam 3')}</span>
                            </div>
                        </div>
                    </div>
                    <button id="btn-reset-save" class="m-btn ghost">🔄 Mulai Ulang dari Malam 1</button>
                ` : tab === 'letters' ? `
                    ${notes.length === 0 ? `
                        <div class="m-card" style="text-align:center; color:#94a3b8;">
                            Belum ada Balasan Sunyi. Bantu tetanggamu lalu kembali ke Kamar 304 untuk menemukan hadiah kecil di depan pintu.
                        </div>
                    ` : notes.map(n => `
                        <div class="m-card done">
                            <div class="font-mono-tech" style="font-size:11px; color:#fbbf24;">Malam ${n.night} • Dari ${n.from}</div>
                            <div style="font-weight:700; color:#fff; margin-bottom:4px;">${n.title}</div>
                            <div class="letter-paper" style="margin:6px 0 0;">${n.letter}</div>
                        </div>
                    `).join('')}
                ` : `
                    ${Object.values(ENDINGS_DATA).map(ed => {
                        const unlocked = gameState.unlockedEndings[ed.id];
                        return `
                            <div class="m-card ${unlocked ? 'done' : ''}">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span class="font-mono-tech" style="font-size:11px; color:${unlocked ? '#34d399' : '#64748b'};">${ed.badge}</span>
                                    <span style="font-size:12px; font-weight:700; color:${unlocked ? '#34d399' : '#64748b'};">${unlocked ? '✓ Terbuka' : '🔒 Terkunci'}</span>
                                </div>
                                <div style="font-weight:700; font-size:15px; color:#fff; margin:3px 0;">${unlocked ? ed.title : '??? (Belum Ditemukan)'}</div>
                                <p style="margin:0; font-size:12.5px; color:#cbd5e1;">${unlocked ? ed.summary : ed.epilogueHint}</p>
                            </div>
                        `;
                    }).join('')}
                `}
            </div>
        `);

        document.getElementById('jtab-mission').addEventListener('click', () => { tab = 'mission'; render(); });
        document.getElementById('jtab-letters').addEventListener('click', () => { tab = 'letters'; render(); });
        document.getElementById('jtab-endings').addEventListener('click', () => { tab = 'endings'; render(); });
        const resetBtn = document.getElementById('btn-reset-save');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => resetNewRunKeepUnlocks());
        }
    };
    render();
}

document.getElementById('btn-open-journal').addEventListener('click', () => openJournalModal('mission'));
document.getElementById('m-btn-journal').addEventListener('click', () => openJournalModal('mission'));

// --- INSTALL PWA / APK MODAL ---
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const installBtn = document.getElementById('btn-install-app');
    if (installBtn) installBtn.textContent = '📲 Install ke Layar HP';
});

function openInstallGuideModal() {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(() => {
            deferredInstallPrompt = null;
        });
        return;
    }
    openModal(`
        <div>
            <span class="m-kicker emerald">Install di Android / iOS / Offline</span>
            <h2 class="m-title">Pasang Game ke HP Kamu</h2>
            <div class="m-card">
                <strong style="color:#6ee7b7;">Cara 1: Langsung dari Browser (PWA Offline)</strong>
                <p style="margin:6px 0 0; font-size:13px; color:#cbd5e1;">
                    • <strong>Android Chrome:</strong> Ketuk ikon titik tiga (⋮) di pojok kanan atas lalu pilih <em>"Tambahkan ke Layar Utama / Install App"</em>.<br>
                    • <strong>iPhone Safari:</strong> Ketuk tombol Share (□↑) lalu pilih <em>"Add to Home Screen"</em>.<br>
                    Setelah terpasang, game tampil <strong>Full Screen</strong> & tetap bisa dimainkan saat <strong>Offline</strong>.
                </p>
            </div>
            <div class="m-card highlight">
                <strong style="color:#fde68a;">Cara 2: Download File .APK Android</strong>
                <p style="margin:6px 0 10px; font-size:13px; color:#cbd5e1;">
                    Install langsung sebagai aplikasi Android native offline:
                </p>
                <a href="https://github.com/Ryn-debugging/terarium-di-ujung-sana/releases/download/latest/Terarium-di-Ujung-Lorong.apk"
                   target="_blank" rel="noopener noreferrer" class="m-btn amber sm" style="width:100%; text-decoration:none;">
                    ⬇️ Download Terarium-di-Ujung-Lorong.apk
                </a>
            </div>
            <button onclick="closeModal()" class="m-btn secondary">Mengerti</button>
        </div>
    `);
}

// --- DELTA-TIME SIMULATION LOOP ---
function updateSimulation(dt) {
    // Rain & Particles always animate smoothly
    const rainMult = gameState.area === 'rooftop' ? 1.15 : 0.7;
    for (const r of gameState.rainDrops) {
        r.y += r.speed * rainMult * dt;
        r.x -= 95 * dt;
        if (r.y > 465) {
            r.y = 52;
            r.x = 40 + Math.random() * 930;
        }
    }

    for (const p of gameState.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < 100) p.y = 450;
        if (p.x < 60) p.x = 940;
        if (p.x > 940) p.x = 60;
    }

    if (gameState.lightningFlash > 0) {
        gameState.lightningFlash = Math.max(0, gameState.lightningFlash - dt * 2.2);
    }

    // Active Cutscene Update
    if (gameState.cutscene && gameState.cutscene.active) {
        const cs = gameState.cutscene;
        if (!cs.finished) {
            cs.progress = Math.min(1, cs.progress + dt * 0.24);
            if (cs.type === 'threshold') {
                cs.dawnProgress = Math.min(1, Math.max(0, (cs.progress - 0.18) / 0.78));
            }
            if (cs.progress >= 1) {
                finishCutscene(cs.type);
            }
        }
        return;
    }

    if (gameState.modalOpen) return;

    // Cooldowns & Timers (in seconds)
    if (gameState.terrariumCooldown > 0) {
        gameState.terrariumCooldown = Math.max(0, gameState.terrariumCooldown - dt);
    }
    if (gameState.groundingAuraTimer > 0) {
        gameState.groundingAuraTimer = Math.max(0, gameState.groundingAuraTimer - dt);
    }

    // Storm Lightning & Thunder (Night 2/3 & Rooftop, except Dawn)
    const conf = NIGHT_DATA[gameState.night] || NIGHT_DATA[1];
    if (!gameState.isDawn && (conf.thunderChance > 0 || gameState.area === 'rooftop')) {
        gameState.thunderTimer -= dt;
        if (gameState.thunderTimer <= 0) {
            gameState.thunderTimer = gameState.area === 'rooftop' ? (5 + Math.random() * 5) : (8 + Math.random() * 8);
            if (gameState.area === 'rooftop' || Math.random() < conf.thunderChance) {
                gameState.lightningFlash = 1;
                audio.playThunder();
            }
        }
    }

    // Player Movement (Frame-rate Independent)
    let moveSpeed = 245;
    if (gameState.isHiding && gameState.area === 'hallway') moveSpeed = 108;
    else if (gameState.sensoryLoad > 80) moveSpeed = 152;

    let moving = false;
    if (gameState.moveLeft) {
        gameState.playerX -= moveSpeed * dt;
        gameState.facing = -1;
        gameState.targetX = null;
        moving = true;
    } else if (gameState.moveRight) {
        gameState.playerX += moveSpeed * dt;
        gameState.facing = 1;
        gameState.targetX = null;
        moving = true;
    } else if (gameState.targetX !== null) {
        const diff = gameState.targetX - gameState.playerX;
        if (Math.abs(diff) > 5) {
            gameState.playerX += Math.sign(diff) * moveSpeed * dt;
            gameState.facing = Math.sign(diff);
            moving = true;
        } else {
            gameState.targetX = null;
        }
    }
    gameState.playerX = Math.max(85, Math.min(935, gameState.playerX));
    if (moving) gameState.walkPhase += dt * (gameState.isHiding ? 6 : 11);
    audio.tickPlayerFootstep(dt, moving, gameState.isHiding, gameState.area);

    // Self-care gradual neglect decay
    if (!gameState.isDawn) {
        gameState.selfCareTimer += dt;
        if (gameState.selfCareTimer >= 18) {
            gameState.selfCareTimer = 0;
            if (gameState.maxResilience > 65) {
                gameState.maxResilience -= 2;
            }
        }
    }

    // Area-Specific Tension & Audio Dynamics
    if (gameState.area === 'room304') {
        const floor = gameState.isDawn ? 0 : 6;
        if (gameState.sensoryLoad > floor) {
            gameState.sensoryLoad = Math.max(floor, gameState.sensoryLoad - 9.0 * dt);
        }
    } else if (gameState.area === 'hallway') {
        const inCover = gameState.isHiding && COVER_SPOTS.some(c => Math.abs(gameState.playerX - c.x) < 48);
        const movingUpright = moving && !gameState.isHiding;

        // Ambient anxiety load + Sprint Noise Stress when walking openly without sneaking
        if (gameState.groundingAuraTimer <= 0 && !inCover) {
            const nightRate = gameState.night === 3 ? 3.2 : (gameState.night === 2 ? 2.6 : 2.1);
            const hideFactor = gameState.isHiding ? 0.32 : 1.0;
            const noiseExtra = movingUpright ? 1.5 : 0;
            gameState.sensoryLoad += (nightRate * hideFactor + noiseExtra) * dt;
        }

        // Soothing distant keroncong near Door 301 once delivered
        if (gameState.delivered.ratna) {
            audio.tickProximityKeroncong(dt, gameState.playerX);
            if (Math.abs(gameState.playerX - 120) < 90) {
                gameState.sensoryLoad = Math.max(0, gameState.sensoryLoad - 1.4 * dt);
            }
        }

        // Door Creak Warning & Neighbor Peek Hazard ("Gagang Pintu Berderit")
        if (!gameState.isDawn) {
            if (!gameState.doorPeek) {
                gameState.doorPeekCooldown -= dt;
                if (gameState.doorPeekCooldown <= 0) {
                    const doors = [
                        { roomNum: '301', x: 120 },
                        { roomNum: '302', x: 300 },
                        { roomNum: '305', x: 770 }
                    ];
                    const pick = doors[Math.floor(Math.random() * doors.length)];
                    audio.playSFX('creak');
                    gameState.doorPeek = {
                        roomNum: pick.roomNum,
                        x: pick.x,
                        phase: 'warning',
                        timer: 1.9,
                        hitApplied: false
                    };
                }
            } else {
                const dp = gameState.doorPeek;
                dp.timer -= dt;
                if (dp.phase === 'warning' && dp.timer <= 0) {
                    dp.phase = 'open';
                    dp.timer = 2.1;
                    audio.playSFX('door');
                } else if (dp.phase === 'open') {
                    const inBeam = Math.abs(gameState.playerX - dp.x) < 108;
                    if (!dp.hitApplied && inBeam) {
                        dp.hitApplied = true;
                        if (!inCover && !gameState.isHiding && gameState.groundingAuraTimer <= 0) {
                            gameState.sensoryLoad = Math.min(100, gameState.sensoryLoad + 22);
                            audio.playSFX('panic');
                            showToast(`Pintu ${dp.roomNum} terbuka! Merunduk [S] atau cari Spot Sembunyi!`, '👁️');
                        } else {
                            showToast(`Nyaris terlihat dari Pintu ${dp.roomNum}! Aman karena mengendap.`, '🙈');
                        }
                    }
                    if (dp.timer <= 0) {
                        gameState.doorPeek = null;
                        gameState.doorPeekCooldown = gameState.night === 3 ? (8.5 + Math.random() * 4) : (10.5 + Math.random() * 5);
                    }
                }
            }
        }

        // NPC Patrol & Spatial Footsteps
        const npc = gameState.hallwayNPC;
        if (npc.pauseTimer > 0) {
            npc.pauseTimer -= dt;
        } else {
            npc.x += npc.dir * conf.npcSpeed * dt;
            if (!npc.flippedThisPass && Math.abs(npc.x - 500) < 12 && Math.random() < conf.npcFlipChance) {
                npc.dir *= -1;
                npc.flippedThisPass = true;
                npc.pauseTimer = 0.6;
            }
            if (npc.x > 835) {
                npc.dir = -1;
                npc.pauseTimer = 1.3;
                npc.flippedThisPass = false;
            } else if (npc.x < 145) {
                npc.dir = 1;
                npc.pauseTimer = 1.3;
                npc.flippedThisPass = false;
            }

            npc.stepAudioTimer -= dt;
            if (npc.stepAudioTimer <= 0) {
                npc.stepAudioTimer = 0.56;
                const pan = Math.max(-1, Math.min(1, (npc.x - gameState.playerX) / 360));
                const prox = Math.max(0.1, 1 - Math.abs(npc.x - gameState.playerX) / 650);
                audio.playSpatialFootstep(pan, prox);
            }
        }

        // Proximity Anxiety Spike (Moving upright makes bigger noise detection radius!)
        const distToNPC = Math.abs(gameState.playerX - npc.x);
        const detectionRange = inCover ? 0 : (gameState.isHiding ? 72 : (movingUpright ? 155 : 125));
        if (distToNPC < detectionRange && gameState.groundingAuraTimer <= 0) {
            const penalty = (detectionRange - distToNPC) * (gameState.isHiding ? 0.14 : 0.38);
            gameState.sensoryLoad += penalty * dt;
        }

        if (gameState.sensoryLoad >= 100) {
            triggerSensoryOverload();
            return;
        }
    } else if (gameState.area === 'rooftop') {
        if (gameState.groundingAuraTimer <= 0 && gameState.sensoryLoad < 68) {
            gameState.sensoryLoad += 2.2 * dt;
        }
    }

    // Nearest Hotspot Detection
    const list = getVisibleHotspotsForArea(gameState.area);
    let nearest = null;
    let minDist = 68;
    for (const h of list) {
        const d = Math.abs(gameState.playerX - h.x);
        if (d < minDist) {
            minDist = d;
            nearest = h;
        }
    }
    gameState.activeHotspot = nearest;

    const promptWrap = document.getElementById('hotspot-prompt');
    const promptLabel = document.getElementById('hotspot-prompt-label');
    if (nearest && !gameState.modalOpen) {
        promptLabel.textContent = nearest.label;
        promptWrap.classList.remove('hidden');
    } else {
        promptWrap.classList.add('hidden');
    }

    updateHUD();
}

// --- INPUT LISTENERS & MOBILE LIFECYCLE SAFETY ---
const clearMovementFlags = () => {
    gameState.moveLeft = false;
    gameState.moveRight = false;
};
window.addEventListener('blur', clearMovementFlags);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearMovementFlags();
});

// Capacitor Android Hardware Back Button Handling
if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', ({ canGoBack }) => {
        if (gameState.modalOpen) {
            closeModal();
            return;
        }
        if (gameState.area === 'rooftop' && !(gameState.cutscene && gameState.cutscene.active)) {
            switchArea('hallway', 895);
            return;
        }
        if (gameState.area === 'hallway') {
            showToast('Kembali masuk ke Pintu 304 untuk menutup game atau membuka Jurnal.', '🏠');
            return;
        }
        const titleEl = document.getElementById('title-screen');
        if (titleEl && titleEl.classList.contains('hidden')) {
            openJournalModal('mission');
            return;
        }
        if (canGoBack) window.history.back();
        else window.Capacitor.Plugins.App.exitApp();
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        gameState.moveLeft = true;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        gameState.moveRight = true;
    } else if (e.code === 'KeyE' || e.code === 'Enter') {
        interactCurrentHotspot();
    } else if (e.code === 'KeyS' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!e.repeat) toggleHide();
    } else if (e.code === 'Space') {
        e.preventDefault();
        triggerGrounding();
    } else if (e.code === 'Escape' && gameState.modalOpen) {
        closeModal();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') gameState.moveLeft = false;
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') gameState.moveRight = false;
});

canvas.addEventListener('pointerdown', (e) => {
    audio.init();
    if (gameState.modalOpen || (gameState.cutscene && gameState.cutscene.active)) return;

    const rect = canvas.getBoundingClientRect();
    const worldX = screenToWorldX(e.clientX, rect);

    const list = getVisibleHotspotsForArea(gameState.area);
    for (const h of list) {
        if (Math.abs(worldX - h.x) < 42) {
            if (Math.abs(gameState.playerX - h.x) < 68) {
                interactCurrentHotspot();
                return;
            }
            gameState.targetX = h.x;
            return;
        }
    }
    gameState.targetX = Math.max(85, Math.min(935, worldX));
});

const bindHoldButton = (btnId, prop) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        audio.init();
        gameState[prop] = true;
    });
    btn.addEventListener('pointerup', () => { gameState[prop] = false; });
    btn.addEventListener('pointercancel', () => { gameState[prop] = false; });
    btn.addEventListener('pointerleave', () => { gameState[prop] = false; });
};

bindHoldButton('btn-move-left', 'moveLeft');
bindHoldButton('btn-move-right', 'moveRight');

document.getElementById('btn-action-main').addEventListener('click', () => { audio.init(); interactCurrentHotspot(); });
document.getElementById('btn-interact-hotspot').addEventListener('click', () => { audio.init(); interactCurrentHotspot(); });
document.getElementById('btn-grounding').addEventListener('click', () => { audio.init(); triggerGrounding(); });
document.getElementById('m-btn-grounding').addEventListener('click', () => { audio.init(); triggerGrounding(); });
document.getElementById('btn-toggle-hide').addEventListener('click', () => { audio.init(); toggleHide(); });

const toggleMuteAction = () => {
    audio.init();
    const muted = audio.toggleMute();
    const ico = muted ? '🔇' : '🔊';
    document.getElementById('audio-icon').textContent = ico;
    document.getElementById('m-audio-icon').textContent = ico;
};
document.getElementById('btn-toggle-audio').addEventListener('click', toggleMuteAction);
document.getElementById('m-btn-audio').addEventListener('click', toggleMuteAction);

// --- TITLE SCREEN & START ---
function refreshTitleScreenUI() {
    const loaded = loadGameProgress();
    const endCount = Object.values(gameState.unlockedEndings).filter(Boolean).length;
    document.getElementById('title-endings-pill').textContent = `Koleksi Akhir: ${endCount} / 3`;

    const btnContinue = document.getElementById('btn-continue-game');
    const btnStart = document.getElementById('btn-start-game');

    if (loaded && hasProgressBeyondStart()) {
        btnContinue.classList.remove('hidden');
        btnContinue.textContent = gameState.isDawn
            ? '▶ Lanjutkan Epilog Pagi'
            : `▶ Lanjutkan Malam ${gameState.night}`;
        btnStart.textContent = '🔄 Mulai Baru (Malam 1)';
    } else {
        btnContinue.classList.add('hidden');
        btnStart.textContent = '▶ Mulai Bermain';
    }
}

function dismissTitleScreen() {
    audio.init();
    audio.playSFX('chime');
    const ts = document.getElementById('title-screen');
    ts.style.opacity = '0';
    setTimeout(() => { ts.classList.add('hidden'); }, 700);
}

document.getElementById('btn-continue-game').addEventListener('click', () => {
    dismissTitleScreen();
    switchArea('room304', 480);
});

document.getElementById('btn-start-game').addEventListener('click', () => {
    const unlocks = { ...gameState.unlockedEndings };
    gameState = createInitialState(unlocks);
    saveGameProgress();
    dismissTitleScreen();
    switchArea('room304', 480);
});

document.getElementById('btn-title-gallery').addEventListener('click', () => {
    openJournalModal('endings');
});

document.getElementById('btn-install-app').addEventListener('click', () => {
    openInstallGuideModal();
});

// Register Service Worker only on http/https (safe when opened offline as standalone file://)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.protocol === 'http:')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

// Main 60/120Hz Delta-Time Animation Loop
let lastFrameTime = performance.now();
function gameLoop(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
    lastFrameTime = now;
    updateSimulation(dt);
    renderScene();
    requestAnimationFrame(gameLoop);
}

window.onload = function () {
    refreshTitleScreenUI();
    updateHUD();
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
};
