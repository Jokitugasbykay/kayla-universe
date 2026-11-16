import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Education', href: '#education' },
        { label: 'Projects', href: '#projects' },
        { label: 'Interests', href: '#research' },
        { label: 'Skills', href: '#skills' },
        { label: 'Contact', href: '#contact' }
    ];

    return (
        <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.navContainer}>
                {/* Brand Monogram */}
                <a href="#home" className={styles.brandLockup} aria-label="Kayla Gabrielle Home">
                    <span className={styles.monogram}>KG</span>
                    <span className={styles.brandText}>
                        <span className={styles.brandName}>Kayla Gabrielle</span>
                        <span className={styles.brandTitle}>Physics, AI &amp; Markets</span>
                    </span>
                </a>

                {/* Floating Centered Pill Navigation */}
                <nav className={styles.floatingNavPill} aria-label="Main Navigation">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className={styles.navLink}>
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Action CTA & Mobile Toggle */}
                <div className={styles.actionGroup}>
                    <a href="#contact" className={styles.quickContactBtn}>
                        <span>Say Hello</span>
                    </a>

                    <button
                        type="button"
                        className={styles.mobileToggle}
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className={styles.hamburgerBar}></span>
                        <span className={styles.hamburgerBar}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className={styles.mobileNavDropdown}>
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={styles.mobileNavLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
};
