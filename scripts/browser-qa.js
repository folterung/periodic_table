import { getWorld, show, closeDetails, filter } from '../src/main.js';
import { elements } from '../dist/elements.js';
import { properties } from '../src/science.js';
import { checkOrbitals } from './orbital-browser-qa.js';
const out=document.createElement('pre');out.id='qa-results';Object.assign(out.style,{position:'fixed',left:'12px',bottom:'12px',maxHeight:'160px',overflow:'auto',zIndex:9999,background:'#021016f5',border:'1px solid #75dfc1',color:'#caffed',padding:'14px',fontSize:'11px',maxWidth:'95vw'});document.body.append(out);
const logs=[],failures=[];function log(s){logs.push(s);out.textContent=logs.join('\n');out.scrollTop=out.scrollHeight;}
function assert(check,message){if(!check){failures.push(message);log('FAIL: '+message);}}
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
async function settled(world){let start=performance.now();while(world.morph||world.cameraMove){await frame();if(performance.now()-start>6000)throw Error('Animation did not settle');}}
const button=mode=>document.querySelector(`button[data-layout="${mode}"]`);
const world=getWorld();
try{
 if(!world)throw Error('WebGL failed to initialize');
 log(`Renderer: WebGL2; ${world.cards.length} independent cards. Viewport ${innerWidth} × ${innerHeight}.`);
 const identities=world.cards.map(c=>c.object);
 const origin=world.cards[0].object.position.clone(),tablePoses=world.cards.map(c=>({position:c.object.position.clone(),quaternion:c.object.quaternion.clone()})),tableCamera=world.camera.position.clone();
 button('Helix').click();assert(!!world.morph&&world.morph.delay===300,'Leaving Table starts with a 300 ms outline fade');
 let fadeStart=world.morph.start,fadeDelay=world.morph.delay;
 world.render(fadeStart+fadeDelay/2);
 assert(world.blockOpacity>0&&world.blockOpacity<1&&world.blocks.visible,'Outlines visibly fade before movement');
 assert(world.cards.every((c,i)=>c.object.position.distanceTo(tablePoses[i].position)<1e-9&&c.object.quaternion.angleTo(tablePoses[i].quaternion)<1e-9),'All 118 card positions and orientations stay still during the fade');
 assert(world.camera.position.distanceTo(tableCamera)<1e-9,'Automatic camera movement waits for the outline fade');
 // Interrupting the fade must retain its current opacity and stationary cards.
 const partialOpacity=world.blockOpacity;button('Sphere').click();
 assert(world.blockOpacity===partialOpacity&&world.morph.delay===300*partialOpacity,'Rapid switching resumes the remaining fade without an opacity jump');
 fadeStart=world.morph.start;fadeDelay=world.morph.delay;world.render(fadeStart+fadeDelay);
 assert(!world.blocks.visible&&world.blockOpacity===0,'Outlines are fully hidden before the first movement');
 assert(world.cards.every((c,i)=>c.object.position.distanceTo(tablePoses[i].position)<1e-9),'Cards remain in Table at the fade boundary');
 world.render(fadeStart+fadeDelay+250);
 assert(world.cards[0].object.position.distanceTo(origin)>1,'Cards move during a transition');
 assert(world.cards.some(c=>c.object.quaternion.angleTo(world.layouts.Table[c.element.number-1].quaternion)>.01),'Orientations change during a transition');
 assert(!world.blocks.visible,'Outlines remain hidden throughout the shape change');
 const midway=world.cards.map(c=>c.object.position.clone());button('Helix').click();assert(world.morph.delay===0,'Changing between spatial layouts adds no fade delay');assert(world.cards.every((c,i)=>c.object.position.distanceTo(midway[i])<1e-9),'Rapid switching begins from current positions');
 for(const mode of ['Grid','Table','Sphere','Helix','Grid'])button(mode).click();await settled(world);assert(world.mode==='Grid'&&!world.morph,'Rapid switches settle to final arrangement');
 log('Outline fade completes before card/camera movement; interrupted fades, animated morphs and rapid switching verified.');
 // Exercise the actual system-preference change listener; finish ongoing motion.
 world.motion.dispatchEvent(new MediaQueryListEvent('change',{matches:true,media:world.motion.media}));assert(world.reduced&&!world.controls.enableDamping,'Reduced motion disables tweening and inertia');
 const realBloom=world.bloom.enabled;world.bloom.enabled=false;
 for(const mode of ['Table','Helix','Sphere','Grid']){
  button(mode).click();assert(!world.morph&&!world.cameraMove,'Reduced-motion layout changes finish immediately');
  world.render(performance.now());assert(world.renderer.info.render.triangles>100,'WebGL draws scene triangles');assert(world.renderer.getContext().getError()===0,'WebGL has no rendering error');
  assert(world.cards.length===118&&world.cards.every((c,i)=>c.object===identities[i]),`${mode}: preserves all 118 objects`);
  assert(world.blocks.visible===(mode==='Table'),`${mode}: outlines only in Table`);
  const projected=world.cards.map(c=>c.object.position.clone().project(world.camera));assert(projected.every(p=>Math.abs(p.x)<=1.05&&Math.abs(p.y)<=1.05&&p.z<1),`${mode}: overview fits all elements (max x=${Math.max(...projected.map(p=>Math.abs(p.x))).toFixed(2)}, y=${Math.max(...projected.map(p=>Math.abs(p.y))).toFixed(2)}, camera distance=${world.controls.getDistance().toFixed(0)})`);
  let picked=0;
  for(const e of elements){
   show(e.number,{focus:false});world.render(performance.now());
   const p=world.cards[e.number-1].object.position.clone().project(world.camera),rect=world.canvas.getBoundingClientRect();
   const x=rect.left+(p.x+1)*rect.width/2,y=rect.top+(1-p.y)*rect.height/2;
   const hit=world.pick(x,y);if(hit===e.number)picked++;else assert(false,`${mode}: picking ${e.number} hit ${hit}`);
   assert(document.querySelector('#element-name').textContent===e.name,`${mode}: ${e.number} name`);
   assert(document.querySelector('[data-field="category"]').textContent===e.category,`${mode}: ${e.number} family`);
   for(const [,value,,key] of properties(e))assert(document.querySelector(`[data-field="${key}"]`).textContent===String(value),`${mode}: ${e.number} ${key}`);
   assert(world.selected===e.number&&world.cards[e.number-1].highlight.visible,`${mode}: ${e.number} selection`);
  }
  closeDetails(false);log(`${mode}: 118 cards rendered, ${picked}/118 camera-focused raycast picks; all scientific profile fields verified.`);
 }
 // Filters must keep every object present while dimming nonmatches.
 for(const mode of ['Table','Helix','Sphere','Grid']){
  button(mode).click();document.querySelector('#search').value='26';filter(true);assert(world.matches.size===1&&world.matches.has(26),`${mode}: number search`);assert(world.cards[25].material.opacity===1&&world.cards[24].material.opacity<.3,`${mode}: search highlighting`);
  document.querySelector('#search').value='Iron';filter();assert(world.matches.has(26)&&world.matches.size===1,`${mode}: name search`);
  document.querySelector('#search').value='Xe';filter();assert(world.matches.has(54),`${mode}: symbol search`);
  document.querySelector('#search').value='';document.querySelector('#category').value='Lanthanide';document.querySelector('#period').value='6';filter();assert(world.matches.size===15,`${mode}: combined filters`);
  document.querySelector('#period').value='7';filter();assert(world.matches.size===0&&!document.querySelector('#empty').hidden,`${mode}: zero results`);
  document.querySelector('#clear').click();assert(world.matches.size===118,`${mode}: clear filters`);
 }
 log('Name / symbol / number search, family / period filters, match highlighting, and empty states verified in all four modes.');
 button('Table').click();world.overview(false);const overviewPosition=world.camera.position.clone(),overviewTarget=world.controls.target.clone();show(26,{focus:false});world.render(performance.now());
 const iron=world.cards[25].object.position.clone().project(world.camera),ironX=(iron.x+1)*canvasWidth()/2,ironY=(1-iron.y)*world.canvas.clientHeight/2;
 world.canvas.dispatchEvent(new PointerEvent('pointermove',{pointerId:99,pointerType:'mouse',clientX:ironX,clientY:ironY,bubbles:true}));world.render(performance.now());assert(!document.querySelector('#preview').hidden&&document.querySelector('#preview').textContent.includes('Iron'),'Hover highlights and previews the raycast card');
 world.canvas.dispatchEvent(new PointerEvent('pointerleave',{pointerType:'mouse'}));world.controls.rotateLeft(.03);world.controls.update();world.render(performance.now());assert(document.querySelector('#preview').hidden,'Moving the camera cannot revive a tooltip after the pointer leaves the world');
 closeDetails(true);assert(world.camera.position.distanceTo(overviewPosition)<.01&&world.controls.target.distanceTo(overviewTarget)<.01,'Return restores the previous camera overview');log('Hover preview, clearing on leave, and return to the saved overview verified.');
 show(26,{focus:false});for(const mode of ['Table','Sphere','Helix','Grid']){button(mode).click();assert(world.selected===26&&document.querySelector('#detail').dataset.number==='26',`${mode}: selection persists`);}closeDetails(false);
 world.overview(false);let before=world.camera.position.clone();const keyboard=(key,shiftKey=false)=>world.canvas.dispatchEvent(new KeyboardEvent('keydown',{key,shiftKey,bubbles:true}));keyboard('ArrowRight');assert(before.distanceTo(world.camera.position)>1,'Keyboard orbit');before=world.controls.target.clone();keyboard('ArrowUp',true);assert(before.distanceTo(world.controls.target)>1,'Keyboard pan');let distance=world.controls.getDistance();keyboard('+');assert(world.controls.getDistance()<distance,'Keyboard zoom in');keyboard('-');keyboard('r');assert(world.controls.target.distanceTo(world.layoutBounds().getCenter(world.controls.target.clone()))<1,'Keyboard overview');
 log('Keyboard orbit, pan, zoom and reset verified.');
 // Synthetic touch events enter the same OrbitControls handlers as device input.
 // Pointer capture is an OS feature, so stub capture only in this isolated test page.
 const canvas=world.canvas,capture=canvas.setPointerCapture,release=canvas.releasePointerCapture;canvas.setPointerCapture=()=>{};canvas.releasePointerCapture=()=>{};
 const pointer=(type,id,x,y,pointerType='touch',extras={})=>canvas.dispatchEvent(new PointerEvent(type,{pointerId:id,clientX:x,clientY:y,pointerType,button:0,buttons:type==='pointerup'?0:1,bubbles:true,...extras}));
 const cx=canvas.clientWidth*.5,cy=canvas.clientHeight*.42;
 world.overview(false);before=world.camera.position.clone();pointer('pointerdown',1,cx-40,cy);pointer('pointermove',1,cx+40,cy+40);pointer('pointerup',1,cx+40,cy+40);world.controls.update();assert(before.distanceTo(world.camera.position)>1,'One-finger touch orbit');
 const targetBefore=world.controls.target.clone();distance=world.controls.getDistance();pointer('pointerdown',1,cx-65,cy);pointer('pointerdown',2,cx+65,cy);pointer('pointermove',1,cx-45,cy+25);pointer('pointermove',2,cx+100,cy+25);pointer('pointerup',1,cx-45,cy+25);pointer('pointerup',2,cx+100,cy+25);world.controls.update();assert(targetBefore.distanceTo(world.controls.target)>1,'Two-finger touch pan');assert(Math.abs(distance-world.controls.getDistance())>1,'Two-finger pinch zoom');
 world.overview(false);before=world.camera.position.clone();pointer('pointerdown',3,cx-40,cy,'mouse');pointer('pointermove',3,cx+40,cy+40,'mouse');pointer('pointerup',3,cx+40,cy+40,'mouse');assert(world.selected===null,'Drag does not select an element');assert(before.distanceTo(world.camera.position)>1,'Mouse drag orbit');
 canvas.setPointerCapture=capture;canvas.releasePointerCapture=release;log('Touch rotation, two-finger pan / pinch and drag-versus-click event paths verified.');
 world.motion.dispatchEvent(new MediaQueryListEvent('change',{matches:false,media:world.motion.media}));world.bloom.enabled=realBloom;button('Table').click();await settled(world);
 document.querySelector('#about').click();document.querySelector('#text-view').click();assert(document.body.classList.contains('text-mode')&&document.querySelectorAll('.fallback-card:not(.fallback-sources)').length===118,'Accessible element view contains all 118 profiles');document.querySelector('#resume-world').click();assert(!world.paused&&!document.body.classList.contains('text-mode'),'Return from accessible view');log('Accessible data view and return to WebGL verified.');
 await checkOrbitals(log,assert);
 out.dataset.status=failures.length?'failed':'passed';out.dataset.failures=String(failures.length);log(failures.length?`FAILED: ${failures.length} checks.`:'PASS: all browser checks complete.');
}catch(error){log('FATAL: '+error.stack);out.dataset.status='failed';out.dataset.failures=String(failures.length+1);}
function canvasWidth(){return world.canvas.clientWidth;}
