import React, { useRef, useState } from 'react';
import { PROJECTS_DATA } from '../../data/portfolio';
import { JokiinDetail } from './JokiinDetail';
import styles from './Projects.module.css';

export const Projects: React.FC = () => {
    const [jokiinOpen, setJokiinOpen] = useState(false);
    const jokiinButton = useRef<HTMLButtonElement>(null);
    return (
        <section id="projects" className={styles.projectsSection}>
            <div className={styles.projectsBackgroundGlow}></div>
            <div className={styles.projectsContainer}>
                {/* Section Header */}
                <div data-reveal className={styles.sectionHeader}>
                    <span className={styles.eyebrowBadge}>PORTFOLIO CASE STUDIES</span>
                    <h2 className={styles.sectionTitle}>Featured Projects</h2>
                    <p className={styles.sectionSubtitle}>
                        Production systems, digital platforms, and mathematical computing applications.
                    </p>
                </div>

                {/* Projects Showcase Grid */}
                <div className={styles.projectsList}>
                    {PROJECTS_DATA.map((project, index) => {
                        const isReversed = index % 2 === 1;
                        return (
                            <article
                                data-reveal data-project={project.id} key={project.id}
                                className={`${styles.projectCard} ${isReversed ? styles.cardReversed : ''}`}
                            >
                                {/* Visual Showcase Side */}
                                <div className={styles.visualContainer}>
                                    <div className={styles.imageWrapper}>
                                        {project.previewVideo ? (
                                            <>
                                                <video className={`${styles.previewImage} ${styles.previewVideo}`} src={project.previewVideo} poster={project.previewImage} autoPlay muted loop playsInline aria-label={`${project.title} project preview`} />
                                                <img className={`${styles.previewImage} ${styles.reducedMotionImage}`} src={project.previewImage} alt={`${project.title} project preview`} />
                                            </>
                                        ) : project.previewImage ? (
                                            <img
                                                src={project.previewImage}
                                                alt={`${project.title} project preview`}
                                                className={styles.previewImage}
                                                loading="eager"
                                            />
                                        ) : (
                                            <div className={styles.financePreview} aria-label="Kayla Finance project">
                                                <span className={styles.financeMark}>KF</span>
                                                <span className={styles.financeLabel}>PERSONAL FINANCE & TRADING</span>
                                                <strong>Kayla Finance</strong>
                                                <span className={styles.financeRule} />
                                                <span>Transactions · Accounts · Trading</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content & Narrative Side */}
                                <div className={styles.infoContainer}>
                                    <div className={styles.categoryRow}>
                                        <span className={styles.categoryPill}>{project.category}</span>
                                        {project.year && <span className={styles.yearPill}>{project.year}</span>}
                                    </div>

                                    <h3 className={styles.projectTitle}>{project.title}</h3>

                                    <p className={styles.projectSummary}>{project.summary}</p>

                                    <p className={styles.projectDescription}>{project.description}</p>

                                    {/* Tech Stack Pills */}
                                    <div className={styles.techStackRow}>
                                        {project.technologies.map((tech) => (
                                            <span key={tech} className={styles.techPill}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Links */}
                                    <div className={styles.actionRow}>
                                        {project.id === 'jokiin' && (
                                            <button ref={jokiinButton} type="button" className={styles.primaryLink} aria-expanded={jokiinOpen} aria-controls="jokiin-details" onClick={() => setJokiinOpen(!jokiinOpen)}>
                                                {jokiinOpen ? 'Close case study' : 'Explore case study'} <span aria-hidden="true">{jokiinOpen ? '↑' : '↓'}</span>
                                            </button>
                                        )}
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={project.id === 'jokiin' ? styles.secondaryLink : styles.primaryLink}
                                            >
                                                <span>{project.linkLabel || 'Launch Platform'}</span>
                                                <span className={styles.linkArrow} aria-hidden="true">&rarr;</span>
                                            </a>
                                        )}
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.secondaryLink}
                                            >
                                                <span>View Source</span>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {project.id === 'jokiin' && <div id="jokiin-details" className={styles.projectDetails} hidden={!jokiinOpen}>
                                    {jokiinOpen && <JokiinDetail onClose={() => { setJokiinOpen(false); jokiinButton.current?.focus(); }} />}
                                </div>}
                            </article>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};
