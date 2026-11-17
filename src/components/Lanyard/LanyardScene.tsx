import React, { useEffect, useMemo, useState } from 'react';
import ReferenceLanyard from './reference-lanyard.js';
import { LanyardFallback } from './LanyardFallback';
import { drawFrontBadgeCanvas, drawBackBadgeCanvas, drawStrapCanvas } from './LanyardBadge';
import styles from './Lanyard.module.css';

export const LanyardScene: React.FC = () => {
    const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
    useEffect(() => {
        const query = window.matchMedia('(max-width: 1024px)');
        const update = () => setMobile(query.matches);
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);
    const images = useMemo(() => {
        const front = document.createElement('canvas');
        const back = document.createElement('canvas');
        const strap = document.createElement('canvas');
        front.width = back.width = 1040;
        front.height = back.height = 1560;
        strap.width = 1024;
        strap.height = 128;
        drawFrontBadgeCanvas(front);
        drawBackBadgeCanvas(back);
        drawStrapCanvas(strap);
        return [front.toDataURL(), back.toDataURL(), strap.toDataURL()];
    }, []);
    const supported = useMemo(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
        return Boolean(gl);
    }, []);
    if (!supported) return <LanyardFallback />;
    return <ReferenceLanyard className={styles.referenceLanyard} frontImage={images[0]} backImage={images[1]} strapImage={images[2]} anchor={mobile ? 'center' : 'right'} size={0.6} intro={true} breeze={0} />;
};
