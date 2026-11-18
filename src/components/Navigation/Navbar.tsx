import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
            const ids = ['home', 'about', 'education', 'projects', 'research', 'skills', 'contact'];
            const current = ids.filter(id => {
                const section = document.getElementById(id);
                return section && section.getBoundingClientRect().top <= window.innerHeight * 0.35;
            }).at(-1);
            setActiveSection(current || 'home');
        };
        handleScroll();
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

    const scrollToSection = (event: React.MouseEvent<HTMLElement>) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = (event.target as Element).closest('a[href^="#"]');
        const id = link?.getAttribute('href')?.slice(1);
        const section = id ? document.getElementById(id) : null;
        if (!section) return;
        event.preventDefault();
        section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };

    return (
        <header onClick={scrollToSection} className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.navContainer}>
                {/* Brand Monogram */}
                <a href="#home" className={styles.brandLockup} aria-label="Kayla Gabrielle Home">
                    <img className={styles.monogram} src="./assets/kayla-logo.svg" alt="" />
                    <span className={styles.brandText}>
                        <span className={styles.brandName}>Kayla Gabrielle</span>
                        <span className={styles.brandTitle}>Physics, AI &amp; Markets</span>
                    </span>
                </a>

                {/* Floating Centered Pill Navigation */}
                <nav className={styles.floatingNavPill} aria-label="Main Navigation">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className={`${styles.navLink} ${activeSection === link.href.slice(1) ? styles.navLinkActive : ''}`} aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}>
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
                            aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
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
