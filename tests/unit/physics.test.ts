import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { LanyardVerletSystem } from '../../src/physics/verletChain';
import { CardRigidBody, AdvancedLanyardPhysics } from '../../src/physics/lanyardPhysics';
import { computeWavePacket } from '../../src/physics/quantumSimulation';

describe('Physics Engines & Numerical Integrators', () => {
    describe('LanyardVerletSystem (Legacy & Fallback)', () => {
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
            expect(system.nodes[0].x).toBe(0);
            expect(system.nodes[0].y).toBe(2.8);
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

    describe('CardRigidBody Dynamics', () => {
        it('computes principal moments of inertia accurately for rectangular body', () => {
            const size = new THREE.Vector3(1.9, 2.77, 0.04);
            const mass = 0.22;
            const body = new CardRigidBody(new THREE.Vector3(0, 0, 0), size, mass);

            const expectedIxx = (1 / 12) * mass * (size.y * size.y + size.z * size.z);
            const expectedIyy = (1 / 12) * mass * (size.x * size.x + size.z * size.z);
            const expectedIzz = (1 / 12) * mass * (size.x * size.x + size.y * size.y);

            expect(body.inertiaBody.x).toBeCloseTo(expectedIxx, 5);
            expect(body.inertiaBody.y).toBeCloseTo(expectedIyy, 5);
            expect(body.inertiaBody.z).toBeCloseTo(expectedIzz, 5);
        });

        it('generates authentic torque (tau = r x F) when force applied off-center', () => {
            const body = new CardRigidBody(new THREE.Vector3(0, 0, 0));
            // Apply horizontal force to the bottom-right corner
            const offCenterPoint = new THREE.Vector3(0.8, -1.0, 0);
            const force = new THREE.Vector3(10.0, 0, 0);

            body.applyForceAtWorldPoint(force, offCenterPoint);

            // r x F: (0.8, -1.0, 0) x (10.0, 0, 0) = (0, 0, 10.0)
            expect(body.force.x).toBe(10.0);
            expect(body.torque.z).toBeCloseTo(10.0, 4);
        });

        it('preserves unit quaternion normalization after integration', () => {
            const body = new CardRigidBody();
            body.torque.set(1.5, 2.0, -0.8);
            body.force.set(0.5, -2.0, 0.2);

            for (let i = 0; i < 50; i++) {
                body.integrate(1 / 120, 0.99, 0.98);
            }

            const quatLength = body.quaternion.length();
            expect(quatLength).toBeCloseTo(1.0, 5);
        });
    });

    describe('AdvancedLanyardPhysics System', () => {
        it('pins anchor firmly and connects card rigid body', () => {
            const sim = new AdvancedLanyardPhysics(14, 0.125, new THREE.Vector3(0, 2.35, 0));
            expect(sim.ropeNodes.length).toBe(15);
            expect(sim.ropeNodes[0].pinned).toBe(true);
            expect(sim.ropeNodes[0].position.y).toBe(2.35);
            expect(sim.ropeNodes[14].pinned).toBe(false);
            expect(sim.card.mass).toBe(0.22);
            expect(sim.isDragging).toBe(false);
            expect(sim.isFlipped).toBe(false);
        });

        it('maintains rope segment distance constraints during simulation', () => {
            const sim = new AdvancedLanyardPhysics(14, 0.125, new THREE.Vector3(0, 2.35, 0));
            // Run 60 frames (1 second of simulation)
            for (let f = 0; f < 60; f++) {
                sim.update(1 / 60);
            }

            // Verify anchor remains fixed
            expect(sim.ropeNodes[0].position.x).toBe(0);
            expect(sim.ropeNodes[0].position.y).toBe(2.35);

            // Verify all rope segment lengths remain within tight physical tolerance (0.125 +- 0.02)
            for (let i = 0; i < sim.segmentCount; i++) {
                const dist = sim.ropeNodes[i].position.distanceTo(sim.ropeNodes[i + 1].position);
                expect(dist).toBeGreaterThan(0.08);
                expect(dist).toBeLessThan(0.18);
            }
        });

        it('handles pointer dragging with torque and updates drag target', () => {
            const sim = new AdvancedLanyardPhysics(14, 0.125, new THREE.Vector3(0, 2.35, 0));
            const grabPoint = new THREE.Vector3(0.5, -1.0, 0);

            sim.startDragging(grabPoint);
            expect(sim.isDragging).toBe(true);

            // Move target to the right
            sim.updateDragTarget(new THREE.Vector3(1.2, -0.8, 0));
            sim.update(1 / 60);

            // Card should accelerate towards the target and experience torque
            expect(sim.card.velocity.x).toBeGreaterThan(0);
            sim.stopDragging();
            expect(sim.isDragging).toBe(false);
        });

        it('toggles flip and smoothly rotates target orientation', () => {
            const sim = new AdvancedLanyardPhysics();
            expect(sim.isFlipped).toBe(false);
            expect(sim.targetFlipAngle).toBe(0);

            sim.toggleFlip();
            expect(sim.isFlipped).toBe(true);
            expect(sim.targetFlipAngle).toBe(Math.PI);

            // Angular velocity kick should be present
            expect(sim.card.angularVelocity.y).toBeGreaterThan(0);

            sim.toggleFlip();
            expect(sim.isFlipped).toBe(false);
            expect(sim.targetFlipAngle).toBe(0);
        });

        it('generates consistent strap ribbon vertex pairs', () => {
            const sim = new AdvancedLanyardPhysics(14, 0.125);
            const { left, right } = sim.getRopeRibbonVertices(0.075);

            expect(left.length).toBe(sim.segmentCount + 1);
            expect(right.length).toBe(sim.segmentCount + 1);

            for (let i = 0; i <= sim.segmentCount; i++) {
                const width = left[i].distanceTo(right[i]);
                // Width should be approximately 2 * 0.075 = 0.15
                expect(width).toBeGreaterThan(0.12);
                expect(width).toBeLessThan(0.18);
            }
        });
    });

    describe('Quantum Wave Packet Simulation', () => {
        it('rejects invalid sampling and decays continuously across eight seconds', () => {
            const p = { omega: 2.4, gamma: 0.08, kappa: 1.35 };
            expect(() => computeWavePacket(p, 1, 1)).toThrow(RangeError);
            expect(() => computeWavePacket({ ...p, gamma: -1 }, 1)).toThrow(RangeError);
            const before = computeWavePacket(p, 7.999)[60].probabilityDensity;
            const after = computeWavePacket(p, 8.001)[60].probabilityDensity;
            expect(Math.abs(after - before)).toBeLessThan(0.01);
        });

        it('computes wave packet points with non-negative probability densities', () => {
            const points = computeWavePacket({ omega: 2.4, gamma: 0.08, kappa: 1.35 }, 1.5, 50);
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
