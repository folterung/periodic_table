# Neutral-atom configurations

The **View electron orbitals** action uses the explicit catalogue in `src/element-configurations.js`, not a filling-order approximation. Selecting an element loads its neutral, isolated-atom ground-state reference assignment into the existing parser and Overall renderer. Manually submitting another valid configuration clears the element-specific attribution, so an arbitrary input is not described as a ground state.

## Sources and retrieval

Retrieved **7 October 2026**:

- **Z = 1–108:** [NIST Atomic Spectra Database, version 5.12](https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html), neutral spectra `H-Og I`, ground electronic shells. The returned export ends at Hs (108). The original CSV is retained in `data/nist-neutral-ground-shells.csv` for offline comparison. [Reproduce the export](https://physics.nist.gov/cgi-bin/ASD/ie.pl?spectra=H-Og%20I&units=1&format=2&order=0&at_num_out=on&sp_name_out=on&el_name_out=on&shells_out=on&conf_out=on&biblio=on).
- **Z = 109, 113–118:** the Royal Society of Chemistry's individual element fact boxes. URLs and extracted configurations are retained in `data/predicted-ground-shells.json`.
- **Z = 110–112:** Lackenby, Dzuba and Flambaum, *Theoretical calculation of atomic properties of superheavy elements Z = 110–112 and their ions* (2019), [paper](https://arxiv.org/abs/1910.01414). Its introduction and neutral-atom ground levels give 6d⁸7s², 6d⁹7s² and 6d¹⁰7s², respectively, above the filled Rn/5f¹⁴ core. These calculations take precedence over the RSC summary's 6d⁹7s¹ and 6d¹⁰7s¹ assignments for Ds and Rg. The retained prediction snapshot records both values to make that choice reviewable.

The NIST *Ground Shells* column includes the occupied core, whereas *Ground Config.* can omit closed subshells and include term labels. Only Ground Shells is converted. NIST's implicit occupancy of one is made explicit; dots become spaces; `[Cd]` and `[Hg]` are expanded using the export's own definitions. Existing noble-gas expansion handles the remaining cores.

## Interpretation and uncertainty

The UI labels Z = 1–102 **Ground-state reference configuration**. This is an evaluated reference assignment, not a claim that every orbital is experimentally imaged or that one configuration completely describes a many-electron wavefunction. NIST's brackets/parentheses around ionization energies are not treated as uncertainty markers on configurations.

Z = 103–118 is conservatively labeled **Predicted ground-state assignment** with a visible notice that experimental confirmation is limited. Lawrencium uses NIST's 7s²7p¹ assignment; its ionization-energy evidence supports a theoretical assignment rather than a simple Lu-like 6d filling. For the superheavy region, relativistic effects and configuration mixing make extrapolation from lighter elements unreliable. See the [2019 calculation](https://arxiv.org/abs/1910.01414) and [theoretical spectra of Sg, Bh, Hs and Mt](https://arxiv.org/abs/1902.06819).

The catalogue lists dominant reference assignments and explicitly labeled predictions. It does not calculate ground-state energies. Overall view retains the existing schematic angular surfaces and shell spacing; it is not a radial-density or relativistic spinor calculation. Manual inputs continue to accept allowed excited-state/ion occupancies without certifying a ground state or charge.

## Validation

`scripts/verify-element-configurations.mjs`, included by the orbital verifier, checks all 118 electron totals and full surface electron coverage, each occupied subshell's capacity, source and prediction metadata, every NIST assignment against the retained export, and the supplemental published predictions. Separate exception expectations cover Cr, Cu, Nb, Mo, Pd, Ce, Gd, Pt, Cm and Lr. Browser QA additionally exercises the real Table → profile → Orbitals → Table flow, source context, visibility reset, manual-input clearing and camera preservation.
