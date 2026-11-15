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

  constructor(segmentCount = 16, segmentLength = 0.165, anchorY = 3.1) {
    this.segmentCount = segmentCount;
    this.segmentLength = segmentLength;
    this.anchorY = anchorY;

    this.nodes = [];
    for (let i = 0; i <= segmentCount; i++) {
      const initX = (i / segmentCount) * 0.08;
      const initY = anchorY - i * segmentLength;
      this.nodes.push({
        x: initX,
        y: initY,
        z: 0,
        oldX: initX - (i === segmentCount ? 0.005 : 0),
        oldY: initY,
        oldZ: 0,
        pinned: i === 0
      });
    }

    this.card = {
      isDragging: false,
      dragTargetX: 0,
      dragTargetY: -0.1,
      rotY: -0.15,
      rotYVel: 0.012,
      targetFlipY: 0,
      isFlipped: false,
      tiltX: 0,
      tiltZ: 0
    };
  }

  setAnchorPosition(x: number, y: number, z = 0) {
    if (this.nodes.length > 0) {
      this.nodes[0].x = x;
      this.nodes[0].y = y;
      this.nodes[0].z = z;
    }
  }

  applyImpulse(fx: number, fy: number, fz: number) {
    const tip = this.nodes[this.segmentCount];
    if (tip) {
      tip.oldX -= fx;
      tip.oldY -= fy;
      tip.oldZ -= fz;
      this.card.rotYVel += fx * 0.12;
    }
  }

  toggleFlip() {
    this.card.isFlipped = !this.card.isFlipped;
    this.card.targetFlipY = this.card.isFlipped ? Math.PI : 0;
    this.card.rotYVel += 0.24;
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

      const vx = (node.x - node.oldX) * damping;
      const vy = (node.y - node.oldY) * damping;
      const vz = (node.z - node.oldZ) * damping;

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

    // 3. Card Inertia and Angular Physics
    const tip = n[count];
    const prev = n[count - 1];
    const tipVx = tip.x - tip.oldX;
    const ropeAngleZ = Math.atan2(tip.x - prev.x, prev.y - tip.y);

    this.card.tiltZ += (-ropeAngleZ * 0.75 - this.card.tiltZ) * 0.15;
    this.card.tiltX += (Math.sin(performance.now() * 0.0015) * 0.03 - this.card.tiltX) * 0.08;

    this.card.rotYVel += tipVx * 0.065;
    const springToFlip = (this.card.targetFlipY - this.card.rotY) * 0.075;
    this.card.rotYVel = (this.card.rotYVel + springToFlip) * 0.92;
    this.card.rotY += this.card.rotYVel;
  }
}
