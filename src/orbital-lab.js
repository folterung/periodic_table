import { parseConfiguration, angularOrbitals, subshells, superscript } from './electron-config.js';
import { elements } from '../dist/elements.js';
import { elementConfiguration, configurationSources } from './element-configurations.js';
const $=selector=>document.querySelector(selector);
export class OrbitalLab {
 constructor(announce){
  this.announce=announce;this.active=false;this.world=null;this.index=0;this.view='overall';this.hiddenLayers=new Set();
  $('#configuration-form').addEventListener('submit',e=>{e.preventDefault();if(this.update()&&innerWidth<=760)$('#orbital-stage').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
  for(const button of document.querySelectorAll('[data-configuration]'))button.onclick=()=>{$('#electron-configuration').value=button.dataset.configuration;this.update();};
  $('#orbital-overlay').onchange=()=>this.draw();
  $('#orbital-overall').onclick=()=>{this.view='overall';this.draw();};$('#orbital-subshell').onclick=()=>{this.view='subshell';this.draw();};$('#orbital-show-all').onclick=()=>{this.hiddenLayers.clear();this.draw();};
  $('#orbital-reset').onclick=()=>this.world?.reset();$('#orbital-zoom-in').onclick=()=>this.world?.zoom(true);$('#orbital-zoom-out').onclick=()=>this.world?.zoom(false);
  this.update();
 }
 loadElement(element){
  const reference=elementConfiguration(element.number);
  $('#electron-configuration').value=reference.configuration;
  this.update({element,reference});
 }
 update(context=null){
  let configuration;try{configuration=parseConfiguration($('#electron-configuration').value);}catch(error){$('#configuration-error').textContent=error.message+' Showing the last valid configuration.';$('#configuration-error').hidden=false;$('#electron-configuration').setAttribute('aria-invalid','true');return false;}
  this.configuration=configuration;this.entry=configuration.entries.find(e=>e.key===configuration.lastKey);this.index=0;this.view='overall';this.hiddenLayers.clear();
  this.context=context;
  $('#orbital-element').hidden=!context;
  $('#configuration-reference').hidden=!context;
  if(context){
   const {element,reference}=context,source=configurationSources[reference.source];
   $('#orbital-element').textContent=`${element.name} (${element.symbol})`;
   $('#configuration-reference-label').textContent=reference.predicted?'Predicted ground-state assignment':'Ground-state reference configuration';
   $('#configuration-reference-note').textContent=reference.predicted?'Theoretical assignment; experimental confirmation is limited. The surfaces remain a schematic orbital model.':'Neutral, isolated atom. This reference assignment describes the dominant configuration.';
   $('#configuration-source').textContent=source.name;
   $('#configuration-source').href=reference.source==='rsc'?`https://periodic-table.rsc.org/element/${element.number}/${element.name.toLowerCase()}`:source.url;
  }
  $('#configuration-error').hidden=true;$('#electron-configuration').removeAttribute('aria-invalid');
  $('#configuration-normalized').textContent=configuration.normalized;
  $('#configuration-total').textContent=configuration.total;
  $('#configuration-unpaired').textContent=configuration.unpaired;
  const match=elements[configuration.total-1];$('#configuration-match').textContent=match?`Neutral atom with ${configuration.total} electrons: ${match.name} (${match.symbol}).`:'No neutral element in this table has this electron count.';
  $('#configuration-shells').textContent=configuration.shells.map(s=>`n=${s.n}: ${s.count}`).join(' · ');
  $('#orbital-lab').dataset.electrons=String(configuration.total);
  $('#subshell-list').replaceChildren(...configuration.entries.map(entry=>{const button=document.createElement('button');button.type='button';button.dataset.subshell=entry.key;button.style.setProperty('--subshell-color',subshells[entry.type].color);button.textContent=entry.key+superscript(entry.count);button.setAttribute('aria-label',`View ${entry.key}, ${entry.count} electrons`);button.onclick=()=>{this.entry=entry;this.index=0;this.view='subshell';this.draw();};return button;}));
  this.draw();this.world?.reset();this.announce(`Overall configuration updated: ${configuration.total} electrons, ${configuration.unpaired} unpaired in the filling model.`);return true;
 }
 draw(){
  const entry=this.entry;if(!entry)return;const focused=document.activeElement?.closest('#orbital-diagram .orbital-box'),focusedIndex=focused?.dataset.orbital;
  const overall=this.view==='overall';$('#orbital-lab').dataset.view=this.view;$('#orbital-overall').setAttribute('aria-pressed',String(overall));$('#orbital-subshell').setAttribute('aria-pressed',String(!overall));$('#orbital-overlay-label').hidden=overall;$('#orbital-show-all').hidden=!overall||!this.hiddenLayers.size;$('#orbital-view-label').textContent=(this.context?.reference.predicted?'PREDICTED · ':'')+(overall?'FULL CONFIGURATION':'SUBSHELL VIEW');
  for(const button of $('#subshell-list').children)button.setAttribute('aria-pressed',String(!overall&&button.dataset.subshell===entry.key));
  if(overall){this.drawOverall();return;}
  $('#orbital-lab').style.setProperty('--subshell-color',subshells[entry.type].color);
  $('#orbital-diagram-title').textContent='Orbital occupancy';$('#orbital-diagram').classList.remove('overall-diagram');$('#orbital-diagram-help').textContent='Choose a box to inspect its shape. ↑ and ↓ represent opposite electron spins.';
  $('#orbital-current').textContent=entry.key+superscript(entry.count);$('#orbital-subtitle').textContent=`${entry.count} of ${entry.capacity} electrons · ${entry.occupancy.length} ${entry.occupancy.length===1?'orbital':'orbitals'}`;
  $('#orbital-diagram').replaceChildren(...angularOrbitals[entry.type].map((orbital,index)=>{const button=document.createElement('button');button.type='button';button.className='orbital-box';button.dataset.orbital=String(index);button.dataset.occupancy=String(entry.occupancy[index]);button.setAttribute('aria-pressed',String(index===this.index));button.setAttribute('aria-label',`${entry.n}${orbital.label}, ${entry.occupancy[index]} ${entry.occupancy[index]===1?'electron':'electrons'}${entry.occupancy[index]===2?', opposite spins':entry.occupancy[index]===1?', spin up':', empty'}`);const arrows=document.createElement('strong');arrows.textContent=['—','↑','↑↓'][entry.occupancy[index]];const label=document.createElement('span');label.textContent=orbital.label;button.append(arrows,label);button.onclick=()=>{this.index=index;this.draw();};return button;}));
  if(focusedIndex!==undefined)$('#orbital-diagram').children[Number(focusedIndex)]?.focus({preventScroll:true});
  const orbital=angularOrbitals[entry.type][this.index];$('#orbital-shape-name').textContent=entry.n+orbital.label;$('#orbital-occupancy').textContent=`${entry.occupancy[this.index]} ${entry.occupancy[this.index]===1?'electron':'electrons'} in the selected orbital`;
  $('#orbital-nodes').textContent=`n = ${entry.n} · ℓ = ${entry.l} · ${entry.n-entry.l-1} radial ${entry.n-entry.l-1===1?'node':'nodes'} (not drawn)`;
  this.world?.setOrbital(entry,this.index,$('#orbital-overlay').checked);
 }
 drawOverall(){
  const configuration=this.configuration,shown=configuration.entries.filter(entry=>!this.hiddenLayers.has(entry.key)),visibleElectrons=shown.reduce((sum,entry)=>sum+entry.count,0),orbitals=shown.reduce((sum,entry)=>sum+entry.occupancy.filter(count=>count>0).length,0),focusedKey=document.activeElement?.closest('[data-layer]')?.dataset.layer;
  $('#orbital-lab').style.setProperty('--subshell-color','#75dfc1');$('#orbital-current').textContent='Overall view';$('#orbital-subtitle').textContent=`${configuration.total} electrons · ${configuration.entries.length} occupied subshells`;
  $('#orbital-shape-name').textContent=`${visibleElectrons} of ${configuration.total} electrons shown`;$('#orbital-occupancy').textContent=`${orbitals} occupied orbitals · ${shown.length} visible subshells`;$('#orbital-nodes').textContent='Shell spacing is schematic; radial nodes are not drawn.';
  $('#orbital-diagram-title').textContent='Visible subshells';$('#orbital-diagram-help').textContent='Toggle layers to see inside. Click a 3D shape or choose a subshell to inspect its orbitals.';$('#orbital-diagram').classList.add('overall-diagram');
  $('#orbital-diagram').replaceChildren(...configuration.entries.map(entry=>{const visible=!this.hiddenLayers.has(entry.key),button=document.createElement('button');button.type='button';button.className='configuration-layer';button.dataset.layer=entry.key;button.style.setProperty('--layer-color',subshells[entry.type].color);button.setAttribute('aria-pressed',String(visible));button.setAttribute('aria-label',`${visible?'Hide':'Show'} ${entry.key}, ${entry.count} electrons in overall view`);const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');const label=document.createElement('strong');label.textContent=entry.key+superscript(entry.count);button.append(dot,label);button.onclick=()=>{if(this.hiddenLayers.has(entry.key))this.hiddenLayers.delete(entry.key);else this.hiddenLayers.add(entry.key);this.draw();};return button;}));
  if(focusedKey)$('#orbital-diagram').querySelector(`[data-layer="${focusedKey}"]`)?.focus({preventScroll:true});
  this.world?.setConfiguration(configuration,this.hiddenLayers);
 }
 async open(focus='input'){
  this.active=true;
  if(!this.initializing)this.initializing=(async()=>{try{const { OrbitalWorld }=await import('./orbital-scene.js');this.world=new OrbitalWorld($('#orbital-canvas'),()=>this.unavailable(),(key,index)=>{this.entry=this.configuration.entries.find(entry=>entry.key===key);this.index=index;this.view='subshell';this.draw();});$('#orbital-lab').dataset.renderer='webgl';$('#orbital-unavailable').hidden=true;this.draw();}catch{this.unavailable();}})();
  await this.initializing;this.world?.pause(!this.active);if(this.active){
   if(focus==='viewer'){
    $('#orbital-current').focus({preventScroll:true});
    if(innerWidth<=760)$('#orbital-viewer').scrollIntoView({block:'start'});
    if(this.context)this.announce(`${this.context.element.name} (${this.context.element.symbol}). ${this.context.reference.predicted?'Predicted ground-state assignment. ':''}Overall view, ${this.configuration.total} electrons. All occupied subshells shown.`);
   }else $('#electron-configuration').focus({preventScroll:true});
  }
 }
 unavailable(){
  $('#orbital-unavailable').hidden=false;$('#orbital-lab').dataset.renderer='unavailable';
  for(const id of ['orbital-reset','orbital-zoom-in','orbital-zoom-out'])$('#'+id).disabled=true;
 }
 close(){this.active=false;this.world?.pause(true);}
}
