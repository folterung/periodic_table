import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeLayouts, cardSize, blockRegions, tablePoint } from './layouts.js';
import { colors } from './science.js';
const v=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const ease=t=>t*t*(3-2*t);
function texture(draw,width=384,height=492){const c=document.createElement('canvas');c.width=width;c.height=height;draw(c.getContext('2d'),width,height);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
function labelMesh(text,color,width=250,height=40){
 const map=texture((ctx,w,h)=>{ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`500 ${h*.72}px "Segoe UI", sans-serif`;ctx.fillText(text,w/2,h/2);},Math.max(256,width*2),height*2);
 return new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
}
function frameGeometry(width,height,thickness=2,depth=7){
 return mergeGeometries([
  new THREE.BoxGeometry(width,thickness,depth).translate(0,height/2,0),new THREE.BoxGeometry(width,thickness,depth).translate(0,-height/2,0),
  new THREE.BoxGeometry(thickness,height,depth).translate(-width/2,0,0),new THREE.BoxGeometry(thickness,height,depth).translate(width/2,0,0)
 ]);
}
export class ElementWorld {
 constructor(canvas,elements,callbacks={}) {
  this.canvas=canvas;this.elements=elements;this.callbacks=callbacks;this.mode='Table';this.selected=null;this.hovered=null;this.savedView=null;this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.reduced=this.motion.matches;this.mobile=innerWidth<=760||matchMedia('(pointer: coarse)').matches;this.paused=false;this.cards=[];this.pickMeshes=[];this.morph=null;this.cameraMove=null;this.blockOpacity=1;this.matches=new Set(elements.map(e=>e.number));this.filterActive=false;
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'high-performance'});if(!gl)throw Error('WebGL 2 is unavailable.');
  this.renderer=new THREE.WebGLRenderer({canvas,context:gl,antialias:true,alpha:false});this.renderer.setClearColor('#08111f');this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
  this.quality=Math.min(devicePixelRatio||1,this.mobile?1.35:1.8);this.renderer.setPixelRatio(this.quality);
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#08111f');this.scene.fog=new THREE.FogExp2('#08111f',.000037);
  this.camera=new THREE.PerspectiveCamera(42,1,3,24000);this.camera.position.set(0,0,6000);
  this.controls=new OrbitControls(this.camera,canvas);this.controls.enableDamping=!this.reduced;this.controls.dampingFactor=.09;this.controls.rotateSpeed=.48;this.controls.zoomSpeed=.8;this.controls.panSpeed=.9;this.controls.minDistance=45;this.controls.maxDistance=22000;this.controls.touches.ONE=THREE.TOUCH.ROTATE;this.controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
  this.controls.addEventListener('start',()=>{this.cancelCamera();this.clearHover();});
  this.controls.addEventListener('change',()=>{this.dirtyPointer=true;});
  this.layouts=makeLayouts(elements);this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2(2,2);this.pointerScreen={x:0,y:0};this.dirtyPointer=false;this.pointerInside=false;this.activePointers=new Map();this.dragged=false;
  this.scene.add(new THREE.HemisphereLight('#b9eaff','#112537',2.2));
  const light=new THREE.DirectionalLight('#9cd9ff',2.5);light.position.set(1000,1600,2000);this.scene.add(light);
  const rim=new THREE.PointLight('#69e6c6',850000,6500,2);rim.position.set(-1500,600,-1300);this.scene.add(rim);
  this.createCards();this.createBlocks();this.createEnvironment();
  this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));this.bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.24,.35,.92);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());this.bloom.enabled=!this.mobile;
  this.resize();this.overview(false);
  this.bindInput();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);
  this.motion.addEventListener('change',event=>{this.reduced=event.matches;this.controls.enableDamping=!this.reduced;if(this.reduced){this.finishMorph();this.finishCamera();}});
  this.frameTimes=[];this.lastFrame=performance.now();this.frames=0;this.lastDiagnostics=0;
  this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.pause(true);callbacks.onFailure?.();});
  this.renderer.setAnimationLoop(time=>this.render(time));
 }
 createCards(){
  const bodyGeometry=new THREE.BoxGeometry(cardSize.width,cardSize.height,6),faceGeometry=new THREE.PlaneGeometry(cardSize.width-4,cardSize.height-4),borderGeometry=frameGeometry(cardSize.width,cardSize.height,1.8,8),highlightGeometry=frameGeometry(cardSize.width+7,cardSize.height+7,3,9);
  const materials=new Map();
  for(const [category,color]of Object.entries(colors))materials.set(category,{body:new THREE.MeshStandardMaterial({color,transparent:true,opacity:.16,metalness:.35,roughness:.25,depthWrite:false}),border:new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.58,metalness:.6,roughness:.24,transparent:true,opacity:.9})});
  this.elements.forEach((e,i)=>{
   const color=colors[e.category], object=new THREE.Group();object.name=`${e.number} ${e.symbol} ${e.name}`;object.userData.element=e;
   const map=texture((ctx,w,h)=>{
    const scale=w/cardSize.width;ctx.scale(scale,scale);
    const fill=ctx.createLinearGradient(0,0,140,124);fill.addColorStop(0,'#162b42ed');fill.addColorStop(1,'#0a1929d9');ctx.fillStyle=fill;ctx.fillRect(0,0,140,124);
    ctx.fillStyle=color;ctx.globalAlpha=.09;ctx.fillRect(0,0,140,124);ctx.globalAlpha=1;
    ctx.font='500 13px "Segoe UI", sans-serif';ctx.textAlign='left';ctx.fillText(e.number,11,21);
    ctx.fillStyle=color;ctx.font='650 43px "Segoe UI", sans-serif';ctx.textAlign='center';ctx.fillText(e.symbol,70,72);
    ctx.fillStyle='#e4f1fa';let font=12;ctx.font=`500 ${font}px "Segoe UI", sans-serif`;while(ctx.measureText(e.name).width>124){font-=.5;ctx.font=`500 ${font}px "Segoe UI", sans-serif`;}ctx.fillText(e.name,70,95);
    ctx.fillStyle='#9fb8cb';ctx.font='400 9px "Segoe UI", sans-serif';ctx.fillText(e.mass,70,112);
    ctx.fillStyle=color;ctx.globalAlpha=.52;ctx.fillRect(11,119,118,1);
   },this.mobile?280:420,this.mobile?248:372);
   const material=new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,side:THREE.FrontSide,toneMapped:false});
   const face=new THREE.Mesh(faceGeometry,material);face.position.z=4.2;face.userData.number=e.number;
   const back=new THREE.Mesh(faceGeometry,material);back.position.z=-4.2;back.rotation.y=Math.PI;back.userData.number=e.number;
   const body=new THREE.Mesh(bodyGeometry,materials.get(e.category).body.clone()),border=new THREE.Mesh(borderGeometry,materials.get(e.category).border.clone());
   const highlight=new THREE.Mesh(highlightGeometry,new THREE.MeshBasicMaterial({color,toneMapped:false}));highlight.visible=false;
   object.add(body,border,face,back,highlight);object.position.copy(this.layouts.Table[i].position);object.quaternion.copy(this.layouts.Table[i].quaternion);this.scene.add(object);
   this.cards.push({object,face,back,body,border,highlight,material,element:e});this.pickMeshes.push(face,back);
  });
 }
 createBlocks(){
  this.blocks=new THREE.Group();this.blocks.name='Electron block outlines and table axes';this.blockMaterials=[];
  for(const region of blockRegions){
   const group=new THREE.Group();group.name=region.name;
   const mat=new THREE.MeshBasicMaterial({color:region.color,transparent:true,opacity:.95,toneMapped:false});this.blockMaterials.push({material:mat,opacity:.95});
   for(let i=0;i<region.points.length;i++){
    const a=region.points[i],b=region.points[(i+1)%region.points.length],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
    const tube=new THREE.Mesh(new THREE.CylinderGeometry(6.5,6.5,length,8),mat);tube.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,10);tube.rotation.z=-Math.atan2(b[0]-a[0],b[1]-a[1]);group.add(tube);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(6.5,8,6),mat);cap.position.set(a[0],a[1],10);group.add(cap);
   }
   const text=labelMesh(region.name,region.color,region.name.includes('series')?420:region.name.includes('He')?260:245,52);text.position.set(...region.label,12);group.add(text);this.blockMaterials.push({material:text.material,opacity:1});this.blocks.add(group);
  }
  for(let group=1;group<=18;group++){const label=labelMesh(String(group),'#839fb5',36,30);label.position.set(tablePoint(group,1).x,780,0);this.blocks.add(label);this.blockMaterials.push({material:label.material,opacity:1});}
  for(let period=1;period<=7;period++){const label=labelMesh(String(period),'#839fb5',36,30);label.position.set(-1470,tablePoint(1,period).y,0);this.blocks.add(label);this.blockMaterials.push({material:label.material,opacity:1});}
  for(const [row,title]of [[9,'6 · LANTHANIDES'],[10,'7 · ACTINIDES']]){const label=labelMesh(title,'#a38abc',275,30);label.position.set(-1300,tablePoint(1,row).y,0);this.blocks.add(label);this.blockMaterials.push({material:label.material,opacity:1});}
  for(const [row,title]of [[6,'57–71'],[7,'89–103']]){const label=labelMesh(title,'#bc64ff',110,30);label.position.copy(tablePoint(3,row));this.blocks.add(label);this.blockMaterials.push({material:label.material,opacity:1});}
  this.scene.add(this.blocks);
 }
 createEnvironment(){
  const floor=new THREE.GridHelper(12000,60,'#1b4a5b','#112d42');floor.position.y=-2100;floor.material.transparent=true;floor.material.opacity=.23;floor.material.depthWrite=false;this.scene.add(floor);
  const positions=[];let seed=1984;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<650;i++)positions.push((random()-.5)*16000,(random()-.5)*12000,(random()-.5)*16000);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));const stars=new THREE.Points(geometry,new THREE.PointsMaterial({color:'#7aaec3',size:3.5,transparent:true,opacity:.35,sizeAttenuation:true,depthWrite:false}));this.scene.add(stars);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1850,1.2,4,180),new THREE.MeshBasicMaterial({color:'#1d5262',transparent:true,opacity:.35}));ring.rotation.x=Math.PI/2;ring.position.y=-2095;this.scene.add(ring);
 }
 setLayout(mode){
  if(!this.layouts[mode])return;
  this.mode=mode;this.clearHover();const now=performance.now();
  this.morph={start:now,duration:this.reduced?0:1450,from:this.cards.map(c=>({position:c.object.position.clone(),quaternion:c.object.quaternion.clone()})),to:this.layouts[mode],blockFrom:this.blockOpacity,blockTo:mode==='Table'?1:0};
  this.blocks.visible=true;if(this.reduced)this.finishMorph();
  this.savedView=null;this.overview();
 }
 finishMorph(){if(!this.morph)return;for(let i=0;i<this.cards.length;i++){const t=this.morph.to[i];this.cards[i].object.position.copy(t.position);this.cards[i].object.quaternion.copy(t.quaternion);}this.blockOpacity=this.morph.blockTo;this.setBlockOpacity();this.morph=null;}
 setBlockOpacity(){for(const item of this.blockMaterials)item.material.opacity=item.opacity*this.blockOpacity;this.blocks.visible=this.blockOpacity>.002;}
 layoutBounds(){
  const bounds=new THREE.Box3();this.layouts[this.mode].forEach(target=>{for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])bounds.expandByPoint(v(x*cardSize.width/2,y*cardSize.height/2,z*5).applyQuaternion(target.quaternion).add(target.position));});bounds.expandByScalar(35);
  if(this.mode==='Table'){bounds.expandByPoint(v(-1510,-810,0));bounds.expandByPoint(v(1460,810,0));}return bounds;
 }
 safeArea(detail=false){
  const rect=this.canvas.getBoundingClientRect(),header=document.querySelector('.finder')?.getBoundingClientRect(),footer=document.querySelector('.bottom-hud')?.getBoundingClientRect();
  let left=24,right=rect.width-24,top=header?header.bottom+30:120,bottom=footer?footer.top-55:rect.height-140;
  if(rect.width<=760){left=18;right=rect.width-18;top=(header?.bottom??175)+45;bottom=(footer?.top??rect.height-140)-48;}
  if(detail){const panel=document.querySelector('#detail')?.getBoundingClientRect();if(panel&&panel.height){if(rect.width<=760)bottom=panel.top-15;else right=panel.left-35;}else if(rect.width>760)right-=350;}
  top=Math.min(top,rect.height*.45);bottom=Math.max(bottom,top+120);return{left,right,top,bottom,width:Math.max(100,right-left),height:Math.max(120,bottom-top),centerX:(left+right)/2,centerY:(top+bottom)/2};
 }
 viewOffset(area){
  // Shift the optical center away from overlays without moving the world.
  const w=this.canvas.clientWidth,h=this.canvas.clientHeight;
  this.camera.setViewOffset(w,h,w/2-area.centerX,h/2-area.centerY,w,h);
 }
 overview(animate=true){
  const bounds=this.layoutBounds(),center=bounds.getCenter(v()),area=this.safeArea(false),height=this.canvas.clientHeight,width=this.canvas.clientWidth;
  const direction=this.mode==='Grid'?v(1.2,.62,2.9).normalize():this.mode==='Helix'?v(.18,.09,1).normalize():v(0,0,1);
  // Fit the full 3D bounds, including the near depth layers of an oblique Grid.
  const probe=this.camera.clone();probe.setViewOffset(width,height,width/2-area.centerX,height/2-area.centerY,width,height);
  const corners=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(v(x,y,z));
  const minX=area.left/width*2-1,maxX=area.right/width*2-1,minY=1-area.bottom/height*2,maxY=1-area.top/height*2;
  const fits=distance=>{probe.position.copy(center).addScaledVector(direction,distance);probe.lookAt(center);probe.updateMatrixWorld(true);return corners.every(corner=>{const p=corner.clone().project(probe);return p.x>=minX&&p.x<=maxX&&p.y>=minY&&p.y<=maxY&&p.z<1&&p.z>-1;});};
  let low=100,high=22000;for(let i=0;i<25;i++){const middle=(low+high)/2;if(fits(middle))high=middle;else low=middle;}
  const position=center.clone().addScaledVector(direction,high*1.025);
  this.animateCamera(position,center,area,animate);
 }
 animateCamera(position,target,area,animate=true){
  this.cancelCamera();
  this.cameraMove={start:performance.now(),duration:this.reduced||!animate?0:950,fromPosition:this.camera.position.clone(),toPosition:position.clone(),fromTarget:this.controls.target.clone(),toTarget:target.clone(),fromCenter:this.currentCenter||{x:this.canvas.clientWidth/2,y:this.canvas.clientHeight/2},toCenter:{x:area.centerX,y:area.centerY}};
  if(!this.cameraMove.duration)this.finishCamera();
 }
 cancelCamera(){if(this.cameraMove){this.cameraMove=null;this.controls.enabled=true;}this.controls.enableDamping=false;this.controls.update();this.controls.enableDamping=!this.reduced;}
 finishCamera(){if(!this.cameraMove)return;this.camera.position.copy(this.cameraMove.toPosition);this.controls.target.copy(this.cameraMove.toTarget);this.currentCenter=this.cameraMove.toCenter;this.viewOffset({centerX:this.currentCenter.x,centerY:this.currentCenter.y});this.camera.lookAt(this.controls.target);this.controls.update();this.cameraMove=null;this.controls.enabled=true;}
 select(n){
  if(!this.selected)this.savedView={position:this.camera.position.clone(),target:this.controls.target.clone(),center:this.currentCenter?{...this.currentCenter}:{x:this.canvas.clientWidth/2,y:this.canvas.clientHeight/2},mode:this.mode};
  this.selected=n;this.updateHighlights();this.focus(n);
 }
 focus(n){
  const index=n-1;const target=this.layouts[this.mode][index],position=target.position.clone(),normal=this.mode==='Grid'?v(.55,.3,1).normalize():v(0,0,1).applyQuaternion(target.quaternion);
  // Read either side from the nearest hemisphere, avoiding a trip through the formation.
  if(this.camera.position.clone().sub(position).dot(normal)<0)normal.negate();
  const area=this.safeArea(true),h=this.canvas.clientHeight;
  const distance=Math.max(430,cardSize.height*h/(area.height*.62)/(2*Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))));
  this.animateCamera(position.clone().addScaledVector(normal,distance),position,area);
 }
 deselect(returnView=true){
  this.selected=null;this.updateHighlights();
  if(returnView&&this.savedView?.mode===this.mode){const s=this.savedView;this.animateCamera(s.position,s.target,{centerX:s.center.x,centerY:s.center.y});}else if(returnView)this.overview();this.savedView=null;
 }
 setMatches(matches,active){
  this.matches=matches;this.filterActive=active;
  for(const card of this.cards){const match=matches.has(card.element.number);card.material.opacity=match?1:.19;card.border.material.opacity=match?.9:.13;card.body.material.opacity=match?.16:.04;}
  this.updateHighlights();
 }
 updateHighlights(){for(const card of this.cards){const n=card.element.number;card.highlight.visible=n===this.selected||n===this.hovered;card.highlight.material.color.set(n===this.selected?'#efffff':colors[card.element.category]);}}
 clearHover(){this.hovered=null;this.callbacks.onHover?.(null);this.canvas.style.cursor=this.activePointers.size?'grabbing':'grab';this.updateHighlights();}
 pick(x,y){
  const rect=this.canvas.getBoundingClientRect();this.pointer.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);this.scene.updateMatrixWorld(true);this.camera.updateMatrixWorld();this.raycaster.setFromCamera(this.pointer,this.camera);
  const hits=this.raycaster.intersectObjects(this.pickMeshes,false);
  const hit=this.filterActive?hits.find(hit=>this.matches.has(hit.object.userData.number))??hits[0]:hits[0];return hit?.object.userData.number??null;
 }
 bindInput(){
  const c=this.canvas;
  c.addEventListener('pointerdown',event=>{this.activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});this.downTime=performance.now();if(this.activePointers.size===1)this.dragged=false;else this.dragged=true;this.canvas.style.cursor='grabbing';this.clearHover();});
  c.addEventListener('pointermove',event=>{
   const start=this.activePointers.get(event.pointerId);if(start&&Math.hypot(event.clientX-start.x,event.clientY-start.y)>6)this.dragged=true;
   this.pointerScreen={x:event.clientX,y:event.clientY};this.pointerInside=event.pointerType!=='touch'&&document.elementFromPoint(event.clientX,event.clientY)===c;this.dirtyPointer=true;if(!this.pointerInside)this.clearHover();
  });
  c.addEventListener('pointerup',event=>{
   const had=this.activePointers.has(event.pointerId),single=this.activePointers.size===1;this.activePointers.delete(event.pointerId);
   if(had&&single&&!this.dragged&&event.button===0&&performance.now()-this.downTime<650){const n=this.pick(event.clientX,event.clientY);if(n)this.callbacks.onPick?.(n);}
   if(!this.activePointers.size){this.canvas.style.cursor='grab';this.dragged=false;}
  });
  c.addEventListener('pointercancel',event=>{this.activePointers.delete(event.pointerId);this.dragged=true;this.clearHover();});
  c.addEventListener('pointerleave',()=>{this.pointer.set(2,2);this.pointerInside=false;this.dirtyPointer=false;this.clearHover();});
  c.addEventListener('wheel',()=>{this.cancelCamera();this.clearHover();},{passive:true});
  c.addEventListener('keydown',event=>{
   const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','_','r','R'];if(!keys.includes(event.key))return;event.preventDefault();this.cancelCamera();
   if(event.key==='r'||event.key==='R'){this.overview();return;}
   if(['+','=','-','_'].includes(event.key)){this.zoom(event.key==='+'||event.key==='=');return;}
   const dx=event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:0,dy=event.key==='ArrowUp'?-1:event.key==='ArrowDown'?1:0;
   if(event.shiftKey)this.controls.pan(dx*35,dy*35);else{this.controls.rotateLeft(dx*.11);this.controls.rotateUp(dy*.11);}this.controls.update();
  });
 }
 zoom(closer){this.cancelCamera();if(closer)this.controls.dollyIn(.8);else this.controls.dollyOut(.8);this.controls.update();}
 resize(refit=true){
  const width=this.canvas.parentElement.clientWidth,height=this.canvas.parentElement.clientHeight;if(!width||!height)return;
  const mobile=width<=760||matchMedia('(pointer: coarse)').matches;if(mobile!==this.mobile){this.mobile=mobile;this.bloom.enabled=!mobile;this.quality=Math.min(devicePixelRatio||1,mobile?1.35:1.8);this.renderer.setPixelRatio(this.quality);}
  this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height,false);this.composer.setSize(width,height);
  // Bloom is intentionally low resolution; the card text remains full resolution.
  this.bloom.setSize(Math.round(width*this.quality*.6),Math.round(height*this.quality*.6));
  if(refit){if(this.selected)this.focus(this.selected);else this.overview(false);}
 }
 pause(value){this.paused=value;}
 render(now){
  if(this.paused||document.hidden)return;
  if(this.morph){const t=this.morph.duration?Math.min(1,(now-this.morph.start)/this.morph.duration):1,amount=ease(t);for(let i=0;i<this.cards.length;i++){const card=this.cards[i],from=this.morph.from[i],to=this.morph.to[i];card.object.position.lerpVectors(from.position,to.position,amount);card.object.quaternion.slerpQuaternions(from.quaternion,to.quaternion,amount);}this.blockOpacity=THREE.MathUtils.lerp(this.morph.blockFrom,this.morph.blockTo,amount);this.setBlockOpacity();if(t===1)this.morph=null;}
  if(this.cameraMove){const move=this.cameraMove,t=move.duration?Math.min(1,(now-move.start)/move.duration):1,amount=ease(t);this.controls.enabled=false;this.camera.position.lerpVectors(move.fromPosition,move.toPosition,amount);this.controls.target.lerpVectors(move.fromTarget,move.toTarget,amount);this.currentCenter={x:THREE.MathUtils.lerp(move.fromCenter.x,move.toCenter.x,amount),y:THREE.MathUtils.lerp(move.fromCenter.y,move.toCenter.y,amount)};this.viewOffset({centerX:this.currentCenter.x,centerY:this.currentCenter.y});this.camera.lookAt(this.controls.target);if(t===1){this.cameraMove=null;this.controls.enabled=true;}}
  this.controls.update();
  if(this.dirtyPointer&&this.pointerInside&&!this.activePointers.size&&!this.cameraMove&&!this.morph){this.dirtyPointer=false;const n=this.pick(this.pointerScreen.x,this.pointerScreen.y);this.hovered=n;this.updateHighlights();this.canvas.style.cursor=n?'pointer':'grab';this.callbacks.onHover?.(n?this.elements[n-1]:null,this.pointerScreen.x,this.pointerScreen.y);}
  if(this.bloom.enabled)this.composer.render();else this.renderer.render(this.scene,this.camera);
  const elapsed=now-this.lastFrame;this.lastFrame=now;this.frames++;
  if(elapsed>0&&elapsed<200)this.frameTimes.push(elapsed);
  if(this.frameTimes.length===180){const average=this.frameTimes.reduce((a,b)=>a+b,0)/180;if(average>29&&this.quality>.85){this.quality=Math.max(.85,this.quality-.25);this.renderer.setPixelRatio(this.quality);if(this.quality<1.1)this.bloom.enabled=false;this.resize(false);}this.frameTimes=[];}
  if(now-this.lastDiagnostics>500){this.lastDiagnostics=now;this.canvas.dataset.layout=this.mode;this.canvas.dataset.cards=String(this.cards.length);this.canvas.dataset.transition=String(!!this.morph);this.canvas.dataset.cameraMoving=String(!!this.cameraMove);this.canvas.dataset.blocks=String(this.blocks.visible);this.canvas.dataset.selected=String(this.selected??'');this.canvas.dataset.renderedFrames=String(this.frames);this.canvas.dataset.pixelRatio=this.quality.toFixed(2);this.canvas.dataset.camera=this.camera.position.toArray().map(n=>n.toFixed(1)).join(',');}
 }
 dispose(){this.renderer.setAnimationLoop(null);this.controls.dispose();this.resizeObserver.disconnect();this.scene.traverse(object=>{object.geometry?.dispose();for(const material of Array.isArray(object.material)?object.material:[object.material]){material?.map?.dispose();material?.dispose();}});this.composer.dispose();this.renderer.dispose();}
}
