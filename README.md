# Element Atlas

A self-contained Three.js WebGL periodic table with 118 independent cards and animated Table, Helix, Sphere, and Grid arrangements. Existing family colors and scientific data are retained.

Element cards show mass at the top-left, a large central symbol, atomic number beneath it, and the element name at the bottom. Table group and period numbers face the camera and retain a readable screen size. The header uses an element-style E / 118 mark and credits Rhesa Warnock. [Before-and-after screenshots](docs/review/README.md) document the presentation changes.

The Orbitals tab accepts typed electron configurations such as `1s2 2s2 2p4`, Unicode superscripts, caret exponents, and noble-gas shorthand such as `[Ar] 4s2 3d6`. It expands cores, validates subshell capacities and shell quantum numbers, and shows totals, shell populations, and a Hund-filling occupancy diagram. Overall view opens by default with every occupied orbital around a shared nucleus. Hide subshell layers to see inside, restore all layers, or click a 3D surface to inspect its orbital. Select a subshell and orbital box to rotate, pan, and zoom its real WebGL angular surface; optionally overlay other occupied orbitals in that subshell. Overall view returns to the complete model. Configuration, view mode, and layer visibility persist across tab changes.

Click an element, then **View electron orbitals** in its profile to load its neutral ground-state reference configuration directly into Overall view. Every occupied layer opens visibly, with the element's name, symbol, source and a prediction label where applicable. Table navigation restores the selected profile and camera. Valid manual edits clear the imported element attribution. [Configuration sources and conventions](docs/electron-configurations.md) document all 118 records, exceptions and theoretical assignments.

## Development

Install dependencies with `pnpm install`, then run `pnpm build` and `pnpm dev`. The local server runs at http://127.0.0.1:4173. Source is in `src/`; static output is in `dist/`. No external runtime CDN is required. `.openai/hosting.json` identifies the existing Sites project.

## GitHub Pages

[Publishing instructions](docs/github-pages.md) explain the one-time repository settings for an administrator. The **Publish Element Atlas** workflow builds and verifies pull requests, then publishes `dist/` after successful updates to `main` once Pages is enabled. The expected site address is https://folterung.github.io/periodic_table/.

## Verification

`pnpm verify` checks all retained scientific records against the original source commit, four layout geometries, every block-outline corner, search and filter semantics, configuration parsing and filling, all 16 finite angular orbital surfaces, and exact electron coverage and layer filtering in Overall view.

The orbital verifier also checks all 118 neutral configurations against retained source data, including exception cases and predicted configurations. Browser QA checks the profile-to-orbitals flow for H, O, Fe, Cr, Cu, Ce, Cm, Lr, Ds, Rg and Og, with source labels, layer/error resets, focus handling, manual editing and exact camera preservation on return.

`node scripts/build-qa.mjs` creates an isolated browser test page at http://127.0.0.1:4173/__qa/. It exercises the actual WebGL renderer, all 472 focused raycast picks, all profile fields, animation continuity, camera controls, touch input event paths, hover previews, reduced motion, selection persistence, and the accessible view. It measures actual projected numeral ink for all 25 table-axis labels, checking readability, viewport containment, and separation from cards and other numerals. It also tests configuration formats and errors, all 16 selectable orbital surfaces, overlays, focus retention, camera reset, touch controls, and tab switching. Test at desktop, tablet and phone viewport sizes. The QA output is excluded from production. `/__qa/fallback.html` simulates a browser without WebGL to verify the accessible fallback, including the orbital occupancy diagram.

## Scientific conventions

Weights and uncertainties are retained from the saved CIAAW source, including 2024 revisions. Bracketed isotope mass numbers use the IUPAC May 2022 edition. Main-group valence counts use the outer shell; transition-metal values use formal s + d counts; detached series use the outermost shell, with lawrencium assigned 7s²7p¹. Source links and qualifications are in the Guide and profiles.

Alternative arrangements are spatial visualizations and do not redefine chemical groups or periods. Helium is enclosed in a separate pink s-block outline in Table mode. Detached f-series include all lanthanides and actinides under the existing compact-table convention.

Orbital surfaces are normalized angular polar plots based on real spherical harmonics. Radial wavefunctions and radial nodes are omitted; the node count is stated separately. Overall view uses illustrative shell spacing, not physical relative radii or a summed electron-density calculation. Color shades distinguish phase. Filling boxes illustrate Hund's rule and opposite paired spins using a real orbital basis, rather than establish a unique electron location. Arbitrary allowed occupancies are accepted; the tool does not certify ground states or infer ionic charge from electron count. OpenStax and angular-function references are linked in the tab.
