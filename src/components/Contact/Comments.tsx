import React, { useEffect, useRef } from 'react';
import { Guestbook } from './Guestbook';
import styles from './Contact.module.css';

export const Comments: React.FC = () => {
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const node = container.current;
        if (!node) return;
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        Object.entries({
            repo: 'Jokitugasbykay/kayla-universe',
            'repo-id': 'R_kgDOVtgvYQ',
            category: 'Announcements',
            'category-id': 'DIC_kwDOVtgvYc4DLWOF',
            mapping: 'specific',
            term: 'Kayla Universe Guestbook',
            strict: '1',
            'reactions-enabled': '0',
            'input-position': 'top',
            theme: 'https://jokitugasbykay.github.io/kayla-universe/assets/giscus-kayla.css',
            lang: 'en',
        }).forEach(([key, value]) => script.setAttribute(`data-${key}`, value));
        node.appendChild(script);
        return () => { node.replaceChildren(); };
    }, []);
    return <div className={styles.guestbookWrapper}>
        <div className={styles.guestbookHeader}>
            <div className={styles.guestbookEyebrow}>Guestbook</div>
            <h3 className={styles.guestbookTitle}>Leave a comment</h3>
            <p className={styles.guestbookSubtitle}>Comments are public and stored on GitHub. Sign in with GitHub to join the conversation.</p>
        </div>
        <div ref={container} />
        <p className={styles.guestbookSubtitle}>Having trouble loading comments? <a href="https://github.com/Jokitugasbykay/kayla-universe/discussions" target="_blank" rel="noopener noreferrer">Open GitHub Discussions</a>.</p>
        <details><summary>Previous browser-local notes</summary><Guestbook /></details>
    </div>;
};
