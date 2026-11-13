import {
  PortfolioProfile,
  ProjectItem,
  EducationItem,
  SkillCategory,
  ResearchInterest,
  GuestbookEntry
} from '../types/portfolio';

export const PROFILE_DATA: PortfolioProfile = {
  name: 'Kayla Gabrielle',
  legalStatus: 'Malaysian Citizen studying in Indonesia',
  tagline: 'Physics undergraduate, AI researcher, and software engineer.',
  shortBio:
    'Semester 5 Physics student at Universitas Airlangga with deep interests in scientific computing, mathematical physics, AI research, and high-performance software engineering.',
  currentRole: 'Physics Undergraduate & Software Builder',
  university: 'Universitas Airlangga',
  department: 'Department of Physics, Faculty of Science and Technology',
  semester: 'Semester 5',
  location: 'Surabaya, Indonesia',
  email: 'kaylagabrielle.work@gmail.com',
  github: 'https://github.com/Jokitugasbykay',
  githubUsername: 'Jokitugasbykay',
  rolesList: [
    'Semester 5 Physics Student at Universitas Airlangga',
    'Exploring AI Research, Simulation & Quantum Dots',
    'Founder & Lead Developer of JOKI.IN',
    'Connecting Scientific Thinking & Software Engineering'
  ]
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'jokiin',
    title: 'JOKI.IN',
    category: 'Full-Stack Platform & Education Workflow',
    year: '2024 - Present',
    summary:
      'Structured technical and academic task execution platform bridging clients with verified subject matter specialists.',
    description:
      'Designed and engineered an end-to-end web system delivering transparent task tracking, automated order intake, queue distribution, and client communication. Built to eliminate academic friction with robust operational rigor.',
    highlights: [
      'Engineered structured order workflows and administrative dashboards for rapid dispatch.',
      'Designed responsive dark mode user interfaces prioritizing clarity and typographic order.',
      'Integrated real-time order tracking with stateful queues and reliable data persistence.'
    ],
    technologies: ['TypeScript', 'React', 'Node.js', 'Vite', 'Tailwind CSS', 'REST APIs'],
    link: 'https://jokiin.my.id',
    linkLabel: 'Visit jokiin.my.id',
    github: 'https://github.com/Jokitugasbykay',
    previewImage: '/assets/jokiin-preview.png',
    accentColor: '#3b82f6'
  },
  {
    id: 'kayla-finance',
    title: 'Kayla Finance',
    category: 'Quantitative Finance & Wealth Analytics',
    year: '2024',
    summary:
      'Personal finance modeling and analytics dashboard built for cash-flow projection, budgeting, and portfolio tracking.',
    description:
      'Created an analytical financial workbench designed for personal cash management and compounding models. Features mathematical visualizations, multi-currency ledger support, and clean reporting metrics without cluttered third-party widgets.',
    highlights: [
      'Implemented recursive compound interest and amortization calculation engines.',
      'Architected modular financial category tagging with deterministic data structures.',
      'Constructed zero-dependency chart visualizations for historical monthly breakdown.'
    ],
    technologies: ['TypeScript', 'React', 'Three.js', 'CSS Modules', 'Vector Math'],
    github: 'https://github.com/Jokitugasbykay',
    previewImage: '/assets/kayla-finance.svg',
    accentColor: '#10b981'
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    period: '2022 - Present',
    institution: 'Universitas Airlangga',
    qualification: 'Bachelor of Science in Physics',
    location: 'Surabaya, Indonesia',
    description:
      'Currently in semester 5. Coursework and independent inquiry center around classical and quantum mechanics, mathematical physics, numerical analysis, computational simulation, and differential equations.',
    coursework: [
      'Mathematical Physics',
      'Classical & Analytical Mechanics',
      'Quantum Mechanics Fundamentals',
      'Differential Equations (ODE / PDE)',
      'Computational Physics & Numerical Modeling',
      'Electrodynamics & Wave Physics'
    ],
    badge: 'Undergraduate Program (Sem 05)'
  },
  {
    period: '2019 - 2022',
    institution: 'Senior High School',
    qualification: 'Natural Sciences & Mathematics Track',
    location: 'Jakarta, Indonesia',
    description:
      'Completed secondary education in Jakarta after relocating from Malaysia. Developed an early foundation in advanced calculus, physics problem solving, and algorithmic logic.',
    coursework: ['Calculus & Linear Algebra', 'Physics Laboratory', 'Foundational Programming'],
    badge: 'Secondary Education'
  },
  {
    period: 'Prior to 2019',
    institution: 'Foundational Schooling',
    qualification: 'Primary & Junior Secondary Education',
    location: 'Malaysia',
    description:
      'Early educational foundation in Malaysia as a Malaysian citizen. Shaped multicultural adaptability, multilingual communication, and international perspective.',
    coursework: ['Mathematics', 'Integrated Sciences', 'Language & Communication'],
    badge: 'Foundational Years'
  }
];

export const RESEARCH_DATA: ResearchInterest[] = [
  {
    code: 'RES-01',
    title: 'Physics-Informed Neural Networks & Continuous Modeling',
    subtitle: 'Machine Learning Governed by Physical Conservation Laws',
    abstract:
      'Investigating methods to embed differential equations and boundary conditions directly into machine learning loss functions, accelerating physical simulation while preserving physical consistency.',
    tags: ['PINNs', 'Scientific ML', 'PDE Solvers', 'Tensor Computing'],
    status: 'Active Exploration'
  },
  {
    code: 'RES-02',
    title: 'Quantum Dots & Zero-Dimensional Nanocrystals',
    subtitle: 'Exciton Confinement & Size-Dependent Electronic Transitions',
    abstract:
      'Studying how nanoscale spatial confinement in semiconductor quantum dots quantizes energy spectra, with implications for quantum optics, high-efficiency photovoltaics, and biological markers.',
    tags: ['Quantum Dots', 'Nanophysics', 'Exciton Dynamics', 'Solid State Physics'],
    status: 'Theoretical Study'
  },
  {
    code: 'RES-03',
    title: 'Real-Time Physics Engines in WebGL / WebGPU',
    subtitle: 'Interactive Verlet Integration & Mass-Spring Constraint Solvers',
    abstract:
      'Developing low-overhead numerical integrators for continuous mechanical systems inside the browser. Applied in interactive lanyards, cloth physics, and physical user interfaces.',
    tags: ['Verlet Integration', 'WebGL', 'Three.js', 'Numerical Stability'],
    status: 'Engineered & Deployed'
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    categoryNumber: '01',
    domain: 'Physics & Mathematical Modeling',
    summary:
      'Analytical mechanics, differential calculus, numerical approximations, and physical simulation principles acquired through academic training.',
    items: [
      'Classical & Wave Mechanics',
      'Mathematical Physics',
      'Ordinary & Partial Differential Equations',
      'Numerical Analysis & Euler / Verlet Integrators',
      'Thermodynamics & Statistical Foundations',
      'Quantum Mechanics Fundamentals'
    ],
    focusPill: 'Core Academic Rigor'
  },
  {
    categoryNumber: '02',
    domain: 'Software Engineering & Web Systems',
    summary:
      'Production-oriented web technologies used to ship applications like JOKI.IN and Kayla Finance with clean architecture.',
    items: [
      'TypeScript (Strict Mode)',
      'React 19 & Next-Gen Patterns',
      'Modern CSS & CSS Modules',
      'Vite & Tooling Architecture',
      'Node.js & Backend REST APIs',
      'Git, GitHub Workflows & CI'
    ],
    focusPill: 'Production Craft'
  },
  {
    categoryNumber: '03',
    domain: 'Interactive 3D & Creative Development',
    summary:
      'Real-time graphics, physical simulation in browser viewports, shaders, and spatial interactive storytelling.',
    items: [
      'Three.js & WebGL Architecture',
      'React Three Fiber & Drei',
      'Verlet Rope & Cloth Dynamics',
      'GSAP & ScrollTrigger Scrollytelling',
      'Procedural Canvas Texturing',
      'GPU Performance Profiling'
    ],
    focusPill: 'Spatial & Kinetic'
  },
  {
    categoryNumber: '04',
    domain: 'AI Exploration & Scientific Computing',
    summary:
      'Mathematical modeling pipelines, deep learning architectures, and scientific computing exploration.',
    items: [
      'Python & Scientific Libraries (NumPy, SciPy)',
      'Neural Network Foundations & Optimization',
      'Physics-Informed Machine Learning Concepts',
      'Computational Experiment Design',
      'Data Visualization & Trajectory Plotting'
    ],
    focusPill: 'Emerging Horizons'
  }
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'g-1',
    name: 'Physics Colleague',
    role: 'Universitas Airlangga',
    comment:
      'The 3D lanyard physics and the quantum wave packet simulation capture the blend between physics theory and clean coding.',
    timestamp: '2024-11-10'
  },
  {
    id: 'g-2',
    name: 'JOKI.IN User',
    role: 'Client Review',
    comment:
      'Fast, structured, and communicative. The attention to detail Kayla brings to software execution is evident in every deliverable.',
    timestamp: '2024-10-28'
  },
  {
    id: 'g-3',
    name: 'Creative Developer Peer',
    role: 'Open-Source Community',
    comment:
      'Honest editorial typography without generic AI gradients. The interactive hanging ID card feels genuinely handcrafted.',
    timestamp: '2024-10-15'
  }
];
