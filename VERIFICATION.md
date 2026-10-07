# WebGL rebuild verification — 30 September 2026

The isolated browser suite passed in the Codex in-app browser at 1280 × 720 (desktop), 834 × 1194 (tablet), 390 × 844 (phone), and 844 × 390 (phone landscape). The landscape canvas and page fit the viewport without overflow.

Each viewport verified:

- All 118 persistent WebGL card objects in each of Table, Helix, Sphere, and Grid; 118/118 focused raycast picks per layout (472 per viewport, 1,888 total).
- Every profile's name, category, atomic number, mass, period, neutral electron count, valence count, and symbol against the retained scientific records.
- Real rendered triangles without WebGL errors, fitted overviews, live position and orientation transitions, and rapid switching from current positions.
- Search by name, symbol and atomic number; combined family/period filtering; dimmed nonmatches; empty results and clearing.
- Selection persistence across arrangements, hover highlight and preview, clearing previews when the pointer leaves the scene, and returning to the saved camera view.
- Keyboard orbit, pan, zoom and overview; reduced-motion preference handling.
- One-finger rotation, two-finger pan and pinch, and mouse drag-versus-click through the actual pointer event handlers. Touch inputs were synthesized in the isolated browser page; physical phone hardware was not used.
- Accessible element view containing all 118 profiles and successful return to the WebGL scene.

The no-WebGL test page confirmed automatic fallback with all 118 profiles and all four scientific source links. Direct browser selection of a rendered Hydrogen card opened its correct profile.

Live production checks verified all four arrangement controls, direct dragging through the Grid, selection of Antimony and its scientific fields, and preservation of that selection when changing to Sphere. Direct local browser picks also verified Iron in Helix and Niobium in Sphere.

`pnpm verify` passed: all 118 scientific records are unchanged from source commit `10eda2f30f04270aaf003633ab4a41f4ed35e4f2`, layout positions and orientations are finite and unique, Sphere and Grid have the required geometry, every card corner is inside its proper Table outline, unrelated cards are outside those outlines, and source qualifications/search/filter semantics are retained.

The reference video was reviewed before the rebuild: independent floating cards, Table/Helix/Sphere/Grid controls, formations through space and direct camera exploration informed this implementation.

Production output is self-contained in `dist/`; it has no runtime CDN dependency, CSS camera sliders, or CSS-transformed board. Test output stays in `.qa-runtime/` and is excluded from publication.

On 1 October 2026, the desktop browser suite passed after staging outgoing Table transitions: a 300 ms fade hides all block outlines and titles before any card position, card orientation, or automatic camera motion changes. Interrupted fades retain their current opacity, spatial-layout switches add no delay, and reduced-motion changes still finish immediately. All 472 layout/card picks and existing interaction checks passed.

The block borders were then refined into single continuous extruded strokes with matching inner/outer circular corners. Geometry checks confirm that the rounded strokes clear every element card and neighboring s/d, d/p, and helium/p borders do not overlap. Desktop and phone previews were inspected, and the desktop interaction suite passed with the prior fade timing preserved.

On 5 October 2026, an Orbitals tab was added. The expanded suite passed at 1280 × 720 and 390 × 844, retaining all 472 table/card picks at each viewport and all existing outline, filter, profile, camera, and fallback checks. It verified ordinary digits, Unicode superscripts, noble-gas shorthand, capacity and quantum-number errors, all 16 rendered angular shapes without WebGL errors, subshell/orbital selection, occupied-orbital overlays, keyboard focus retention, camera reset, synthetic touch rotation/pan/pinch, persistent configuration, and returning to Table from element selection. Physical touch hardware was not used.

The local product was visually inspected at desktop, phone portrait, 834 × 1194 tablet, and 844 × 390 landscape sizes. Narrow screens stack the editor and viewer; short landscape screens allow vertical page scrolling so the orbital diagram stays reachable. The no-WebGL page retained typed configuration parsing, electron totals and the occupancy diagram, and returned to the full 118-element fallback successfully.

`pnpm verify` additionally passed seven noble-gas cores, all subshell occupancies, invalid and duplicate configurations, and finite geometry/normals/phase groups for all 16 s/p/d/f surfaces. The model's omission of radial functions and radial nodes, illustrative filling convention, and electron-count qualifications are visible in the tab.

The Orbitals tab now defaults to Overall view, combining every occupied orbital at a shared nucleus, with illustrative shell spacing. Desktop (1280 × 720) and phone (390 × 844) browser suites passed complete electron/subshell coverage through [Og], layer hiding and restoring (including the empty-visible state), retained layer choices and keyboard focus, direct raycast selection into detailed orbital views, drag-versus-click behavior, and camera fitting/reset. All previous table and subshell checks passed. Desktop and phone previews were inspected, and the no-WebGL page retained overall totals/layer controls and the detailed electron-filling diagram.

## Element cards and header refinement — 5 October 2026

The shared card texture now places the retained mass at the top-left, the symbol centrally, the atomic number below the symbol, and the full name at the bottom. Both faces use the same artwork in every arrangement. Card geometry increased from 140 × 124 to 164 × 148; Table spacing, Grid spacing, and overview framing were adjusted together. The original data and its scientific qualifications are unchanged.

All 18 group and seven period labels use high-contrast, camera-facing numerals. Their projected size is maintained during camera navigation; group labels sit above their first occupied row. The header shows 118 at the top-left of the E tile and a mint italic “By Rhesa Warnock” beneath the title/tagline, including on phones.

`node scripts/build.mjs`, `node scripts/verify.mjs`, and `node scripts/verify-orbitals.mjs` passed. The full browser suite passed at 1280 × 720, 834 × 1194, 390 × 844, and 320 × 740. Each viewport passed all 472 focused element picks, all profile fields, animation/fade continuity, searches and filters, mouse/keyboard/synthetic-touch camera controls, accessible-view return, and both Overall and Subshell orbital views. The added raster-ink checks confirmed all 25 numbers are readable, within the viewport, and separated from cards and neighboring numerals. Physical touch hardware was not used.

Desktop Table, Helix, Sphere and Grid previews, focused Silicon, tablet and phone layouts were visually inspected. A header/navigation overlap at 320 px was corrected and rechecked. [Review screenshots](docs/review/README.md) include the baseline and updated desktop/phone tables and the new card composition. The screenshots and test artifacts are outside the production `dist/` directory.

## Element profile → Orbitals — 7 October 2026

Each element profile now has a mint **View electron orbitals** action. It opens the existing Orbitals tab in Overall view, loads a sourced neutral configuration, restores every occupied layer, and displays the selected name, symbol, source and applicable prediction notice. Valid manual configurations clear imported identity/source attribution; invalid edits retain the last valid model and its attribution. Existing orbital inspection and camera controls remain available.

All three required commands passed: `node scripts/build.mjs`, `node scripts/verify.mjs`, and `node scripts/verify-orbitals.mjs`. The new configuration verifier checks all 118 electron totals, subshell capacities, complete surface coverage, source metadata, every retained NIST assignment, the supplemental published predictions and independent ground-state exception expectations. The existing element records remain unchanged. [Sources and uncertainty policy](docs/electron-configurations.md) document the catalogue and theoretical assignments.

The full browser suite passed at 1440 × 1000, 1024 × 768, 390 × 844 and 320 × 700. Each run retained all 472 focused element picks and existing table/orbital checks. New profile-to-orbitals tests selected H, O, Fe, Cr, Cu, Ce, Cm, Lr, Ds, Rg and Og through canvas pointer/raycast handlers, activated the profile action, verified the rendered electron coverage, restored layers, cleared stale input errors, checked source/prediction context and heading focus, then returned to the selected Table profile. Camera position, pan target and the saved overview were unchanged after resize observation. A normal-motion rotated, panned and zoomed camera also survived the round trip. Invalid and valid manual edits and subshell inspection were checked. Touch events were synthesized; physical phone hardware was not used.

Direct browser keyboard checks confirmed Search Enter → profile → Tab → orbital action → Enter → focused Overall heading. Search now prevents the Enter key's default action from immediately activating the newly focused Close button. Desktop and phone production previews were visually inspected; the phone's sticky navigation keeps Table reachable after scrolling to the model. [Review screenshots](docs/review/README.md) show the action and orbital identity/prediction context.
