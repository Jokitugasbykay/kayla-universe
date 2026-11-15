import React from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import styles from './About.module.css';

interface AboutProps {
  portraitSrc: string;
  onFoto1Upload?: (file: File) => void;
}

export const About: React.FC<AboutProps> = ({ portraitSrc, onFoto1Upload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFoto1Upload) {
      onFoto1Upload(e.target.files[0]);
    }
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>02 / BIOGRAPHY &amp; SCIENTIFIC INQUIRY</div>
          <div className={styles.eyebrowRight}>
            FOUNDATIONAL PHYSICS &middot; COMPUTATIONAL REASONING &middot; SOFTWARE CRAFT
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Column: Asymmetrical Double-Bezel Dual Photo Spread */}
          <div className={styles.leftColumn}>
            <div className={styles.photoComposition}>
              {/* Primary Plate: Foto 1 Official Academic Portrait */}
              <div className={styles.primaryPhotoFrame}>
                <div className={styles.innerCore}>
                  <img
                    src={portraitSrc}
                    alt="Official Academic Portrait of Kayla Gabrielle (Foto 1)"
                    className={styles.primaryPhoto}
                  />
                  <div className={styles.photoTagOverlay}>
                    <span className={styles.photoTagTitle}>FOTO 1 // OFFICIAL PORTRAIT</span>
                    <span className={styles.photoTagSub}>UNAIR Red Alma Mater Blazer</span>
                  </div>
                </div>
              </div>

              {/* Secondary Overlapping Plate: Authentic Candid / Academic Snapshot */}
              <div className={styles.secondaryPhotoFrame}>
                <div className={styles.innerCoreSmall}>
                  <img
                    src="./assets/kayla-about.jpg"
                    alt="Authentic Casual Snapshot of Kayla Gabrielle"
                    className={styles.secondaryPhoto}
                  />
                </div>
              </div>

              {/* Upload control */}
              <div className={styles.uploadRow}>
                <label htmlFor="foto1-upload-about" className={styles.uploadBtn}>
                  <span>Change Custom Foto 1</span>
                  <input
                    id="foto1-upload-about"
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Academic Dossier Ledger */}
            <div className={styles.dossierLedger}>
              <div className={styles.ledgerRow}>
                <span className={styles.ledgerKey}>FULL NAME</span>
                <span className={styles.ledgerVal}>{PROFILE_DATA.name}</span>
              </div>
              <div className={styles.ledgerRow}>
                <span className={styles.ledgerKey}>ACADEMIC STATUS</span>
                <span className={styles.ledgerVal}>Semester 5 Physics Undergraduate</span>
              </div>
              <div className={styles.ledgerRow}>
                <span className={styles.ledgerKey}>INSTITUTION</span>
                <span className={styles.ledgerVal}>{PROFILE_DATA.university}</span>
              </div>
              <div className={styles.ledgerRow}>
                <span className={styles.ledgerKey}>CROSS-BORDER PATH</span>
                <span className={styles.ledgerVal}>Malaysia &middot; Jakarta &middot; Surabaya</span>
              </div>
              <div className={styles.ledgerRow}>
                <span className={styles.ledgerKey}>CITIZENSHIP</span>
                <span className={styles.ledgerVal}>Malaysian Citizen</span>
              </div>
              <div className={styles.ledgerRow}>
                <span className={styles.ledgerKey}>CORE VENTURES</span>
                <span className={styles.ledgerVal}>JOKI.IN &middot; Kayla Finance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative Prose & Inquiry Dimensions */}
          <div className={styles.rightColumn}>
            <div className={styles.quoteBlock}>
              <h2 className={styles.narrativeTitle}>
                Grounded in the deterministic beauty of physics, driven by the limitless scale of software.
              </h2>
            </div>

            <div className={styles.storyProse}>
              <p>
                My path across Southeast Asia shaped how I observe complex systems. As a{' '}
                <strong className={styles.boldWhite}>Malaysian citizen</strong>, I spent my
                formative school years in Malaysia before relocating to{' '}
                <strong className={styles.boldWhite}>Jakarta for high school</strong>. Today, I am
                based in Surabaya, pursuing a Bachelor of Science in{' '}
                <strong className={styles.boldWhite}>Physics at Universitas Airlangga</strong>,
                currently immersed in <strong className={styles.boldSky}>semester 5</strong>.
              </p>

              <p>
                Physics teaches that beneath the apparent chaos of natural phenomena lie elegant
                conservation laws, differential equations, and boundary conditions. From analytical
                mechanics to the discrete energy states of nanoscale{' '}
                <strong className={styles.boldViolet}>quantum dots</strong>, I find immense
                clarity in formal mathematical rigor.
              </p>

              <p>
                That mathematical foundation drives my work in{' '}
                <strong className={styles.boldWhite}>
                  artificial intelligence and scientific simulation
                </strong>
                . Rather than treating neural networks as black boxes, I am fascinated by
                physics-informed architectures where conservation of momentum and energy are built
                directly into optimization losses.
              </p>

              <p>
                Concurrently, I am an active product builder. Founding{' '}
                <strong className={styles.boldWhite}>JOKI.IN</strong> and architecting{' '}
                <strong className={styles.boldWhite}>Kayla Finance</strong> taught me how to
                structure end-to-end full-stack platforms, manage real client workloads, and deploy
                robust cloud services that people trust every day.
              </p>
            </div>

            {/* Three Architectural Inquiries */}
            <div className={styles.inquiriesList}>
              <div className={styles.inquiryItem}>
                <div className={styles.inquiryIndex}>01</div>
                <div className={styles.inquiryBody}>
                  <h3 className={styles.inquiryHeading}>Theoretical Physics &amp; Mathematics</h3>
                  <p className={styles.inquiryText}>
                    Analytical mechanics, differential equations, computational electrodynamics, and
                    quantum dot spatial confinement models.
                  </p>
                </div>
              </div>

              <div className={styles.inquiryItem}>
                <div className={styles.inquiryIndex}>02</div>
                <div className={styles.inquiryBody}>
                  <h3 className={styles.inquiryHeading}>Scientific Computing &amp; Machine Learning</h3>
                  <p className={styles.inquiryText}>
                    Physics-informed neural networks, numerical wave packet solvers, and continuous
                    dynamical simulation with Python and Three.js.
                  </p>
                </div>
              </div>

              <div className={styles.inquiryItem}>
                <div className={styles.inquiryIndex}>03</div>
                <div className={styles.inquiryBody}>
                  <h3 className={styles.inquiryHeading}>Production Software Systems</h3>
                  <p className={styles.inquiryText}>
                    Modern TypeScript, React 19, scalable cloud infrastructure, and operational
                    product craftsmanship behind JOKI.IN.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
