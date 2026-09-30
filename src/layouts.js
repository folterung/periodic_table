import { Vector3, Object3D, Quaternion } from 'three';
export const cardSize={width:140,height:124,stepX:160,stepY:146};
export const tablePoint=(col,row)=>new Vector3((col-9.5)*cardSize.stepX,(5.5-row)*cardSize.stepY,0);
export function makeLayouts(elements) {
 const layouts={Table:[],Helix:[],Sphere:[],Grid:[]}, dummy=new Object3D();
 elements.forEach((e,i)=>{
  layouts.Table.push({position:tablePoint(e.col,e.row),quaternion:new Quaternion()});
  const angle=i*.225+Math.PI*.5;
  const helix=new Vector3(Math.sin(angle)*870,(59-i)*24,Math.cos(angle)*870);
  dummy.position.copy(helix);dummy.lookAt(new Vector3(helix.x*2,helix.y,helix.z*2));
  layouts.Helix.push({position:helix,quaternion:dummy.quaternion.clone()});
  const y=1-2*(i+.5)/elements.length,theta=i*Math.PI*(3-Math.sqrt(5));
  const sphere=new Vector3(Math.sqrt(1-y*y)*Math.cos(theta),y,Math.sqrt(1-y*y)*Math.sin(theta)).multiplyScalar(1120);
  dummy.position.copy(sphere);dummy.lookAt(sphere.clone().multiplyScalar(2));
  layouts.Sphere.push({position:sphere,quaternion:dummy.quaternion.clone()});
  const layer=Math.floor(i/30),column=i%6,row=Math.floor((i%30)/6);
  const grid=new Vector3((column-2.5)*420,(2-row)*420,(layer-1.5)*650);
  dummy.rotation.set(0, (column-2.5)*.055, (2-row)*.012);
  layouts.Grid.push({position:grid,quaternion:dummy.quaternion.clone()});
 });
 return layouts;
}
// Outlines follow the same coordinate system as the cards, including gaps.
const x=col=>tablePoint(col,1).x, y=row=>tablePoint(1,row).y;
const halfW=cardSize.width/2+8, halfH=cardSize.height/2+8;
export const blockRegions=[
 {name:'s-block',color:'#ff38bc',points:[[x(1)-halfW,y(1)+halfH],[x(1)+halfW,y(1)+halfH],[x(1)+halfW,y(2)+halfH],[x(2)+halfW,y(2)+halfH],[x(2)+halfW,y(7)-halfH],[x(1)-halfW,y(7)-halfH]],label:[(x(1)+x(2))/2,y(7)-halfH-42],members:e=>e.group===1||e.group===2},
 {name:'d-block',color:'#ff951f',points:[[x(3)-halfW,y(4)+halfH],[x(12)+halfW,y(4)+halfH],[x(12)+halfW,y(7)-halfH],[x(3)-halfW,y(7)-halfH]],label:[(x(3)+x(12))/2,y(7)-halfH-42],members:e=>e.group>=3&&e.group<=12},
 {name:'p-block',color:'#497bff',points:[[x(13)-halfW,y(2)+halfH],[x(18)+halfW,y(2)+halfH],[x(18)+halfW,y(7)-halfH],[x(13)-halfW,y(7)-halfH]],label:[(x(13)+x(18))/2,y(7)-halfH-42],members:e=>e.group>=13&&e.number!==2},
 {name:'f-block series*',color:'#bc64ff',points:[[x(3)-halfW,y(9)+halfH],[x(17)+halfW,y(9)+halfH],[x(17)+halfW,y(10)-halfH],[x(3)-halfW,y(10)-halfH]],label:[(x(3)+x(17))/2,y(10)-halfH-42],members:e=>e.row>=9},
 {name:'s-block · He',color:'#ff38bc',points:[[x(18)-halfW,y(1)+halfH],[x(18)+halfW,y(1)+halfH],[x(18)+halfW,y(1)-halfH],[x(18)-halfW,y(1)-halfH]],label:[x(18),y(1)+halfH+34],members:e=>e.number===2}
];
