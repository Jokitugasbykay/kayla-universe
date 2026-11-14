import React from 'react';
import { PROJECTS_DATA } from '../../data/portfolio';
import { QuantumSimulator } from './QuantumSimulator';
import styles from './Projects.module.css';

const resolveAsset = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('/')) return `.${path}`;
  return path;
};

export const Projects: React.FC = () => {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.projectsContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>04 / SELECTED WORK</div>
          <div className={styles.eyebrowRight}>
            OPERATIONAL PRODUCTS &middot; QUANTITATIVE MODELS &middot; SIMULATION
          </div>
        </div>

        <div className={styles.sectionIntro}>
          <h2 className={styles.sectionTitle}>
            Engineering systems with mathematical purpose.
          </h2>
          <p className={styles.sectionSubtitle}>
            Instead of generic templates, each project solves a distinct technical or operational
            challenge: from academic queue workflows to quantitative compounding logic and physical
            wave packet simulation.
          </p>
        </div>

        {/* Project Case Studies List */}
        <div className={styles.projectsList}>
          {PROJECTS_DATA.map((project, index) => {
            const isReversed = index % 2 === 1;
            return (
              <article
                key={project.id}
                className={`${styles.projectCard} ${isReversed ? styles.cardReversed : ''}`}
              >
                {/* Visual / Preview Container */}
                <div className={styles.previewContainer}>
                  {project.previewImage && (
                    <img
                      src={resolveAsset(project.previewImage)}
                      alt={`${project.title} interface preview`}
                      className={styles.previewImg}
                    />
                  )}
                  <div className={styles.previewOverlay}>
                    <span className={styles.previewCategory}>{project.category}</span>
                    <span className={styles.previewYear}>{project.year}</span>
                  </div>
                </div>

                {/* Narrative & Details */}
                <div className={styles.projectDetails}>
                  <div className={styles.projectCategoryLabel}>
                    CASE STUDY 0{index + 1} / {project.category}
                  </div>

                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectSummary}>{project.summary}</p>
                  <p className={styles.projectDescription}>{project.description}</p>

                  <div className={styles.highlightsBlock}>
                    <div className={styles.highlightsHeader}>Key Engineering Deliverables:</div>
                    <ul className={styles.highlightsList}>
                      {project.highlights.map((item, hIdx) => (
                        <li key={hIdx} className={styles.highlightItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.techStackRow}>
                    {project.technologies.map((tech) => (
                      <span key={tech} className={styles.techPill}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className={styles.actionRow}>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.liveLink}
                      >
                        <span>{project.linkLabel || 'Launch Platform'}</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.codeLink}
                      >
                        <span>GitHub Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Integrated Quantum Simulation Experiment */}
        <div className={styles.simSectionWrapper}>
          <QuantumSimulator />
        </div>
      </div>
    </section>
  );
};
