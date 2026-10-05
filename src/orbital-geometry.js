import { SphereGeometry } from 'three';
import { angularOrbitals } from './electron-config.js';
export function orbitalGeometry(type,index,segments=96){
 const geometry=new SphereGeometry(1,segments,Math.round(segments*2/3)),positions=geometry.attributes.position,fn=angularOrbitals[type][index].fn,values=[];
 let maximum=0;for(let i=0;i<positions.count;i++){const value=fn(positions.getX(i),positions.getY(i),positions.getZ(i));values.push(value);maximum=Math.max(maximum,Math.abs(value));}
 for(let i=0;i<positions.count;i++){const radius=1.8*Math.abs(values[i])/maximum;positions.setXYZ(i,positions.getX(i)*radius,positions.getY(i)*radius,positions.getZ(i)*radius);}
 const positive=[],negative=[],old=geometry.index.array;
 for(let i=0;i<old.length;i+=3){const target=values[old[i]]+values[old[i+1]]+values[old[i+2]]>=0?positive:negative;target.push(old[i],old[i+1],old[i+2]);}
 geometry.setIndex([...positive,...negative]);geometry.clearGroups();geometry.addGroup(0,positive.length,0);geometry.addGroup(positive.length,negative.length,1);geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
}
