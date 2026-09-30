# Element Atlas

A self-contained Three.js WebGL periodic table with 118 independent cards and animated Table, Helix, Sphere, and Grid arrangements. Existing family colors and scientific data are retained.

## Development

Install dependencies with `pnpm install`, then run `pnpm build` and `pnpm dev`. The local server runs at http://127.0.0.1:4173. Source is in `src/`; static output is in `dist/`. No external runtime CDN is required. `.openai/hosting.json` identifies the existing Sites project.

## Verification

`pnpm verify` checks all retained scientific records against the original source commit, four layout geometries, every block-outline corner, and search and filter semantics.

`node scripts/build-qa.mjs` creates an isolated browser test page at http://127.0.0.1:4173/__qa/. It exercises the actual WebGL renderer, all 472 focused raycast picks, all profile fields, animation continuity, camera controls, touch input event paths, hover previews, reduced motion, selection persistence, and the accessible view. Test at desktop, tablet and phone viewport sizes. The QA output is excluded from production. `/__qa/fallback.html` simulates a browser without WebGL to verify the accessible fallback.

## Scientific conventions

Weights and uncertainties are retained from the saved CIAAW source, including 2024 revisions. Bracketed isotope mass numbers use the IUPAC May 2022 edition. Main-group valence counts use the outer shell; transition-metal values use formal s + d counts; detached series use the outermost shell, with lawrencium assigned 7s²7p¹. Source links and qualifications are in the Guide and profiles.

Alternative arrangements are spatial visualizations and do not redefine chemical groups or periods. Helium is enclosed in a separate pink s-block outline in Table mode. Detached f-series include all lanthanides and actinides under the existing compact-table convention.
