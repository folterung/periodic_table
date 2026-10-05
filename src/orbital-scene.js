import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { angularOrbitals, subshells } from './electron-config.js';
import { orbitalGeometry } from './orbital-geometry.js';
import { configurationSurfaces } from './orbital-overview.js';
export class OrbitalWorld {
 constructor(canvas,onFailure,onSelect){
  this.canvas=canvas;this.paused=false;this.cache=new Map();this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.frames=0;this.view='subshell';this.radius=1.8;
  const context=canvas.getContext('webgl2',{antialias:true,alpha:false});if(!context)throw Error('WebGL is unavailable.');
  this.renderer=new THREE.WebGLRenderer({canvas,context,antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,matchMedia('(pointer: coarse)').matches?1.25:1.7));this.renderer.setClearColor('#08111f');this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(42,1,.02,100);this.model=new THREE.Group();this.scene.add(this.model);
  this.scene.add(new THREE.HemisphereLight('#d1efff','#162340',2.4));const light=new THREE.DirectionalLight('#ffffff',3);light.position.set(3,4,5);this.scene.add(light);const rim=new THREE.DirectionalLight('#7fead1',2);rim.position.set(-3,1,-4);this.scene.add(rim);
  this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=!this.motion.matches;this.controls.dampingFactor=.08;this.controls.minDistance=2.2;this.controls.maxDistance=30;this.controls.touches.ONE=THREE.TOUCH.ROTATE;this.controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
  this.motion.addEventListener('change',e=>{this.controls.enableDamping=!e.matches;});
  const axes=new THREE.AxesHelper(2.5);axes.material.transparent=true;axes.material.opacity=.25;this.scene.add(axes);
  for(const [label,position]of [['x',[2.65,0,0]],['y',[0,2.65,0]],['z',[0,0,2.65]]]){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#aac1d2';ctx.font='36px sans-serif';ctx.textAlign='center';ctx.fillText(label,32,43);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));sprite.position.set(...position);sprite.scale.set(.23,.23,.23);this.scene.add(sprite);}
  const nucleus=new THREE.Mesh(new THREE.SphereGeometry(.055,20,12),new THREE.MeshBasicMaterial({color:'#d8fff1'}));this.scene.add(nucleus);
  this.reset();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);this.resize();
  canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.pause(true);onFailure?.();});
  const pointers=new Map();let dragged=false;this.raycaster=new THREE.Raycaster();
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(!pointers.size)dragged=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size>1)dragged=true;});
  canvas.addEventListener('pointermove',e=>{const origin=pointers.get(e.pointerId);if(origin&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>6)dragged=true;});
  canvas.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);dragged=true;});
  canvas.addEventListener('pointerup',e=>{const origin=pointers.get(e.pointerId),click=origin&&pointers.size===1&&!dragged&&Math.hypot(e.clientX-origin.x,e.clientY-origin.y)<=6;pointers.delete(e.pointerId);if(!click||this.view!=='overall')return;const hit=this.pick(e.clientX,e.clientY);if(hit)onSelect?.(hit.key,hit.index);});
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','r','R'].includes(e.key))return;e.preventDefault();if(['r','R'].includes(e.key))this.reset();else if(['+','=','-'].includes(e.key))this.zoom(e.key!=='-');else{const x=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,y=e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0;if(e.shiftKey)this.controls.pan(x*25,y*25);else{this.controls.rotateLeft(x*.12);this.controls.rotateUp(y*.12);}this.controls.update();}});
  this.renderer.setAnimationLoop(()=>{if(this.paused||document.hidden)return;this.controls.update();this.renderer.render(this.scene,this.camera);this.canvas.dataset.frames=String(++this.frames);});
 }
 clearModel(){for(const mesh of [...this.model.children]){this.model.remove(mesh);for(const material of mesh.material)material.dispose();}}
 geometry(type,index,segments){const key=type+index+':'+segments;if(!this.cache.has(key))this.cache.set(key,orbitalGeometry(type,index,segments));return this.cache.get(key);}
 setConfiguration(configuration,hidden=new Set()){
  this.clearModel();const changed=this.view!=='overall';this.view='overall';this.radius=2.45;
  const surfaces=configurationSurfaces(configuration,hidden),segments=surfaces.length>80?24:innerWidth<=760?32:48;
  for(const surface of surfaces){
   const base=new THREE.Color(subshells[surface.type].color),second=base.clone().lerp(new THREE.Color('#d2f5ff'),.58),opacity=Math.max(.09,.23-surfaces.length*.002)*(surface.type==='s'?.55:1);
   const materials=[base,second].map(color=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.16,roughness:.4,metalness:.05,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false}));
   const mesh=new THREE.Mesh(this.geometry(surface.type,surface.index,segments),materials);mesh.scale.setScalar(surface.radius/1.8);mesh.name=surface.key+' / '+angularOrbitals[surface.type][surface.index].label;mesh.userData={key:surface.key,index:surface.index,electrons:surface.occupancy};mesh.renderOrder=-surface.n;this.model.add(mesh);
  }
  this.canvas.dataset.view='overall';this.canvas.dataset.subshell='all';this.canvas.dataset.orbital='';this.canvas.dataset.electrons=String(configuration.total);this.canvas.dataset.visibleElectrons=String(surfaces.reduce((sum,s)=>sum+s.occupancy,0));this.canvas.dataset.meshes=String(surfaces.length);
  if(changed)this.reset();
 }
 setOrbital(entry,index,overlay=false){
  this.clearModel();const changed=this.view!=='subshell';this.view='subshell';this.radius=1.8;
  const base=new THREE.Color(subshells[entry.type].color),second=base.clone().lerp(new THREE.Color('#d2f5ff'),.58);
  angularOrbitals[entry.type].forEach((orbital,i)=>{
   if(i!==index&&(!overlay||entry.occupancy[i]===0))return;
   const selected=i===index,materials=[base,second].map(color=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:selected?.12:0,roughness:.34,metalness:.08,transparent:true,opacity:selected?.88:.14,wireframe:!selected,side:THREE.DoubleSide,depthWrite:selected}));
   const mesh=new THREE.Mesh(this.geometry(entry.type,i,innerWidth<=760?64:96),materials);mesh.name=entry.n+orbital.label;this.model.add(mesh);
  });
  this.canvas.dataset.view='subshell';this.canvas.dataset.subshell=entry.key;this.canvas.dataset.orbital=String(index);this.canvas.dataset.electrons=String(entry.count);delete this.canvas.dataset.visibleElectrons;this.canvas.dataset.meshes=String(this.model.children.length);if(changed)this.reset();
 }
 pick(x,y){const rect=this.canvas.getBoundingClientRect();this.scene.updateMatrixWorld(true);this.camera.updateMatrixWorld(true);this.raycaster.setFromCamera(new THREE.Vector2((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2),this.camera);return this.raycaster.intersectObjects(this.model.children,false)[0]?.object.userData;}
 reset(){const damping=this.controls?.enableDamping;if(this.controls){this.controls.enableDamping=false;this.controls.update();}this.camera.position.set(4.3,3.1,5.8);if(this.view==='overall'){const angle=Math.atan(Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))*Math.min(1,this.camera.aspect));this.camera.position.normalize().multiplyScalar(this.radius/Math.sin(angle)*1.22);}if(this.controls){this.controls.target.set(0,0,0);this.controls.update();this.controls.enableDamping=damping;}}
 zoom(closer){if(closer)this.controls.dollyIn(.8);else this.controls.dollyOut(.8);this.controls.update();}
 resize(){const width=this.canvas.parentElement.clientWidth,height=this.canvas.parentElement.clientHeight;if(!width||!height)return;const changed=Math.abs(this.camera.aspect-width/height)>.001;this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height,false);if(changed&&this.view==='overall')this.reset();}
 pause(value){this.paused=value;if(!value)this.resize();}
}
