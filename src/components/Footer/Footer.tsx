import React from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerTopRow}>
                    <div className={styles.brandCol}>
                        <div className={styles.brandLockup}>
                            <span className={styles.monogram}>KG</span>
                            <span className={styles.brandName}>KAYLA UNIVERSE</span>
                        </div>
                        <p className={styles.brandTagline}>
                            Continuous physical principles, artificial intelligence, and purposeful software craft.
                        </p>
                    </div>

                    <div className={styles.navCol}>
                        <span className={styles.navHeader}>EXPLORE</span>
                        <div className={styles.linkList}>
                            <a href="#home" className={styles.footerLink}>Home</a>
                            <a href="#about" className={styles.footerLink}>About</a>
                            <a href="#education" className={styles.footerLink}>Education</a>
                            <a href="#projects" className={styles.footerLink}>Projects</a>
                            <a href="#research" className={styles.footerLink}>Research</a>
                            <a href="#skills" className={styles.footerLink}>Skills</a>
                            <a href="#contact" className={styles.footerLink}>Contact</a>
                        </div>
                    </div>

                    <div className={styles.backToTopCol}>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className={styles.backToTopBtn}
                            aria-label="Scroll back to top"
                        >
                            <span>Back to Top &uarr;</span>
                        </button>
                    </div>
                </div>

                <div className={styles.footerBottomRow}>
                    <div className={styles.copyrightText}>
                        &copy; {new Date().getFullYear()} {PROFILE_DATA.name}. Physics Undergraduate, Universitas Airlangga.
                    </div>
                    <div className={styles.techStackNote}>
                        Engineered with React 19, TypeScript, Three.js &amp; GSAP.
                    </div>
                </div>
            </div>
        </footer>
    );
};
