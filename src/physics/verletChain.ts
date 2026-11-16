export interface VerletNode {
  x: number;
  y: number;
  z: number;
  oldX: number;
  oldY: number;
  oldZ: number;
  pinned: boolean;
}

export interface CardState {
  isDragging: boolean;
  dragTargetX: number;
  dragTargetY: number;
  rotY: number;
  rotYVel: number;
  targetFlipY: number;
  isFlipped: boolean;
  tiltX: number;
  tiltZ: number;
}

export class LanyardVerletSystem {
  readonly segmentCount: number;
  readonly segmentLength: number;
  nodes: VerletNode[];
  card: CardState;
  anchorY: number;

  constructor(segmentCount = 14, segmentLength = 0.135, anchorY = 2.35) {
    this.segmentCount = segmentCount;
    this.segmentLength = segmentLength;
    this.anchorY = anchorY;

    this.nodes = [];
    for (let i = 0; i <= segmentCount; i++) {
      const initX = (i / segmentCount) * 0.05;
      const initY = anchorY - i * segmentLength;
      this.nodes.push({
        x: initX,
        y: initY,
        z: 0,
        oldX: initX - (i === segmentCount ? 0.003 : 0),
        oldY: initY,
        oldZ: 0,
        pinned: i === 0
      });
    }

    this.card = {
      isDragging: false,
      dragTargetX: 0,
      dragTargetY: anchorY - segmentCount * segmentLength,
      rotY: -0.15,
      rotYVel: 0.012,
      targetFlipY: 0,
      isFlipped: false,
      tiltX: 0,
      tiltZ: 0
    };
  }

  setAnchorPosition(x: number, y: number, z = 0) {
    this.anchorY = y;
    if (this.nodes.length > 0) {
      this.nodes[0].x = x;
      this.nodes[0].y = y;
      this.nodes[0].z = z;
    }
  }

  applyImpulse(fx: number, fy: number, fz: number) {
    const tip = this.nodes[this.segmentCount];
    if (tip) {
      // Limit impulse magnitude to keep within camera bounds
      const clampedFx = Math.max(-0.16, Math.min(0.16, fx));
      const clampedFy = Math.max(-0.08, Math.min(0.08, fy));
      const clampedFz = Math.max(-0.06, Math.min(0.06, fz));
      tip.oldX -= clampedFx;
      tip.oldY -= clampedFy;
      tip.oldZ -= clampedFz;
      this.card.rotYVel += clampedFx * 0.10;
    }
  }

  toggleFlip() {
    this.card.isFlipped = !this.card.isFlipped;
    this.card.targetFlipY = this.card.isFlipped ? Math.PI : 0;
    this.card.rotYVel += 0.22;
  }

  step(gravity = -0.0035, damping = 0.985, iterations = 16) {
    const n = this.nodes;
    const count = this.segmentCount;

    // 1. Verlet Integration with drag override on bottom tip
    for (let i = 1; i <= count; i++) {
      const node = n[i];

      if (this.card.isDragging && i === count) {
        node.oldX = node.x;
        node.oldY = node.y;
        node.x += (this.card.dragTargetX - node.x) * 0.35;
        node.y += (this.card.dragTargetY - node.y) * 0.35;
        continue;
      }

      let vx = (node.x - node.oldX) * damping;
      let vy = (node.y - node.oldY) * damping;
      let vz = (node.z - node.oldZ) * damping;

      // Velocity clamping to prevent explosive movements outside frustum
      const maxVel = 0.28;
      vx = Math.max(-maxVel, Math.min(maxVel, vx));
      vy = Math.max(-maxVel, Math.min(maxVel, vy));
      vz = Math.max(-maxVel, Math.min(maxVel, vz));

      node.oldX = node.x;
      node.oldY = node.y;
      node.oldZ = node.z;

      node.x += vx;
      node.y += vy + gravity;
      node.z += vz;
    }

    // 2. Relaxation Constraint Iterations
    for (let iter = 0; iter < iterations; iter++) {
      // Anchor remains rigidly pinned
      n[0].x = 0;
      n[0].y = this.anchorY;
      n[0].z = 0;

      for (let i = 0; i < count; i++) {
        const n1 = n[i];
        const n2 = n[i + 1];

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dz = n2.z - n1.z;
        const dist = Math.hypot(dx, dy, dz) || 0.0001;
        const diff = (this.segmentLength - dist) / dist;

        if (i === 0) {
          n2.x += dx * diff;
          n2.y += dy * diff;
          n2.z += dz * diff;
        } else if (this.card.isDragging && i + 1 === count) {
          n1.x -= dx * diff;
          n1.y -= dy * diff;
          n1.z -= dz * diff;
        } else {
          n1.x -= dx * diff * 0.5;
          n1.y -= dy * diff * 0.5;
          n1.z -= dz * diff * 0.5;
          n2.x += dx * diff * 0.5;
          n2.y += dy * diff * 0.5;
          n2.z += dz * diff * 0.5;
        }
      }
    }

    // 3. Safety frustum boundary constraints on all nodes
    for (let i = 1; i <= count; i++) {
      n[i].x = Math.max(-2.2, Math.min(2.2, n[i].x));
      n[i].y = Math.max(-3.2, Math.min(this.anchorY, n[i].y));
      n[i].z = Math.max(-1.0, Math.min(1.0, n[i].z));
    }

    // 4. Card Inertia and Angular Physics
    const tip = n[count];
    const prev = n[count - 1];
    const tipVx = tip.x - tip.oldX;
    const ropeAngleZ = Math.atan2(tip.x - prev.x, prev.y - tip.y);

    const targetTiltZ = Math.max(-0.45, Math.min(0.45, -ropeAngleZ * 0.75));
    this.card.tiltZ += (targetTiltZ - this.card.tiltZ) * 0.15;
    this.card.tiltX += (Math.sin(performance.now() * 0.0015) * 0.025 - this.card.tiltX) * 0.08;

    this.card.rotYVel += tipVx * 0.055;
    const springToFlip = (this.card.targetFlipY - this.card.rotY) * 0.075;
    this.card.rotYVel = (this.card.rotYVel + springToFlip) * 0.92;
    this.card.rotY += this.card.rotYVel;
  }
}
