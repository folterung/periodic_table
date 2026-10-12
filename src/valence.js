import { superscript } from './electron-config.js';

// A linked reference uses the Table's existing convention. Custom inputs only
// establish shell occupancies; their electron total cannot establish identity.
export function configurationValence(configuration,element=null){
 const n=element?.period??Math.max(...configuration.entries.map(entry=>entry.n));
 const formal=!!element&&element.row<9&&element.group>=3&&element.group<=12;
 const counted=configuration.entries.filter(entry=>formal
  ?entry.n===n&&entry.type==='s'||entry.n===n-1&&entry.type==='d'
  :entry.n===n);
 const count=counted.reduce((sum,entry)=>sum+entry.count,0);
 const occupancy=counted.map(entry=>entry.key+superscript(entry.count)).join(' + ')||'no occupied subshells';
 const label=element?'Valence electrons':'Valence estimate';
 const convention=formal?'Formal s + d':element?`Outermost shell · n=${n}`:`Outermost occupied shell · n=${n}`;
 let explanation;
 if(!element)explanation=`Counts ${occupancy} in the highest occupied shell (n=${n}). Configuration-only estimate; identity, charge and bonding participation are not established. This can differ from a transition metal's formal s + d count.`;
 else if(formal)explanation=`Counts ${n}s + ${n-1}d (${occupancy}), using the Table's formal convention. An unoccupied subshell contributes zero. This is not a bond count or oxidation state.`;
 else if(element.row>=9)explanation=`Counts ${occupancy} in shell n=${n}, using the Table's outermost-shell convention. The f and d electrons can also participate in bonding; this is not a universal bonding-electron count.`;
 else explanation=`Counts ${occupancy} in shell n=${n}, using the Table's outermost-shell convention.${element.number>112?' This is an expected configuration; superheavy chemistry is not fully established.':''}`;
 return{count,label,convention,explanation,n,formal,keys:counted.map(entry=>entry.key),announcement:`${count} ${element?'valence electrons':'electrons in the valence estimate'}; ${convention.toLowerCase()}.`};
}
