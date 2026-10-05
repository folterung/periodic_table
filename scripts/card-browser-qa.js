import { Vector3 } from 'three';

// Measure the actual rasterized ink and its projected position, rather than
// treating a large texture or nominal world-space font as proof of readability.
export function checkCardPresentation(world,assert,log){
 world.render(performance.now());
 const width=world.canvas.clientWidth,height=world.canvas.clientHeight;
 const screen=point=>{const p=point.clone().project(world.camera);return{x:(p.x+1)*width/2,y:(1-p.y)*height/2};};
 const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
 const cards=world.cards.map(card=>{
  const {width:w,height:h}=card.face.geometry.parameters;
  const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,y])=>screen(card.face.localToWorld(new Vector3(x*w/2,y*h/2,0))));
  return{left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))};
 });
 const axes=world.axisLabels.map(({label,axis})=>{
  const image=label.material.map.image,{data}=image.getContext('2d').getImageData(0,0,image.width,image.height);
  let left=image.width,right=0,top=image.height,bottom=0;
  for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(data[(y*image.width+x)*4+3]>150){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  const center=screen(label.position),depth=Math.abs(label.position.clone().applyMatrix4(world.camera.matrixWorldInverse).z);
  const size=label.scale.y*height/(2*depth*Math.tan(world.camera.fov*Math.PI/360));
  const box={left:center.x+(left/image.width-.5)*size,right:center.x+(right/image.width-.5)*size,top:center.y+(top/image.height-.5)*size,bottom:center.y+(bottom/image.height-.5)*size};
  assert(box.bottom-box.top>=(width<=360?9:width<=760?10:12),`${label.name}: readable projected numeral ink`);
  assert(box.left>=0&&box.right<=width&&box.top>=0&&box.bottom<=height,`${label.name}: stays inside the viewport`);
  assert(cards.every(card=>!overlaps(box,card)),`${label.name}: does not overlap an element card`);
  return{box,axis,name:label.name};
 });
 assert(axes.filter(a=>a.axis==='group').length===18&&axes.filter(a=>a.axis==='period').length===7,'All 18 group and 7 period numbers are rendered');
 for(let i=0;i<axes.length;i++)for(let j=i+1;j<axes.length;j++)assert(!overlaps(axes[i].box,axes[j].box),`${axes[i].name} and ${axes[j].name}: no overlapping numerals`);
 log('All 25 table numbers: projected raster ink is readable, inside the viewport, and clear of cards and neighboring numbers.');
}
