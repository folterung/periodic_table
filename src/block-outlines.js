import { Shape, Path } from 'three';

export const blockStrokeWidth=7;
const cornerRadius=8;

// Offset both sides of a closed, clockwise orthogonal path. Matching arc
// centers keep the stroke equally wide through convex and stepped corners.
function roundedContour(points,offset,path){
 for(let i=0;i<points.length;i++){
  const previous=points[(i+points.length-1)%points.length],point=points[i],next=points[(i+1)%points.length];
  const beforeLength=Math.hypot(point[0]-previous[0],point[1]-previous[1]),afterLength=Math.hypot(next[0]-point[0],next[1]-point[1]);
  const before=[(point[0]-previous[0])/beforeLength,(point[1]-previous[1])/beforeLength],after=[(next[0]-point[0])/afterLength,(next[1]-point[1])/afterLength];
  const clockwise=before[0]*after[1]-before[1]*after[0]<0;
  const radius=cornerRadius+(clockwise?offset:-offset);
  const x=point[0]-(before[1]+after[1])*offset,y=point[1]+(before[0]+after[0])*offset;
  const startX=x-before[0]*radius,startY=y-before[1]*radius;
  if(i===0)path.moveTo(startX,startY);else path.lineTo(startX,startY);
  path.absarc(startX+after[0]*radius,startY+after[1]*radius,radius,Math.atan2(-after[1],-after[0]),Math.atan2(before[1],before[0]),clockwise);
 }
 path.closePath();return path;
}

export function blockOutlineShape(points){
 const shape=roundedContour(points,blockStrokeWidth/2,new Shape());
 shape.holes.push(roundedContour(points,-blockStrokeWidth/2,new Path()));
 return shape;
}
