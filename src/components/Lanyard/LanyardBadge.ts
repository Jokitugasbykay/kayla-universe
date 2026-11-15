function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCoverPortrait(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / Math.max(1, img.height);
  const boxRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) * 0.5;
  } else {
    sh = img.width / boxRatio;
    // Favor upper third to keep facial features centered
    sy = (img.height - sh) * 0.16;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

export function drawFrontBadgeCanvas(
  canvas: HTMLCanvasElement,
  portraitImg: HTMLImageElement | null
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Deep obsidian and slate gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#0c1424');
  bgGrad.addColorStop(0.5, '#050812');
  bgGrad.addColorStop(1, '#091020');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle coordinate grid hairlines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 102);
  ctx.lineTo(w - 32, 102);
  ctx.moveTo(32, 570);
  ctx.lineTo(w - 32, 570);
  ctx.stroke();

  // Top lanyard clasp slot cutout
  ctx.fillStyle = '#020409';
  drawRoundedRect(ctx, w / 2 - 45, 20, 90, 16, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Header university metadata
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('UNIVERSITAS AIRLANGGA', 36, 76);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText('FAKULTAS SAINS DAN TEKNOLOGI', 36, 94);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('NIM 082211333061', w - 36, 76);
  ctx.fillStyle = '#64748b';
  ctx.fillText('SEM 05 / 2024-2025', w - 36, 94);
  ctx.textAlign = 'left';

  // Prominent Foto 1 portrait window
  const portX = 36;
  const portY = 118;
  const portW = w - 72;
  const portH = 415;

  ctx.save();
  drawRoundedRect(ctx, portX, portY, portW, portH, 14);
  ctx.clip();

  if (portraitImg && portraitImg.complete && portraitImg.naturalWidth > 0) {
    drawCoverPortrait(ctx, portraitImg, portX, portY, portW, portH);
  } else {
    // Elegant fallback plate
    const pGrad = ctx.createLinearGradient(portX, portY, portX + portW, portY + portH);
    pGrad.addColorStop(0, '#101a30');
    pGrad.addColorStop(0.6, '#080e1c');
    pGrad.addColorStop(1, '#050912');
    ctx.fillStyle = pGrad;
    ctx.fillRect(portX, portY, portW, portH);

    ctx.fillStyle = 'rgba(226, 232, 240, 0.12)';
    ctx.beginPath();
    ctx.arc(w / 2, 270, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2, 450, 110, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 36px "Instrument Serif", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Kayla Gabrielle', w / 2, 280);
    ctx.textAlign = 'left';
  }

  // Bottom gradient vignette inside portrait for contrast
  const botVignette = ctx.createLinearGradient(0, portY + portH - 100, 0, portY + portH);
  botVignette.addColorStop(0, 'rgba(5, 8, 18, 0)');
  botVignette.addColorStop(1, 'rgba(5, 8, 18, 0.92)');
  ctx.fillStyle = botVignette;
  ctx.fillRect(portX, portY + portH - 100, portW, 100);

  // Holographic security strip on bottom corner of portrait
  const holoGrad = ctx.createLinearGradient(portX + portW - 140, 0, portX + portW, 0);
  holoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
  holoGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
  holoGrad.addColorStop(1, 'rgba(52, 211, 153, 0.25)');
  ctx.fillStyle = holoGrad;
  ctx.fillRect(portX + portW - 140, portY + portH - 32, 126, 20);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 9px "JetBrains Mono", monospace';
  ctx.fillText('UNAIR SECURE ID', portX + portW - 132, portY + portH - 18);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 11px "JetBrains Mono", monospace';
  ctx.fillText('STUDENT ID: KG-082211333061', portX + 16, portY + portH - 18);
  ctx.restore();

  // Crisp border around Foto 1 window
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, portX, portY, portW, portH, 14);
  ctx.stroke();

  // Name and academic title
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 30px "Syne", sans-serif';
  ctx.fillText('KAYLA GABRIELLE', 36, 608);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText('Physics Undergrad / Scientific Computing', 36, 638);

  // Focus Tags Row
  const tags = ['QUANTUM DOTS', 'JOKI.IN', 'APPLIED AI'];
  let tx = 36;
  tags.forEach((t) => {
    ctx.font = '500 11px "JetBrains Mono", monospace';
    const tw = ctx.measureText(t).width + 20;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
    drawRoundedRect(ctx, tx, 664, tw, 28, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(t, tx + 10, 682);
    tx += tw + 8;
  });

  // Concentric outer bezel highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 4, 4, w - 8, h - 8, 22);
  ctx.stroke();
}

export function drawBackBadgeCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#0c1424');
  bgGrad.addColorStop(0.5, '#050812');
  bgGrad.addColorStop(1, '#091020');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Clasp cutout
  ctx.fillStyle = '#020409';
  drawRoundedRect(ctx, w / 2 - 45, 20, 90, 16, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('ACADEMIC DOSSIER / RESEARCH PROFILE', 40, 84);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 42px "Instrument Serif", Georgia, serif';
  ctx.fillText('Kayla Gabrielle', 40, 138);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 164);
  ctx.lineTo(w - 40, 164);
  ctx.stroke();

  const rows = [
    ['STATUS', 'Physics Undergrad (Semester 5)'],
    ['INSTITUTION', 'Universitas Airlangga (UNAIR)'],
    ['ORIGIN', 'Malaysia, Jakarta, Surabaya'],
    ['CITIZENSHIP', 'Malaysian Citizen'],
    ['INQUIRY', 'Quantum Systems, Physics-Informed ML'],
    ['PRODUCTS', 'JOKI.IN & Kayla Finance'],
    ['GITHUB', 'github.com/Jokitugasbykay']
  ];

  let ry = 208;
  rows.forEach(([k, v]) => {
    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(k, 40, ry);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(v, 165, ry);
    ry += 42;
  });

  // Footer separator
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(40, 520);
  ctx.lineTo(w - 40, 520);
  ctx.stroke();

  // Reduced, refined QR Code (64x64) in bottom right corner
  const qrSize = 64;
  const qrX = w - 40 - qrSize;
  const qrY = 548;

  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 8);
  ctx.fill();

  ctx.fillStyle = '#050812';
  const cell = 4;
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      const isCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c > 7) ||
        (r > 7 && c < 3);
      const bit = ((r * 13 + c * 17 + r * c) % 5) < 2;
      if (isCorner || bit) {
        ctx.fillRect(qrX + 10 + c * cell, qrY + 10 + r * cell, cell - 1, cell - 1);
      }
    }
  }

  // Left text beside QR code
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px "Syne", sans-serif';
  ctx.fillText('KAYLA UNIVERSE', 40, 568);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Physical simulation, AI & engineering.', 40, 592);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 12px "JetBrains Mono", monospace';
  ctx.fillText('jokiin.my.id', 40, 616);

  // Outer bezel highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 4, 4, w - 8, h - 8, 22);
  ctx.stroke();
}
