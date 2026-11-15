import React from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import { Guestbook } from './Guestbook';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeaderRow}>
          <div className={styles.eyebrow}>07 / CORRESPONDENCE &amp; DIALOGUE</div>
          <div className={styles.eyebrowRight}>DIRECT CHANNELS &middot; SURABAYA, ID</div>
        </div>

        <div className={styles.mainGrid}>
          {/* Left Column: Personal Statement & Links */}
          <div className={styles.leftCol}>
            <h2 className={styles.sectionTitle}>
              Let us connect over physics, artificial intelligence, or software craft.
            </h2>

            <p className={styles.closingStatement}>
              Whether you are working on machine learning for physical systems, interested in
              nanoscale simulation, or looking to collaborate on software engineering, I welcome
              thoughtful conversations and research opportunities.
            </p>

            {/* Direct Channel Cards with Button-in-Button Arrow */}
            <div className={styles.channelList}>
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className={styles.channelCard}
                aria-label="Send email to Kayla Gabrielle"
              >
                <div className={styles.channelMeta}>
                  <span className={styles.channelLabel}>PRIMARY EMAIL</span>
                  <span className={styles.channelValue}>{PROFILE_DATA.email}</span>
                </div>
                <span className={styles.channelArrowCircle}>→</span>
              </a>

              <a
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelCard}
                aria-label="Visit Kayla Gabrielle on GitHub"
              >
                <div className={styles.channelMeta}>
                  <span className={styles.channelLabel}>GITHUB PROFILE</span>
                  <span className={styles.channelValue}>github.com/{PROFILE_DATA.githubUsername}</span>
                </div>
                <span className={styles.channelArrowCircle}>→</span>
              </a>

              <a
                href="https://jokiin.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelCard}
                aria-label="Visit JOKI.IN project"
              >
                <div className={styles.channelMeta}>
                  <span className={styles.channelLabel}>PRODUCTION SYSTEM</span>
                  <span className={styles.channelValue}>jokiin.my.id</span>
                </div>
                <span className={styles.channelArrowCircle}>→</span>
              </a>
            </div>

            {/* Academic & Geographic Footprint */}
            <div className={styles.geoCard}>
              <div className={styles.geoRow}>
                <span className={styles.geoKey}>ACADEMIC AFFILIATION</span>
                <span className={styles.geoVal}>Physics, Universitas Airlangga</span>
              </div>
              <div className={styles.geoRow}>
                <span className={styles.geoKey}>CURRENT LOCATION</span>
                <span className={styles.geoVal}>Surabaya, East Java, Indonesia</span>
              </div>
              <div className={styles.geoRow}>
                <span className={styles.geoKey}>TIMEZONE</span>
                <span className={styles.geoVal}>UTC+7 (Western Indonesia Time)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Guestbook */}
          <div className={styles.rightCol}>
            <Guestbook />
          </div>
        </div>
      </div>
    </section>
  );
};
