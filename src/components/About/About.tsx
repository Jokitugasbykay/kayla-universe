import React from 'react';
import { STATS_DATA, SPOTIFY_DATA } from '../../data/portfolio';
import styles from './About.module.css';

interface AboutProps {
    className?: string;
}

export const About: React.FC<AboutProps> = () => {
    return (
        <section id="about" className={styles.aboutSection}>
            <div className={styles.aboutContainer}>
                {/* Section Header */}
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionEyebrow}>ABOUT &amp; DISCIPLINES</span>
                    <h2 className={styles.sectionTitle}>Scientific Thinker, Builder &amp; Trader</h2>
                    <p className={styles.sectionSubtitle}>
                        Physics student at Universitas Airlangga connecting continuous mechanics, software craft, and disciplined market execution.
                    </p>
                </div>

                {/* Central Triptych Layout */}
                <div className={styles.triptychGrid}>
                    {/* Left Column: Personal Background */}
                    <div className={styles.leftNarrative}>
                        <div className={styles.introHeading}>
                            <span className={styles.hiText}>Hi, I am</span>
                            <h3 className={styles.nameText}>Kayla Gabrielle</h3>
                        </div>

                        <p className={styles.narrativeLead}>
                            I am currently an undergraduate Physics student in <strong>Semester 5 at Universitas Airlangga</strong> in Surabaya. My academic foundation is centered on classical mechanics, mathematical physics, and computational modeling.
                        </p>

                        <p className={styles.narrativeBody}>
                            Studying how physical systems obey conservation laws and differential equations gives me a principled framework for tackling complex real-world dynamics, from scientific computing to financial market microstructure.
                        </p>

                        <div className={styles.leftCtaBlock}>
                            <a href="#contact" className={styles.hubungiBtn}>
                                <span>Get In Touch</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Center Column: Intentional Black Architectural Portrait Placeholder */}
                    <div className={styles.centerVisual}>
                        <div className={styles.portraitPlaceholderFrame}>
                            <div className={styles.placeholderMonogramBlock}>
                                <span className={styles.placeholderMonogram}>KG</span>
                                <div className={styles.placeholderCrosshair} aria-hidden="true">
                                    <span className={styles.chHoriz}></span>
                                    <span className={styles.chVert}></span>
                                </div>
                                <span className={styles.placeholderTag}>IDENTITY PORTRAIT</span>
                                <span className={styles.placeholderStatus}>PENDING OFFICIAL UPDATE</span>
                            </div>
                            <div className={styles.photoCaption}>
                                <span className={styles.captionName}>Kayla Gabrielle</span>
                                <span className={styles.captionSub}>Physics • AI &amp; Software • Daily Trading</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Software Craft & Daily Trading Discipline */}
                    <div className={styles.rightNarrative}>
                        <h4 className={styles.rightSubheading}>
                            From Physical Principles to Software &amp; Markets
                        </h4>

                        <p className={styles.narrativeText}>
                            Physics instills a rigorous intuition for how complex systems behave under natural constraints. Over time, that curiosity naturally guided me toward <strong>scientific computing</strong>, <strong>artificial intelligence</strong>, and <strong>high-performance web interfaces</strong>.
                        </p>

                        <p className={styles.narrativeText}>
                            Alongside coursework, I actively build platforms like <strong>JOKI.IN</strong> and quantitative tools like <strong>journalingtrade</strong>. In daily trading, I apply that same systematic discipline: analyzing price action mechanics, market structure, and mathematical risk-to-reward ratios.
                        </p>

                        <div className={styles.rightCtaBlock}>
                            <a href="#projects" className={styles.projectsLink}>
                                <span>Explore Selected Projects</span>
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3 Metric Cards Row */}
                <div className={styles.statsRow}>
                    {STATS_DATA.map((stat, idx) => (
                        <div key={idx} className={styles.statCard}>
                            <span className={styles.statNumber}>{stat.number}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <span className={styles.statDetail}>{stat.detail}</span>
                        </div>
                    ))}
                </div>

                {/* Personal Music & Rhythm Showcase Card */}
                <div className={styles.musicCardWrapper}>
                    <div className={styles.musicShowcase}>
                        <div className={styles.musicLeft}>
                            <span className={styles.musicBadge}>FOCUS PLAYLIST</span>
                            <h3 className={styles.musicTitle}>
                                Deep Work Rhythm
                            </h3>
                            <p className={styles.musicDesc}>
                                Soundtrack accompanying mathematical problem-solving, late-night code architectures, and market chart analysis.
                            </p>
                            <a
                                href="https://open.spotify.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.spotifyBtn}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306c-.215.353-.674.464-1.026.25-2.812-1.718-6.353-2.106-10.524-1.154-.403.092-.807-.156-.899-.56-.092-.404.156-.807.56-.899 4.568-1.045 8.487-.604 11.638 1.336.353.214.464.673.251 1.027zm1.467-3.262c-.27.442-.851.581-1.293.311-3.218-1.977-8.125-2.55-11.93-1.395-.497.151-1.028-.135-1.179-.633-.15-.497.135-1.028.633-1.179 4.352-1.321 9.775-.68 13.458 1.583.442.27.581.851.311 1.293zm.126-3.411c-3.858-2.29-10.222-2.502-13.896-1.386-.593.18-1.222-.16-1.402-.753-.18-.593.16-1.222.753-1.402 4.223-1.282 11.258-1.036 15.696 1.597.534.316.709 1.01.393 1.545-.317.534-1.011.71-1.544.399z" />
                                </svg>
                                <span>Rotation on Spotify</span>
                            </a>
                        </div>

                        <div className={styles.musicRight}>
                            <div className={styles.playlistBox}>
                                <div className={styles.playlistHeader}>
                                    <div className={styles.soundWaves}>
                                        <span className={styles.waveBar}></span>
                                        <span className={styles.waveBar}></span>
                                        <span className={styles.waveBar}></span>
                                        <span className={styles.waveBar}></span>
                                    </div>
                                    <span className={styles.nowPlayingText}>{SPOTIFY_DATA.playlistTitle}</span>
                                </div>
                                <div className={styles.trackList}>
                                    {SPOTIFY_DATA.tracks.map((track, i) => (
                                        <div key={i} className={styles.trackItem}>
                                            <span className={styles.trackIndex}>{i + 1}</span>
                                            <div className={styles.trackDetails}>
                                                <span className={styles.trackName}>{track.title}</span>
                                                <span className={styles.trackArtist}>{track.artist}</span>
                                            </div>
                                            <span className={styles.trackDuration}>{track.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
