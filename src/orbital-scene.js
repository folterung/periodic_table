import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { angularOrbitals, subshells } from './electron-config.js';
import { orbitalGeometry } from './orbital-geometry.js';
export class OrbitalWorld {
 constructor(canvas,onFailure){
  this.canvas=canvas;this.paused=false;this.cache=new Map();this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.frames=0;
  const context=canvas.getContext('webgl2',{antialias:true,alpha:false});if(!context)throw Error('WebGL is unavailable.');
  this.renderer=new THREE.WebGLRenderer({canvas,context,antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,matchMedia('(pointer: coarse)').matches?1.25:1.7));this.renderer.setClearColor('#08111f');this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(42,1,.02,100);this.model=new THREE.Group();this.scene.add(this.model);
  this.scene.add(new THREE.HemisphereLight('#d1efff','#162340',2.4));const light=new THREE.DirectionalLight('#ffffff',3);light.position.set(3,4,5);this.scene.add(light);const rim=new THREE.DirectionalLight('#7fead1',2);rim.position.set(-3,1,-4);this.scene.add(rim);
  this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=!this.motion.matches;this.controls.dampingFactor=.08;this.controls.minDistance=2.2;this.controls.maxDistance=18;this.controls.touches.ONE=THREE.TOUCH.ROTATE;this.controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
  this.motion.addEventListener('change',e=>{this.controls.enableDamping=!e.matches;});
  const axes=new THREE.AxesHelper(2.5);axes.material.transparent=true;axes.material.opacity=.25;this.scene.add(axes);
  for(const [label,position]of [['x',[2.65,0,0]],['y',[0,2.65,0]],['z',[0,0,2.65]]]){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#aac1d2';ctx.font='36px sans-serif';ctx.textAlign='center';ctx.fillText(label,32,43);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));sprite.position.set(...position);sprite.scale.set(.23,.23,.23);this.scene.add(sprite);}
  const nucleus=new THREE.Mesh(new THREE.SphereGeometry(.055,20,12),new THREE.MeshBasicMaterial({color:'#d8fff1'}));this.scene.add(nucleus);
  this.reset();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);this.resize();
  canvas.addEventListener('contextmenu',e=>e.preventDefault());canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.pause(true);onFailure?.();});
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','r','R'].includes(e.key))return;e.preventDefault();if(['r','R'].includes(e.key))this.reset();else if(['+','=','-'].includes(e.key))this.zoom(e.key!=='-');else{const x=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,y=e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0;if(e.shiftKey)this.controls.pan(x*25,y*25);else{this.controls.rotateLeft(x*.12);this.controls.rotateUp(y*.12);}this.controls.update();}});
  this.renderer.setAnimationLoop(()=>{if(this.paused||document.hidden)return;this.controls.update();this.renderer.render(this.scene,this.camera);this.canvas.dataset.frames=String(++this.frames);});
 }
 setOrbital(entry,index,overlay=false){
  for(const mesh of [...this.model.children]){this.model.remove(mesh);for(const m of mesh.material)m.dispose();}
  const base=new THREE.Color(subshells[entry.type].color),second=base.clone().lerp(new THREE.Color('#d2f5ff'),.58);
  angularOrbitals[entry.type].forEach((orbital,i)=>{
   if(i!==index&&(!overlay||entry.occupancy[i]===0))return;const key=entry.type+i;
   if(!this.cache.has(key))this.cache.set(key,orbitalGeometry(entry.type,i,innerWidth<=760?64:96));
   const selected=i===index,materials=[base,second].map(color=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:selected?.12:0,roughness:.34,metalness:.08,transparent:true,opacity:selected?.88:.14,wireframe:!selected,side:THREE.DoubleSide,depthWrite:selected}));
   const mesh=new THREE.Mesh(this.cache.get(key),materials);mesh.name=entry.n+orbital.label;this.model.add(mesh);
  });
  this.canvas.dataset.subshell=entry.key;this.canvas.dataset.orbital=String(index);this.canvas.dataset.electrons=String(entry.count);this.canvas.dataset.meshes=String(this.model.children.length);
 }
 reset(){const damping=this.controls?.enableDamping;if(this.controls){this.controls.enableDamping=false;this.controls.update();}this.camera.position.set(4.3,3.1,5.8);if(this.controls){this.controls.target.set(0,0,0);this.controls.update();this.controls.enableDamping=damping;}}
 zoom(closer){if(closer)this.controls.dollyIn(.8);else this.controls.dollyOut(.8);this.controls.update();}
 resize(){const width=this.canvas.parentElement.clientWidth,height=this.canvas.parentElement.clientHeight;if(!width||!height)return;this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height,false);}
 pause(value){this.paused=value;if(!value)this.resize();}
}
