import React from 'react';
import { RESEARCH_DATA } from '../../data/portfolio';
import styles from './Research.module.css';

export const Research: React.FC = () => {
    return (
        <section id="research" className={styles.researchSection}>
            <div className={styles.researchContainer}>
                {/* Section Header */}
                <div data-reveal className={styles.sectionHeader}>
                    <span className={styles.eyebrowBadge}>SCIENTIFIC INQUIRY</span>
                    <h2 className={styles.sectionTitle}>Research & Exploration</h2>
                    <p className={styles.sectionSubtitle}>
                        Areas of active mathematical study, computational physics, and physical machine learning.
                    </p>
                </div>

                {/* Research Topics Grid */}
                <div className={styles.researchGrid}>
                    {RESEARCH_DATA.map((item) => (
                        <article key={item.code} data-reveal className={styles.researchCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.codeBadge}>TOPIC {item.code}</span>
                                <span className={styles.statusPill}>{item.status}</span>
                            </div>

                            <h3 className={styles.topicTitle}>{item.title}</h3>
                            <h4 className={styles.topicSubtitle}>{item.subtitle}</h4>

                            <p className={styles.topicAbstract}>{item.abstract}</p>

                            <div className={styles.tagsRow}>
                                {item.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className={styles.tagPill}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
