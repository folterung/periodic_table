# Element Atlas presentation review

Baseline: commit `44972c176e00baf01bb333c909f158ed8eda6288`.

## Desktop — 1280 × 720

| Before | After |
| --- | --- |
| ![Original desktop table](cards-before-desktop.png) | ![Updated desktop table](cards-after-desktop.png) |

## Phone — 390 × 844

| Before | After |
| --- | --- |
| ![Original phone table](cards-before-phone.png) | ![Updated phone table](cards-after-phone.png) |

## Card information layout

Silicon shows the retained mass, central symbol, atomic number below the symbol, and name at the bottom. The scientific profile remains interactive.

![Updated Silicon card and profile](cards-after-silicon.png)

## Other 3D arrangements

- [Helix](cards-after-helix.png)
- [Sphere](cards-after-sphere.png)
- [Grid](cards-after-grid.png)

The same front/back artwork is shared by all four arrangements. The full browser suite passed on desktop, tablet, phone, and a narrower 320 px phone viewport; see [verification](../../VERIFICATION.md).

## Element profile → Orbitals — 7 October 2026

The mint action opens the selected element's reference configuration in the existing Overall view. The imported identity and source stay visible during subshell inspection; valid manual edits clear that attribution. Table navigation restores the selected profile and camera.

| Profile action | Overall orbital view |
| --- | --- |
| ![Chromium profile with the orbital action](profile-orbitals-button-desktop.png) | ![Chromium overall configuration](profile-orbitals-overall-desktop.png) |

Phone previews show the accessible action and the prediction notice beside the model:

| Phone profile | Phone orbital view |
| --- | --- |
| ![Lawrencium profile action](profile-orbitals-button-phone.png) | ![Lawrencium predicted overall configuration](profile-orbitals-overall-phone.png) |

See [source documentation](../electron-configurations.md) and [verification](../../VERIFICATION.md). Screenshots are outside the published `dist/` directory.

## Orbital valence counter — 12 October 2026

The mint count appears beside total electrons in the editor and beside the orbital model. Linked Palladium uses the Table's formal s + d convention: 10 valence electrons from 4d¹⁰ and empty 5s. The custom-input preview shows the separately labeled highest-occupied-shell estimate and its explanation.

![Desktop Palladium valence counter](orbital-valence-desktop.png)

| Phone orbital model | Custom configuration explanation |
| --- | --- |
| ![Palladium model and valence counter](orbital-valence-phone.png) | ![Custom configuration estimate and limits](orbital-valence-custom-phone.png) |

Full browser QA reports: [desktop](orbital-valence-qa-desktop.txt), [tablet](orbital-valence-qa-tablet.txt), [phone](orbital-valence-qa-phone.txt), and [320 px phone](orbital-valence-qa-narrow.txt). Every suite passed with zero failures. See [calculation and references](../orbital-valence.md) and [verification](../../VERIFICATION.md).
