import React from 'react';
import { RESEARCH_DATA } from '../../data/portfolio';
import styles from './Research.module.css';

export const Research: React.FC = () => {
  return (
    <section id="research" className={styles.researchSection}>
      <div className={styles.researchContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>05 / RESEARCH &amp; EXPLORATION</div>
          <div className={styles.eyebrowRight}>
            THEORETICAL PHYSICS &middot; AI INTEGRATION &middot; COMPUTATIONAL RIGOR
          </div>
        </div>

        <div className={styles.headerBlock}>
          <h2 className={styles.sectionTitle}>
            Where physical theory meets artificial intelligence.
          </h2>
          <p className={styles.sectionSubtitle}>
            My independent and academic investigations concentrate on bridging continuous
            differential systems with discrete computational learning: grounding neural
            architectures in physical conservation laws and understanding spatial confinement in
            nanocrystals.
          </p>
        </div>

        {/* Research Topics Grid */}
        <div className={styles.researchGrid}>
          {RESEARCH_DATA.map((item) => (
            <div key={item.code} className={styles.researchCard}>
              <div className={styles.cardHeader}>
                <span className={styles.topicCode}>{item.code}</span>
                <span className={styles.topicStatus}>{item.status}</span>
              </div>

              <h3 className={styles.topicTitle}>{item.title}</h3>
              <div className={styles.topicSubtitle}>{item.subtitle}</div>

              <p className={styles.topicAbstract}>{item.abstract}</p>

              <div className={styles.tagsRow}>
                {item.tags.map((tag) => (
                  <span key={tag} className={styles.topicTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
