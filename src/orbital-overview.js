// Shell spacing is an illustrative layout, not a physical radial wavefunction.
export function configurationSurfaces(configuration,hidden=new Set()){
 const outerShell=Math.max(...configuration.entries.map(entry=>entry.n));
 return configuration.entries.flatMap(entry=>hidden.has(entry.key)?[]:entry.occupancy.flatMap((occupancy,index)=>occupancy?[{key:entry.key,n:entry.n,type:entry.type,index,occupancy,radius:.3+2.15*entry.n/outerShell}]:[]));
}
