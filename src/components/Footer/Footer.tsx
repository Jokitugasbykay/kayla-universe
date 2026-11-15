import React from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              Science, computational modeling, and creative technology crafted with mathematical discipline.
            </p>
          </div>

          <div className={styles.navCol}>
            <span className={styles.navHeader}>SECTIONS</span>
            <div className={styles.linkList}>
              <a href="#home" className={styles.footerLink}>Identity</a>
              <a href="#about" className={styles.footerLink}>Biography</a>
              <a href="#education" className={styles.footerLink}>Curriculum</a>
              <a href="#projects" className={styles.footerLink}>Selected Work</a>
              <a href="#research" className={styles.footerLink}>Research</a>
              <a href="#skills" className={styles.footerLink}>Capabilities</a>
              <a href="#contact" className={styles.footerLink}>Correspondence</a>
            </div>
          </div>

          <div className={styles.backToTopCol}>
            <button
              type="button"
              onClick={scrollToTop}
              className={styles.backToTopBtn}
              aria-label="Scroll back to top"
            >
              <span>Back to Top ↑</span>
            </button>
          </div>
        </div>

        <div className={styles.footerBottomRow}>
          <div className={styles.copyrightText}>
            &copy; {new Date().getFullYear()} {PROFILE_DATA.name}. Physics Undergraduate, Universitas Airlangga.
          </div>
          <div className={styles.techStackNote}>
            Engineered with TypeScript, React 19, Three.js &amp; GSAP.
          </div>
        </div>
      </div>
    </footer>
  );
};
