import React from 'react';
import { SKILLS_DATA } from '../../data/portfolio';
import styles from './Skills.module.css';

export const Skills: React.FC = () => {
    return (
        <section id="skills" className={styles.skillsSection}>
            <div className={styles.skillsContainer}>
                {/* Section Header */}
                <div data-reveal className={styles.sectionHeader}>
                    <span className={styles.eyebrowBadge}>TECHNICAL CRAFT</span>
                    <h2 className={styles.sectionTitle}>Skills & Competencies</h2>
                    <p className={styles.sectionSubtitle}>
                        A blend of creative work, media, science, development, and market analysis.
                    </p>
                </div>

                {/* Modern Categorized Cards Grid */}
                <div className={styles.skillsGrid}>
                    {SKILLS_DATA.map((cat) => (
                        <div key={cat.categoryNumber} data-reveal className={styles.skillCategoryCard}>
                            <div className={styles.cardTopRow}>
                                <span className={styles.categoryIndex}>{cat.categoryNumber}</span>
                                <span className={styles.focusPill}>{cat.focusPill}</span>
                            </div>

                            <h3 className={styles.categoryDomain}>{cat.domain}</h3>
                            <p className={styles.categorySummary}>{cat.summary}</p>

                            <div className={styles.badgeCloud}>
                                {cat.items.map((item, idx) => (
                                    <span key={idx} className={styles.skillItemPill}>
                                        <span className={styles.dot}></span>
                                        <span>{item}</span>
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
