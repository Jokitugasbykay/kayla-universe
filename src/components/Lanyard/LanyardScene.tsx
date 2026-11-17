import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { AdvancedLanyardPhysics } from '../../physics/lanyardPhysics';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas, drawStrapCanvas } from './LanyardBadge';
import { LanyardFallback } from './LanyardFallback';
import styles from './Lanyard.module.css';

interface LanyardSceneProps {
    portraitImg?: HTMLImageElement | null;
}

export const LanyardScene: React.FC<LanyardSceneProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [webglSupported, setWebglSupported] = useState<boolean>(true);
    const simRef = useRef<AdvancedLanyardPhysics>(new AdvancedLanyardPhysics(5, 0.38, new THREE.Vector3(2.74, 3.25, 0)));
    const rafRef = useRef<number>(0);

    const handleFlip = useCallback(() => {
        simRef.current.toggleFlip();
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

        // High-resolution badge textures (1040 x 1560) for crisp Retina display (exact 1:1.5 aspect ratio)
        const frontCanvas = document.createElement('canvas');
        frontCanvas.width = 1040;
        frontCanvas.height = 1560;
        const backCanvas = document.createElement('canvas');
        backCanvas.width = 1040;
        backCanvas.height = 1560;
        const strapCanvas = document.createElement('canvas');
        strapCanvas.width = 1024;
        strapCanvas.height = 128;

        drawFrontBadgeCanvas(frontCanvas);
        drawBackBadgeCanvas(backCanvas);
        drawStrapCanvas(strapCanvas);

        let renderer: THREE.WebGLRenderer | null = null;
        let scene: THREE.Scene | null = null;
        let camera: THREE.PerspectiveCamera | null = null;
        let cardGroup: THREE.Group | null = null;
        let cardMesh: THREE.Mesh | null = null;
        let strapMesh: THREE.Mesh | null = null;
        let frontTex: THREE.CanvasTexture | null = null;
        let backTex: THREE.CanvasTexture | null = null;
        let strapTex: THREE.CanvasTexture | null = null;

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
            strapTex?.dispose();
            renderer?.dispose();
        };

        const updateCameraFraming = () => {
            if (!camera || !canvas) return;
            const rect = canvas.getBoundingClientRect();
            const width = rect.width || window.innerWidth || 1440;
            const height = rect.height || window.innerHeight || 800;
            camera.aspect = width / height;

            const halfFovRad = (24 * Math.PI) / 360;
            const targetVisibleHeight = 6.2;
            const camZ = (targetVisibleHeight * 0.5) / Math.tan(halfFovRad);

            camera.position.set(0, 0, camZ);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();

            const visibleHeight = 2 * camZ * Math.tan(halfFovRad);
            const visibleWidth = visibleHeight * camera.aspect;

            const isDesktop = width >= 1024;
            const anchorX = isDesktop ? 0.23 * visibleWidth : 0;
            const anchorY = isDesktop ? (visibleHeight * 0.5) + 0.15 : 0.8;
            simRef.current.setAnchorPosition(anchorX, anchorY, 0, false);
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
            const width = rect.width || window.innerWidth || 1440;
            const height = rect.height || window.innerHeight || 800;
            renderer.setSize(width, height, false);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            scene = new THREE.Scene();

            // Perspective Camera calibrated to keep badge comfortably within view and prominently scaled
            camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 50);
            updateCameraFraming();

            // Studio Lighting for High-Contrast Clean Shading
            const ambLight = new THREE.AmbientLight(0xffffff, 1.25);
            scene.add(ambLight);

            const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
            keyLight.position.set(3.5, 6.0, 5.0);
            scene.add(keyLight);

            const rimLight = new THREE.PointLight(0xc8ad8d, 1.0, 25);
            rimLight.position.set(-3.5, -1.0, 4.0);
            scene.add(rimLight);

            const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
            fillLight.position.set(0, -4, 3);
            scene.add(fillLight);

            // Canvas Textures with exact sRGB color space and anisotropic filtering
            frontTex = new THREE.CanvasTexture(frontCanvas);
            backTex = new THREE.CanvasTexture(backCanvas);
            strapTex = new THREE.CanvasTexture(strapCanvas);

            frontTex.colorSpace = THREE.SRGBColorSpace;
            backTex.colorSpace = THREE.SRGBColorSpace;
            strapTex.colorSpace = THREE.SRGBColorSpace;

            frontTex.generateMipmaps = true;
            backTex.generateMipmaps = true;
            strapTex.generateMipmaps = true;

            frontTex.minFilter = THREE.LinearMipmapLinearFilter;
            backTex.minFilter = THREE.LinearMipmapLinearFilter;
            strapTex.minFilter = THREE.LinearMipmapLinearFilter;

            frontTex.magFilter = THREE.LinearFilter;
            backTex.magFilter = THREE.LinearFilter;
            strapTex.magFilter = THREE.LinearFilter;

            strapTex.wrapS = THREE.RepeatWrapping;
            strapTex.wrapT = THREE.ClampToEdgeWrapping;

            const maxAniso = renderer.capabilities.getMaxAnisotropy();
            frontTex.anisotropy = maxAniso;
            backTex.anisotropy = maxAniso;
            strapTex.anisotropy = maxAniso;

            frontTex.needsUpdate = true;
            backTex.needsUpdate = true;
            strapTex.needsUpdate = true;

            cardGroup = new THREE.Group();

            // Card Geometry matching exact 1040:1560 aspect ratio (1:1.5) and prominent size
            const cardW = 2.35;
            const cardH = 3.525;
            const cardDepth = 0.045;
            const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardDepth);

            const edgeMat = new THREE.MeshStandardMaterial({
                color: 0x14161d,
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

            // Invisible generous hit proxy ensuring 100% grab reliability regardless of tilt angle
            const hitProxyGeo = new THREE.BoxGeometry(cardW * 1.15, cardH * 1.15, 0.45);
            const hitProxyMat = new THREE.MeshBasicMaterial({ visible: false });
            const hitProxyMesh = new THREE.Mesh(hitProxyGeo, hitProxyMat);
            hitProxyMesh.position.set(0, 0, 0);
            cardGroup.add(hitProxyMesh);

            // Polished Hardware Clasp: Crisp chrome bracket + swivel ring
            const metalMat = new THREE.MeshStandardMaterial({
                color: 0xefefef,
                roughness: 0.22,
                metalness: 0.95
            });

            // Swivel ring loop positioned at attachment point
            const ringGeo = new THREE.TorusGeometry(0.12, 0.024, 16, 24);
            const ringMesh = new THREE.Mesh(ringGeo, metalMat);
            ringMesh.position.set(0, cardH * 0.5 + 0.08, 0);
            ringMesh.rotation.x = Math.PI / 2;
            cardGroup.add(ringMesh);

            // Clasp bracket body
            const bracketGeo = new THREE.BoxGeometry(0.38, 0.16, 0.08);
            const bracketMesh = new THREE.Mesh(bracketGeo, metalMat);
            bracketMesh.position.set(0, cardH * 0.5 - 0.02, 0);
            cardGroup.add(bracketMesh);

            scene.add(cardGroup);

            // Woven Fabric Strap Ribbon Geometry with branded texture
            const ropeSegments = simRef.current.segmentCount;
            const strapGeo = new THREE.BufferGeometry();
            const strapPositions = new Float32Array((ropeSegments + 1) * 2 * 3);
            const strapUVs = new Float32Array((ropeSegments + 1) * 2 * 2);

            for (let i = 0; i <= ropeSegments; i++) {
                const u = (i / ropeSegments) * 1.0;
                strapUVs[(i * 2) * 2 + 0] = u;
                strapUVs[(i * 2) * 2 + 1] = 1.0;
                strapUVs[(i * 2 + 1) * 2 + 0] = u;
                strapUVs[(i * 2 + 1) * 2 + 1] = 0.0;
            }

            strapGeo.setAttribute('position', new THREE.BufferAttribute(strapPositions, 3));
            strapGeo.setAttribute('uv', new THREE.BufferAttribute(strapUVs, 2));

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
                map: strapTex,
                roughness: 0.70,
                metalness: 0.10,
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
            const rect = canvas.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return null;
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
                // Camera-aware bounds calculation allowing full traversal across hero into text column
                const vHalf = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
                const hHalf = vHalf * camera.aspect;
                const minDragX = -hHalf + 1.2;
                const maxDragX = hHalf - 1.2;
                const maxDragY = sim.anchor.y - 0.25;
                const minDragY = -vHalf + 1.0;

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
                const { left, right } = sim.getRopeRibbonVertices(0.095);
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
            const width = rect.width || window.innerWidth || 1440;
            const height = rect.height || window.innerHeight || 800;
            updateCameraFraming();
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
        </div>
    );
};
