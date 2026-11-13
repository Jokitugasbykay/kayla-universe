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

  // Deep anodized obsidian background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#0d1528');
  bgGrad.addColorStop(0.55, '#070b16');
  bgGrad.addColorStop(1, '#0b1326');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle coordinate grid hairlines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 108);
  ctx.lineTo(w - 36, 108);
  ctx.moveTo(36, 565);
  ctx.lineTo(w - 36, 565);
  ctx.stroke();

  // Top lanyard clasp cutout
  ctx.fillStyle = '#03050b';
  drawRoundedRect(ctx, w / 2 - 50, 22, 100, 18, 9);
  ctx.fill();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top header metadata
  ctx.fillStyle = '#93c5fd';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText('UNIVERSITAS AIRLANGGA', 36, 82);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('PHYSICS / SEM 05', w - 36, 82);
  ctx.textAlign = 'left';

  // Prominent Foto 1 portrait window
  const portX = 36;
  const portY = 126;
  const portW = w - 72;
  const portH = 418;

  ctx.save();
  drawRoundedRect(ctx, portX, portY, portW, portH, 16);
  ctx.clip();

  if (portraitImg && portraitImg.complete && portraitImg.naturalWidth > 0) {
    drawCoverPortrait(ctx, portraitImg, portX, portY, portW, portH);
  } else {
    // Elegant fallback plate
    const pGrad = ctx.createLinearGradient(portX, portY, portX + portW, portY + portH);
    pGrad.addColorStop(0, '#13203d');
    pGrad.addColorStop(0.6, '#091022');
    pGrad.addColorStop(1, '#060a14');
    ctx.fillStyle = pGrad;
    ctx.fillRect(portX, portY, portW, portH);

    ctx.fillStyle = 'rgba(226, 232, 240, 0.15)';
    ctx.beginPath();
    ctx.arc(w / 2, 280, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2, 470, 120, Math.PI, 0, false);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 38px "Instrument Serif", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Kayla Gabrielle', w / 2, 290);
    ctx.textAlign = 'left';
  }

  // Bottom gradient vignette inside portrait for contrast
  const botVignette = ctx.createLinearGradient(0, portY + portH - 95, 0, portY + portH);
  botVignette.addColorStop(0, 'rgba(7, 11, 22, 0)');
  botVignette.addColorStop(1, 'rgba(7, 11, 22, 0.85)');
  ctx.fillStyle = botVignette;
  ctx.fillRect(portX, portY + portH - 95, portW, 95);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('ID // KG-UNAIR-PHY', portX + 18, portY + portH - 18);
  ctx.restore();

  // Crisp border around Foto 1 window
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.22)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, portX, portY, portW, portH, 16);
  ctx.stroke();

  // Lower editorial name & discipline
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 32px "Syne", sans-serif';
  ctx.fillText('KAYLA GABRIELLE', 36, 614);

  ctx.fillStyle = '#93c5fd';
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.fillText('Physics / AI Research / Software', 36, 646);

  // Bottom pill tags
  const tags = ['JOKI.IN', 'KAYLA FINANCE', 'QUANTUM DOTS'];
  let tx = 36;
  tags.forEach((t) => {
    ctx.font = '500 12px "JetBrains Mono", monospace';
    const tw = ctx.measureText(t).width + 24;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    drawRoundedRect(ctx, tx, 676, tw, 32, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(t, tx + 12, 697);
    tx += tw + 10;
  });

  // Outer card bezel highlight
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.3)';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 4, 4, w - 8, h - 8, 26);
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
  bgGrad.addColorStop(0, '#0d1528');
  bgGrad.addColorStop(0.55, '#070b16');
  bgGrad.addColorStop(1, '#0b1326');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Clasp cutout
  ctx.fillStyle = '#03050b';
  drawRoundedRect(ctx, w / 2 - 50, 22, 100, 18, 9);
  ctx.fill();

  ctx.fillStyle = '#93c5fd';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText('PORTFOLIO DOSSIER // BACK', 42, 92);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 46px "Instrument Serif", Georgia, serif';
  ctx.fillText('Kayla Gabrielle', 42, 150);

  ctx.strokeStyle = 'rgba(226, 232, 240, 0.14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(42, 178);
  ctx.lineTo(w - 42, 178);
  ctx.stroke();

  const rows = [
    ['STATUS', 'Physics Undergrad (Sem 5)'],
    ['UNIVERSITY', 'Universitas Airlangga'],
    ['BACKGROUND', 'Malaysia, Jakarta, Surabaya'],
    ['FOCUS', 'AI, Simulation & Quantum Dots'],
    ['PROJECTS', 'JOKI.IN & Kayla Finance'],
    ['GITHUB', 'github.com/Jokitugasbykay']
  ];

  let ry = 224;
  rows.forEach(([k, v]) => {
    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.fillText(k, 42, ry);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 14px "Inter", sans-serif';
    ctx.fillText(v, 185, ry);
    ry += 48;
  });

  // Footer separator
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.14)';
  ctx.beginPath();
  ctx.moveTo(42, 535);
  ctx.lineTo(w - 42, 535);
  ctx.stroke();

  // Subtle restrained QR code in bottom corner
  const qrX = 42;
  const qrY = 568;
  const qrSize = 116;
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, qrX, qrY, qrSize, qrSize, 12);
  ctx.fill();

  ctx.fillStyle = '#070b16';
  const cell = 7;
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      const isCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c > 8) ||
        (r > 8 && c < 3);
      const bit = ((r * 19 + c * 13 + r * c) % 5) < 2;
      if (isCorner || bit) {
        ctx.fillRect(qrX + 14 + c * cell, qrY + 14 + r * cell, cell - 1.5, cell - 1.5);
      }
    }
  }

  // Footer metadata
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 16px "Syne", sans-serif';
  ctx.fillText('KAYLA UNIVERSE', 182, 602);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 13px "Inter", sans-serif';
  ctx.fillText('Science, engineering, and', 182, 628);
  ctx.fillText('creative technology.', 182, 648);

  ctx.fillStyle = '#93c5fd';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText('jokiin.my.id', 182, 674);

  // Outer bezel highlight
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.3)';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 4, 4, w - 8, h - 8, 26);
  ctx.stroke();
}
