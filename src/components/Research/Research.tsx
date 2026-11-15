import React from 'react';
import { RESEARCH_DATA } from '../../data/portfolio';
import styles from './Research.module.css';

export const Research: React.FC = () => {
  return (
    <section id="research" className={styles.researchSection}>
      <div className={styles.researchContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>05 / RESEARCH &amp; SCIENTIFIC INQUIRY</div>
          <div className={styles.eyebrowRight}>
            THEORETICAL PHYSICS &middot; MACHINE LEARNING &middot; COMPUTATIONAL RIGOR
          </div>
        </div>

        <div className={styles.headerBlock}>
          <h2 className={styles.sectionTitle}>
            Where continuous physical laws inform modern artificial intelligence.
          </h2>
          <p className={styles.sectionSubtitle}>
            My investigations focus on bridging continuous differential systems with discrete
            computational architectures: embedding physical conservation laws into neural networks and
            modeling zero-dimensional quantum dot confinement.
          </p>
        </div>

        {/* Research Bento Grid */}
        <div className={styles.researchGrid}>
          {RESEARCH_DATA.map((item, idx) => (
            <div key={item.code} className={`${styles.researchCard} ${idx === 0 ? styles.featuredCard : ''}`}>
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
