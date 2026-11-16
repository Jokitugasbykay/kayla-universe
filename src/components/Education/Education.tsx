import React from 'react';
import { EDUCATION_DATA } from '../../data/portfolio';
import styles from './Education.module.css';

export const Education: React.FC = () => {
    return (
        <section id="education" className={styles.educationSection}>
            <div className={styles.educationContainer}>
                {/* Section Header */}
                <div className={styles.sectionHeader}>
                    <span className={styles.eyebrowBadge}>ACADEMIC ROOTS</span>
                    <h2 className={styles.sectionTitle}>Education & Foundations</h2>
                    <p className={styles.sectionSubtitle}>
                        A record of continuous academic inquiry and cross-border learning.
                    </p>
                </div>

                {/* Timeline Cards Grid */}
                <div className={styles.educationGrid}>
                    {EDUCATION_DATA.map((item, idx) => (
                        <article key={idx} className={styles.educationCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.timeBadge}>{item.period}</div>
                                <span className={styles.statusPill}>{item.badge}</span>
                            </div>

                            <h3 className={styles.institutionTitle}>{item.institution}</h3>
                            <h4 className={styles.degreeTitle}>{item.qualification}</h4>

                            <div className={styles.locationMeta}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>{item.location}</span>
                            </div>

                            <p className={styles.itemDescription}>{item.description}</p>

                            <div className={styles.courseworkWrapper}>
                                <span className={styles.courseworkLabel}>Core Topics:</span>
                                <div className={styles.courseworkPills}>
                                    {item.coursework.map((course, cIdx) => (
                                        <span key={cIdx} className={styles.coursePill}>
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
