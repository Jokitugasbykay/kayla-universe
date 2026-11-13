export interface QuantumSimParameters {
  omega: number;
  gamma: number;
  kappa: number;
}

export interface WaveformPoint {
  x: number;
  psiReal: number;
  psiImag: number;
  probabilityDensity: number;
  potential: number;
}

export function computeWavePacket(
  params: QuantumSimParameters,
  time: number,
  samplePoints = 120
): WaveformPoint[] {
  const { omega, gamma, kappa } = params;
  const points: WaveformPoint[] = [];

  const xMin = -3.2;
  const xMax = 3.2;
  const dx = (xMax - xMin) / (samplePoints - 1);

  // Time decay factor from dissipation
  const decay = Math.exp(-gamma * (time % 8));

  for (let i = 0; i < samplePoints; i++) {
    const x = xMin + i * dx;

    // Harmonic well potential with quadratic boundary confinement
    const potential = 0.5 * omega * omega * (x * x) * 0.12;

    // Wave packet envelope (Gaussian spatial localization)
    const envelope = Math.exp(-0.75 * x * x) * decay;

    // Superposition of fundamental and first harmonic mode
    const phase1 = omega * time - kappa * x;
    const phase2 = 2.0 * omega * time - 1.5 * kappa * x;

    const psiReal = envelope * (Math.cos(phase1) + 0.45 * Math.cos(phase2));
    const psiImag = envelope * (Math.sin(phase1) + 0.45 * Math.sin(phase2));

    const probabilityDensity = psiReal * psiReal + psiImag * psiImag;

    points.push({
      x,
      psiReal,
      psiImag,
      probabilityDensity,
      potential
    });
  }

  return points;
}
