import React, { useState, useEffect, useRef } from 'react';
import { computeWavePacket, QuantumSimParameters } from '../../physics/quantumSimulation';
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
    const handleSliderChange = (key: keyof QuantumSimParameters, value: number) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let lastTimestamp = performance.now();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const render = (timestamp: number) => {
            const dt = (timestamp - lastTimestamp) * 0.001;
            lastTimestamp = timestamp;
            if (!reduced)
                timeRef.current += Math.max(0, Math.min(dt, 0.05));
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            // Deep oscilloscopic grid
            ctx.strokeStyle = 'rgba(200, 173, 141, 0.06)';
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
            ctx.strokeStyle = 'rgba(147, 145, 138, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            points.forEach((pt, idx) => {
                const px = (idx / (points.length - 1)) * w;
                const py = h - pt.potential * 42 - 16;
                if (idx === 0)
                    ctx.moveTo(px, py);
                else
                    ctx.lineTo(px, py);
            });
            ctx.stroke();
            // Draw Probability Density Envelope |psi|^2
            ctx.fillStyle = 'rgba(200, 173, 141, 0.12)';
            ctx.beginPath();
            points.forEach((pt, idx) => {
                const px = (idx / (points.length - 1)) * w;
                const py = centerY - pt.probabilityDensity * 95;
                if (idx === 0)
                    ctx.moveTo(px, py);
                else
                    ctx.lineTo(px, py);
            });
            for (let i = points.length - 1; i >= 0; i--) {
                const px = (i / (points.length - 1)) * w;
                ctx.lineTo(px, centerY);
            }
            ctx.closePath();
            ctx.fill();
            // Draw Real Part Re(psi) Waveform
            ctx.strokeStyle = '#c8ad8d';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            points.forEach((pt, idx) => {
                const px = (idx / (points.length - 1)) * w;
                const py = centerY - pt.psiReal * 85;
                if (idx === 0)
                    ctx.moveTo(px, py);
                else
                    ctx.lineTo(px, py);
            });
            ctx.stroke();
            // Draw Imaginary Part Im(psi) waveform
            ctx.strokeStyle = 'rgba(168, 162, 158, 0.6)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            points.forEach((pt, idx) => {
                const px = (idx / (points.length - 1)) * w;
                const py = centerY - pt.psiImag * 85;
                if (idx === 0)
                    ctx.moveTo(px, py);
                else
                    ctx.lineTo(px, py);
            });
            ctx.stroke();
            // Zero baseline reference
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(w, centerY);
            ctx.stroke();
            if (!reduced)
                rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
    }, [params]);
    return (<div className={styles.simWrapper}>
      <div className={styles.simGrid}>
        {/* Controls Column */}
        <div className={styles.simControlsCol}>
          <div className={styles.simEyebrow}>Illustrative wave model</div>
          <h3 className={styles.simTitle}>Two waves, one envelope</h3>
          <p className={styles.simDescription}>
            A Gaussian envelope containing two complex sinusoidal waves. Parameters use arbitrary units. This animation is not a solution of the Schrodinger equation, and its squared magnitude is not normalized probability. The grey curve is a decorative quadratic reference.
          </p>

          <div className={styles.simTelemetryGrid}>
            <div className={styles.simTelemetryCard}>
              <span className={styles.telemetryKey}>FIRST MODE: omega / kappa</span>
              <span className={styles.telemetryVal}>{phaseVelocity} (arbitrary units)</span>
            </div>

          </div>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-omega" className={styles.sliderLabel}>
                Angular Frequency (omega)
              </label>
              <span className={styles.sliderValue}>{params.omega.toFixed(1)} (arbitrary units)</span>
            </div>
            <input id="sim-omega" type="range" min="0.8" max="5.0" step="0.1" value={params.omega} onChange={(e) => handleSliderChange('omega', parseFloat(e.target.value))} className={styles.sliderInput}/>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-gamma" className={styles.sliderLabel}>
                Amplitude decay (gamma)
              </label>
              <span className={styles.sliderValue}>{params.gamma.toFixed(2)}</span>
            </div>
            <input id="sim-gamma" type="range" min="0.00" max="0.40" step="0.01" value={params.gamma} onChange={(e) => handleSliderChange('gamma', parseFloat(e.target.value))} className={styles.sliderInput}/>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.sliderLabelRow}>
              <label htmlFor="sim-kappa" className={styles.sliderLabel}>
                Spatial Wavenumber (kappa)
              </label>
              <span className={styles.sliderValue}>{params.kappa.toFixed(2)}</span>
            </div>
            <input id="sim-kappa" type="range" min="0.20" max="2.80" step="0.05" value={params.kappa} onChange={(e) => handleSliderChange('kappa', parseFloat(e.target.value))} className={styles.sliderInput}/>
          </div>
        </div>

        {/* Canvas Display Column */}
        <div className={styles.simCanvasCol}>
          <div className={styles.simHeaderBar}>
            <span className={styles.simLegend}>
              Gaussian envelope and two sinusoidal modes
            </span>
            <span className={styles.simReadoutText}>
              omega={params.omega.toFixed(1)} / gamma={params.gamma.toFixed(2)} / kappa={params.kappa.toFixed(2)}
            </span>
          </div>

          <canvas ref={canvasRef} width={720} height={300} className={styles.simCanvas} aria-label="Illustrative wave model plot"/>

          <div className={styles.simFooterBar}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.champagne}`}></span>
              <span>Re(psi) Wave</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.warmGray}`}></span>
              <span>Im(psi) Wave</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.shaded}`}></span>
              <span>Squared magnitude</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.slate}`}></span>
              <span>Quadratic reference</span>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
