# Valence counts in Orbitals

The counter sums occupancies from the complete parsed configuration after noble-gas expansion. It does not use visible meshes, the inspected subshell, or total electron count as a proxy for identity. Both the editor and model caption update only after valid input; errors retain the last valid count and explanation.

## Linked elements and examples

Table profiles and the named Oxygen, Iron and Europium examples retain known reference context. `src/valence.js` uses the existing Table convention, independently calculating the count from that reference configuration:

| Context | Counted occupancies |
| --- | --- |
| Main group | All occupied subshells with n equal to the element's period |
| d-block, including group 12 | ns plus (n−1)d, where n is the period; an absent subshell contributes zero |
| Detached lanthanide/actinide series | Outermost shell at the element's period, preserving the Table's limited convention |

The d-block result is explicitly called **Formal s + d**. The f-series explanation states that f/d electrons can participate in bonding too. Neither convention is a universal bond count or oxidation state. Existing predicted-assignment notices remain visible.

## Custom input

Manual configurations clear linked reference context and display **Valence estimate**. This counts every electron in the highest occupied n shell, with that n and the counted subshells explained. No identity, charge or ground state is inferred. A neutral-element electron-total match is labeled as a comparison only.

This deliberately differs from the linked d-block convention: linked Pd counts 4d¹⁰ plus empty 5s, giving 10. Custom `[Kr] 4d10` has 18 electrons in its highest occupied shell, n=4, including the expanded core's 4s²4p⁶. Its displayed 18 is an outermost-occupied-shell estimate, not a claim about palladium's bonding electrons. Chromium similarly shows linked formal 6 versus a custom outermost-shell estimate of 1. Equal totals can also have different estimates for excited configurations.

## References and checks

Checked 12 October 2026: [OpenStax Chemistry 2e §6.4](https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations) describes highest-n main-group counts, ns/(n−1)d transition counts, exceptions and broader f-series participation. Our narrower f-series count is the app's retained educational convention, explicitly qualified. [RSC's palladium fact box](https://periodic-table.rsc.org/element/46/palladium) confirms `[Kr] 4d10` and period 5. [The configuration catalogue's NIST/theory sources](electron-configurations.md) supply the existing exception and lawrencium assignments.

A fresh NIST neutral-atom export on that date matched all 108 retained NIST assignments, including Cr, Cu, Pd, Ce, Cm and Lr. The scientific records and source catalogue are unchanged.

`verify-valence.mjs` compares calculated linked counts with all 118 retained Table values, checks independent representative expectations, Pd's empty 5s, Lr's 7p, core expansion, order independence, custom inputs and equal-total excited configurations. Browser QA checks both displays, element/example/manual updates, invalid-input retention, visibility/inspection invariants, readable layouts and polite announcements.
