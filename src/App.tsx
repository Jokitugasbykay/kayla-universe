import React, { useEffect, useRef } from 'react';
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
    const mainRef = useRef<HTMLDivElement>(null);

    // GSAP Scrollytelling Setup with reduced motion check
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }
        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
                gsap.fromTo(element, { opacity: 0.25, y: 24 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    onComplete: () => gsap.set(element, { clearProps: 'opacity,transform' }),
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 92%',
                        once: true
                    }
                });
            });
        }, mainRef);
        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div className="app-wrapper" ref={mainRef}>
            {/* Ambient Backdrop Lighting */}
            <div className="ambient-lighting" aria-hidden="true"></div>

            {/* Navigation */}
            <Navbar />

            {/* Main Narrative Chapters */}
            <a className="skip-link" href="#main-content">Skip to content</a>
            <main id="main-content">
                <Hero />
                <About />
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
