import React from 'react';
import { EDUCATION_DATA } from '../../data/portfolio';
import styles from './Education.module.css';

export const Education: React.FC = () => {
  return (
    <section id="education" className={styles.educationSection}>
      <div className={styles.educationContainer}>
        <div className={styles.sectionGrid}>
          {/* Left Column: Heading */}
          <div className={styles.leftCol}>
            <div className={styles.eyebrow}>03 / EDUCATION &amp; PATH</div>
            <h2 className={styles.sectionTitle}>
              Academic foundation &amp; cross-border path.
            </h2>
            <p className={styles.sectionDesc}>
              A concise record of my educational journey from Malaysia and Jakarta to studying
              Physics at Universitas Airlangga in Surabaya.
            </p>

            <div className={styles.curiosityBadge}>
              <span className={styles.curiosityDot}></span>
              <span>Currently active in Semester 5 (2024/2025)</span>
            </div>
          </div>

          {/* Right Column: Clean Editorial Ledger */}
          <div className={styles.rightCol}>
            <div className={styles.ledgerList}>
              {EDUCATION_DATA.map((item, index) => (
                <div key={index} className={styles.ledgerItem}>
                  <div className={styles.itemMetaRow}>
                    <span className={styles.itemBadge}>{item.badge}</span>
                    <span className={styles.itemPeriod}>{item.period} &middot; {item.location}</span>
                  </div>

                  <h3 className={styles.itemInstitution}>{item.institution}</h3>
                  <div className={styles.itemDegree}>{item.qualification}</div>

                  <p className={styles.itemDesc}>{item.description}</p>

                  <div className={styles.courseworkWrap}>
                    <span className={styles.courseworkLabel}>Core Coursework:</span>
                    <div className={styles.pillRow}>
                      {item.coursework.map((course, cIdx) => (
                        <span key={cIdx} className={styles.coursePill}>
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
