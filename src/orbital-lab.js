import { parseConfiguration, angularOrbitals, subshells, superscript } from './electron-config.js';
import { elements } from '../dist/elements.js';
const $=selector=>document.querySelector(selector);
export class OrbitalLab {
 constructor(announce){
  this.announce=announce;this.active=false;this.world=null;this.index=0;
  $('#configuration-form').addEventListener('submit',e=>{e.preventDefault();if(this.update()&&innerWidth<=760)$('#orbital-stage').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});
  for(const button of document.querySelectorAll('[data-configuration]'))button.onclick=()=>{$('#electron-configuration').value=button.dataset.configuration;this.update();};
  $('#orbital-overlay').onchange=()=>this.draw();
  $('#orbital-reset').onclick=()=>this.world?.reset();$('#orbital-zoom-in').onclick=()=>this.world?.zoom(true);$('#orbital-zoom-out').onclick=()=>this.world?.zoom(false);
  this.update();
 }
 update(){
  let configuration;try{configuration=parseConfiguration($('#electron-configuration').value);}catch(error){$('#configuration-error').textContent=error.message+' Showing the last valid configuration.';$('#configuration-error').hidden=false;$('#electron-configuration').setAttribute('aria-invalid','true');return false;}
  this.configuration=configuration;this.entry=configuration.entries.find(e=>e.key===configuration.lastKey);this.index=0;
  $('#configuration-error').hidden=true;$('#electron-configuration').removeAttribute('aria-invalid');
  $('#configuration-normalized').textContent=configuration.normalized;
  $('#configuration-total').textContent=configuration.total;
  $('#configuration-unpaired').textContent=configuration.unpaired;
  const match=elements[configuration.total-1];$('#configuration-match').textContent=match?`Neutral atom with ${configuration.total} electrons: ${match.name} (${match.symbol}).`:'No neutral element in this table has this electron count.';
  $('#configuration-shells').textContent=configuration.shells.map(s=>`n=${s.n}: ${s.count}`).join(' · ');
  $('#orbital-lab').dataset.electrons=String(configuration.total);
  $('#subshell-list').replaceChildren(...configuration.entries.map(entry=>{const button=document.createElement('button');button.type='button';button.dataset.subshell=entry.key;button.style.setProperty('--subshell-color',subshells[entry.type].color);button.textContent=entry.key+superscript(entry.count);button.setAttribute('aria-label',`View ${entry.key}, ${entry.count} electrons`);button.onclick=()=>{this.entry=entry;this.index=0;this.draw();};return button;}));
  this.draw();this.announce(`Configuration updated: ${configuration.total} electrons, ${configuration.unpaired} unpaired in the filling model.`);return true;
 }
 draw(){
  const entry=this.entry;if(!entry)return;const focused=document.activeElement?.closest('#orbital-diagram .orbital-box'),focusedIndex=focused?.dataset.orbital;
  for(const button of $('#subshell-list').children)button.setAttribute('aria-pressed',String(button.dataset.subshell===entry.key));
  $('#orbital-lab').style.setProperty('--subshell-color',subshells[entry.type].color);
  $('#orbital-current').textContent=entry.key+superscript(entry.count);$('#orbital-subtitle').textContent=`${entry.count} of ${entry.capacity} electrons · ${entry.occupancy.length} ${entry.occupancy.length===1?'orbital':'orbitals'}`;
  $('#orbital-diagram').replaceChildren(...angularOrbitals[entry.type].map((orbital,index)=>{const button=document.createElement('button');button.type='button';button.className='orbital-box';button.dataset.orbital=String(index);button.dataset.occupancy=String(entry.occupancy[index]);button.setAttribute('aria-pressed',String(index===this.index));button.setAttribute('aria-label',`${entry.n}${orbital.label}, ${entry.occupancy[index]} ${entry.occupancy[index]===1?'electron':'electrons'}${entry.occupancy[index]===2?', opposite spins':entry.occupancy[index]===1?', spin up':', empty'}`);const arrows=document.createElement('strong');arrows.textContent=['—','↑','↑↓'][entry.occupancy[index]];const label=document.createElement('span');label.textContent=orbital.label;button.append(arrows,label);button.onclick=()=>{this.index=index;this.draw();};return button;}));
  if(focusedIndex!==undefined)$('#orbital-diagram').children[Number(focusedIndex)]?.focus({preventScroll:true});
  const orbital=angularOrbitals[entry.type][this.index];$('#orbital-shape-name').textContent=entry.n+orbital.label;$('#orbital-occupancy').textContent=`${entry.occupancy[this.index]} ${entry.occupancy[this.index]===1?'electron':'electrons'} in the selected orbital`;
  $('#orbital-nodes').textContent=`n = ${entry.n} · ℓ = ${entry.l} · ${entry.n-entry.l-1} radial ${entry.n-entry.l-1===1?'node':'nodes'} (not drawn)`;
  this.world?.setOrbital(entry,this.index,$('#orbital-overlay').checked);
 }
 async open(){
  this.active=true;
  if(!this.initializing)this.initializing=(async()=>{try{const { OrbitalWorld }=await import('./orbital-scene.js');this.world=new OrbitalWorld($('#orbital-canvas'),()=>this.unavailable());$('#orbital-lab').dataset.renderer='webgl';$('#orbital-unavailable').hidden=true;this.draw();}catch{this.unavailable();}})();
  await this.initializing;this.world?.pause(!this.active);if(this.active)$('#electron-configuration').focus({preventScroll:true});
 }
 unavailable(){
  $('#orbital-unavailable').hidden=false;$('#orbital-lab').dataset.renderer='unavailable';
  for(const id of ['orbital-reset','orbital-zoom-in','orbital-zoom-out'])$('#'+id).disabled=true;
 }
 close(){this.active=false;this.world?.pause(true);}
}
