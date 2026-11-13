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
          <div className={styles.eyebrow}>02 / ABOUT KAYLA GABRIELLE</div>
          <div className={styles.eyebrowRight}>
            SCIENTIFIC REASONING &middot; ENGINEERING DISCIPLINE &middot; ORIGINAL RESEARCH
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Column: Authentic Photography Plate (Foto 1) & Profile Table */}
          <div className={styles.leftColumn}>
            <figure className={styles.foto1Plate}>
              <div className={styles.plateHeader}>
                <span className={styles.plateTitle}>FOTO 1 &middot; KAYLA GABRIELLE</span>
                <span className={styles.plateRatio}>PORTRAIT PLATE 4:5</span>
              </div>

              <div className={styles.imageFrame}>
                <img
                  src={portraitSrc}
                  alt="Official Portrait of Kayla Gabrielle (Foto 1)"
                  className={styles.portraitImage}
                />
                <div className={styles.imageCaptionBar}>
                  <div>
                    <div className={styles.captionName}>{PROFILE_DATA.name}</div>
                    <div className={styles.captionRole}>
                      Physics Undergraduate, Universitas Airlangga
                    </div>
                  </div>
                  <label htmlFor="foto1-upload-about" className={styles.changeFotoBtn}>
                    <span>Change Foto 1</span>
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
            </figure>

            {/* Verified Quick Profile Table */}
            <div className={styles.profileTable}>
              <div className={styles.profileRow}>
                <span className={styles.profileKey}>FULL NAME</span>
                <span className={styles.profileVal}>{PROFILE_DATA.name}</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileKey}>STATUS</span>
                <span className={styles.profileVal}>
                  Physics Undergrad (Semester 5)
                </span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileKey}>UNIVERSITY</span>
                <span className={styles.profileVal}>{PROFILE_DATA.university}</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileKey}>BACKGROUND</span>
                <span className={styles.profileVal}>
                  Malaysia &middot; Jakarta &middot; Surabaya
                </span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileKey}>CITIZENSHIP</span>
                <span className={styles.profileVal}>Malaysian Citizen</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileKey}>PROJECTS</span>
                <span className={styles.profileVal}>JOKI.IN &amp; Kayla Finance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Inquiry Pillars */}
          <div className={styles.rightColumn}>
            <h2 className={styles.narrativeTitle}>
              Bridging continuous physical phenomena, mathematical rigor, and modern software craft.
            </h2>

            <div className={styles.storyProse}>
              <p>
                My educational journey began across borders. As a{' '}
                <strong className={styles.boldWhite}>Malaysian citizen</strong>, I spent my early
                school years in Malaysia before relocating to{' '}
                <strong className={styles.boldWhite}>Jakarta for high school</strong>. Later, I
                moved to Surabaya to pursue a degree in{' '}
                <strong className={styles.boldWhite}>Physics at Universitas Airlangga</strong>,
                where I am currently completing{' '}
                <strong className={styles.boldSky}>semester 5</strong>. Experiencing different
                educational systems taught me to observe how complex structures function and how to
                tackle unfamiliar challenges with curiosity.
              </p>

              <p>
                Studying physics instilled in me a deep respect for mathematical modeling and the
                behavior of physical systems under natural constraints. Over time, that academic
                foundation naturally led me toward{' '}
                <strong className={styles.boldWhite}>
                  scientific computing, physical simulation, and artificial intelligence
                </strong>
                . I am fascinated by how machine learning architectures can be grounded in physical
                conservation laws, as well as the fascinating quantum mechanics governing nanoscale
                structures like <strong className={styles.boldViolet}>quantum dots</strong>.
              </p>

              <p>
                Alongside academic study, I love the craft of software engineering. Building{' '}
                <strong className={styles.boldWhite}>JOKI.IN</strong> and{' '}
                <strong className={styles.boldWhite}>Kayla Finance</strong> taught me to turn
                structured conceptual models into real, production-ready web platforms that users
                rely upon. My long-term goal is to contribute to deep technology and build software
                that connects scientific insight with human utility.
              </p>
            </div>

            {/* Three Pillars of Inquiry */}
            <div className={styles.pillarsGrid}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarNumber}>01 / SCIENTIFIC CORE</div>
                <h3 className={styles.pillarTitle}>Physics &amp; Mathematics</h3>
                <p className={styles.pillarDesc}>
                  Analytical mechanics, differential equations, numerical methods, and theoretical
                  exploration of zero-dimensional quantum dots.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarNumber}>02 / DEEP TECH &amp; AI</div>
                <h3 className={styles.pillarTitle}>AI &amp; Scientific Computing</h3>
                <p className={styles.pillarDesc}>
                  Physics-informed neural networks, computational modeling, and accelerating
                  numerical simulation through machine learning.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarNumber}>03 / APPLIED CRAFT</div>
                <h3 className={styles.pillarTitle}>Software Engineering</h3>
                <p className={styles.pillarDesc}>
                  Production TypeScript, full-stack systems, interactive 3D WebGL interfaces, and
                  operational product engineering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
