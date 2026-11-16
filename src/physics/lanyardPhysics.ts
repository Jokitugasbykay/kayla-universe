import * as THREE from 'three';

/**
 * Advanced 3D Lanyard Physics Engine
 * Rigid Body Dynamics coupled with a Segmented Constrained Rope.
 *
 * Implements:
 * - Segmented rope with distance constraints (XPBD/PBD)
 * - Rigid body dynamics with full 3D inertia tensor and quaternion rotation
 * - Physical joint attachment between rope and card
 * - Off-center pointer grab producing realistic torque: tau = r x F
 * - Aerodynamic drag (orientation-dependent), linear & angular damping
 * - Torsional twist restoration for natural front-facing equilibrium
 * - Fixed-timestep substepping with accumulator clamping for high FPS-stability
 */

export interface PhysicsConfig {
  gravity: THREE.Vector3;
  substeps: number;
  fixedDelta: number;
  linearDampingRate: number;    // Damping decay rate (s^-1)
  angularDampingRate: number;   // Angular damping decay rate (s^-1)
  aerodynamicDrag: number;
  strapTwistStiffness: number;
  strapBendingStiffness: number;
  dragSpringStiffness: number;
  dragSpringDamping: number;
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: new THREE.Vector3(0, -9.81, 0),
  substeps: 8,
  fixedDelta: 1 / 120, // 120 Hz internal physics rate
  linearDampingRate: 0.45,
  angularDampingRate: 2.2,
  aerodynamicDrag: 0.75,
  strapTwistStiffness: 2.2,
  strapBendingStiffness: 3.5,
  dragSpringStiffness: 420.0,
  dragSpringDamping: 24.0
};

export class CardRigidBody {
  // Center of Mass position and linear motion
  position: THREE.Vector3;
  prevPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  force: THREE.Vector3;

  // Orientation and angular motion
  quaternion: THREE.Quaternion;
  angularVelocity: THREE.Vector3;
  torque: THREE.Vector3;

  // Physical properties
  mass: number;
  invMass: number;
  size: THREE.Vector3; // width (x), height (y), depth (z)
  inertiaBody: THREE.Vector3;
  invInertiaBody: THREE.Vector3;

  // Local attachment point of hardware bracket/clasp
  attachmentLocal: THREE.Vector3;

  constructor(
    centerOfMass = new THREE.Vector3(0, -0.91, 0),
    size = new THREE.Vector3(1.90, 1.90 * (1520 / 1040), 0.04),
    mass = 0.22
  ) {
    this.position = centerOfMass.clone();
    this.prevPosition = centerOfMass.clone();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.force = new THREE.Vector3(0, 0, 0);

    // Initial slight natural angle for depth
    this.quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.08, 0, 'YXZ'));
    this.angularVelocity = new THREE.Vector3(0, 0, 0);
    this.torque = new THREE.Vector3(0, 0, 0);

    this.size = size.clone();
    this.mass = Math.max(0.01, mass);
    this.invMass = 1 / this.mass;

    // Diagonal principal moments of inertia for a cuboid/box:
    // Ixx = 1/12 * M * (h^2 + d^2)
    // Iyy = 1/12 * M * (w^2 + d^2)
    // Izz = 1/12 * M * (w^2 + h^2)
    const w = size.x;
    const h = size.y;
    const d = size.z;
    const ixx = (1 / 12) * this.mass * (h * h + d * d);
    const iyy = (1 / 12) * this.mass * (w * w + d * d);
    const izz = (1 / 12) * this.mass * (w * w + h * h);

    this.inertiaBody = new THREE.Vector3(ixx, iyy, izz);
    this.invInertiaBody = new THREE.Vector3(1 / ixx, 1 / iyy, 1 / izz);

    // Attachment ring is at the top center of the card
    // Since card CoM is at local (0, 0, 0) of the rigid body,
    // top edge is at +h/2 plus clasp height (0.12)
    this.attachmentLocal = new THREE.Vector3(0, h * 0.5 + 0.12, 0);
  }

  getAttachmentWorld(): THREE.Vector3 {
    return this.localToWorld(this.attachmentLocal);
  }

  localToWorld(localPoint: THREE.Vector3): THREE.Vector3 {
    const rotated = localPoint.clone().applyQuaternion(this.quaternion);
    return rotated.add(this.position);
  }

  worldToLocal(worldPoint: THREE.Vector3): THREE.Vector3 {
    const rel = worldPoint.clone().sub(this.position);
    const invQ = this.quaternion.clone().invert();
    return rel.applyQuaternion(invQ);
  }

  getVelocityAtWorldPoint(worldPoint: THREE.Vector3): THREE.Vector3 {
    const r = worldPoint.clone().sub(this.position);
    const angularVelLinear = new THREE.Vector3().crossVectors(this.angularVelocity, r);
    return this.velocity.clone().add(angularVelLinear);
  }

  applyForceAtWorldPoint(force: THREE.Vector3, worldPoint: THREE.Vector3) {
    this.force.add(force);
    const r = worldPoint.clone().sub(this.position);
    const t = new THREE.Vector3().crossVectors(r, force);
    this.torque.add(t);
  }

  applyTorque(torque: THREE.Vector3) {
    this.torque.add(torque);
  }

  integrate(dt: number, linDampFactor: number, angDampFactor: number) {
    // 1. Linear integration
    const acceleration = this.force.clone().multiplyScalar(this.invMass);
    this.velocity.addScaledVector(acceleration, dt);
    this.velocity.multiplyScalar(linDampFactor);

    // Clamp velocity to avoid instability
    const maxSpeed = 16.0;
    if (this.velocity.lengthSq() > maxSpeed * maxSpeed) {
      this.velocity.setLength(maxSpeed);
    }

    this.position.addScaledVector(this.velocity, dt);

    // 2. Angular integration
    // Transform inverse inertia tensor to world coordinates: I_world^-1 = R * I_body^-1 * R^T
    const rotMat = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(this.quaternion));
    const invInertiaWorld = this.computeWorldInverseInertia(rotMat);

    // Angular acceleration: alpha = I_world^-1 * torque
    const angularAcc = this.torque.clone().applyMatrix3(invInertiaWorld);
    this.angularVelocity.addScaledVector(angularAcc, dt);
    this.angularVelocity.multiplyScalar(angDampFactor);

    const maxAngularSpeed = 24.0;
    if (this.angularVelocity.lengthSq() > maxAngularSpeed * maxAngularSpeed) {
      this.angularVelocity.setLength(maxAngularSpeed);
    }

    // Quaternion update: q_new = normalize(q + 0.5 * dt * [omega, 0] * q)
    const omegaQuat = new THREE.Quaternion(
      this.angularVelocity.x * dt * 0.5,
      this.angularVelocity.y * dt * 0.5,
      this.angularVelocity.z * dt * 0.5,
      0
    );
    omegaQuat.multiply(this.quaternion);
    this.quaternion.x += omegaQuat.x;
    this.quaternion.y += omegaQuat.y;
    this.quaternion.z += omegaQuat.z;
    this.quaternion.w += omegaQuat.w;
    this.quaternion.normalize();

    // Reset accumulated force & torque
    this.force.set(0, 0, 0);
    this.torque.set(0, 0, 0);
  }

  computeWorldInverseInertia(rotMat: THREE.Matrix3): THREE.Matrix3 {
    // R * diag(invI) * R^T
    const r = rotMat.elements;
    const ix = this.invInertiaBody.x;
    const iy = this.invInertiaBody.y;
    const iz = this.invInertiaBody.z;

    const m00 = r[0] * ix * r[0] + r[3] * iy * r[3] + r[6] * iz * r[6];
    const m01 = r[0] * ix * r[1] + r[3] * iy * r[4] + r[6] * iz * r[7];
    const m02 = r[0] * ix * r[2] + r[3] * iy * r[5] + r[6] * iz * r[8];

    const m10 = m01;
    const m11 = r[1] * ix * r[1] + r[4] * iy * r[4] + r[7] * iz * r[7];
    const m12 = r[1] * ix * r[2] + r[4] * iy * r[5] + r[7] * iz * r[8];

    const m20 = m02;
    const m21 = m12;
    const m22 = r[2] * ix * r[2] + r[5] * iy * r[5] + r[8] * iz * r[8];

    const result = new THREE.Matrix3();
    result.set(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return result;
  }
}

export interface RopeNode {
  position: THREE.Vector3;
  prevPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  invMass: number;
  pinned: boolean;
}

export class AdvancedLanyardPhysics {
  config: PhysicsConfig;
  anchor: THREE.Vector3;
  ropeNodes: RopeNode[];
  segmentCount: number;
  segmentLength: number;
  totalLength: number;
  card: CardRigidBody;

  // Interaction State
  isDragging: boolean;
  dragGrabLocal: THREE.Vector3;
  dragTargetWorld: THREE.Vector3;

  // Flip & Twist State
  isFlipped: boolean;
  targetFlipAngle: number;

  // Substepping accumulator
  private accumulator: number;

  constructor(
    segmentCount = 14,
    segmentLength = 0.125,
    anchorPosition = new THREE.Vector3(0, 2.35, 0),
    config: Partial<PhysicsConfig> = {}
  ) {
    this.config = { ...DEFAULT_PHYSICS_CONFIG, ...config };
    this.segmentCount = segmentCount;
    this.segmentLength = segmentLength;
    this.totalLength = segmentCount * segmentLength;
    this.anchor = anchorPosition.clone();

    // 1. Initialize rope nodes vertically from anchor
    this.ropeNodes = [];
    for (let i = 0; i <= segmentCount; i++) {
      const pos = new THREE.Vector3(
        this.anchor.x + (i / segmentCount) * 0.04,
        this.anchor.y - i * segmentLength,
        this.anchor.z
      );
      this.ropeNodes.push({
        position: pos.clone(),
        prevPosition: pos.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        invMass: i === 0 ? 0 : 1 / 0.025, // Pin the anchor node
        pinned: i === 0
      });
    }

    // 2. Initialize Card Rigid Body
    const ropeTip = this.ropeNodes[segmentCount].position;
    const cardSize = new THREE.Vector3(1.90, 1.90 * (1520 / 1040), 0.04);
    const initialCardPos = ropeTip.clone().sub(new THREE.Vector3(0, cardSize.y * 0.5 + 0.12, 0));
    this.card = new CardRigidBody(initialCardPos, cardSize, 0.22);
    this.card.prevPosition.copy(this.card.position);

    this.isDragging = false;
    this.dragGrabLocal = new THREE.Vector3();
    this.dragTargetWorld = new THREE.Vector3();

    this.isFlipped = false;
    this.targetFlipAngle = 0;
    this.accumulator = 0;
  }

  setAnchorPosition(x: number, y: number, z = 0) {
    this.anchor.set(x, y, z);
    if (this.ropeNodes.length > 0) {
      this.ropeNodes[0].position.copy(this.anchor);
      this.ropeNodes[0].prevPosition.copy(this.anchor);
    }
  }

  startDragging(worldHitPoint: THREE.Vector3) {
    this.isDragging = true;
    this.dragGrabLocal = this.card.worldToLocal(worldHitPoint);
    this.dragTargetWorld.copy(worldHitPoint);
  }

  updateDragTarget(worldTarget: THREE.Vector3) {
    this.dragTargetWorld.copy(worldTarget);
  }

  stopDragging() {
    this.isDragging = false;
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    this.targetFlipAngle = this.isFlipped ? Math.PI : 0;
    // Add natural rotational kick for immediate tactile feedback
    this.card.angularVelocity.y += (this.isFlipped ? 4.0 : -4.0);
  }

  applyImpulse(fx: number, fy: number, fz: number) {
    const impulse = new THREE.Vector3(
      Math.max(-2.5, Math.min(2.5, fx)),
      Math.max(-1.5, Math.min(1.5, fy)),
      Math.max(-1.5, Math.min(1.5, fz))
    );
    this.card.velocity.addScaledVector(impulse, this.card.invMass);
    this.card.angularVelocity.x += impulse.z * 1.5;
    this.card.angularVelocity.y += impulse.x * 2.0;
  }

  /**
   * Fixed-timestep update with accumulator and safety clamping.
   * Guarantees identical physics across variable monitor refresh rates (60Hz, 120Hz, 144Hz, 240Hz).
   */
  update(frameDeltaSeconds: number) {
    // Clamp frame delta to 0.05s to prevent explosion after tab suspension or browser throttling
    const clampedDelta = Math.min(frameDeltaSeconds, 0.05);
    this.accumulator += clampedDelta;

    const fixedDt = this.config.fixedDelta;
    let iterations = 0;
    const maxSubsteps = this.config.substeps;

    while (this.accumulator >= fixedDt && iterations < maxSubsteps) {
      this.substep(fixedDt);
      this.accumulator -= fixedDt;
      iterations++;
    }

    if (iterations >= maxSubsteps) {
      this.accumulator = 0;
    }
  }

  /**
   * Single high-precision numerical sub-step
   */
  private substep(dt: number) {
    const gravity = this.config.gravity;
    const count = this.segmentCount;
    const nodes = this.ropeNodes;

    const linDamp = Math.exp(-this.config.linearDampingRate * dt);
    const angDamp = Math.exp(-this.config.angularDampingRate * dt);

    // 1. External forces on Card
    // Gravity: F = M * g
    this.card.applyForceAtWorldPoint(gravity.clone().multiplyScalar(this.card.mass), this.card.position);

    // Aerodynamic Drag (orientation dependent: higher drag perpendicular to face)
    const cardNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(this.card.quaternion);
    const speed = this.card.velocity.length();
    if (speed > 0.001) {
      const normalComponent = this.card.velocity.dot(cardNormal);
      const aeroForce = cardNormal.clone().multiplyScalar(
        -this.config.aerodynamicDrag * normalComponent * Math.abs(normalComponent) * this.card.mass
      );
      this.card.applyForceAtWorldPoint(aeroForce, this.card.position);
    }

    // Strap Twist Restoration Torque
    // Fabric ribbon strap resists twisting around the vertical suspension axis
    const cardEuler = new THREE.Euler().setFromQuaternion(this.card.quaternion, 'YXZ');
    const yawDelta = cardEuler.y - this.targetFlipAngle;
    const normalizedYaw = Math.atan2(Math.sin(yawDelta), Math.cos(yawDelta));
    const twistTorque = new THREE.Vector3(0, -this.config.strapTwistStiffness * normalizedYaw, 0);
    this.card.applyTorque(twistTorque);

    // Card upright restoring tendency (gravity center-of-mass naturally creates pitch/roll balance)
    const upVector = new THREE.Vector3(0, 1, 0);
    const cardUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.card.quaternion);
    const tiltCross = new THREE.Vector3().crossVectors(cardUp, upVector);
    this.card.applyTorque(tiltCross.multiplyScalar(this.config.strapBendingStiffness));

    // Pointer Dragging Force & Torque (Applied at exact local grab location)
    if (this.isDragging) {
      const currentGrabWorld = this.card.localToWorld(this.dragGrabLocal);
      const grabVel = this.card.getVelocityAtWorldPoint(currentGrabWorld);
      const toTarget = this.dragTargetWorld.clone().sub(currentGrabWorld);

      // Spring-damper force at grab point
      const pullForce = toTarget.multiplyScalar(this.config.dragSpringStiffness);
      const dampForce = grabVel.multiplyScalar(this.config.dragSpringDamping);
      const totalDragForce = pullForce.sub(dampForce);

      // Apply force at the exact 3D grab point on the card (creates realistic torque = r x F)
      this.card.applyForceAtWorldPoint(totalDragForce, currentGrabWorld);
    }

    // 2. Integrate Card Rigid Body linear and angular motion
    this.card.integrate(dt, linDamp, angDamp);

    // 3. Integrate Rope Nodes (Verlet integration)
    for (let i = 1; i <= count; i++) {
      const node = nodes[i];
      const vx = (node.position.x - node.prevPosition.x) * linDamp;
      const vy = (node.position.y - node.prevPosition.y) * linDamp;
      const vz = (node.position.z - node.prevPosition.z) * linDamp;

      node.prevPosition.copy(node.position);

      node.position.x += vx + gravity.x * dt * dt;
      node.position.y += vy + gravity.y * dt * dt;
      node.position.z += vz + gravity.z * dt * dt;
    }

    // 4. Position-Based Dynamics (PBD) Constraint Solver
    const pbdIterations = 16;
    for (let iter = 0; iter < pbdIterations; iter++) {
      // Anchor is permanently pinned
      nodes[0].position.copy(this.anchor);

      // A. Forward Pass: Rope Segment Distance Constraints (nodes 0 to count - 1)
      for (let i = 0; i < count - 1; i++) {
        const n1 = nodes[i];
        const n2 = nodes[i + 1];

        const delta = n2.position.clone().sub(n1.position);
        const dist = delta.length() || 0.0001;
        const diff = (dist - this.segmentLength) / dist;

        const w1 = n1.invMass;
        const w2 = n2.invMass;
        const totalW = w1 + w2;

        if (totalW > 0) {
          const corr = delta.multiplyScalar(diff / totalW);
          if (!n1.pinned) n1.position.addScaledVector(corr, w1);
          if (!n2.pinned) n2.position.addScaledVector(corr, -w2);
        }
      }

      // B. Card-to-Rope Joint Constraint (Last Segment to Attachment Point)
      const lastNode = nodes[count - 1];
      const attachWorld = this.card.getAttachmentWorld();
      const rAttach = attachWorld.clone().sub(this.card.position);

      const delta = attachWorld.clone().sub(lastNode.position);
      const dist = delta.length() || 0.0001;
      const diff = (dist - this.segmentLength) / dist;

      const n = delta.clone().normalize();
      const rCrossN = new THREE.Vector3().crossVectors(rAttach, n);
      const rotMat = new THREE.Matrix3().setFromMatrix4(
        new THREE.Matrix4().makeRotationFromQuaternion(this.card.quaternion)
      );
      const invInertiaWorld = this.card.computeWorldInverseInertia(rotMat);
      const rotInvMass = rCrossN.clone().applyMatrix3(invInertiaWorld).dot(rCrossN);

      const wCard = this.card.invMass + rotInvMass;
      const wLast = lastNode.invMass;
      const totalW = wLast + wCard;

      if (totalW > 0) {
        const corr = delta.multiplyScalar(diff / totalW);
        lastNode.position.addScaledVector(corr, wLast);

        // Correct card translation
        const cardCorr = corr.clone().multiplyScalar(-this.card.invMass);
        this.card.position.add(cardCorr);

        // Correct card orientation via angular displacement
        const angImpulse = new THREE.Vector3().crossVectors(rAttach, corr.clone().multiplyScalar(-1));
        const deltaTheta = angImpulse.applyMatrix3(invInertiaWorld).multiplyScalar(0.35);

        const deltaQ = new THREE.Quaternion(
          deltaTheta.x * 0.5,
          deltaTheta.y * 0.5,
          deltaTheta.z * 0.5,
          0
        ).multiply(this.card.quaternion);

        this.card.quaternion.x += deltaQ.x;
        this.card.quaternion.y += deltaQ.y;
        this.card.quaternion.z += deltaQ.z;
        this.card.quaternion.w += deltaQ.w;
        this.card.quaternion.normalize();
      }

      // C. Backward Pass: Propagate card tension back up the rope
      for (let i = count - 2; i >= 0; i--) {
        const n1 = nodes[i];
        const n2 = nodes[i + 1];

        const bDelta = n2.position.clone().sub(n1.position);
        const bDist = bDelta.length() || 0.0001;
        const bDiff = (bDist - this.segmentLength) / bDist;

        const w1 = n1.invMass;
        const w2 = n2.invMass;
        const totalW = w1 + w2;

        if (totalW > 0) {
          const corr = bDelta.multiplyScalar(bDiff / totalW);
          if (!n1.pinned) n1.position.addScaledVector(corr, w1);
          if (!n2.pinned) n2.position.addScaledVector(corr, -w2);
        }
      }

      // Update the tip node position to exactly match attachment hardware
      nodes[count].position.copy(this.card.getAttachmentWorld());
    }

    // 5. Camera Frustum Safety Soft Bounds
    this.enforceSafetyFrustumBounds();
  }

  private enforceSafetyFrustumBounds() {
    const card = this.card;
    const maxX = 2.4;
    const minY = -3.4;
    const maxY = this.anchor.y - 0.2;
    const maxZ = 1.6;

    if (card.position.x < -maxX) {
      card.position.x = -maxX;
      card.velocity.x *= -0.2;
    } else if (card.position.x > maxX) {
      card.position.x = maxX;
      card.velocity.x *= -0.2;
    }

    if (card.position.y < minY) {
      card.position.y = minY;
      card.velocity.y *= -0.2;
    } else if (card.position.y > maxY) {
      card.position.y = maxY;
      card.velocity.y *= -0.2;
    }

    if (card.position.z < -maxZ) {
      card.position.z = -maxZ;
      card.velocity.z *= -0.2;
    } else if (card.position.z > maxZ) {
      card.position.z = maxZ;
      card.velocity.z *= -0.2;
    }
  }

  /**
   * Generates ribbon vertex pairs for smooth fabric strap rendering.
   * Correctly interpolates twist from the anchor to the card clasp.
   */
  getRopeRibbonVertices(halfWidth = 0.075): { left: THREE.Vector3[]; right: THREE.Vector3[] } {
    const left: THREE.Vector3[] = [];
    const right: THREE.Vector3[] = [];
    const nodes = this.ropeNodes;
    const count = this.segmentCount;

    // Anchor orientation: ribbon width is along X axis, normal is +Z
    const anchorNormal = new THREE.Vector3(0, 0, 1);

    // Card attachment orientation: normal follows card quaternion
    const cardNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(this.card.quaternion);

    for (let i = 0; i <= count; i++) {
      // For the last node, seamlessly align with attachment hardware point
      const p = (i === count) ? this.card.getAttachmentWorld() : nodes[i].position;
      const t = i / count;

      // Smooth tangent along the rope curve
      let tangent: THREE.Vector3;
      if (i === 0) {
        tangent = nodes[1].position.clone().sub(p).normalize();
      } else if (i === count) {
        tangent = p.clone().sub(nodes[count - 1].position).normalize();
      } else {
        tangent = nodes[i + 1].position.clone().sub(nodes[i - 1].position).normalize();
      }

      // Slerp or spherical lerp of normal vector from anchor to card
      const normal = anchorNormal.clone().lerp(cardNormal, t).normalize();

      // Binormal (perpendicular to tangent and normal) forms the strap width
      let binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
      if (binormal.lengthSq() < 0.001) {
        binormal = new THREE.Vector3(1, 0, 0);
      }

      const offset = binormal.clone().multiplyScalar(halfWidth);
      left.push(p.clone().sub(offset));
      right.push(p.clone().add(offset));
    }

    return { left, right };
  }
}
