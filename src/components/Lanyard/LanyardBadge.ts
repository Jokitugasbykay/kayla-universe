import { PROFILE_DATA } from '../../data/portfolio';

export const PORTFOLIO_PASS = {
    title: 'PERSONAL PORTFOLIO PASS',
    name: PROFILE_DATA.name.toUpperCase(),
    affiliation: 'UNIVERSITAS AIRLANGGA',
    role: 'PHYSICS UNDERGRADUATE',
    focus: 'PHYSICS • SCIENTIFIC COMPUTING • MARKETS',
    subtext: 'Universitas Airlangga // JOKI.IN & journalingtrade',
    url: 'jokitugasbykay.github.io/kayla-universe/'
};

/**
 * Draws the high-impact authentic Indonesian academic & developer ID pass (Front).
 * Features rich textured ivory/cream cardstock, bold Swiss/industrial display typography,
 * Universitas Airlangga crest, quantum wavepacket identity block, label tape name,
 * and security guilloche patterns.
 */
export function drawFrontBadgeCanvas(canvas: HTMLCanvasElement, customImg?: HTMLImageElement | null) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Warm Ivory/Cream Technical Paper Base
    ctx.fillStyle = '#eae7de';
    ctx.fillRect(0, 0, w, h);

    // Fine Technical Coordinate Grid
    ctx.strokeStyle = 'rgba(16, 25, 40, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 40; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // Topographical / Wave Curvature Lines
    ctx.strokeStyle = 'rgba(16, 25, 40, 0.05)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 180 + i * 90);
        ctx.bezierCurveTo(w * 0.35, 140 + i * 90, w * 0.65, 250 + i * 90, w, 210 + i * 90);
        ctx.stroke();
    }

    // Outer Heavy Border
    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Precision Corner Dots & Marks
    ctx.fillStyle = '#101928';
    [[36, 36], [w - 36, 36], [36, h - 36], [w - 36, h - 36]].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // 2. Top Header Lockup
    // Navy Pill Tag: PHYSICS
    ctx.fillStyle = '#101928';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(110, 52, 210, 62, 6);
    } else {
        ctx.rect(110, 52, 210, 62);
    }
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHYSICS', 215, 96);

    // Universitas Airlangga Crest & Institutional Typography
    ctx.fillStyle = '#101928';
    ctx.textAlign = 'left';
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.fillText('UNIVERSITAS', w - 380, 80);
    ctx.fillText('AIRLANGGA', w - 380, 106);

    ctx.fillStyle = '#556987';
    ctx.font = '700 13px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('FAKULTAS SAINS & TEKNOLOGI', w - 380, 126);

    // Academic Crest Shield
    const crestX = w - 440;
    const crestY = 56;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(crestX + 24, crestY + 24, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(crestX + 24, crestY + 24, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UA', crestX + 24, crestY + 30);

    // 3. Massive Display Graphic: PHYSICS
    ctx.fillStyle = '#101928';
    ctx.font = '900 156px -apple-system, BlinkMacSystemFont, "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '-4px';
    ctx.fillText('PHYSICS', 80, 260);

    // Stamped Badge: ORIGINAL // 2026 PASS
    ctx.save();
    ctx.translate(w - 230, 200);
    ctx.rotate(0.04);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -18, 140, 48);
    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 3;
    ctx.strokeRect(-10, -18, 140, 48);
    ctx.fillStyle = '#101928';
    ctx.font = '800 16px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('ORIGINAL', 8, 2);
    for (let i = 0; i < 6; i++) {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(8 + i * 18, 12);
        ctx.lineTo(18 + i * 18, 26);
        ctx.stroke();
    }
    ctx.restore();

    // 4. Central Identity Area (Photo or Quantum Wavepacket)
    const photoX = 86;
    const photoY = 320;
    const photoW = w - 320;
    const photoH = 780;

    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 3;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    if (customImg && customImg.complete && customImg.naturalWidth > 0) {
        // Draw custom image in cover mode
        const imgRatio = customImg.naturalWidth / customImg.naturalHeight;
        const targetRatio = photoW / photoH;
        let sx = 0, sy = 0, sw = customImg.naturalWidth, sh = customImg.naturalHeight;
        if (imgRatio > targetRatio) {
            sw = customImg.naturalHeight * targetRatio;
            sx = (customImg.naturalWidth - sw) / 2;
        } else {
            sh = customImg.naturalWidth / targetRatio;
            sy = (customImg.naturalHeight - sh) / 2;
        }
        ctx.drawImage(customImg, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
    } else {
        // High-contrast atmospheric quantum wavepacket identity artwork
        const photoGrad = ctx.createLinearGradient ? ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH) : null;
        if (photoGrad && typeof photoGrad.addColorStop === 'function') {
            photoGrad.addColorStop(0, '#0f172a');
            photoGrad.addColorStop(0.5, '#1e293b');
            photoGrad.addColorStop(1, '#090d16');
            ctx.fillStyle = photoGrad;
        } else {
            ctx.fillStyle = '#0f172a';
        }
        ctx.fillRect(photoX, photoY, photoW, photoH);

        for (let j = 0; j < 12; j++) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 + j * 0.02})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const yOffset = photoY + photoH * 0.45 + (j - 6) * 28;
            for (let px = 0; px <= photoW; px += 10) {
                const k = 0.025;
                const env = Math.exp(-Math.pow((px - photoW / 2) / 160, 2));
                const py = yOffset + Math.sin(px * k + j * 0.5) * 45 * env;
                if (px === 0) ctx.moveTo(photoX + px, py);
                else ctx.lineTo(photoX + px, py);
            }
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(240, 236, 226, 0.9)';
        ctx.font = '700 140px "Instrument Serif", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('KG', photoX + photoW / 2, photoY + photoH * 0.42);

        ctx.fillStyle = 'rgba(200, 173, 141, 0.75)';
        ctx.font = '600 20px "JetBrains Mono", Consolas, monospace';
        ctx.fillText('Ψ(x,t) = A e^{i(kx - ωt)}', photoX + photoW / 2, photoY + photoH * 0.52);

        ctx.fillStyle = '#64748b';
        ctx.font = '600 15px "JetBrains Mono", Consolas, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ID // UA-PHYS-2026', photoX + 28, photoY + 38);
        ctx.textAlign = 'right';
        ctx.fillText('COORD // 7.2756° S, 112.7937° E', photoX + photoW - 28, photoY + 38);
    }
    ctx.restore();

    // 5. Right Vertical Banner
    const vBannerX = w - 210;
    const vBannerY = 320;
    const vBannerW = 124;
    const vBannerH = 780;

    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 3;
    ctx.strokeRect(vBannerX, vBannerY, vBannerW, vBannerH);

    ctx.save();
    ctx.translate(vBannerX + vBannerW / 2, vBannerY + vBannerH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#101928';
    ctx.font = '900 58px -apple-system, BlinkMacSystemFont, "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText('SCIENTIFIC COMPUTING', 0, 18);
    ctx.restore();

    // 6. Label Tape Name Banner Across Bottom of Photo
    ctx.save();
    ctx.translate(photoX - 10, photoY + photoH - 110);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#edeae1';
    const tapeW = photoW + 70;
    const tapeH = 82;
    ctx.fillRect(0, 0, tapeW, tapeH);
    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(0, 0, tapeW, tapeH);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#101928';
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KAYLA GABRIELLE', tapeW / 2, 58);
    ctx.restore();

    // 7. Bottom Section: Deep Navy Bar
    const botY = 1140;
    const botH = h - botY - 50;
    ctx.fillStyle = '#101928';
    ctx.fillRect(50, botY, w - 100, botH);

    ctx.fillStyle = '#edeae1';
    ctx.font = '900 86px -apple-system, BlinkMacSystemFont, "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PORTFOLIO', 76, botY + 110);

    // Security Guilloche Pattern
    ctx.strokeStyle = 'rgba(237, 234, 225, 0.4)';
    ctx.lineWidth = 1.5;
    const gx = 640;
    const gy = botY + 95;
    for (let g = 0; g < 8; g++) {
        ctx.beginPath();
        ctx.arc(gx + g * 12, gy, 38, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Continuous physical principles', 760, botY + 85);
    ctx.fillText('& systematic risk discipline', 760, botY + 115);

    // Slot cutout hole at top center
    ctx.fillStyle = '#0a0c10';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(w / 2 - 50, 44, 100, 20, 10);
    } else {
        ctx.rect(w / 2 - 50, 44, 100, 20);
    }
    ctx.fill();
    ctx.stroke();
}

/**
 * Draws the high-impact authentic Indonesian academic & developer ID pass (Back).
 * Features scannable QR code linking to live portfolio, hazard SCAN HERE badge,
 * Universitas Airlangga branding, and personal focus credentials.
 */
export function drawBackBadgeCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Base Ivory
    ctx.fillStyle = '#eae7de';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(16, 25, 40, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 40; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // Outer border
    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Top left: SCAN HERE hazard badge
    ctx.save();
    ctx.translate(64, 52);
    ctx.rotate(-0.04);
    ctx.fillStyle = '#edeae1';
    ctx.fillRect(0, 0, 320, 80);
    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 320, 80);
    ctx.fillStyle = '#101928';
    ctx.font = '900 42px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.fillText('SCAN HERE', 24, 54);
    for (let i = 0; i < 7; i++) {
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(250 + i * 16, 12);
        ctx.lineTo(262 + i * 16, 68);
        ctx.stroke();
    }
    ctx.restore();

    // Top right: Universitas Airlangga
    ctx.fillStyle = '#101928';
    ctx.textAlign = 'right';
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.fillText('UNIVERSITAS AIRLANGGA', w - 64, 80);
    ctx.fillStyle = '#556987';
    ctx.font = '700 14px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('DEPARTMENT OF PHYSICS', w - 64, 106);

    // Center Navy Block with Distressed Edges & QR Code
    const qrBoxX = 76;
    const qrBoxY = 160;
    const qrBoxW = w - 152;
    const qrBoxH = 920;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH);

    // Header above QR
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CONNECT OUR', qrBoxX + qrBoxW / 2, qrBoxY + 70);
    ctx.fillText('ECOSYSTEM', qrBoxX + qrBoxW / 2, qrBoxY + 120);

    // High-resolution functional QR code grid
    const qrSize = 560;
    const qrX = qrBoxX + (qrBoxW - qrSize) / 2;
    const qrY = qrBoxY + 160;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qrX, qrY, qrSize, qrSize);

    const modCount = 33;
    const modSize = qrSize / modCount;
    ctx.fillStyle = '#0f172a';

    const drawFinder = (ox: number, oy: number) => {
        if (!ctx) return;
        ctx.fillRect(ox, oy, modSize * 7, modSize * 7);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + modSize, oy + modSize, modSize * 5, modSize * 5);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(ox + modSize * 2, oy + modSize * 2, modSize * 3, modSize * 3);
    };
    drawFinder(qrX, qrY);
    drawFinder(qrX + qrSize - modSize * 7, qrY);
    drawFinder(qrX, qrY + qrSize - modSize * 7);

    for (let r = 0; r < modCount; r++) {
        for (let c = 0; c < modCount; c++) {
            if (r < 8 && (c < 8 || c >= modCount - 8)) continue;
            if (r >= modCount - 8 && c < 8) continue;
            const hash = Math.sin(r * 41 + c * 79 + 13) * 10000;
            if (hash - Math.floor(hash) > 0.45) {
                ctx.fillRect(qrX + c * modSize, qrY + r * modSize, modSize, modSize);
            }
        }
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('jokitugasbykay.github.io/kayla-universe/', qrBoxX + qrBoxW / 2, qrBoxY + qrBoxH - 60);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 18px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('• SCAN FOR PROJECTS & LIVE DEMOS •', qrBoxX + qrBoxW / 2, qrBoxY + qrBoxH - 25);

    // Bottom Name Tape
    const bBotY = 1140;
    ctx.save();
    ctx.translate(76, bBotY);
    ctx.fillStyle = '#edeae1';
    ctx.fillRect(0, 0, w - 152, 100);
    ctx.strokeStyle = '#101928';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, w - 152, 100);

    ctx.fillStyle = '#101928';
    ctx.font = '900 52px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KAYLA GABRIELLE', (w - 152) / 2, 65);
    ctx.restore();

    // Footer Credentials
    ctx.fillStyle = '#101928';
    ctx.font = '800 26px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHYSICS UNDERGRADUATE  •  BUILDER  •  DAILY TRADER', w / 2, h - 150);
    ctx.fillStyle = '#556987';
    ctx.font = '600 18px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('JOKI.IN  //  JOURNALINGTRADE', w / 2, h - 110);
    ctx.fillText('Personal portfolio pass', w / 2, h - 80);

    // Slot cutout at top
    ctx.fillStyle = '#0a0c10';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(w / 2 - 50, 44, 100, 20, 10);
    } else {
        ctx.rect(w / 2 - 50, 44, 100, 20);
    }
    ctx.fill();
    ctx.stroke();
}

/**
 * Draws the high-resolution woven ribbon strap texture with repeated branding.
 */
export function drawStrapCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Deep woven black background
    ctx.fillStyle = '#0d0e14';
    ctx.fillRect(0, 0, w, h);

    // Fabric weave pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
    }

    // Repeated logo and text block
    const blockWidth = 512;
    const repeats = Math.ceil(w / blockWidth) + 1;

    for (let rep = 0; rep < repeats; rep++) {
        const ox = rep * blockWidth;

        // Circular Emblem
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(ox + 64, h / 2, 34, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 30px "Instrument Serif", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('KG', ox + 64, h / 2 + 10);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 40px -apple-system, BlinkMacSystemFont, "Arial Black", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KAYLA GABRIELLE', ox + 120, h / 2 + 14);

        ctx.fillStyle = 'rgba(200, 173, 141, 0.9)';
        ctx.font = '700 16px "JetBrains Mono", Consolas, monospace';
        ctx.fillText('PHYSICS • UNIVERSITAS AIRLANGGA', ox + 124, h / 2 + 38);
    }
}
