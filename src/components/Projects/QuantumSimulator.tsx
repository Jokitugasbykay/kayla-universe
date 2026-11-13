import React, { useState, useEffect, useRef } from 'react';
import {
  computeWavePacket,
  QuantumSimParameters
} from '../../physics/quantumSimulation';
import styles from './Projects.module.css';

export const QuantumSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<QuantumSimParameters>({
    omega: 2.4,
    gamma: 0.08,
    kappa: 1.35
  });
  const [readout, setReadout] = useState<string>(
    'omega = 2.4 rad/s / gamma = 0.08 / kappa = 1.35'
  );
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const handleSliderChange = (key: keyof QuantumSimParameters, value: number) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value };
      setReadout(
        `omega = ${next.omega.toFixed(1)} rad/s / gamma = ${next.gamma.toFixed(2)} / kappa = ${next.kappa.toFixed(2)}`
      );
      return next;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (timestamp: number) => {
      const dt = (timestamp - lastTimestamp) * 0.001;
      lastTimestamp = timestamp;
      timeRef.current += dt;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.06)';
      ctx.lineWidth = 1;
      const gridCols = 8;
      const gridRows = 4;
      for (let i = 1; i < gridCols; i++) {
        const gx = (w / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let j = 1; j < gridRows; j++) {
        const gy = (h / gridRows) * j;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Compute wave packet data
      const points = computeWavePacket(params, timeRef.current, 140);
      const centerY = h * 0.58;

      // Draw Potential Well V(x)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = h - pt.potential * 38 - 14;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Probability Density Envelope |psi|^2
      ctx.fillStyle = 'rgba(59, 130, 246, 0.14)';
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = centerY - pt.probabilityDensity * 90;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      for (let i = points.length - 1; i >= 0; i--) {
        const px = (i / (points.length - 1)) * w;
        ctx.lineTo(px, centerY);
      }
      ctx.closePath();
      ctx.fill();

      // Draw Real Part Re(psi) Waveform
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = centerY - pt.psiReal * 80;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Imaginary Part Im(psi) subtle waveform
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = centerY - pt.psiImag * 80;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Baseline reference
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafRef.current);
  }, [params]);

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simGrid}>
        {/* Controls Column */}
        <div className={styles.simControlsCol}>
          <div className={styles.simEyebrow}>INTERACTIVE EXPERIMENT</div>
          <h3 className={styles.simTitle}>Quantum Confinement Simulator</h3>
          <p className={styles.simDescription}>
            Visualizing spatial confinement in semiconductor quantum dots and harmonic well
            superposition. Adjust the mathematical parameters to observe wave packet dispersion.
          </p>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-omega" className={styles.sliderLabel}>
                Confinement Frequency (omega)
              </label>
              <span className={styles.sliderValue}>{params.omega.toFixed(1)} rad/s</span>
            </div>
            <input
              id="sim-omega"
              type="range"
              min="0.8"
              max="5.0"
              step="0.1"
              value={params.omega}
              onChange={(e) => handleSliderChange('omega', parseFloat(e.target.value))}
              className={styles.sliderInput}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-gamma" className={styles.sliderLabel}>
                Dissipation Factor (gamma)
              </label>
              <span className={styles.sliderValue}>{params.gamma.toFixed(2)}</span>
            </div>
            <input
              id="sim-gamma"
              type="range"
              min="0.00"
              max="0.40"
              step="0.01"
              value={params.gamma}
              onChange={(e) => handleSliderChange('gamma', parseFloat(e.target.value))}
              className={styles.sliderInput}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-kappa" className={styles.sliderLabel}>
                Modulation Coupling (kappa)
              </label>
              <span className={styles.sliderValue}>{params.kappa.toFixed(2)}</span>
            </div>
            <input
              id="sim-kappa"
              type="range"
              min="0.20"
              max="2.80"
              step="0.05"
              value={params.kappa}
              onChange={(e) => handleSliderChange('kappa', parseFloat(e.target.value))}
              className={styles.sliderInput}
            />
          </div>
        </div>

        {/* Canvas Display Column */}
        <div className={styles.simCanvasCol}>
          <div className={styles.simHeaderBar}>
            <span className={styles.simLegend}>
              SUPERPOSITION &amp; CONFINEMENT ENVELOPE psi(x,t)
            </span>
            <span className={styles.simReadoutText}>{readout}</span>
          </div>

          <canvas
            ref={canvasRef}
            width={720}
            height={280}
            className={styles.simCanvas}
            aria-label="Quantum wave packet simulation plot"
          />

          <div className={styles.simFooterBar}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.blue}`}></span>
              <span>Re(psi) Wave</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.violet}`}></span>
              <span>Im(psi) Wave</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.shaded}`}></span>
              <span>|psi|^2 Density</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.slate}`}></span>
              <span>Potential Well V(x)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
