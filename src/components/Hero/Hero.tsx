import React from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import { LanyardScene } from '../Lanyard/LanyardScene';
import styles from './Hero.module.css';

interface HeroProps {
    portraitImg?: HTMLImageElement | null;
    portraitSrc?: string;
}

export const Hero: React.FC<HeroProps> = () => {
    return (
        <section id="home" className={styles.heroSection}>
            <div className={styles.heroBackgroundGlow}></div>
            <div className={styles.heroContainer}>
                {/* Left Column: Expressive Editorial Typography & Clear Identity */}
                <div className={styles.heroContent}>
                    <div className={styles.heroEyebrow}>
                        PHYSICS  •  SCIENTIFIC SOFTWARE  •  DAILY TRADING
                    </div>

                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleLead}>I am</span>
                        <span className={styles.titleName}>Kayla Gabrielle</span>
                    </h1>

                    <p className={styles.heroTagline}>
                        Undergraduate in Physics at <strong>Universitas Airlangga</strong> exploring continuous physical principles, machine learning, and mathematical mechanics.
                    </p>

                    <p className={styles.heroBio}>
                        Scientific thinker and builder behind <strong>JOKI.IN</strong> and <strong>Kayla Finance</strong>, connecting analytical modeling and systematic risk discipline with production software craft and daily trading.
                    </p>

                    {/* Action CTAs */}
                    <div className={styles.actionRow}>
                        <a href="#projects" className={styles.primaryCta}>
                            <span>Explore Selected Work</span>
                            <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
                        </a>
                        <a href="#about" className={styles.secondaryCta}>
                            <span>About Disciplines</span>
                        </a>
                    </div>

                    {/* Social / Discovery Links */}
                    <div className={styles.socialDiscovery}>
                        <span className={styles.socialLabel}>CONNECT</span>
                        <div className={styles.socialIcons}>
                            <a
                                href={PROFILE_DATA.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconBtn}
                                aria-label="Kayla Gabrielle GitHub Profile"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                            <a
                                href="#contact"
                                className={styles.iconBtn}
                                aria-label="Contact Kayla Gabrielle"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Prominent 3D Hanging Lanyard Pass */}
                <div className={styles.heroVisual}>
                    <LanyardScene />
                </div>
            </div>
        </section>
    );
};
