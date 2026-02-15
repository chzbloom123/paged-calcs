# CLAUDE.md

## Project Overview

**Fitter Math Engine** — a React web application providing specialized calculators for pipe fitters and HVAC professionals (UA Local 598, Pasco, WA). Users input measurements and get real-time calculation results with fractional inch output.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (loaded via CDN in `index.html`) + custom CSS (`index.css`)
- **Deployment:** Netlify (config in `netlify.toml`, publishes `dist/`)
- **Node Version:** 20

## Project Structure

This is a **flat project** — all source files live at the root level. There are no `src/`, `components/`, or `tests/` directories.

```
├── App.tsx              # Main application component (all calculator logic and UI)
├── index.tsx            # React DOM entry point (StrictMode wrapper)
├── index.css            # Global styles (CSS variables, Tailwind directives, custom classes)
├── index.html           # HTML template (Tailwind CDN, import maps)
├── vite.config.ts       # Vite configuration (React plugin)
├── tsconfig.json        # TypeScript configuration (strict mode)
├── package.json         # Dependencies and scripts
├── netlify.toml         # Netlify deployment config
├── logo.png             # App logo
├── seal1.jpg            # Radiation symbol image
└── seal2.jpg            # UA Local 598 union seal image
```

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build (tsc && vite build)
npm run preview   # Preview production build locally
```

There is no test runner, linter, or formatter configured.

## Architecture & Conventions

### Single-file component architecture

All application logic is in `App.tsx`. It contains:
- `toFraction()` helper — converts decimal inches to fractional notation (16ths)
- `CalculatorCard` — reusable presentational component for calculator cards
- `App` — root component with all state and calculations

### State management

- React `useState` hooks only — no external state library
- All state lives in the `App` component
- Two calculator pages toggled via `activePage` state: `'fitter'` | `'fluid'`

### Calculator categories

**Fitter Math:** 45° Offset, Rolling Offset, Pipe Volume, 90° Bend Gain, Pipe Length with Fittings, Right Triangle

**Fluid Math:** Flow Velocity, Water Weight, Surface Area

### Styling conventions

- Dark theme with neon green (`#00ff9f`) accent — defined as CSS variable `--neon-green`
- CSS variables in `:root` for all theme colors
- Mix of Tailwind utility classes and custom CSS classes (`.calculator`, `.formula`, `.input-group`, `.output`)
- Fonts: Orbitron (headings), Rajdhani (body), Courier New (formulas)

### TypeScript

- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Target: ES2020
- JSX transform: `react-jsx`
- The `CalculatorCard` component uses `any` for its props type

### Input handling pattern

All number inputs follow the same pattern:
```tsx
<input type="number" value={stateVar || ''} onChange={e => setSetter(parseFloat(e.target.value) || 0)} />
```
Values default to `0` when input is empty or non-numeric.

## Dependencies

**Production:** `react`, `react-dom` (both ^19.0.0)

**Dev:** `typescript`, `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`

**CDN (in index.html):** Tailwind CSS v4, React/ReactDOM 19.2.1 import maps via esm.sh

## Deployment

Deployed to Netlify. Build runs `npm run build` and publishes the `dist/` directory. Node 20 is specified in `netlify.toml`.
