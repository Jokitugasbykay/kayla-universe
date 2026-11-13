# Kayla Universe

Interactive personal portfolio of Kayla Gabrielle, connecting continuous physical simulation, mathematical modeling, and artificial intelligence exploration with production software engineering.

## 1. Project Overview

Kayla Universe is a modern single-page portfolio engineered with React 19, TypeScript, and Three.js. It highlights authentic personal photography, verified academic milestones at Universitas Airlangga, operational case studies (JOKI.IN and Kayla Finance), and a real-time quantum dot confinement simulator.

The defining visual centerpiece is an interactive 3D hanging student ID card simulated with a numerical Verlet physics rope, natural swinging inertia, and front/back badge surfaces.

## 2. Technology Stack

- Language: TypeScript 5.7+ (strict mode enabled)
- Frontend: React 19, Vite 6
- 3D Graphics: Three.js (WebGL renderer, custom perspective camera, canvas textures)
- Physics Simulation: Numerical Verlet chain integrator (rope dynamics, gravity, damping, card tilt)
- Animation: GSAP 3.12, ScrollTrigger
- Styling: CSS Modules, centralized design tokens, responsive CSS grids
- Testing: Vitest (unit tests) and Playwright (end-to-end browser verification)
- Continuous Integration: GitHub Actions

## 3. Core Features

1. Interactive 3D Lanyard:
   - Hanging faculty/student pass with a multi-node flexible strap.
   - Pointer and touch dragging with spring constraints and inertia.
   - Double-sided texture rendering: Front identity pass with authentic Foto 1 portrait and back dossier with mini QR code.
   - Interactive flip toggle ("Show Dossier" / "Show Front") and impulse nudge button.
   - Dedicated 2D canvas physics fallback for low-power devices and reduced motion.

2. Editorial Portrait & Narrative:
   - Authentic formal portrait plate (Foto 1) preserving facial proportions and natural lighting.
   - Transparent academic history covering foundational education in Malaysia, high school in Jakarta, and physics degree (Semester 5) at Universitas Airlangga in Surabaya.
   - Three core pillars: Scientific Core (Physics & Math), Deep Tech & AI, and Applied Craft (Software Engineering).

3. Selected Projects & Mathematical Simulator:
   - JOKI.IN: Operational academic workflow and task execution platform.
   - Kayla Finance: Quantitative financial compounding and cash-flow tracking model.
   - Quantum Confinement Simulator: Interactive real-time wave packet psi(x,t) solver in a harmonic well, with user-tunable frequency, dissipation, and modulation parameters.

4. Research Exploration:
   - Physics-Informed Neural Networks (PINNs) and physical conservation laws.
   - Nanocrystal quantum dot exciton dynamics.
   - Real-time numerical integration for browser viewports.

5. Responsive Design & Accessibility:
   - Fully tested across desktop (1440px), tablet (768px), and mobile (390px) viewports with zero horizontal overflow.
   - Respects prefers-reduced-motion media query.
   - Strict typographical hygiene: zero em dash or en dash characters.

## 4. Project Structure

```text
kayla-universe/
├── public/
│   └── assets/
│       ├── foto1.jpg             # Authentic student portrait (Foto 1)
│       ├── kayla-about.jpg       # Authentic casual portrait
│       ├── kayla-academic.jpg    # Campus and research snapshot
│       ├── jokiin-preview.png    # JOKI.IN product interface
│       ├── jokiin-logo.png       # JOKI.IN brand mark
│       └── kayla-finance.svg     # Kayla Finance vector mark
├── src/
│   ├── components/
│   │   ├── Navigation/           # Header bar and custom portrait uploader
│   │   ├── Hero/                 # Identity, typewriter focus, and 3D stage
│   │   ├── Lanyard/              # 3D Three.js scene, textures, and 2D fallback
│   │   ├── About/                # 4:5 Foto 1 plate and profile dossier
│   │   ├── Education/            # Universitas Airlangga ledger
│   │   ├── Projects/             # Case studies and QuantumSimulator
│   │   ├── Research/             # PINNs, quantum dots, and WebGL physics
│   │   ├── Skills/               # Architectural index table
│   │   ├── Contact/              # Contact links and interactive guestbook
│   │   └── Footer/               # Identity lockup and back to top
│   ├── data/
│   │   └── portfolio.ts          # Strongly typed portfolio content
│   ├── physics/
│   │   ├── verletChain.ts        # Verlet numerical rope and card physics
│   │   └── quantumSimulation.ts  # Wave packet solver
│   ├── styles/
│   │   ├── tokens.css            # Color variables, spacing, and radii
│   │   ├── typography.css        # Font family rules
│   │   └── layout.css            # Section containers and grid templates
│   ├── types/
│   │   └── portfolio.ts          # Data model interfaces
│   ├── App.tsx                   # Main narrative shell and GSAP triggers
│   ├── index.css                 # Reset, ambient lighting, and accessibility
│   ├── main.tsx                  # React entry point
│   └── vite-env.d.ts             # CSS Module and asset declarations
├── tests/
│   ├── unit/                     # Vitest unit test suite
│   └── e2e/                      # Playwright browser test suite
├── .github/
│   └── workflows/
│       └── ci.yml                # Automated CI pipeline
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── index.html
```

## 5. Development and Build Instructions

### Prerequisites
- Node.js 20 LTS or Node.js 22 LTS
- npm 10+

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/Jokitugasbykay/kayla-universe.git
cd kayla-universe
npm ci
```

### Local Development Server
Start the local Vite development server with hot module reloading:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Type Checking
Run the TypeScript compiler to check for type issues without emitting files:

```bash
npm run typecheck
```

### Unit Testing
Run the Vitest test suite:

```bash
npm run test
```

### End-to-End Browser Testing
Execute Playwright browser tests across desktop, tablet, and mobile configurations:

```bash
npm run test:e2e
```

### Production Build
Compile TypeScript and generate an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 6. Current Development Status

- Core portfolio chapters: Complete and verified.
- 3D Verlet lanyard: Functional, interactive, and responsive.
- Foto 1 integration: Complete with authentic assets.
- Test coverage: 11 unit tests and 6 browser e2e tests passing.
- Repository: Private on GitHub under Jokitugasbykay.
