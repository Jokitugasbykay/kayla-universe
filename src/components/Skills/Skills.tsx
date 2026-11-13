import React from 'react';
import { SKILLS_DATA } from '../../data/portfolio';
import styles from './Skills.module.css';

export const Skills: React.FC = () => {
  return (
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.skillsContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>06 / TECHNICAL STACK &amp; CAPABILITIES</div>
          <div className={styles.eyebrowRight}>VERIFIED PRACTICAL EXPERIENCE &middot; ACADEMIC FOUNDATION</div>
        </div>

        <div className={styles.headerBlock}>
          <h2 className={styles.sectionTitle}>
            Tools I build with and topics I am actively investigating.
          </h2>
          <p className={styles.sectionSubtitle}>
            Organized transparently without arbitrary skill percentages. Categorized by the
            production tools used for JOKI.IN and Kayla Finance, mathematical methods from my physics
            degree, and current AI research topics.
          </p>
        </div>

        {/* Curated Architectural Table */}
        <div className={styles.indexTable}>
          {SKILLS_DATA.map((cat) => (
            <div key={cat.categoryNumber} className={styles.tableRow}>
              {/* Category Info */}
              <div className={styles.colCategory}>
                <span className={styles.catNumber}>{cat.categoryNumber}</span>
                <span className={styles.catFocusPill}>{cat.focusPill}</span>
              </div>

              {/* Domain & Summary */}
              <div className={styles.colDomain}>
                <h3 className={styles.domainTitle}>{cat.domain}</h3>
                <p className={styles.domainSummary}>{cat.summary}</p>
              </div>

              {/* Items List */}
              <div className={styles.colItems}>
                <div className={styles.pillGrid}>
                  {cat.items.map((item, idx) => (
                    <span key={idx} className={styles.skillPill}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
