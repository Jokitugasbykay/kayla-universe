import { PROFILE_DATA } from '../../data/portfolio';

export const PORTFOLIO_PASS = {
    title: 'PERSONAL PORTFOLIO PASS',
    name: PROFILE_DATA.name.toUpperCase(),
    affiliation: 'UNIVERSITAS AIRLANGGA',
    role: 'PHYSICS UNDERGRADUATE / SEMESTER 5',
    focus: 'PHYSICS • SCIENTIFIC COMPUTING • MARKETS',
    subtext: 'Universitas Airlangga // JOKI.IN & journalingtrade',
    url: 'jokitugasbykay.github.io/kayla-universe/'
};

export function drawFrontBadgeCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);

    // Warm Obsidian Solid Base
    ctx.fillStyle = '#0c0d10';
    ctx.fillRect(0, 0, w, h);

    // Very Subtle Warm Ambient Gradient
    const glowGrad = ctx.createRadialGradient ? ctx.createRadialGradient(w / 2, h * 0.35, 30, w / 2, h * 0.35, w * 0.7) : null;
    if (glowGrad && typeof glowGrad.addColorStop === 'function') {
        glowGrad.addColorStop(0, 'rgba(200, 173, 141, 0.06)');
        glowGrad.addColorStop(1, 'rgba(12, 13, 16, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
    }

    // Outer Architectural Bezel (Warm hairline, no neon blue)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    ctx.strokeStyle = 'rgba(200, 173, 141, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Corner Precision Marks
    const cornerSize = 20;
    ctx.strokeStyle = '#c8ad8d';
    ctx.lineWidth = 2.5;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(40, 40 + cornerSize);
    ctx.lineTo(40, 40);
    ctx.lineTo(40 + cornerSize, 40);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(w - 40 - cornerSize, 40);
    ctx.lineTo(w - 40, 40);
    ctx.lineTo(w - 40, 40 + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(40, h - 40 - cornerSize);
    ctx.lineTo(40, h - 40);
    ctx.lineTo(40 + cornerSize, h - 40);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(w - 40 - cornerSize, h - 40);
    ctx.lineTo(w - 40, h - 40);
    ctx.lineTo(w - 40, h - 40 - cornerSize);
    ctx.stroke();

    // Top Header Lockup
    ctx.fillStyle = '#93918a';
    ctx.font = '600 21px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(PORTFOLIO_PASS.title, 64, 88);

    ctx.fillStyle = '#c8ad8d';
    ctx.font = '700 20px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('EDITION // 2026', w - 64, 88);

    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, 110);
    ctx.lineTo(w - 64, 110);
    ctx.stroke();

    // Architectural Black Portrait Placeholder Frame
    // (Intentional minimalist dark monolith, removing any wrong portrait)
    const photoX = 64;
    const photoY = 140;
    const photoW = w - 128;
    const photoH = 720;

    // Neutral deep black background
    ctx.fillStyle = '#070709';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    // Subtle inner border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 2;
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Fine decorative architectural cross-hair & watermark in placeholder
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    // Central Monogram "KG"
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(200, 173, 141, 0.16)';
    ctx.font = '400 160px "Instrument Serif", Georgia, serif';
    ctx.fillText('KG', photoX + photoW / 2, photoY + photoH / 2 + 50);

    // Subtle fine architectural crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(photoX + photoW / 2 - 40, photoY + photoH / 2);
    ctx.lineTo(photoX + photoW / 2 + 40, photoY + photoH / 2);
    ctx.moveTo(photoX + photoW / 2, photoY + photoH / 2 - 40);
    ctx.lineTo(photoX + photoW / 2, photoY + photoH / 2 + 40);
    ctx.stroke();

    // Intentional placeholder typography
    ctx.fillStyle = '#73716b';
    ctx.font = '600 17px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('IDENTITY PORTRAIT  •  ARCHIVAL PLACEHOLDER', photoX + photoW / 2, photoY + photoH - 42);

    ctx.restore();

    // Identity Block Underneath Placeholder
    const textStartY = photoY + photoH + 54;
    ctx.textAlign = 'left';

    // Status / Role Pill (Refined warm bronze styling)
    ctx.fillStyle = 'rgba(200, 173, 141, 0.10)';
    ctx.strokeStyle = 'rgba(200, 173, 141, 0.28)';
    ctx.lineWidth = 1.5;
    const pillW = 460;
    const pillH = 36;
    const pillX = 64;
    const pillY = textStartY - 36;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(pillX, pillY, pillW, pillH, 18);
    } else if (typeof ctx.rect === 'function') {
        ctx.rect(pillX, pillY, pillW, pillH);
    }
    ctx.fill();
    ctx.stroke();

    // Active status accent dot
    ctx.fillStyle = '#c8ad8d';
    ctx.beginPath();
    ctx.arc(pillX + 20, pillY + 18, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#eae8e3';
    ctx.font = '600 16px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('SCIENTIFIC THINKER • BUILDER • DAILY TRADER', pillX + 36, pillY + 23);

    // Name (Bold, editorial, warm off-white)
    ctx.fillStyle = '#f4f3ef';
    ctx.font = '800 66px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(PORTFOLIO_PASS.name, 64, textStartY + 64);

    // Primary Discipline / Focus
    ctx.fillStyle = '#c8ad8d';
    ctx.font = '600 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(PORTFOLIO_PASS.focus, 64, textStartY + 116);

    // Institutional & Projects Context
    ctx.fillStyle = '#93918a';
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(PORTFOLIO_PASS.subtext, 64, textStartY + 158);

    // Card Footer Separator
    const footerY = h - 140;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, footerY);
    ctx.lineTo(w - 64, footerY);
    ctx.stroke();

    // Footer Left
    ctx.fillStyle = '#f4f3ef';
    ctx.font = '800 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('KAYLA UNIVERSE', 64, footerY + 50);

    ctx.fillStyle = '#73716b';
    ctx.font = '500 18px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('SCIENTIFIC INQUIRY • SYSTEMS CRAFT', 64, footerY + 84);

    // Footer Right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#c8ad8d';
    ctx.font = '600 22px "JetBrains Mono", Consolas, monospace';
    ctx.fillText('PORTFOLIO PASS', w - 64, footerY + 50);

    ctx.fillStyle = '#73716b';
    ctx.font = '500 17px "JetBrains Mono", Consolas, monospace';
    ctx.fillText(PORTFOLIO_PASS.url, w - 64, footerY + 84);
}

export function drawBackBadgeCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: w, height: h } = canvas;

    ctx.clearRect(0, 0, w, h);

    // Matching Warm Obsidian Base
    ctx.fillStyle = '#0c0d10';
    ctx.fillRect(0, 0, w, h);

    // Subtle Radial Ambient Glow
    const glowGrad = ctx.createRadialGradient ? ctx.createRadialGradient(w / 2, h * 0.45, 30, w / 2, h * 0.45, w * 0.7) : null;
    if (glowGrad && typeof glowGrad.addColorStop === 'function') {
        glowGrad.addColorStop(0, 'rgba(200, 173, 141, 0.06)');
        glowGrad.addColorStop(1, 'rgba(12, 13, 16, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
    }

    // Outer Architectural Bezel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    ctx.strokeStyle = 'rgba(200, 173, 141, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Top Header Lockup
    ctx.fillStyle = '#93918a';
    ctx.font = '600 21px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(PORTFOLIO_PASS.title, 64, 88);

    ctx.fillStyle = '#c8ad8d';
    ctx.font = '700 20px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('DISCIPLINES // 2026', w - 64, 88);

    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, 110);
    ctx.lineTo(w - 64, 110);
    ctx.stroke();

    // Headline
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f4f3ef';
    ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Core Disciplines &', 64, 204);
    ctx.fillText('Areas of Exploration', 64, 262);

    // Topics list accurately representing Kayla
    const topics = [
        {
            num: '01',
            title: 'Physics & Mathematical Mechanics',
            desc: 'Continuous physical systems, differential equations, and analytical mechanics at Universitas Airlangga.'
        },
        {
            num: '02',
            title: 'Scientific Computing & Machine Learning',
            desc: 'Physics-informed neural networks (PINNs), numerical simulation, and mathematical modeling.'
        },
        {
            num: '03',
            title: 'Quantitative Markets & Daily Trading',
            desc: 'Systematic market structure analysis, price action mechanics, and disciplined risk-reward asymmetry.'
        },
        {
            num: '04',
            title: 'Production Software Craft',
            desc: 'Building responsive web platforms including JOKI.IN and trading analytics tools like journalingtrade.'
        }
    ];

    let startY = 330;
    topics.forEach((t) => {
        // Container box
        ctx.fillStyle = 'rgba(19, 21, 26, 0.75)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(64, startY, w - 128, 144, 12);
        } else if (typeof ctx.rect === 'function') {
            ctx.rect(64, startY, w - 128, 144);
        }
        ctx.fill();
        ctx.stroke();

        // Topic number
        ctx.fillStyle = '#c8ad8d';
        ctx.font = '700 28px "JetBrains Mono", Consolas, monospace';
        ctx.fillText(t.num, 96, startY + 54);

        // Topic title
        ctx.fillStyle = '#f4f3ef';
        ctx.font = '700 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(t.title, 172, startY + 52);

        // Topic description
        ctx.fillStyle = '#93918a';
        ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(t.desc, 172, startY + 98);

        startY += 172;
    });

    // Bottom Footer
    const footerY = h - 140;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(64, footerY);
    ctx.lineTo(w - 64, footerY);
    ctx.stroke();

    ctx.fillStyle = '#f4f3ef';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Kayla Gabrielle / Personal Portfolio', 64, footerY + 50);

    ctx.fillStyle = '#73716b';
    ctx.font = '400 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Personal portfolio pass. Built with React, TypeScript & Three.js.', 64, footerY + 84);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#c8ad8d';
    ctx.font = '600 20px "JetBrains Mono", Consolas, monospace';
    ctx.fillText(PORTFOLIO_PASS.url, w - 64, footerY + 68);
}
