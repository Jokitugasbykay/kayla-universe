import React, { useState, useEffect } from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import { LanyardScene } from '../Lanyard/LanyardScene';
import styles from './Hero.module.css';

interface HeroProps {
  portraitImg: HTMLImageElement | null;
  portraitSrc: string;
}

export const Hero: React.FC<HeroProps> = ({ portraitImg, portraitSrc }) => {
  const [roleIndex, setRoleIndex] = useState<number>(0);
  const [text, setText] = useState<string>(PROFILE_DATA.rolesList[0]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentFull = PROFILE_DATA.rolesList[roleIndex];

    if (!isDeleting) {
      if (text.length < currentFull.length) {
        timeout = setTimeout(() => {
          setText(currentFull.slice(0, text.length + 1));
        }, 45);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2400);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentFull.slice(0, text.length - 1));
        }, 22);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % PROFILE_DATA.rolesList.length);
        timeout = setTimeout(() => {}, 280);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section id="home" className={styles.heroSection}>
      <div className={styles.heroContainer}>
        {/* Left Column: Editorial Identity & Intro */}
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span>CHAPTER 01 / IDENTITY &amp; ROOTS</span>
            <span className={styles.dotSeparator}>/</span>
            <span className={styles.tagLocation}>SURABAYA, ID</span>
          </div>

          <h1 className={styles.heroTitle}>
            Kayla <span className={styles.heroTitleSerif}>Gabrielle</span>
          </h1>

          <div className={styles.typewriterRow}>
            <span className={styles.typewriterPrefix}>Focus:</span>
            <span className={styles.typewriterText}>{text}</span>
            <span className={styles.cursor}></span>
          </div>

          <p className={styles.heroBio}>
            I study physics at <strong className={styles.highlight}>Universitas Airlangga</strong> in
            Surabaya. My work connects continuous physical principles, mathematical modeling, and
            artificial intelligence with practical software engineering.
          </p>

          {/* Integrated Foto 1 Identity Plate */}
          <div className={styles.identityPlate}>
            <div className={styles.portraitThumbWrap}>
              <img
                src={portraitSrc}
                alt="Portrait of Kayla Gabrielle"
                className={styles.portraitThumb}
              />
            </div>
            <div className={styles.identityMeta}>
              <div className={styles.identityName}>{PROFILE_DATA.name}</div>
              <div className={styles.identitySub}>
                Physics Undergrad &middot; Universitas Airlangga
              </div>
              <div className={styles.identityNote}>
                Authentic portrait integrated with 3D hanging lanyard
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className={styles.ctaRow}>
            <a href="#about" className={styles.primaryCta}>
              <span>Read Biography</span>
            </a>
            <a href="#projects" className={styles.secondaryCta}>
              <span>Explore Selected Work</span>
            </a>
          </div>

          {/* Scroll invitation */}
          <div className={styles.scrollInvitation}>
            <span className={styles.scrollLine}></span>
            <span className={styles.scrollText}>Scroll to discover academic inquiry &amp; projects</span>
          </div>
        </div>

        {/* Right Column: Open-Stage 3D Lanyard Centerpiece */}
        <div className={styles.heroVisual}>
          <LanyardScene portraitImg={portraitImg} />
        </div>
      </div>
    </section>
  );
};
