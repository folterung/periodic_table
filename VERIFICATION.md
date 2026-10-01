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
