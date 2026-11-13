import { describe, it, expect } from 'vitest';
import { LanyardVerletSystem } from '../../src/physics/verletChain';
import { computeWavePacket } from '../../src/physics/quantumSimulation';

describe('Physics Engines & Numerical Integrators', () => {
  describe('LanyardVerletSystem', () => {
    it('initializes nodes and anchor correctly', () => {
      const system = new LanyardVerletSystem(8, 0.3, 2.8);
      expect(system.nodes.length).toBe(9);
      expect(system.nodes[0].pinned).toBe(true);
      expect(system.nodes[0].y).toBe(2.8);
      expect(system.nodes[8].pinned).toBe(false);
      expect(system.card.isDragging).toBe(false);
      expect(system.card.isFlipped).toBe(false);
    });

    it('relaxes constraints across multiple steps without exploding', () => {
      const system = new LanyardVerletSystem(8, 0.3, 2.8);
      for (let i = 0; i < 60; i++) {
        system.step(-0.004, 0.98, 10);
      }

      // Check anchor remains pinned
      expect(system.nodes[0].x).toBe(0);
      expect(system.nodes[0].y).toBe(2.8);

      // Check all segment distances remain close to expected segmentLength
      for (let i = 0; i < system.segmentCount; i++) {
        const n1 = system.nodes[i];
        const n2 = system.nodes[i + 1];
        const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y, n2.z - n1.z);
        expect(dist).toBeGreaterThan(0.25);
        expect(dist).toBeLessThan(0.35);
      }
    });

    it('toggles card flip state smoothly', () => {
      const system = new LanyardVerletSystem();
      expect(system.card.isFlipped).toBe(false);
      expect(system.card.targetFlipY).toBe(0);

      system.toggleFlip();
      expect(system.card.isFlipped).toBe(true);
      expect(system.card.targetFlipY).toBe(Math.PI);
      expect(system.card.rotYVel).toBeGreaterThan(0);

      system.toggleFlip();
      expect(system.card.isFlipped).toBe(false);
      expect(system.card.targetFlipY).toBe(0);
    });

    it('applies physical impulse to tip', () => {
      const system = new LanyardVerletSystem();
      const oldOldX = system.nodes[system.segmentCount].oldX;
      system.applyImpulse(0.1, 0.05, 0);
      expect(system.nodes[system.segmentCount].oldX).toBeLessThan(oldOldX);
      expect(system.card.rotYVel).toBeGreaterThan(0);
    });
  });

  describe('Quantum Wave Packet Simulation', () => {
    it('computes wave packet points with non-negative probability densities', () => {
      const points = computeWavePacket(
        { omega: 2.4, gamma: 0.08, kappa: 1.35 },
        1.5,
        50
      );
      expect(points.length).toBe(50);
      points.forEach((pt) => {
        expect(pt.probabilityDensity).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(pt.psiReal)).toBe(true);
        expect(Number.isFinite(pt.psiImag)).toBe(true);
        expect(Number.isFinite(pt.potential)).toBe(true);
      });
    });
  });
});
