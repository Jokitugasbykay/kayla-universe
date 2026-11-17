import React, { useEffect, useRef, useCallback } from 'react';
import { LanyardVerletSystem } from '../../physics/verletChain';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas } from './LanyardBadge';
import styles from './Lanyard.module.css';

interface LanyardFallbackProps {
    portraitImg?: HTMLImageElement | null;
    onFlipToggle?: () => void;
}

export const LanyardFallback: React.FC<LanyardFallbackProps> = ({ onFlipToggle }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const backCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const simRef = useRef<LanyardVerletSystem>(new LanyardVerletSystem(14, 0.135, 2.35));
    const rafRef = useRef<number>(0);

    const handleFlip = useCallback(() => {
        simRef.current.toggleFlip();
        onFlipToggle?.();
    }, [onFlipToggle]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (!frontCanvasRef.current) {
            frontCanvasRef.current = document.createElement('canvas');
            frontCanvasRef.current.width = 1040;
            frontCanvasRef.current.height = 1520;
        }
        if (!backCanvasRef.current) {
            backCanvasRef.current = document.createElement('canvas');
            backCanvasRef.current.width = 1040;
            backCanvasRef.current.height = 1520;
        }

        drawFrontBadgeCanvas(frontCanvasRef.current);
        drawBackBadgeCanvas(backCanvasRef.current);

        const sim = simRef.current;

        const pointerPosition = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: ((e.clientX - rect.left) * canvas.width) / rect.width,
                y: ((e.clientY - rect.top) * canvas.height) / rect.height
            };
        };

        const hitCard = (e: MouseEvent) => {
            const point = pointerPosition(e);
            const tip = sim.nodes[sim.segmentCount];
            const dx = point.x - (canvas.width / 2 + tip.x * 96);
            const dy = point.y - (canvas.height * 0.32 - tip.y * 82);
            const angle = sim.card.tiltZ;
            const x = dx * Math.cos(angle) + dy * Math.sin(angle);
            const y = -dx * Math.sin(angle) + dy * Math.cos(angle);
            return Math.abs(x) <= 95 * Math.abs(Math.cos(sim.card.rotY)) && y >= 0 && y <= 278;
        };

        let offsetX = 0;
        let offsetY = 0;

        const handlePointerDown = (e: PointerEvent) => {
            if (!hitCard(e)) return;
            const point = pointerPosition(e);
            const tip = sim.nodes[sim.segmentCount];
            offsetX = tip.x - (point.x - canvas.width / 2) / 96;
            offsetY = tip.y - (canvas.height * 0.32 - point.y) / 82;
            sim.card.isDragging = true;
            sim.card.dragTargetX = tip.x;
            sim.card.dragTargetY = tip.y;
            canvas.style.cursor = 'grabbing';
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!sim.card.isDragging) {
                if (hitCard(e)) {
                    canvas.style.cursor = 'grab';
                } else {
                    canvas.style.cursor = 'default';
                }
                return;
            }
            const point = pointerPosition(e);
            sim.card.dragTargetX = Math.max(-2.0, Math.min(2.0, (point.x - canvas.width / 2) / 96 + offsetX));
            sim.card.dragTargetY = Math.max(-2.0, Math.min(1.8, (canvas.height * 0.32 - point.y) / 82 + offsetY));
        };

        const handlePointerUp = (e: PointerEvent) => {
            if (sim.card.isDragging) {
                sim.card.isDragging = false;
                canvas.style.cursor = hitCard(e) ? 'grab' : 'default';
            }
        };

        const handleDblClick = (e: MouseEvent) => {
            if (hitCard(e)) handleFlip();
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        canvas.addEventListener('dblclick', handleDblClick);

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let lastStep = 0;

        const render = (now: number) => {
            if (now - lastStep >= 1000 / 60) {
                if (!reduced || sim.card.isDragging || Math.abs(sim.card.targetFlipY - sim.card.rotY) > 0.001) {
                    sim.step();
                }
                lastStep = now;
            }

            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const toScreenX = (x: number) => w / 2 + x * 96;
            const toScreenY = (y: number) => h * 0.32 - y * 82;

            // Strap ribbon
            ctx.strokeStyle = '#060e20';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            sim.nodes.forEach((node, i) => {
                const sx = toScreenX(node.x);
                const sy = toScreenY(node.y);
                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            });
            ctx.stroke();

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Hardware clasp
            const tip = sim.nodes[sim.segmentCount];
            const tipSx = toScreenX(tip.x);
            const tipSy = toScreenY(tip.y);

            ctx.save();
            ctx.translate(tipSx, tipSy);
            ctx.rotate(sim.card.tiltZ);

            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(-14, -8, 28, 16);

            // Card drawing (scale Math.abs to avoid text mirroring)
            const cosY = Math.cos(sim.card.rotY);
            ctx.scale(Math.abs(cosY), 1);
            const activeBadge = cosY >= 0 ? frontCanvasRef.current : backCanvasRef.current;
            if (activeBadge) {
                const cardW = 190;
                const cardH = (190 * 1520) / 1040;
                ctx.drawImage(activeBadge, -cardW / 2, 8, cardW, cardH);
            }
            ctx.restore();

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafRef.current);
            canvas.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
            canvas.removeEventListener('dblclick', handleDblClick);
        };
    }, [handleFlip]);

    return (
        <div className={styles.lanyardStage}>
            <canvas
                ref={canvasRef}
                width={540}
                height={680}
                className={`${styles.lanyardCanvas} ${styles.fallbackCanvas}`}
                aria-label="Interactive physics lanyard for Kayla Gabrielle"
            />
        </div>
    );
};
