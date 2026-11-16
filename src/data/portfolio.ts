import type { PortfolioProfile, ProjectItem, EducationItem, SkillCategory, ResearchInterest, GuestbookEntry } from '../types/portfolio';

export const PROFILE_DATA: PortfolioProfile = {
    name: 'Kayla Gabrielle',
    tagline: 'Physics undergraduate, builder in AI & scientific software, and daily trader.',
    shortBio: 'Undergraduate in Physics at Universitas Airlangga. I explore continuous physical systems, mathematical mechanics, and machine learning, while building production software and applying systematic discipline to daily trading.',
    currentRole: 'Undergraduate Physics Student',
    university: 'Universitas Airlangga',
    semester: 'Semester 5',
    github: 'https://github.com/Jokitugasbykay',
    githubUsername: 'Jokitugasbykay'
};

export const STATS_DATA = [
    { number: 'Physics', label: 'Academic Discipline', detail: 'Semester 5, Universitas Airlangga' },
    { number: 'Builder', label: 'Selected Work', detail: 'JOKI.IN & Kayla Finance platforms' },
    { number: 'Markets', label: 'Daily Trading', detail: 'Price dynamics, risk models & execution' }
];

export const SPOTIFY_DATA = {
    playlistTitle: 'Late Night Physics & Code',
    curator: 'Kayla Gabrielle',
    description: 'Ambient synth, indie acoustics, and modern beats accompanying scientific computing sessions.',
    tracks: [
        { title: 'Cornfield Chase', artist: 'Hans Zimmer', duration: '2:07' },
        { title: 'Midnight City', artist: 'M83', duration: '4:03' },
        { title: 'Resonance', artist: 'HOME', duration: '3:32' }
    ]
};

export const PROJECTS_DATA: ProjectItem[] = [
    {
        id: 'jokiin',
        title: 'JOKI.IN',
        category: 'Production Web Platform',
        year: '2024',
        summary: 'Digital academic and task management platform connecting collaborative student workflows with dependable fulfillment.',
        description: 'Engineered an operational task marketplace featuring responsive client dashboards, transparent order intake pipelines, status tracking, and automated fulfillment routing.',
        highlights: [
            'Architected client-facing service catalog with dynamic pricing calculators.',
            'Implemented order tracking state machine with real-time progress indicators.',
            'Engineered mobile-first interface optimized for speed and clarity.'
        ],
        technologies: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'Vite'],
        link: 'https://jokiin.my.id',
        linkLabel: 'Launch Platform',
        previewImage: './assets/jokiin-preview.png',
        accentColor: '#c8ad8d'
    },
    {
        id: 'kayla-finance',
        title: 'Kayla Finance',
        category: 'Analytical Financial Dashboard',
        year: '2024',
        summary: 'Personal portfolio tracking and predictive modeling engine designed for compound projections and capital allocation.',
        description: 'Constructed an analytical workbench for multi-ledger tracking, cash flow visualizations, and compounding calculations without third-party analytics bloat.',
        highlights: [
            'Built recursive compound interest and capital projection calculations.',
            'Designed lightweight canvas chart visualizer for cash-flow analytics.',
            'Created modular transaction categorization with deterministic state management.'
        ],
        technologies: ['TypeScript', 'React', 'Three.js', 'CSS Modules', 'Vector Math'],
        github: 'https://github.com/Jokitugasbykay/kayla-finance',
        linkLabel: 'View Source',
        previewImage: './assets/kayla-finance.svg',
        accentColor: '#889882'
    }
];

export const EDUCATION_DATA: EducationItem[] = [
    {
        period: '2022 - Present',
        institution: 'Universitas Airlangga',
        qualification: 'Undergraduate Physics student',
        location: 'Surabaya, Indonesia',
        description: 'Currently in Semester 5. Core studies in classical mechanics, differential equations, computational simulation, and quantum phenomena.',
        coursework: ['Classical Mechanics', 'Mathematical Physics', 'Computational Simulation', 'Quantum Physics', 'Thermodynamics'],
        badge: 'Academic Core'
    }
];

export const RESEARCH_DATA: ResearchInterest[] = [
    {
        code: '01',
        title: 'Physics-Informed Neural Networks',
        subtitle: 'Scientific Machine Learning',
        abstract: 'Investigating how fundamental conservation laws and differential mechanics constrain neural architectures to model non-linear dynamic systems efficiently.',
        tags: ['PINNs', 'Differential Equations', 'PyTorch', 'Numerical Methods'],
        status: 'Active Study'
    },
    {
        code: '02',
        title: 'Quantum Dots & Nanoscale Modeling',
        subtitle: 'Quantum Confinement',
        abstract: 'Studying electronic property variations in zero-dimensional semiconductor nanocrystals driven by quantum size effects and potential well confinement.',
        tags: ['Quantum Mechanics', 'Solid State Physics', 'Nanomaterials'],
        status: 'Academic Exploration'
    },
    {
        code: '03',
        title: 'Quantitative Price Action & Market Dynamics',
        subtitle: 'Market Microstructure',
        abstract: 'Analyzing market liquidity, support/resistance reaction zones, and disciplined risk-reward asymmetry in daily trading environments.',
        tags: ['Market Structure', 'Risk Management', 'Volatility', 'Execution Discipline'],
        status: 'Daily Practice'
    }
];

export const SKILLS_DATA: SkillCategory[] = [
    {
        categoryNumber: '01',
        domain: 'Frontend & Systems Craft',
        summary: 'Modern web applications built with an eye for performance, motion fidelity, and clean structure.',
        items: ['TypeScript', 'React 19', 'Next.js', 'Three.js', 'WebGL', 'GSAP', 'Vite', 'CSS Modules'],
        focusPill: 'Engineering'
    },
    {
        categoryNumber: '02',
        domain: 'Physics & Scientific Computing',
        summary: 'Mathematical modeling, differential analysis, and computational mechanics methods.',
        items: ['Mathematical Mechanics', 'Differential Equations', 'Python', 'NumPy', 'Verlet Dynamics', 'Quantum Modeling'],
        focusPill: 'Science'
    },
    {
        categoryNumber: '03',
        domain: 'Market Analysis & Trading Discipline',
        summary: 'Systematic approach to price behavior, capital preservation, and daily market execution.',
        items: ['Price Action Mechanics', 'Support & Resistance', 'Risk-to-Reward Modeling', 'Market Structure', 'Capital Management'],
        focusPill: 'Markets'
    }
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [];
