import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navigation/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Education } from './components/Education/Education';
import { Projects } from './components/Projects/Projects';
import { Research } from './components/Research/Research';
import { Skills } from './components/Skills/Skills';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [portraitSrc, setPortraitSrc] = useState<string>('./assets/foto1.jpg');
  const [portraitImg, setPortraitImg] = useState<HTMLImageElement | null>(null);
  const [hasCustomFoto1, setHasCustomFoto1] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Load portrait image element for Three.js texture generation
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = portraitSrc;
    img.onload = () => {
      setPortraitImg(img);
    };
  }, [portraitSrc]);

  // Handler for custom Foto 1 file upload
  const handleFoto1Upload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPortraitSrc(objectUrl);
    setHasCustomFoto1(true);
  };

  // GSAP Scrollytelling Setup
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const sections = ['#about', '#education', '#projects', '#research', '#skills', '#contact'];

      sections.forEach((selector) => {
        const el = document.querySelector(selector);
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0.88, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });
    }, mainRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="app-wrapper" ref={mainRef}>
      {/* Restrained Ambient Backdrop Lighting */}
      <div className="ambient-lighting" aria-hidden="true"></div>

      {/* Navigation */}
      <Navbar onFoto1Upload={handleFoto1Upload} hasCustomFoto1={hasCustomFoto1} />

      {/* Main Narrative Chapters */}
      <main id="main-content">
        <Hero portraitImg={portraitImg} portraitSrc={portraitSrc} />
        <About portraitSrc={portraitSrc} onFoto1Upload={handleFoto1Upload} />
        <Education />
        <Projects />
        <Research />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
