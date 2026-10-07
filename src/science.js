export const colors = { 'Alkali metal':'#f6ac92', 'Alkaline earth metal':'#edcf82', 'Transition metal':'#93baf8', 'Post-transition metal':'#aacce0', 'Metalloid':'#9be1a3', 'Other nonmetal':'#75dfc1', 'Halogen':'#c2aff9', 'Noble gas':'#eda8d3', 'Lanthanide':'#7ed3e3', 'Actinide':'#deb3ed' };
export function valenceNote(e) {
 if (e.row >= 9) return `Outermost-shell convention: ${e.valence} electrons (${e.number === 103 ? '7s²7p¹' : e.period+'s²'}). The f and d electrons may also take part in bonding, so this is not a universal bonding-electron count.`;
 if (e.group >= 3 && e.group <= 12) return `Formal s + d convention: ${e.valence} electrons. This includes the outer s and preceding d subshells, not just the outermost shell. The number involved in bonding varies by compound; this is not an oxidation state.`;
 return `Outermost-shell convention: ${e.valence} ${e.valence===1?'electron':'electrons'}.${e.number > 112 ? ' This count follows the expected main-group configuration; superheavy chemistry is not fully established.' : ''}`;
}
export function massNote(e) { return e.mass.startsWith('[') ? 'Square brackets give protons + neutrons for a selected isotope (IUPAC 2022). This element has no standard atomic weight. The number is not an exact mass in u.' : 'The atomic mass shown is an average for normal terrestrial materials, based on CIAAW’s abridged standard atomic weight. Different isotopes and samples can have different masses.'; }
export function properties(e) {
 const isotope = e.mass.startsWith('[');
 return [
  ['Atomic number', e.number, 'Protons in the nucleus', 'number'],
  [isotope ? 'Atomic mass / isotope' : 'Atomic mass', e.mass+(isotope?'':' u'), isotope?'Isotope mass number':`Uncertainty: ± ${e.uncertainty} u`, 'mass'],
  ['Period',e.period,'Horizontal row of the table','period'],
  ['Electrons',e.number,'Neutral atom: equals atomic number','electrons'],
  ['Valence electrons',e.valence,e.row >= 9?'Outermost shell':e.group>=3&&e.group<=12?'Formal s + d count':'Outermost shell','valence'],
  ['Chemical symbol',e.symbol,'The element’s shorthand','symbol']
 ];
}
export function profileHTML(e) {
 return `<div class="identity"><div class="big-symbol"><span>${e.number}</span><strong>${e.symbol}</strong></div><div><h2 id="element-name">${e.name}</h2><p data-field="category">${e.category}</p></div></div><button id="view-element-orbitals" type="button" aria-label="View electron orbitals for ${e.name}" aria-controls="orbital-lab">View electron orbitals <span aria-hidden="true">↗</span></button><dl class="properties">${properties(e).map(([label,value,note,key])=>`<div class="property"><dt>${label}</dt><dd data-field="${key}">${value}</dd><small>${note}</small></div>`).join('')}</dl><p class="note">${valenceNote(e)}</p><p class="note">${massNote(e)}</p><a class="source-link" target="_blank" rel="noreferrer" href="https://periodic-table.rsc.org/element/${e.number}/${e.name.toLowerCase()}">Explore ${e.name} at the Royal Society of Chemistry ↗</a>`;
}
export function matchElement(e, query, category, period) {
 const q=query.trim().toLowerCase(), aliases={13:'aluminum',55:'cesium',16:'sulphur'};
 return (!q||e.name.toLowerCase().includes(q)||e.symbol.toLowerCase()===q||String(e.number)===q||!!aliases[e.number]?.includes(q)) && (!category||e.category===category) && (!period||e.period===Number(period));
}
