import { getWorld, getOrbitalLab, show, closeDetails } from '../src/main.js';
import { elements } from '../dist/elements.js';
import { elementConfiguration } from '../src/element-configurations.js';
const $=selector=>document.querySelector(selector);
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
export async function checkProfileOrbitals(log,assert){
 const table=getWorld(),lab=getOrbitalLab(),canvas=table.canvas;
 $('button[data-layout="Table"]').click();
 table.motion.dispatchEvent(new MediaQueryListEvent('change',{matches:true,media:table.motion.media}));
 const capture=canvas.setPointerCapture,release=canvas.releasePointerCapture;
 canvas.setPointerCapture=()=>{};canvas.releasePointerCapture=()=>{};
 try{
  for(const number of [1,8,26,24,29,58,96,103,110,111,118]){
   const element=elements[number-1];
   show(number,{focus:false});table.render(performance.now());
   // Select through the actual canvas pointer/raycast route, not just the list helper.
   const projected=table.cards[number-1].object.position.clone().project(table.camera),rect=canvas.getBoundingClientRect();
   const x=rect.left+(projected.x+1)*rect.width/2,y=rect.top+(1-projected.y)*rect.height/2;
   assert(table.pick(x,y)===number,`${element.symbol}: card is raycast selectable`);
   for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new PointerEvent(type,{pointerId:501,pointerType:innerWidth<=760?'touch':'mouse',clientX:x,clientY:y,button:0,bubbles:true}));
   assert($('#detail').dataset.number===String(number)&&!$('#detail').hidden,`${element.symbol}: Table click opens its profile`);
   const action=$('#view-element-orbitals'),bounds=action.getBoundingClientRect();
   assert(bounds.height>=44&&bounds.width>=44&&bounds.top>=0&&bounds.bottom<=innerHeight,`${element.symbol}: prominent action is visible and touch sized`);
   assert(action.getAttribute('aria-label').includes(element.name),`${element.symbol}: accessible action names the element`);
   const position=table.camera.position.clone(),target=table.controls.target.clone(),saved=table.savedView;
   // Start with stale filters, an error, a hidden layer and a detailed orbital.
   $('#electron-configuration').value='1s3';$('#configuration-form').requestSubmit();
   lab.hiddenLayers.add('1s');lab.view='subshell';
   action.focus({preventScroll:true});action.click();await lab.initializing;await frame();await frame();
   assert(lab.active&&table.paused,`${element.symbol}: profile action opens Orbitals in place`);
   assert($('#electron-configuration').value===elementConfiguration(number).configuration,`${element.symbol}: sourced configuration loaded`);
   assert(lab.configuration.total===number&&!$('#electron-configuration').hasAttribute('aria-invalid'),`${element.symbol}: neutral total and previous error cleared`);
   assert(lab.view==='overall'&&lab.hiddenLayers.size===0&&$('#orbital-show-all').hidden,`${element.symbol}: Overall opens with every layer restored`);
   assert(lab.world.model.children.reduce((sum,mesh)=>sum+mesh.userData.electrons,0)===number,`${element.symbol}: actual WebGL model covers every electron`);
   assert($('#orbital-element').textContent===`${element.name} (${element.symbol})`&&!$('#orbital-element').hidden,`${element.symbol}: name and symbol visible in the scene`);
   assert(!$('#configuration-reference').hidden&&$('#configuration-source').href.startsWith('https://'),`${element.symbol}: reference source is visible`);
   assert($('#configuration-reference-label').textContent.includes('Predicted')===elementConfiguration(number).predicted,`${element.symbol}: prediction label matches data`);
   assert($('#orbital-view-label').textContent.includes('PREDICTED')===elementConfiguration(number).predicted,`${element.symbol}: prediction status is visible beside the model`);
   assert(document.activeElement===$('#orbital-current'),`${element.symbol}: focus moves to the orbital heading`);
   assert(lab.world.renderer.getContext().getError()===0,`${element.symbol}: orbital renderer has no error`);
   $('button[data-layout="Table"]').click();await frame();await frame();
   assert(!lab.active&&!table.paused&&table.selected===number&&!$('#detail').hidden,`${element.symbol}: Table restores the selected element and profile`);
   assert(table.camera.position.distanceTo(position)<1e-6&&table.controls.target.distanceTo(target)<1e-6&&table.savedView===saved,`${element.symbol}: camera, pan target and original overview preserved after resize observation`);
   assert(!table.morph&&!table.cameraMove,`${element.symbol}: return does not start a new arrangement or camera reset`);
  }
  // A deliberate rotated/panned/zoomed view must also survive normal-motion tab switches.
  table.motion.dispatchEvent(new MediaQueryListEvent('change',{matches:false,media:table.motion.media}));
  table.cancelCamera();table.controls.enableDamping=false;table.controls.rotateLeft(.2);table.controls.rotateUp(.1);table.controls.pan(15,10);table.controls.dollyIn(.9);table.controls.update();
  const position=table.camera.position.clone(),target=table.controls.target.clone();
  $('#view-element-orbitals').click();await lab.initializing;await frame();await frame();
  $('#subshell-list button').click();assert(lab.view==='subshell'&&lab.context.element.number===118,'Linked element identity survives subshell inspection');
  $('#electron-configuration').value='1s3';$('#configuration-form').requestSubmit();assert(lab.context.element.number===118&&!$('#orbital-element').hidden,'Invalid edits retain attribution for the last valid model');
  $('#electron-configuration').value='[Ar] 4s2 3d6';$('#configuration-form').requestSubmit();
  assert(lab.configuration.total===26&&lab.context===null&&$('#configuration-reference').hidden&&$('#orbital-element').hidden,'Valid manual input clears stale element/ground-state attribution');
  $('button[data-layout="Table"]').click();await frame();await frame();
  assert(table.camera.position.distanceTo(position)<1e-6&&table.controls.target.distanceTo(target)<1e-6,'Normal-motion return preserves a rotated, panned and zoomed camera');
  table.controls.enableDamping=true;closeDetails(false);table.overview(false);
 }finally{canvas.setPointerCapture=capture;canvas.releasePointerCapture=release;}
 log('Profile → Orbitals: H, O, Fe, Cr, Cu, Ce, Cm, Lr, Ds, Rg and Og; raycast picks, all electrons/layers, source/prediction context, focus, manual editing and unchanged Table camera verified.');
}
