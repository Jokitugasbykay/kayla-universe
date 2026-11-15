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
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const phaseVelocity = (params.omega / Math.max(0.01, params.kappa)).toFixed(2);
  const groupVelocity = (0.5 * (params.omega / Math.max(0.01, params.kappa))).toFixed(2);

  const handleSliderChange = (key: keyof QuantumSimParameters, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
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

      // Deep oscilloscopic grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      const gridCols = 10;
      const gridRows = 6;
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
      const points = computeWavePacket(params, timeRef.current, 160);
      const centerY = h * 0.56;

      // Draw Potential Well V(x)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = h - pt.potential * 42 - 16;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Probability Density Envelope |psi|^2
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = centerY - pt.probabilityDensity * 95;
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
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = centerY - pt.psiReal * 85;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Draw Imaginary Part Im(psi) waveform
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = (idx / (points.length - 1)) * w;
        const py = centerY - pt.psiImag * 85;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Zero baseline reference
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
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
          <div className={styles.simEyebrow}>LABORATORY SIMULATION</div>
          <h3 className={styles.simTitle}>Quantum Wave Packet &amp; Confinement</h3>
          <p className={styles.simDescription}>
            Visualizing time-dependent Schrodinger wave packet evolution in a harmonic potential well.
            Adjust parameters to observe dispersion, probability density envelope, and phase velocity.
          </p>

          <div className={styles.simTelemetryGrid}>
            <div className={styles.simTelemetryCard}>
              <span className={styles.telemetryKey}>PHASE VELOCITY (vp)</span>
              <span className={styles.telemetryVal}>{phaseVelocity} c</span>
            </div>
            <div className={styles.simTelemetryCard}>
              <span className={styles.telemetryKey}>GROUP VELOCITY (vg)</span>
              <span className={styles.telemetryVal}>{groupVelocity} c</span>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-omega" className={styles.sliderLabel}>
                Angular Frequency (omega)
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
                Spatial Wavenumber (kappa)
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
              SUPERPOSITION &amp; CONFINEMENT ENVELOPE: psi(x,t)
            </span>
            <span className={styles.simReadoutText}>
              omega={params.omega.toFixed(1)} / gamma={params.gamma.toFixed(2)} / kappa={params.kappa.toFixed(2)}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={720}
            height={300}
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
              <span>Potential V(x)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
