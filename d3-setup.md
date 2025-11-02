# D3.js Development Environment Setup

## installation steps

run in your terminal:
```bash
npm init -y
npm install d3 parcel
```

## configuration

1. **`package.json`**: configured scripts for development and build
   - `npm run dev`: starts development server with hot reload
   - `npm run build`: creates production build
   - `npm start`: runs development server without auto-open

2. **`project structure`**:
   - `src/index.html`: main html file with styles
   - `src/index.js`: d3 javascript code with sample visualization
   - parcel handles bundling and module resolution automatically

## running the project

start the development server:
```bash
npm run dev
```

this will:
- bundle your javascript with d3
- start a local server (usually at http://localhost:1234)
- open the page in your browser
- auto-reload when you save changes

## what was fixed

- moved scripts from incorrect `dev` object to proper `scripts` object
- removed `main` field that was causing library target error
- moved parcel to devDependencies
- created complete html template with styling
- added sample d3 visualization with interactive tooltips and animations

## next steps

replace the sample visualization in `src/index.js` with your chicago airbnb and crime data visualizations.
