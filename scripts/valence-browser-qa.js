import { getOrbitalLab, getWorld } from '../src/main.js';
const $=selector=>document.querySelector(selector);
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
export async function checkValence(log,assert){
 const lab=getOrbitalLab(),table=getWorld();
 $('#open-orbitals').click();await lab.initializing;
 for(const [number,count] of [[8,6],[26,8],[63,2]]){
  $(`[data-element="${number}"]`).click();await frame();
  assert(lab.context.element.number===number&&$('#configuration-valence').textContent===String(count),`Example ${number}: uses the linked reference convention`);
  assert($('#announcement').textContent.includes(`${count} valence electrons`),`Example ${number}: announces updated valence`);
 }
 const submit=raw=>{$('#electron-configuration').value=raw;$('#configuration-form').requestSubmit();};
 for(const [raw,count] of [['[Ar] 3d5 4s1',1],['[Kr] 4d10',18],['1s2 2s2 2p4',6],['1s2 2s2 3s2 3p2',4]]){
  submit(raw);await frame();
  assert(lab.context===null&&$('#configuration-valence-label').textContent==='Valence estimate',`Manual ${raw}: estimate label, no inferred identity`);
  assert($('#configuration-valence').textContent===String(count)&&$('#orbital-valence-count').textContent===String(count),`Manual ${raw}: both displays update from the whole input`);
  assert($('#configuration-match').textContent.includes('Count alone does not identify'),`Manual ${raw}: electron-total match is qualified`);
  assert($('#announcement').textContent.includes(`${count} electrons in the valence estimate`),`Manual ${raw}: estimate and convention announced`);
 }
 const previous=lab.valence,display=$('#orbital-valence-summary').textContent;
 submit('2p7');
 assert(lab.valence===previous&&$('#orbital-valence-summary').textContent===display&&!$('#configuration-error').hidden,'Invalid input retains both valence displays and shows the error');
 assert($('#configuration-valence-help').textContent.includes('Configuration-only estimate'),'Custom convention and limits are explained visibly');
 assert($('.configuration-summary').getAttribute('aria-live')==='polite','Updated counts have a polite accessible announcement region');
 assert(getComputedStyle($('#configuration-valence')).fontSize.replace('px','')>=24,'Primary valence value is prominent');
 $('#configuration-valence').scrollIntoView({block:'center'});
 for(const id of ['configuration-total','configuration-valence','configuration-valence-label','configuration-valence-convention']){
  const rect=$('#'+id).getBoundingClientRect();
  assert(rect.width>0&&rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight,`${id}: readable counter is inside the viewport`);
 }
 submit('1s2 2s2 2p4');$('button[data-layout="Table"]').click();await frame();
 assert(!lab.active&&!table.paused,'Valence counter preserves return-to-Table behavior');
 log('Valence: named examples, manual and same-total excited input, qualified labels, accessible updates, invalid-input retention and responsive counter visibility verified.');
}
