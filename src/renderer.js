/**************************************************************************
 * 2D CANVAS RENDERER, SMART CAMERA & VISUAL CUTSCENES
 **************************************************************************/
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function drawRoundedRect(c, x, y, w, h, r) {
    if (typeof c.roundRect === 'function') {
        c.beginPath();
        c.roundRect(x, y, w, h, r);
        return;
    }
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.lineTo(x + w - rr, y);
    c.quadraticCurveTo(x + w, y, x + w, y + rr);
    c.lineTo(x + w, y + h - rr);
    c.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    c.lineTo(x + rr, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - rr);
    c.lineTo(x, y + rr);
    c.quadraticCurveTo(x, y, x + rr, y);
    c.closePath();
}

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let smoothCameraX = 480;

function getStageTransform() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const stageW = 1000;
    const stageH = 600;
    const aspect = vw / Math.max(1, vh);

    if (aspect >= 1.25) {
        const scale = Math.min(vw / stageW, vh / stageH) * 0.95;
        const offsetX = (vw - stageW * scale) / 2;
        const offsetY = (vh - stageH * scale) / 2;
        return { stageW, stageH, scale, offsetX, offsetY, isMobileZoom: false };
    }

    // Mobile Portrait / Narrow Viewport: zoom in cleanly around Raka
    const scale = Math.max(vw / 520, Math.min(vh / 660, vw / 420));
    const visibleStageW = vw / scale;
    const targetCam = gameState.cutscene && gameState.cutscene.active
        ? (gameState.cutscene.focusX || 520)
        : gameState.playerX;

    smoothCameraX += (targetCam - smoothCameraX) * 0.12;
    const halfVis = visibleStageW / 2;
    const clampedCam = Math.max(halfVis + 15, Math.min(stageW - halfVis - 15, smoothCameraX));
    const offsetX = vw / 2 - clampedCam * scale;
    const offsetY = (vh - stageH * scale) / 2 - (vh < 720 ? 10 : 0);
    return { stageW, stageH, scale, offsetX, offsetY, isMobileZoom: true };
}

function screenToWorldX(clientX, rect) {
    const { scale, offsetX } = getStageTransform();
    return (clientX - rect.left - offsetX) / scale;
}

function renderScene() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    ctx.clearRect(0, 0, vw, vh);

    // Base background fill
    if (gameState.isDawn) {
        ctx.fillStyle = '#18131d';
    } else if (gameState.area === 'room304') {
        ctx.fillStyle = '#090706';
    } else if (gameState.area === 'hallway') {
        ctx.fillStyle = '#060a0d';
    } else {
        ctx.fillStyle = '#04070b';
    }
    ctx.fillRect(0, 0, vw, vh);

    const { stageW, stageH, scale, offsetX, offsetY } = getStageTransform();
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Camera tremor when Sensory Load is high (except during peaceful dawn)
    if (gameState.sensoryLoad > 60 && !gameState.isDawn && !(gameState.cutscene && gameState.cutscene.active)) {
        const shake = ((gameState.sensoryLoad - 60) / 40) * 2.6;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }

    if (gameState.area === 'room304') {
        drawRoom304(ctx, stageW, stageH);
    } else if (gameState.area === 'hallway') {
        drawHallway(ctx, stageW, stageH);
    } else if (gameState.area === 'rooftop') {
        drawRooftop(ctx, stageW, stageH);
    }

    // Draw Raka (unless cutscene handles Raka + Sora together)
    if (!(gameState.cutscene && gameState.cutscene.hideNormalRaka)) {
        drawRaka(ctx, gameState.playerX, 460);
    }

    // Draw hotspot markers when not in cutscene
    if (!(gameState.cutscene && gameState.cutscene.active)) {
        drawHotspotMarkers(ctx);
    }

    // Lightning flash overlay
    if (gameState.lightningFlash > 0.02) {
        ctx.fillStyle = `rgba(226, 232, 240, ${gameState.lightningFlash * 0.28})`;
        ctx.fillRect(0, 0, stageW, stageH);
    }

    ctx.restore();
}

function drawRoom304(ctx) {
    const now = Date.now();
    const isDawn = gameState.isDawn;

    // Warm Sanctuary Wall Backdrop
    const wallGrad = ctx.createLinearGradient(0, 80, 0, 460);
    if (isDawn) {
        wallGrad.addColorStop(0, '#2a1f24');
        wallGrad.addColorStop(1, '#3b2b23');
    } else {
        wallGrad.addColorStop(0, '#1a1411');
        wallGrad.addColorStop(1, '#29201a');
    }
    ctx.fillStyle = wallGrad;
    ctx.fillRect(50, 80, 900, 380);

    // Acoustic Foam Panels
    for (let px = 80; px < 880; px += 90) {
        ctx.fillStyle = 'rgba(15, 12, 10, 0.42)';
        ctx.fillRect(px, 120, 65, 110);
        ctx.fillStyle = 'rgba(255, 210, 150, 0.04)';
        for (let gx = px + 8; gx < px + 60; gx += 14) {
            for (let gy = 130; gy < 220; gy += 16) {
                ctx.fillRect(gx, gy, 7, 7);
            }
        }
    }

    // Warm Wooden Floor
    const floorGrad = ctx.createLinearGradient(0, 460, 0, 540);
    floorGrad.addColorStop(0, isDawn ? '#4e3524' : '#3b281e');
    floorGrad.addColorStop(1, '#18100c');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(40, 460, 920, 65);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 460);
    ctx.lineTo(960, 460);
    ctx.stroke();

    // 1. Kitchen Stove (x=150)
    ctx.fillStyle = '#33261e';
    ctx.fillRect(95, 360, 110, 100);
    ctx.fillStyle = '#475569';
    ctx.fillRect(115, 345, 70, 15);
    ctx.fillStyle = gameState.soupCharges > 0 ? '#d97706' : '#57534e';
    ctx.fillRect(128, 322, 45, 23);

    if (gameState.soupCharges > 0) {
        const flameGlow = ctx.createRadialGradient(150, 345, 5, 150, 345, 70);
        flameGlow.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
        flameGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = flameGlow;
        ctx.beginPath();
        ctx.arc(150, 345, 70, 0, Math.PI * 2);
        ctx.fill();

        // Subtle steam wisps
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.22)';
        ctx.lineWidth = 1.5;
        for (let s = 0; s < 2; s++) {
            const sy = 315 - ((now * 0.02 + s * 15) % 24);
            ctx.beginPath();
            ctx.moveTo(143 + s * 14, sy);
            ctx.quadraticCurveTo(148 + s * 14, sy - 8, 142 + s * 14, sy - 16);
            ctx.stroke();
        }
    }

    // 2. Moss Terrarium Shelf (x=365)
    ctx.fillStyle = '#3e2c22';
    ctx.fillRect(295, 365, 140, 95);
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(365, 80);
    ctx.lineTo(365, 220);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(365, 225, 14, Math.PI, 0);
    ctx.fill();

    const terraGlow = ctx.createRadialGradient(365, 315, 10, 365, 325, 145);
    terraGlow.addColorStop(0, gameState.terrariumCooldown > 0 ? 'rgba(52, 211, 153, 0.42)' : 'rgba(52, 211, 153, 0.28)');
    terraGlow.addColorStop(0.55, 'rgba(245, 158, 11, 0.14)');
    terraGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = terraGlow;
    ctx.beginPath();
    ctx.arc(365, 325, 145, 0, Math.PI * 2);
    ctx.fill();

    const drawJar = (jx, jy, jw, jh) => {
        ctx.fillStyle = 'rgba(167, 243, 208, 0.13)';
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.62)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(jx, jy, jw, jh);
        ctx.strokeRect(jx, jy, jw, jh);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(jx + jw / 2, jy + jh - 6, jw / 2.2, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.fillRect(jx + 4, jy - 5, jw - 8, 5);
    };
    drawJar(315, 320, 26, 44);
    drawJar(350, 306, 32, 58);
    drawJar(392, 324, 24, 40);

    // 3. Workbench (x=565)
    ctx.fillStyle = '#2d231e';
    ctx.fillRect(495, 365, 140, 95);
    ctx.fillStyle = '#334155';
    ctx.fillRect(510, 332, 46, 33);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(516, 338, 34, 18);

    // Desk lamp
    ctx.strokeStyle = '#a8a29e';
    ctx.beginPath();
    ctx.moveTo(610, 365);
    ctx.lineTo(620, 320);
    ctx.lineTo(590, 312);
    ctx.stroke();

    const workGlow = ctx.createRadialGradient(575, 340, 5, 575, 340, 92);
    workGlow.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
    workGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = workGlow;
    ctx.beginPath();
    ctx.arc(575, 340, 92, 0, Math.PI * 2);
    ctx.fill();

    // Silent Reply Collectibles displayed on Workbench / Shelf!
    if (gameState.repliesCollected.ratna) {
        // Plate with green/white Kue Putu
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(566, 359, 26, 5);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(570, 351, 8, 8);
        ctx.fillRect(580, 351, 8, 8);
    }
    if (gameState.repliesCollected.damar) {
        // Ginger coffee thermos
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(618, 336, 12, 29);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(618, 332, 12, 5);
    }
    if (gameState.repliesCollected.sora) {
        // Small framed painting on wall above workbench
        ctx.fillStyle = '#78350f';
        ctx.fillRect(540, 265, 48, 38);
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(544, 269, 40, 30);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(564, 282, 9, Math.PI, 0);
        ctx.fill();
    }

    // 4. Frosted Window & Curtains that progressively open! (x=745)
    ctx.fillStyle = isDawn ? '#fbbf24' : (gameState.lightningFlash > 0.1 ? '#64748b' : '#1e293b');
    ctx.fillRect(695, 165, 105, 145);

    if (isDawn) {
        // Golden dawn sky through window + diagonal sunbeam
        const winDawn = ctx.createLinearGradient(695, 165, 695, 310);
        winDawn.addColorStop(0, '#7c3aed');
        winDawn.addColorStop(0.5, '#f59e0b');
        winDawn.addColorStop(1, '#fde68a');
        ctx.fillStyle = winDawn;
        ctx.fillRect(695, 165, 105, 145);

        ctx.fillStyle = 'rgba(253, 230, 138, 0.14)';
        ctx.beginPath();
        ctx.moveTo(695, 310);
        ctx.lineTo(800, 310);
        ctx.lineTo(710, 460);
        ctx.lineTo(540, 460);
        ctx.closePath();
        ctx.fill();
    } else {
        // Rain streaks on glass
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.2;
        const streakSpeed = gameState.night === 3 ? 0.14 : 0.08;
        for (let i = 0; i < 12; i++) {
            const rx = 702 + ((i * 19 + now * 0.02) % 90);
            const ry = 172 + ((i * 29 + now * streakSpeed) % 120);
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 2, ry + 12);
            ctx.stroke();
        }
    }

    // Curtain fabric covering window depending on gameState.curtainOpen (0 = closed, 0.75 = mostly open)
    const closedFrac = Math.max(0.22, 1 - gameState.curtainOpen);
    const curtainWidth = 52 * closedFrac;
    ctx.fillStyle = '#332924';
    ctx.fillRect(695, 165, curtainWidth, 145);
    ctx.fillRect(800 - curtainWidth, 165, curtainWidth, 145);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(695, 165, 105, 145);

    // Acoustic Air Vent
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(715, 115, 65, 32);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(715, 115, 65, 32);
    if (!isDawn) {
        const waveRadius = (now * 0.03) % 36;
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - waveRadius / 36})`;
        ctx.beginPath();
        ctx.arc(747, 131, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 5. Pending Silent Reply Gift on Doormat (x=835)
    if (gameState.pendingGift) {
        const pulse = 0.5 + Math.sin(now * 0.007) * 0.35;
        const gGlow = ctx.createRadialGradient(835, 446, 3, 835, 446, 36);
        gGlow.addColorStop(0, `rgba(251, 191, 36, ${pulse})`);
        gGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = gGlow;
        ctx.beginPath();
        ctx.arc(835, 446, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(822, 442, 26, 16);
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(822, 442, 26, 16);
    }

    // 6. Door to Hallway (x=915)
    ctx.fillStyle = '#261c16';
    ctx.fillRect(872, 230, 78, 230);
    ctx.strokeStyle = '#574134';
    ctx.lineWidth = 3;
    ctx.strokeRect(872, 230, 78, 230);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(880, 330, 10, 6);
    ctx.fillRect(880, 345, 10, 6);
    if (gameState.curtainOpen < 0.5) {
        ctx.fillRect(880, 360, 10, 6);
    }

    // Floating Dust & Spores
    for (const p of gameState.particles) {
        ctx.fillStyle = isDawn ? '#fde68a' : p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawHallway(ctx) {
    const now = Date.now();

    // Damp Concrete Corridor Wall
    const hallGrad = ctx.createLinearGradient(0, 70, 0, 460);
    hallGrad.addColorStop(0, '#0b1317');
    hallGrad.addColorStop(1, '#142228');
    ctx.fillStyle = hallGrad;
    ctx.fillRect(30, 70, 940, 390);

    ctx.fillStyle = '#111820';
    ctx.fillRect(30, 460, 940, 65);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 460);
    ctx.lineTo(970, 460);
    ctx.stroke();

    // Flickering Fluorescent Tubes (harsher flicker in Night 2 & 3)
    const flickerThreshold = gameState.night === 3 ? -0.65 : gameState.night === 2 ? -0.8 : -0.92;
    const flicker = Math.sin(now * 0.021) > flickerThreshold ? 0.22 : 0.04;
    for (const lx of [220, 520, 800]) {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(lx - 40, 82, 80, 6);
        const lampGlow = ctx.createRadialGradient(lx, 95, 5, lx, 220, 190);
        lampGlow.addColorStop(0, `rgba(186, 230, 253, ${flicker})`);
        lampGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = lampGlow;
        ctx.beginPath();
        ctx.arc(lx, 200, 190, 0, Math.PI * 2);
        ctx.fill();
    }

    // Neighbor Doors
    const drawCorridorDoor = (dx, num, isRaka, delivered) => {
        ctx.fillStyle = isRaka ? '#292019' : '#18262d';
        ctx.fillRect(dx - 38, 235, 76, 225);
        ctx.strokeStyle = isRaka ? '#b45309' : (delivered ? '#10b981' : '#334155');
        ctx.lineWidth = 2.5;
        ctx.strokeRect(dx - 38, 235, 76, 225);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(dx - 20, 258, 40, 18);
        ctx.fillStyle = delivered ? '#34d399' : '#cbd5e1';
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(num, dx, 271);

        if (delivered) {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(dx - 12, 446, 24, 14);
            const pkgGlow = ctx.createRadialGradient(dx, 450, 2, dx, 450, 32);
            pkgGlow.addColorStop(0, 'rgba(52, 211, 153, 0.58)');
            pkgGlow.addColorStop(1, 'rgba(52, 211, 153, 0)');
            ctx.fillStyle = pkgGlow;
            ctx.beginPath();
            ctx.arc(dx, 450, 32, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    drawCorridorDoor(120, '301', false, gameState.delivered.ratna);
    drawCorridorDoor(300, '302', false, gameState.delivered.damar);
    drawCorridorDoor(600, '304', true, false);
    drawCorridorDoor(770, '305', false, gameState.delivered.sora);

    // Musical notes floating softly from Room 301 after radio delivery!
    if (gameState.delivered.ratna) {
        ctx.fillStyle = 'rgba(253, 230, 138, 0.55)';
        ctx.font = '600 14px sans-serif';
        const noteY = 330 - ((now * 0.025) % 45);
        ctx.fillText('♪', 105 + Math.sin(now * 0.003) * 8, noteY);
        ctx.fillText('♫', 135 - Math.cos(now * 0.003) * 7, noteY + 18);
    }

    // Cover Spot 1: Tall Potted Snake Plant (x=382)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(364, 410, 36, 50);
    ctx.fillStyle = '#065f46';
    for (let lx = -12; lx <= 12; lx += 8) {
        ctx.beginPath();
        ctx.moveTo(382 + lx, 410);
        ctx.lineTo(382 + lx - 4, 345 + Math.abs(lx));
        ctx.lineTo(382 + lx + 5, 410);
        ctx.fill();
    }
    drawCoverLabel(ctx, 382, 330);

    // Cover Spot 2: Dark Stairwell Alcove Pillar (x=688)
    ctx.fillStyle = '#090e14';
    ctx.fillRect(664, 210, 48, 250);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(664, 210, 48, 250);
    drawCoverLabel(ctx, 688, 200);

    // Hallway Trash / Discarded Items Box (x=460)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(435, 395, 50, 65);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(435, 395, 50, 65);

    const nightConf = NIGHT_DATA[gameState.night];
    if (nightConf && gameState.clues[nightConf.neighborKey] && !gameState.inventory[nightConf.inventoryKey]) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(460, 384 + Math.sin(now * 0.006) * 4, 4.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Emergency Stairs to Rooftop (x=915)
    const stairsUnlocked = gameState.delivered.ratna && gameState.delivered.damar && gameState.delivered.sora;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(875, 210, 75, 250);
    ctx.strokeStyle = stairsUnlocked ? '#34d399' : '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(875, 210, 75, 250);
    for (let s = 0; s < 6; s++) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(882 + s * 8, 440 - s * 28, 60 - s * 8, 10);
    }

    // Patrol NPC Shadow Silhouette
    const npc = gameState.hallwayNPC;
    ctx.save();
    const auraRadius = gameState.isHiding ? 75 : 125;
    const auraGrad = ctx.createRadialGradient(npc.x, 390, 10, npc.x, 390, auraRadius);
    auraGrad.addColorStop(0, 'rgba(244, 63, 94, 0.28)');
    auraGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(npc.x, 390, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.arc(npc.x, 338, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(npc.x - 16, 355, 32, 105);

    ctx.fillStyle = 'rgba(251, 113, 133, 0.88)';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const dirArrow = npc.dir > 0 ? '→' : '←';
    ctx.fillText(`👣 Tetangga ${dirArrow} (Sembunyi [S])`, npc.x, 312);
    ctx.restore();
}

function drawCoverLabel(ctx, x, y) {
    const near = Math.abs(gameState.playerX - x) < 48;
    ctx.fillStyle = near ? 'rgba(56, 189, 248, 0.92)' : 'rgba(148, 163, 184, 0.42)';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(near ? '🙈 Spot Sembunyi' : 'Spot', x, y);
}

function drawRooftop(ctx) {
    const now = Date.now();
    const cs = gameState.cutscene;
    const dawn = cs && cs.type === 'threshold' ? Math.min(1, cs.dawnProgress || 0) : (gameState.isDawn ? 1 : 0);

    // Sky transitions smoothly from Stormy Night to Golden-Violet Dawn!
    const skyGrad = ctx.createLinearGradient(0, 50, 0, 460);
    if (dawn > 0.05) {
        skyGrad.addColorStop(0, lerpColor('#040811', '#2e1a47', dawn));
        skyGrad.addColorStop(0.55, lerpColor('#0d1b2a', '#b45309', dawn));
        skyGrad.addColorStop(1, lerpColor('#1b263b', '#fcd34d', dawn));
    } else {
        skyGrad.addColorStop(0, '#040811');
        skyGrad.addColorStop(0.6, '#0d1b2a');
        skyGrad.addColorStop(1, '#1b263b');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(30, 50, 940, 410);

    // Dawn birds in True Ending
    if (dawn > 0.55) {
        ctx.strokeStyle = 'rgba(30, 27, 75, 0.7)';
        ctx.lineWidth = 2;
        for (let b = 0; b < 3; b++) {
            const bx = 260 + b * 55 + ((now * 0.025) % 240);
            const by = 140 + b * 22 + Math.sin(now * 0.005 + b) * 6;
            ctx.beginPath();
            ctx.moveTo(bx - 8, by);
            ctx.quadraticCurveTo(bx - 3, by - 5, bx, by);
            ctx.quadraticCurveTo(bx + 3, by - 5, bx + 8, by);
            ctx.stroke();
        }
    }

    // Distant City Silhouettes
    for (let i = 0; i < 22; i++) {
        const bx = 60 + i * 42;
        const bh = 60 + ((i * 37) % 110);
        ctx.fillStyle = dawn > 0.4 ? 'rgba(30, 24, 42, 0.72)' : 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(bx, 460 - bh, 34, bh);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(56, 189, 248, 0.14)';
        ctx.beginPath();
        ctx.arc(bx + 17, 460 - bh + 25, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Wet Concrete Floor
    ctx.fillStyle = dawn > 0.4 ? '#1e2433' : '#0f172a';
    ctx.fillRect(30, 460, 940, 65);

    // Rooftop Fence Railing
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, 365);
    ctx.lineTo(920, 365);
    ctx.stroke();
    for (let fx = 240; fx <= 900; fx += 60) {
        ctx.beginPath();
        ctx.moveTo(fx, 365);
        ctx.lineTo(fx, 460);
        ctx.stroke();
    }

    // Stairwell Door (x=130)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(85, 240, 90, 220);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(85, 240, 90, 220);

    // --- CUTSCENE SPECIFIC VISUALS ---
    if (cs && cs.active) {
        if (cs.type === 'avoidant') {
            // Damar climbing stairs with flashlight beam toward Sora
            const damarX = 210 + cs.progress * 420;
            const soraX = 740 - Math.max(0, cs.progress - 0.5) * 260;

            // Flashlight beam
            const beam = ctx.createRadialGradient(damarX + 20, 390, 5, damarX + 180, 395, 190);
            beam.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
            beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
            ctx.fillStyle = beam;
            ctx.beginPath();
            ctx.moveTo(damarX + 14, 388);
            ctx.lineTo(damarX + 260, 330);
            ctx.lineTo(damarX + 260, 450);
            ctx.closePath();
            ctx.fill();

            // Damar silhouette
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(damarX, 342, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(damarX - 14, 357, 28, 103);

            drawSoraSilhouette(ctx, soraX, 460, false);
        } else if (cs.type === 'lanterns') {
            // 5 glowing moss lanterns placed sequentially along the rooftop
            const spots = [280, 385, 490, 595, 690];
            const litCount = Math.floor(cs.progress * 6);
            for (let i = 0; i < Math.min(spots.length, litCount); i++) {
                const lx = spots[i];
                const lg = ctx.createRadialGradient(lx, 446, 3, lx, 446, 52);
                lg.addColorStop(0, 'rgba(52, 211, 153, 0.72)');
                lg.addColorStop(1, 'rgba(52, 211, 153, 0)');
                ctx.fillStyle = lg;
                ctx.beginPath();
                ctx.arc(lx, 446, 52, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#a7f3d0';
                ctx.fillRect(lx - 6, 444, 12, 16);
            }
            const soraX = 740 - Math.max(0, cs.progress - 0.35) * 420;
            drawSoraSilhouette(ctx, soraX, 460, false);
        } else if (cs.type === 'threshold') {
            // Raka & Sora sitting side-by-side under a wide warm umbrella!
            const centerX = 705;
            const sitGlow = ctx.createRadialGradient(centerX, 440, 8, centerX, 440, 95);
            sitGlow.addColorStop(0, 'rgba(52, 211, 153, 0.55)');
            sitGlow.addColorStop(0.6, 'rgba(251, 191, 36, 0.2)');
            sitGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = sitGlow;
            ctx.beginPath();
            ctx.arc(centerX, 440, 95, 0, Math.PI * 2);
            ctx.fill();

            // Terrarium Lantern between them
            ctx.fillStyle = '#6ee7b7';
            ctx.fillRect(centerX - 6, 440, 12, 18);

            // Raka sitting (left of lantern)
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(centerX - 28, 398, 12, 0, Math.PI * 2);
            ctx.fill();
            drawRoundedRect(ctx, centerX - 44, 410, 32, 46, 8);
            ctx.fill();

            // Sora sitting (right of lantern)
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.arc(centerX + 26, 400, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#334155';
            drawRoundedRect(ctx, centerX + 12, 412, 28, 44, 8);
            ctx.fill();

            // Open Umbrella Canopy above both!
            if (cs.progress > 0.15) {
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(centerX - 18, 430);
                ctx.lineTo(centerX - 6, 338);
                ctx.stroke();

                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(centerX - 4, 384, 72, Math.PI * 1.08, Math.PI * 1.92);
                ctx.closePath();
                ctx.fill();
            }
        }
    } else {
        // Normal rooftop state: Sora near edge holding glowing vibrating terrarium
        drawSoraSilhouette(ctx, 740, 460, true);
    }

    // Rain streaks (subsides cleanly during dawn!)
    const rainOpacity = Math.max(0.03, 0.38 * (1 - dawn));
    ctx.strokeStyle = `rgba(186, 230, 253, ${rainOpacity})`;
    ctx.lineWidth = 1.3;
    for (const r of gameState.rainDrops) {
        if (dawn > 0.85) break;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 4, r.y + r.len);
        ctx.stroke();

        // Subtle floor splash ripples
        if (r.y > 445) {
            ctx.beginPath();
            ctx.ellipse(r.x, 462, 4, 1.5, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function drawSoraSilhouette(ctx, sx, floorY, withPulseGlow) {
    if (withPulseGlow) {
        const pulse = 0.45 + Math.sin(Date.now() * 0.008) * 0.22;
        const soraGlow = ctx.createRadialGradient(sx - 22, floorY - 15, 4, sx - 22, floorY - 15, 78);
        soraGlow.addColorStop(0, `rgba(52, 211, 153, ${pulse})`);
        soraGlow.addColorStop(1, 'rgba(52, 211, 153, 0)');
        ctx.fillStyle = soraGlow;
        ctx.beginPath();
        ctx.arc(sx - 22, floorY - 15, 78, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(sx, floorY - 115, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(sx - 16, floorY - 100);
    ctx.lineTo(sx + 16, floorY - 100);
    ctx.lineTo(sx + 22, floorY);
    ctx.lineTo(sx - 22, floorY);
    ctx.closePath();
    ctx.fill();
}

function drawRaka(ctx, x, floorY) {
    ctx.save();
    const isMoving = gameState.moveLeft || gameState.moveRight || gameState.targetX !== null;
    const isHiding = gameState.isHiding && gameState.area === 'hallway';
    const panicShiver = gameState.sensoryLoad > 68 ? Math.sin(Date.now() * 0.05) * 1.4 : 0;
    const walkStride = isMoving ? Math.sin(gameState.walkPhase) * 9 : 0;
    const bob = isMoving ? Math.abs(Math.sin(gameState.walkPhase)) * -3.5 : Math.sin(Date.now() * 0.004) * 1.2;
    const crouchOffset = isHiding ? 26 : 0;

    // Grounding calm aura
    if (gameState.groundingAuraTimer > 0) {
        const aura = ctx.createRadialGradient(x, floorY - 55, 8, x, floorY - 55, 70);
        aura.addColorStop(0, 'rgba(52, 211, 153, 0.38)');
        aura.addColorStop(1, 'rgba(52, 211, 153, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(x, floorY - 55, 70, 0, Math.PI * 2);
        ctx.fill();
    }

    // Stealth Cover Halo when hidden safely!
    if (isHiding) {
        const inCover = COVER_SPOTS.some(c => Math.abs(x - c.x) < 48);
        ctx.strokeStyle = inCover ? '#38bdf8' : 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, floorY - 40, 38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Floor shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x, floorY, isHiding ? 25 : 21, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated Striding Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 10 + walkStride * 0.55, floorY - (42 - crouchOffset * 0.5), 8, 42 - crouchOffset * 0.5);
    ctx.fillRect(x + 2 - walkStride * 0.55, floorY - (42 - crouchOffset * 0.5), 8, 42 - crouchOffset * 0.5);

    // Oversized Hoodie Torso
    ctx.fillStyle = isHiding ? '#0f172a' : '#1e293b';
    drawRoundedRect(ctx, x - 18 + panicShiver, floorY - 96 + bob + crouchOffset, 36, 58 - crouchOffset * 0.45, 10);
    ctx.fill();
    ctx.strokeStyle = isHiding ? '#38bdf8' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Amber Resilience Core
    const heartRadius = 6 + (gameState.resilience / 100) * 14;
    const heartGlow = ctx.createRadialGradient(x, floorY - 68 + bob + crouchOffset, 2, x, floorY - 68 + bob + crouchOffset, heartRadius);
    heartGlow.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
    heartGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = heartGlow;
    ctx.beginPath();
    ctx.arc(x, floorY - 68 + bob + crouchOffset, heartRadius, 0, Math.PI * 2);
    ctx.fill();

    // Head & Hood
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(x + gameState.facing * 2 + panicShiver, floorY - 110 + bob + crouchOffset, 12.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x + panicShiver, floorY - 112 + bob + crouchOffset, 15.5, isHiding ? Math.PI * 0.7 : Math.PI * 0.85, isHiding ? Math.PI * 2.3 : Math.PI * 2.15);
    ctx.fill();

    ctx.restore();
}

function drawHotspotMarkers(ctx) {
    const list = getVisibleHotspotsForArea(gameState.area);
    for (const h of list) {
        const isActive = gameState.activeHotspot && gameState.activeHotspot.id === h.id;
        const floatY = 185 + Math.sin(Date.now() * 0.004 + h.x) * 4;

        ctx.save();
        ctx.strokeStyle = isActive ? 'rgba(251, 191, 36, 0.7)' : 'rgba(148, 163, 184, 0.24)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(h.x, floatY + 14);
        ctx.lineTo(h.x, 310);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.translate(h.x, floatY);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = isActive ? '#fbbf24' : '#1e293b';
        ctx.strokeStyle = isActive ? '#fef3c7' : '#64748b';
        ctx.lineWidth = 2;
        ctx.fillRect(-7, -7, 14, 14);
        ctx.strokeRect(-7, -7, 14, 14);
        ctx.restore();

        ctx.font = isActive ? '700 11px sans-serif' : '500 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = isActive ? '#fde68a' : 'rgba(203, 213, 225, 0.75)';
        ctx.fillText(h.shortTitle, h.x, floatY - 14);
    }
}

function lerpColor(hexA, hexB, t) {
    const a = parseInt(hexA.slice(1), 16);
    const b = parseInt(hexB.slice(1), 16);
    const r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
    const g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
    const bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return `rgb(${r}, ${g}, ${bl})`;
}
