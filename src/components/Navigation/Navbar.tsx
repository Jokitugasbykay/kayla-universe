import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  onFoto1Upload?: (file: File) => void;
  hasCustomFoto1: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onFoto1Upload, hasCustomFoto1 }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFoto1Upload) {
      onFoto1Upload(e.target.files[0]);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Research', href: '#research' },
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
            <span className={styles.brandTitle}>Physics / AI / Software</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Foto 1 Load Action & Mobile Toggle */}
        <div className={styles.actionGroup}>
          <label htmlFor="foto1-upload-header" className={styles.foto1Button}>
            <span>{hasCustomFoto1 ? 'Custom Foto 1 Active' : 'Load Custom Foto 1'}</span>
            <input
              id="foto1-upload-header"
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />
          </label>

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
