import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { LanyardVerletSystem } from '../../physics/verletChain';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas } from './LanyardBadge';
import { LanyardFallback } from './LanyardFallback';
import styles from './Lanyard.module.css';

interface LanyardSceneProps {
  portraitImg: HTMLImageElement | null;
}

export const LanyardScene: React.FC<LanyardSceneProps> = ({ portraitImg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<string>(
    'Drag card to swing / Double-click to flip'
  );
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const simRef = useRef<LanyardVerletSystem>(new LanyardVerletSystem(8, 0.33, 2.8));
  const rafRef = useRef<number>(0);

  // Trigger flip
  const handleFlip = useCallback(() => {
    simRef.current.toggleFlip();
    setIsFlipped((prev) => !prev);
    setTelemetry(
      simRef.current.card.isFlipped
        ? 'Viewing Dossier (Back) / Double-click to flip'
        : 'Viewing Faculty Pass (Front) / Double-click to flip'
    );
  }, []);

  // Impulse push
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

    // Check WebGL availability
    const testGl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!testGl) {
      setWebglSupported(false);
      return;
    }

    // 2D badge canvas textures
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 520;
    frontCanvas.height = 760;
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 520;
    backCanvas.height = 760;

    drawFrontBadgeCanvas(frontCanvas, portraitImg);
    drawBackBadgeCanvas(backCanvas);

    // Three.js Scene Setup
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let cardGroup: THREE.Group | null = null;
    let strapMesh: THREE.Mesh | null = null;

    let frontTex: THREE.CanvasTexture | null = null;
    let backTex: THREE.CanvasTexture | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 540;
      const height = rect.height || 640;

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      scene = new THREE.Scene();

      // Camera positioned with generous vertical margin to prevent bottom clipping
      camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
      camera.position.set(0, -0.15, 7.6);

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambLight);

      const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
      keyLight.position.set(3.5, 5, 6);
      scene.add(keyLight);

      const rimLight = new THREE.PointLight(0x93c5fa, 1.15, 16);
      rimLight.position.set(-4, -1.5, 4);
      scene.add(rimLight);

      // Materials & Textures
      frontTex = new THREE.CanvasTexture(frontCanvas);
      backTex = new THREE.CanvasTexture(backCanvas);
      frontTex.anisotropy = 4;
      backTex.anisotropy = 4;

      cardGroup = new THREE.Group();

      const cardW = 1.95;
      const cardH = 2.85;
      const cardDepth = 0.045;
      const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardDepth);

      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.25,
        metalness: 0.85
      });
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        roughness: 0.22,
        metalness: 0.12
      });
      const backMat = new THREE.MeshStandardMaterial({
        map: backTex,
        roughness: 0.22,
        metalness: 0.12
      });

      const cardMesh = new THREE.Mesh(cardGeo, [
        edgeMat,
        edgeMat,
        edgeMat,
        edgeMat,
        frontMat,
        backMat
      ]);
      cardMesh.position.y = -cardH / 2 - 0.1;
      cardGroup.add(cardMesh);

      // Metallic clasp connecting strap to card
      const claspGeo = new THREE.BoxGeometry(0.26, 0.18, 0.08);
      const claspMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.94
      });
      const claspMesh = new THREE.Mesh(claspGeo, claspMat);
      claspMesh.position.y = -0.04;
      cardGroup.add(claspMesh);

      scene.add(cardGroup);

      // Satin strap ribbon geometry
      const ropeSegments = simRef.current.segmentCount;
      const strapGeo = new THREE.BufferGeometry();
      const strapPositions = new Float32Array((ropeSegments + 1) * 2 * 3);
      strapGeo.setAttribute('position', new THREE.BufferAttribute(strapPositions, 3));

      const strapIndices: number[] = [];
      for (let i = 0; i < ropeSegments; i++) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        strapIndices.push(a, b, c, b, d, c);
      }
      strapGeo.setIndex(strapIndices);

      const strapMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.16,
        side: THREE.DoubleSide,
        roughness: 0.6
      });

      strapMesh = new THREE.Mesh(strapGeo, strapMat);
      scene.add(strapMesh);
    } catch {
      setWebglSupported(false);
      return;
    }

    // Pointer events
    const sim = simRef.current;

    const getNormCoords = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      return { nx, ny };
    };

    const handlePointerDown = (e: PointerEvent) => {
      const { nx, ny } = getNormCoords(e);
      sim.card.isDragging = true;
      sim.card.dragTargetX = nx * 2.2;
      sim.card.dragTargetY = ny * 2.2;
      canvas.style.cursor = 'grabbing';
      setTelemetry('Holding card / Release to swing');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!sim.card.isDragging) return;
      const { nx, ny } = getNormCoords(e);
      sim.card.dragTargetX = Math.max(-2.3, Math.min(2.3, nx * 2.2));
      sim.card.dragTargetY = Math.max(-2.1, Math.min(1.7, ny * 2.2));
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

    // Animation loop
    const animate = () => {
      sim.step();
      const tip = sim.nodes[sim.segmentCount];

      if (strapMesh && cardGroup && renderer && scene && camera) {
        const posAttr = strapMesh.geometry.attributes.position as THREE.BufferAttribute;
        const halfStrapW = 0.085;

        for (let i = 0; i <= sim.segmentCount; i++) {
          const n = sim.nodes[i];
          posAttr.setXYZ(i * 2, n.x - halfStrapW, n.y, n.z);
          posAttr.setXYZ(i * 2 + 1, n.x + halfStrapW, n.y, n.z);
        }
        posAttr.needsUpdate = true;
        strapMesh.geometry.computeVertexNormals();

        cardGroup.position.set(tip.x, tip.y, tip.z);
        cardGroup.rotation.set(sim.card.tiltX, sim.card.rotY, sim.card.tiltZ);

        renderer.render(scene, camera);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!renderer || !camera || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 540;
      const height = rect.height || 640;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('dblclick', handleDblClick);
      window.removeEventListener('resize', handleResize);

      if (renderer) {
        renderer.dispose();
      }
      if (frontTex) frontTex.dispose();
      if (backTex) backTex.dispose();
    };
  }, [portraitImg, handleFlip]);

  if (!webglSupported) {
    return <LanyardFallback portraitImg={portraitImg} onFlipToggle={handleFlip} />;
  }

  return (
    <div className={styles.lanyardContainer} ref={containerRef}>
      <div className={styles.lanyardStage}>
        <canvas
          ref={canvasRef}
          width={540}
          height={640}
          className={styles.lanyardCanvas}
          aria-label="Interactive 3D hanging student ID lanyard for Kayla Gabrielle"
        />

        {/* Floating Telemetry & Controls */}
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
    </div>
  );
};
