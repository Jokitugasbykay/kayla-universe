import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LanyardVerletSystem } from '../../physics/verletChain';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas } from './LanyardBadge';
import styles from './Lanyard.module.css';

interface LanyardFallbackProps {
  portraitImg: HTMLImageElement | null;
  onFlipToggle?: () => void;
}

export const LanyardFallback: React.FC<LanyardFallbackProps> = ({
  portraitImg,
  onFlipToggle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<LanyardVerletSystem>(new LanyardVerletSystem(8, 0.32, 2.7));
  const rafRef = useRef<number>(0);
  const [telemetry, setTelemetry] = useState<string>(
    'Drag card to swing / Double-click to flip'
  );
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleFlip = useCallback(() => {
    simRef.current.toggleFlip();
    setIsFlipped((prev) => !prev);
    onFlipToggle?.();
    setTelemetry(
      simRef.current.card.isFlipped
        ? 'Viewing Dossier (Back) / Double-click to flip'
        : 'Viewing Faculty Pass (Front) / Double-click to flip'
    );
  }, [onFlipToggle]);

  const handleImpulse = useCallback(() => {
    const randomFx = (Math.random() - 0.5) * 0.12;
    simRef.current.applyImpulse(randomFx, 0.05, 0.02);
    setTelemetry('Applied physical impulse');
    setTimeout(() => {
      setTelemetry('Drag card to swing / Double-click to flip');
    }, 1500);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!frontCanvasRef.current) {
      frontCanvasRef.current = document.createElement('canvas');
      frontCanvasRef.current.width = 520;
      frontCanvasRef.current.height = 760;
    }
    if (!backCanvasRef.current) {
      backCanvasRef.current = document.createElement('canvas');
      backCanvasRef.current.width = 520;
      backCanvasRef.current.height = 760;
    }

    drawFrontBadgeCanvas(frontCanvasRef.current, portraitImg);
    drawBackBadgeCanvas(backCanvasRef.current);

    const sim = simRef.current;

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      sim.card.isDragging = true;
      sim.card.dragTargetX = nx * 2.2;
      sim.card.dragTargetY = ny * 2.2;
      canvas.style.cursor = 'grabbing';
      setTelemetry('Holding card / Release to swing');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!sim.card.isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      sim.card.dragTargetX = Math.max(-2.4, Math.min(2.4, nx * 2.2));
      sim.card.dragTargetY = Math.max(-2.2, Math.min(1.8, ny * 2.2));
    };

    const handlePointerUp = () => {
      if (sim.card.isDragging) {
        sim.card.isDragging = false;
        canvas.style.cursor = 'grab';
        setTelemetry('Drag card to swing / Double-click to flip');
      }
    };

    const handleDblClick = () => {
      handleFlip();
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('dblclick', handleDblClick);

    const render = () => {
      sim.step();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const toScreenX = (x: number) => w / 2 + x * 96;
      const toScreenY = (y: number) => h * 0.32 - y * 82;

      // Draw strap
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 16;
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

      ctx.strokeStyle = 'rgba(147, 197, 253, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw card
      const tip = sim.nodes[sim.segmentCount];
      const tipSx = toScreenX(tip.x);
      const tipSy = toScreenY(tip.y);

      ctx.save();
      ctx.translate(tipSx, tipSy);
      ctx.rotate(sim.card.tiltZ);

      // Card scale & flip
      const cosY = Math.cos(sim.card.rotY);
      ctx.scale(cosY, 1);

      const activeBadge =
        cosY >= 0 ? frontCanvasRef.current : backCanvasRef.current;
      if (activeBadge) {
        const cardW = 190;
        const cardH = 278;
        ctx.drawImage(activeBadge, -cardW / 2, 0, cardW, cardH);
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
      canvas.removeEventListener('dblclick', handleDblClick);
    };
  }, [portraitImg, handleFlip]);

  return (
    <div className={styles.lanyardStage}>
      <canvas
        ref={canvasRef}
        width={540}
        height={640}
        className={styles.lanyardCanvas}
        aria-label="Interactive physics lanyard for Kayla Gabrielle"
      />

      <div className={styles.lanyardControlsBar}>
        <span className={styles.lanyardTelemetry}>{telemetry}</span>
        <div className={styles.lanyardActionButtons}>
          <button
            type="button"
            onClick={handleFlip}
            className={styles.lanyardButton}
            aria-label="Flip lanyard badge"
          >
            {isFlipped ? 'Show Front' : 'Show Dossier'}
          </button>
          <button
            type="button"
            onClick={handleImpulse}
            className={styles.lanyardButton}
            aria-label="Nudge physical card"
          >
            Nudge
          </button>
        </div>
      </div>
    </div>
  );
};
