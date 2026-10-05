import { elements } from '../dist/elements.js';
import { colors, profileHTML, properties, valenceNote, massNote, matchElement } from './science.js';
import { OrbitalLab } from './orbital-lab.js';
const $=s=>document.querySelector(s);
let world, selected=null, originFocus, browsing=false, mode='Table', unavailable=false, orbitalActive=false;
const descriptions={Table:['01 / THE PERIODIC TABLE','118 elements. One connected world.'],Helix:['02 / THE HELIX','Follow a spiral through the elements.'],Sphere:['03 / THE SPHERE','A constellation of chemical identities.'],Grid:['04 / THE GRID','Explore every layer of the element field.']};
function announce(message){$('#announcement').textContent=message;}
const orbitalLab=new OrbitalLab(announce);
function enterOrbitals(){
 orbitalActive=true;world?.pause(true);world?.clearHover();$('#guide').close();toggleResults(false);$('#detail').hidden=true;$('#loading').hidden=true;$('#fallback').hidden=true;document.body.classList.remove('text-mode');document.body.classList.add('orbital-mode');$('#orbital-lab').hidden=false;
 for(const b of document.querySelectorAll('button[data-layout]'))b.setAttribute('aria-pressed','false');$('#open-orbitals').setAttribute('aria-pressed','true');$('.skip').href='#electron-configuration';$('.skip').textContent='Edit electron configuration';orbitalLab.open();
}
function leaveOrbitals(){
 orbitalActive=false;orbitalLab.close();document.body.classList.remove('orbital-mode');$('#orbital-lab').hidden=true;$('#open-orbitals').setAttribute('aria-pressed','false');$('.skip').href='#search';$('.skip').textContent='Find an element';$('#detail').hidden=selected===null;
 if(unavailable)fallback('WebGL is unavailable in this browser. Explore all 118 elements and their full profiles below.',true);else{world?.pause(false);world?.resize();}
}
$('#open-orbitals').onclick=enterOrbitals;$('#fallback-orbitals').onclick=enterOrbitals;
$('#electron-configuration').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('#configuration-form').requestSubmit();}});
function toggleResults(open){$('#results').hidden=!open;$('#browse').setAttribute('aria-expanded',String(open));}
for(const [name,color]of Object.entries(colors)) {
 $('#category').add(new Option(name,name));
 const b=document.createElement('button');b.style.setProperty('--color',color);b.dataset.category=name;b.setAttribute('aria-pressed','false');b.innerHTML=`<i aria-hidden="true"></i>${name}`;b.addEventListener('click',()=>{$('#category').value=$('#category').value===name?'':name;filter(true);});$('#legend').append(b);
}
for(let p=1;p<=7;p++)$('#period').add(new Option(`Period ${p}`,p));
function filter(open=false){
 const matches=elements.filter(e=>matchElement(e,$('#search').value,$('#category').value,$('#period').value));
 const active=!!($('#search').value.trim()||$('#category').value||$('#period').value);
 world?.setMatches(new Set(matches.map(e=>e.number)),active);
 $('#count').textContent=active?`${matches.length} / 118 matches`:'118 elements';$('#empty').hidden=matches.length!==0;
 $('#filter-badge').hidden=!($('#category').value||$('#period').value);
 $('#result-list').replaceChildren(...matches.map(e=>{
  const b=document.createElement('button');b.className='result';b.style.setProperty('--color',colors[e.category]);b.dataset.number=e.number;b.setAttribute('aria-label',`Locate ${e.name}, ${e.symbol}, atomic number ${e.number}`);b.setAttribute('aria-pressed',String(selected===e.number));b.innerHTML=`<span class="mini-symbol">${e.symbol}</span><span><strong>${e.name}</strong><small>${e.number} · ${e.category}</small></span><span class="locate-icon" aria-hidden="true">↗</span>`;b.addEventListener('click',()=>show(e.number));return b;
 }));
 for(const b of $('#legend').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.category===$('#category').value));
 if(open||browsing)toggleResults(true);
 return matches;
}
$('#search').addEventListener('input',()=>filter(!!$('#search').value.trim()));
$('#search').addEventListener('keydown',e=>{if(e.key==='Enter'){const matches=filter();if(matches.length===1)show(matches[0].number);else $('#result-list button')?.focus();}if(e.key==='Escape'){toggleResults(false);$('#canvas').focus();}});
for(const id of ['category','period'])$('#'+id).addEventListener('change',()=>filter(true));
$('#clear').onclick=()=>{for(const id of ['search','category','period'])$('#'+id).value='';filter();if(!browsing)toggleResults(false);};
$('#browse').onclick=()=>{browsing=$('#results').hidden;filter();toggleResults(browsing);if(browsing)$('#result-list button')?.focus();};
$('#close-results').onclick=()=>{browsing=false;toggleResults(false);$('#browse').focus();};
$('#filter-toggle').onclick=()=>{const open=$('#filter-options').classList.toggle('open');$('#filter-toggle').setAttribute('aria-expanded',String(open));};
function show(n,{focus=true}={}){
 if(orbitalActive)document.querySelector('button[data-layout="Table"]').click();
 const e=elements[n-1];if(!e)return;
 if(selected===null)originFocus=document.activeElement;
 selected=n;$('#profile').style.setProperty('--color',colors[e.category]);$('#profile').innerHTML=profileHTML(e);$('#detail').hidden=false;$('#detail').scrollTop=0;$('#return').hidden=false;
 $('#previous').disabled=n===1;$('#next').disabled=n===118;
 $('#detail').dataset.number=String(n);
 for(const b of $('#result-list').children)b.setAttribute('aria-pressed',String(Number(b.dataset.number)===n));
 browsing=false;toggleResults(false);$('#filter-options').classList.remove('open');$('#filter-toggle').setAttribute('aria-expanded','false');
 world?.select(n);announce(`${e.name}, ${e.symbol}, atomic number ${n}. Element profile opened.`);
 if(focus)$('#close-detail').focus({preventScroll:true});
}
function closeDetails(returnCamera=true){
 $('#detail').hidden=true;$('#return').hidden=true;selected=null;world?.deselect(returnCamera);
 if(originFocus?.isConnected&&originFocus.closest('#results')===null)originFocus.focus({preventScroll:true});else $('#canvas').focus({preventScroll:true});
 originFocus=null;announce('Returned to the element world.');
}
$('#close-detail').onclick=()=>closeDetails();$('#return').onclick=()=>closeDetails();
$('#previous').onclick=()=>show(selected-1);$('#next').onclick=()=>show(selected+1);
$('#overview').onclick=()=>{if(selected!==null)closeDetails(false);world?.overview();toggleResults(false);};
$('#zoom-in').onclick=()=>world?.zoom(true);$('#zoom-out').onclick=()=>world?.zoom(false);
for(const b of document.querySelectorAll('button[data-layout]'))b.onclick=()=>{
 if(orbitalActive)leaveOrbitals();
 mode=b.dataset.layout;world?.setLayout(mode);
 for(const button of document.querySelectorAll('button[data-layout]'))button.setAttribute('aria-pressed',String(button===b));
 $('#mode-label').textContent=descriptions[mode][0];$('#mode-description').textContent=descriptions[mode][1];
 $('#arrangement-note').textContent=mode==='Table'?'Outlines mark electron blocks; card colors mark element families.':'Spatial visualization · Chemical periods and groups stay defined by the Table.';
 announce(`${mode} arrangement. All 118 elements remain in the world.`);
};
$('#legend-toggle').onclick=()=>{const open=$('#legend').hidden;$('#legend').hidden=!open;$('#legend-toggle').textContent=open?'Hide legend':'Show legend';$('#legend-toggle').setAttribute('aria-expanded',String(open));world?.resize();};
$('#about').onclick=()=>$('#guide').showModal();$('#close-guide').onclick=()=>$('#guide').close();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#guide').open&&selected!==null)closeDetails();});
function fallback(reason,failed=false){
 if(orbitalActive){orbitalActive=false;orbitalLab.close();$('#orbital-lab').hidden=true;document.body.classList.remove('orbital-mode');$('#open-orbitals').setAttribute('aria-pressed','false');$('.skip').href='#search';$('.skip').textContent='Find an element';}
 unavailable=failed;world?.pause(true);$('#guide').close();$('#fallback').hidden=false;document.body.classList.add('text-mode');$('#loading').hidden=true;$('#fallback-reason').textContent=reason;$('#resume-world').hidden=failed;
 if(!$('#fallback-list').children.length){
  for(const e of elements){const card=document.createElement('article');card.className='fallback-card';card.style.setProperty('--color',colors[e.category]);card.innerHTML=`<h2>${e.number} · ${e.symbol} · ${e.name}</h2><p>${e.category}</p><dl>${properties(e).map(([label,value,note])=>`<dt>${label}</dt><dd>${value} <small>(${note})</small></dd>`).join('')}</dl><details><summary>Scientific notes</summary><p>${valenceNote(e)}</p><p>${massNote(e)}</p></details>`;$('#fallback-list').append(card);}
  const sources=document.createElement('article');sources.className='fallback-card fallback-sources';sources.innerHTML='<h2>Guide & scientific sources</h2>'+[...$('#guide').children].filter(el=>['H3','P'].includes(el.tagName)).map(el=>el.outerHTML).join('');$('#fallback-list').append(sources);
 }
 $('#fallback-title').tabIndex=-1;$('#fallback-title').focus();
}
$('#text-view').onclick=()=>fallback('All 118 elements, with the same scientific data and explanations as the 3D world.');
$('#resume-world').onclick=()=>{if(unavailable)return;document.body.classList.remove('text-mode');$('#fallback').hidden=true;world?.pause(false);world?.resize();$('#canvas').focus();};
function hover(e,x,y){
 if(!e){$('#preview').hidden=true;return;}
 const p=$('#preview');p.style.setProperty('--color',colors[e.category]);p.innerHTML=`<strong>${e.symbol} · ${e.name}</strong>${e.number} ${e.number===1?'electron':'electrons'} · Period ${e.period}<br><small>${e.category} · Click to explore</small>`;p.hidden=false;p.style.left=Math.max(8,Math.min(innerWidth-240,x+15))+'px';p.style.top=Math.max(8,Math.min(innerHeight-100,y+16))+'px';
}
function cameraHint(){$('#camera-instructions').textContent=innerWidth<=760?'1 finger to orbit · 2 fingers to pan / pinch':'Drag to orbit · Shift / right-drag to pan · Scroll to zoom';}
cameraHint();addEventListener('resize',cameraHint);
filter();
try {
 const { ElementWorld } = await import('./scene.js');
 world=new ElementWorld($('#canvas'),elements,{onPick:n=>show(n),onHover:hover,onFailure:()=>fallback('Your browser could not keep the 3D world running. All element data is available below.',true)});
 $('#loading').hidden=true;filter();
} catch(error){console.error('WebGL initialization unavailable:',error.message);fallback('WebGL is unavailable in this browser. Explore all 118 elements and their full profiles below.',true);}
// Optional standard browser tool: the same action as selecting a search result.
if(document.modelContext?.registerTool)try{document.modelContext.registerTool({name:'locate_element',description:'Locate a chemical element in the current 3D arrangement and open its profile.',inputSchema:{type:'object',properties:{atomicNumber:{type:'integer',minimum:1,maximum:118}},required:['atomicNumber'],additionalProperties:false},annotations:{readOnlyHint:false},execute:({atomicNumber})=>{if(!Number.isInteger(atomicNumber)||atomicNumber<1||atomicNumber>118)throw Error('Use an atomic number from 1 to 118.');show(atomicNumber);return elements[atomicNumber-1];}});}catch{}
export { show, closeDetails, filter };
export const getWorld=()=>world;
export const getOrbitalLab=()=>orbitalLab;
