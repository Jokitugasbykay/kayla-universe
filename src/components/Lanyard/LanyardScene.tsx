import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { AdvancedLanyardPhysics } from '../../physics/lanyardPhysics';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas } from './LanyardBadge';
import { LanyardFallback } from './LanyardFallback';
import styles from './Lanyard.module.css';

interface LanyardSceneProps {
    portraitImg?: HTMLImageElement | null;
}

export const LanyardScene: React.FC<LanyardSceneProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [webglSupported, setWebglSupported] = useState<boolean>(true);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [telemetry, setTelemetry] = useState<string>('Drag card to swing / Double-click to turn');
    const simRef = useRef<AdvancedLanyardPhysics>(new AdvancedLanyardPhysics(14, 0.125, new THREE.Vector3(0, 2.35, 0)));
    const rafRef = useRef<number>(0);

    const handleFlip = useCallback(() => {
        simRef.current.toggleFlip();
        setIsFlipped((prev) => !prev);
        setTelemetry(simRef.current.isFlipped ? 'Reverse view' : 'Front view');
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Check WebGL availability safely using an offscreen canvas
        const testCanvas = document.createElement('canvas');
        const testGl = testCanvas.getContext('webgl2') ||
            testCanvas.getContext('webgl') ||
            testCanvas.getContext('experimental-webgl');
        if (!testGl) {
            setWebglSupported(false);
            return;
        }
        (testGl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();

        // High-resolution badge textures (1040 x 1520) for crisp Retina display
        const frontCanvas = document.createElement('canvas');
        frontCanvas.width = 1040;
        frontCanvas.height = 1520;
        const backCanvas = document.createElement('canvas');
        backCanvas.width = 1040;
        backCanvas.height = 1520;

        drawFrontBadgeCanvas(frontCanvas);
        drawBackBadgeCanvas(backCanvas);

        let renderer: THREE.WebGLRenderer | null = null;
        let scene: THREE.Scene | null = null;
        let camera: THREE.PerspectiveCamera | null = null;
        let cardGroup: THREE.Group | null = null;
        let cardMesh: THREE.Mesh | null = null;
        let strapMesh: THREE.Mesh | null = null;
        let frontTex: THREE.CanvasTexture | null = null;
        let backTex: THREE.CanvasTexture | null = null;

        const dispose = () => {
            const materials = new Set<THREE.Material>();
            scene?.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) =>
                        materials.add(m)
                    );
                }
            });
            materials.forEach((m) => m.dispose());
            frontTex?.dispose();
            backTex?.dispose();
            renderer?.dispose();
        };

        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.05;

            const rect = canvas.getBoundingClientRect();
            const width = rect.width || 540;
            const height = rect.height || 680;
            renderer.setSize(width, height, false);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            scene = new THREE.Scene();

            // Perspective Camera calibrated to keep badge comfortably within view
            camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
            camera.position.set(0, -0.28, Math.max(11.8, 6.0 / camera.aspect));

            // Studio Lighting for Warm Editorial Material Shading
            const ambLight = new THREE.AmbientLight(0xf5f3ee, 1.1);
            scene.add(ambLight);

            const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.5);
            keyLight.position.set(3.5, 6.0, 5.0);
            scene.add(keyLight);

            const rimLight = new THREE.PointLight(0xc8ad8d, 1.2, 20);
            rimLight.position.set(-3.5, -1.0, 3.5);
            scene.add(rimLight);

            const fillLight = new THREE.DirectionalLight(0x8a929a, 0.4);
            fillLight.position.set(0, -4, 2);
            scene.add(fillLight);

            // Canvas Textures with exact sRGB color space and anisotropic filtering
            frontTex = new THREE.CanvasTexture(frontCanvas);
            backTex = new THREE.CanvasTexture(backCanvas);
            frontTex.colorSpace = THREE.SRGBColorSpace;
            backTex.colorSpace = THREE.SRGBColorSpace;
            frontTex.generateMipmaps = true;
            backTex.generateMipmaps = true;
            frontTex.minFilter = THREE.LinearMipmapLinearFilter;
            backTex.minFilter = THREE.LinearMipmapLinearFilter;
            frontTex.magFilter = THREE.LinearFilter;
            backTex.magFilter = THREE.LinearFilter;
            const maxAniso = renderer.capabilities.getMaxAnisotropy();
            frontTex.anisotropy = maxAniso;
            backTex.anisotropy = maxAniso;
            frontTex.needsUpdate = true;
            backTex.needsUpdate = true;

            cardGroup = new THREE.Group();

            // Card Geometry matching exact 1040:1520 aspect ratio (0.6842)
            const cardW = 1.90;
            const cardH = cardW * (frontCanvas.height / frontCanvas.width);
            const cardDepth = 0.04;
            const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardDepth);

            const edgeMat = new THREE.MeshStandardMaterial({
                color: 0x101114,
                roughness: 0.35,
                metalness: 0.6
            });

            const frontMat = new THREE.MeshStandardMaterial({
                map: frontTex,
                roughness: 0.22,
                metalness: 0.08
            });

            const backMat = new THREE.MeshStandardMaterial({
                map: backTex,
                roughness: 0.22,
                metalness: 0.08
            });

            cardMesh = new THREE.Mesh(cardGeo, [
                edgeMat,
                edgeMat,
                edgeMat,
                edgeMat,
                frontMat,
                backMat
            ]);
            // Centered directly at card group origin (Center of Mass)
            cardMesh.position.set(0, 0, 0);
            cardGroup.add(cardMesh);

            // Polished Hardware Clasp: Warm satin titanium/champagne bracket + swivel ring
            const metalMat = new THREE.MeshStandardMaterial({
                color: 0xd6cebe,
                roughness: 0.28,
                metalness: 0.85
            });

            // Swivel ring loop positioned at attachment point
            const ringGeo = new THREE.TorusGeometry(0.10, 0.022, 16, 24);
            const ringMesh = new THREE.Mesh(ringGeo, metalMat);
            ringMesh.position.set(0, cardH * 0.5 + 0.12, 0);
            ringMesh.rotation.x = Math.PI / 2;
            cardGroup.add(ringMesh);

            // Clasp bracket body
            const bracketGeo = new THREE.BoxGeometry(0.32, 0.14, 0.07);
            const bracketMesh = new THREE.Mesh(bracketGeo, metalMat);
            bracketMesh.position.set(0, cardH * 0.5 + 0.04, 0);
            cardGroup.add(bracketMesh);

            scene.add(cardGroup);

            // Woven Fabric Strap Ribbon Geometry (Refined matte charcoal woven strap, no neon glow)
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
                color: 0x141518,
                roughness: 0.85,
                metalness: 0.05,
                side: THREE.DoubleSide
            });
            strapMesh = new THREE.Mesh(strapGeo, strapMat);
            scene.add(strapMesh);
        } catch {
            dispose();
            setWebglSupported(false);
            return;
        }

        // Raycasting & Hit Testing (Drags only when pointer interacts with the actual card)
        const sim = simRef.current;
        const raycaster = new THREE.Raycaster();
        const dragPlane = new THREE.Plane();
        const dragPoint = new THREE.Vector3();

        const getNormCoords = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
            const ny = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
            return { nx, ny };
        };

        const getCardIntersection = (e: MouseEvent): THREE.Intersection | null => {
            if (!camera || !cardGroup) return null;
            const { nx, ny } = getNormCoords(e);
            raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
            cardGroup.updateMatrixWorld(true);
            const hits = raycaster.intersectObjects(cardGroup.children, true);
            return hits.length > 0 ? hits[0] : null;
        };

        const handlePointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            const hit = getCardIntersection(e);
            if (!hit || !cardGroup || !camera) return;
            try {
                canvas.setPointerCapture(e.pointerId);
            } catch {
                // Ignore pointer capture errors in testing/virtual environments
            }
            camera.getWorldDirection(dragPlane.normal);
            dragPlane.setFromNormalAndCoplanarPoint(dragPlane.normal, hit.point);

            sim.startDragging(hit.point);
            canvas.style.cursor = 'grabbing';
            setTelemetry('Holding card / Release to swing');
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!sim.isDragging) {
                canvas.style.cursor = getCardIntersection(e) ? 'grab' : 'default';
                return;
            }
            if (!camera) return;
            const { nx, ny } = getNormCoords(e);
            raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
            if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
                // Camera-aware bounds calculation to guarantee card remains comfortably inside frustum
                const vHalf = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
                const hHalf = vHalf * camera.aspect;
                const halfCardW = 0.95;
                const halfCardH = 1.45;
                const minDragX = -hHalf + halfCardW + 0.15;
                const maxDragX = hHalf - halfCardW - 0.15;
                const maxDragY = sim.anchor.y - 0.25;
                const minDragY = camera.position.y - vHalf + halfCardH + 0.25;

                const clampedTarget = new THREE.Vector3(
                    Math.max(minDragX, Math.min(maxDragX, dragPoint.x)),
                    Math.max(minDragY, Math.min(maxDragY, dragPoint.y)),
                    dragPoint.z
                );
                sim.updateDragTarget(clampedTarget);
            }
        };

        const handlePointerUp = (e: PointerEvent) => {
            try {
                if (canvas.hasPointerCapture(e.pointerId)) {
                    canvas.releasePointerCapture(e.pointerId);
                }
            } catch {
                // Ignore pointer release errors
            }
            if (sim.isDragging) {
                sim.stopDragging();
                canvas.style.cursor = getCardIntersection(e) ? 'grab' : 'default';
                setTelemetry('Drag card to swing / Double-click to turn');
            }
        };

        const handleDblClick = (e: MouseEvent) => {
            if (getCardIntersection(e)) handleFlip();
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        canvas.addEventListener('dblclick', handleDblClick);

        // Animation Loop with Segment Normal Ribbon Extrusion & Substep Physics
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let lastTime = 0;

        const animate = (now: number) => {
            const dt = Math.min((now - (lastTime || now)) / 1000, 0.05);
            lastTime = now;

            if (!reduced || sim.isDragging || sim.card.angularVelocity.lengthSq() > 0.0001 || sim.card.velocity.lengthSq() > 0.0001) {
                sim.update(dt);
            }

            if (strapMesh && cardGroup && renderer && scene && camera) {
                const { left, right } = sim.getRopeRibbonVertices(0.075);
                const posAttr = strapMesh.geometry.attributes.position as THREE.BufferAttribute;

                for (let i = 0; i <= sim.segmentCount; i++) {
                    posAttr.setXYZ(i * 2, left[i].x, left[i].y, left[i].z);
                    posAttr.setXYZ(i * 2 + 1, right[i].x, right[i].y, right[i].z);
                }
                posAttr.needsUpdate = true;
                strapMesh.geometry.computeVertexNormals();

                cardGroup.position.copy(sim.card.position);
                cardGroup.quaternion.copy(sim.card.quaternion);

                renderer.render(scene, camera);
            }
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            if (!renderer || !camera || !canvas) return;
            const rect = canvas.getBoundingClientRect();
            const width = rect.width || 540;
            const height = rect.height || 680;
            camera.aspect = width / height;
            camera.position.z = Math.max(11.8, 6.0 / camera.aspect);
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
            canvas.removeEventListener('dblclick', handleDblClick);
            dispose();
        };
    }, [handleFlip]);

    if (!webglSupported) {
        return <LanyardFallback onFlipToggle={handleFlip} />;
    }

    return (
        <div className={styles.lanyardStage}>
            <canvas
                ref={canvasRef}
                className={styles.lanyardCanvas}
                aria-label="Interactive 3D physics lanyard for Kayla Gabrielle"
            />
            <div className={styles.lanyardMetaHint}>
                <span className={styles.hintText}>{telemetry}</span>
                <div className={styles.controlButtons}>
                    <button
                        type="button"
                        onClick={handleFlip}
                        className={styles.subtleFlipBtn}
                        aria-label="Turn lanyard badge"
                    >
                        {isFlipped ? 'Front View' : 'Turn Card'}
                    </button>
                </div>
            </div>
        </div>
    );
};
