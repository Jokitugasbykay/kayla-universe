import React from 'react';
import { EDUCATION_DATA } from '../../data/portfolio';
import styles from './Education.module.css';

export const Education: React.FC = () => {
  return (
    <section id="education" className={styles.educationSection}>
      <div className={styles.educationContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>03 / ACADEMIC FOUNDATION &amp; CURRICULUM</div>
          <div className={styles.eyebrowRight}>
            UNIVERSITAS AIRLANGGA &middot; FAKULTAS SAINS DAN TEKNOLOGI
          </div>
        </div>

        <div className={styles.sectionGrid}>
          {/* Left Column: Academic Persona & Institution Badge */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>
              Continuous inquiry across borders.
            </h2>
            <p className={styles.sectionDesc}>
              My academic trajectory began in Malaysia and Jakarta before moving to Surabaya to study
              Physics at Universitas Airlangga, where I am currently active in semester 5.
            </p>

            <div className={styles.institutionCard}>
              <div className={styles.institutionHeader}>
                <div className={styles.crestCircle}>UA</div>
                <div>
                  <div className={styles.instName}>Universitas Airlangga</div>
                  <div className={styles.instFaculty}>Faculty of Science and Technology</div>
                </div>
              </div>
              <div className={styles.instMetaGrid}>
                <div className={styles.instMetaItem}>
                  <span className={styles.metaLabel}>PROGRAM</span>
                  <span className={styles.metaValue}>Bachelor of Science (Physics)</span>
                </div>
                <div className={styles.instMetaItem}>
                  <span className={styles.metaLabel}>TIMELINE</span>
                  <span className={styles.metaValue}>2022 - Present (Semester 5)</span>
                </div>
                <div className={styles.instMetaItem}>
                  <span className={styles.metaLabel}>LOCATION</span>
                  <span className={styles.metaValue}>Surabaya, East Java, Indonesia</span>
                </div>
                <div className={styles.instMetaItem}>
                  <span className={styles.metaLabel}>FOCUS</span>
                  <span className={styles.metaValue}>Quantum Physics, AI Modeling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Curriculum Ledger */}
          <div className={styles.rightCol}>
            <div className={styles.ledgerList}>
              {EDUCATION_DATA.map((item, index) => (
                <div key={index} className={styles.ledgerCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.periodBadge}>{item.period}</div>
                    <span className={styles.locationTag}>{item.location}</span>
                  </div>

                  <h3 className={styles.institutionTitle}>{item.institution}</h3>
                  <div className={styles.degreeTitle}>{item.qualification}</div>

                  <p className={styles.itemDescription}>{item.description}</p>

                  <div className={styles.courseworkWrapper}>
                    <div className={styles.courseworkHeader}>Core Academic Coursework:</div>
                    <div className={styles.courseworkGrid}>
                      {item.coursework.map((course, cIdx) => (
                        <span key={cIdx} className={styles.courseworkPill}>
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
