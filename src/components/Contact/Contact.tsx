import React from 'react';
import { PROFILE_DATA } from '../../data/portfolio';
import { Comments } from './Comments';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
    return (
        <section id="contact" className={styles.contactSection}>
            <div className={styles.contactBackgroundGlow}></div>
            <div className={styles.contactContainer}>
                {/* Section Header */}
                <div data-reveal className={styles.sectionHeader}>
                    <span className={styles.eyebrowBadge}>COMMUNICATION</span>
                    <h2 className={styles.sectionTitle}>Get In Touch</h2>
                    <p className={styles.sectionSubtitle}>
                        Open for collaborative scientific inquiries, software engineering discussions, and academic exchange.
                    </p>
                </div>

                {/* Dual Column Layout */}
                <div className={styles.contactGrid}>
                    {/* Left Column: Direct Communication Channels */}
                    <div data-reveal className={styles.directCard}>
                        <h3 className={styles.cardHeading}>Let us collaborate.</h3>
                        <p className={styles.cardParagraph}>
                            Whether you are interested in discussing computational physics, exploring machine learning models, or discussing software projects like JOKI.IN, feel free to reach out.
                        </p>

                        <form className={styles.contactForm} action="https://formsubmit.co/kaylafisika24@gmail.com" method="POST">
                            <input type="hidden" name="_subject" value="New message from Kayla Universe" />
                            <label htmlFor="contact-name">Name</label>
                            <input id="contact-name" name="name" type="text" maxLength={80} required />
                            <label htmlFor="contact-email">Email</label>
                            <input id="contact-email" name="email" type="email" maxLength={254} required />
                            <label htmlFor="contact-message">Message</label>
                            <textarea id="contact-message" name="message" rows={5} maxLength={4000} required />
                            <p>Your message will be sent to Kayla through FormSubmit.</p>
                            <button type="submit">Send message</button>
                        </form>
                        <div className={styles.channelList}>
                            <a
                                href={PROFILE_DATA.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.channelItem}
                            >
                                <div className={styles.channelIcon}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                </div>
                                <div className={styles.channelMeta}>
                                    <span className={styles.channelName}>GitHub</span>
                                    <span className={styles.channelDetail}>@{PROFILE_DATA.githubUsername}</span>
                                </div>
                                <span className={styles.channelArrow} aria-hidden="true">&rarr;</span>
                            </a>

                            <div className={styles.locationBadge}>
                                <div className={styles.pulseIndicator}></div>
                                <span>Based in Surabaya, Indonesia (Universitas Airlangga)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Local Guestbook Notes */}
                    <div data-reveal className={styles.guestbookColumn}>
                        <Comments />
                    </div>
                </div>
            </div>
        </section>
    );
};
