import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { elements } from '../dist/elements.js';
import { makeLayouts, tablePoint, blockRegions, cardSize } from '../src/layouts.js';
import { matchElement, properties, valenceNote, massNote } from '../src/science.js';
import { blockOutlineShape } from '../src/block-outlines.js';
assert.equal(elements.length,118);assert.deepEqual(elements.map(e=>e.number),Array.from({length:118},(_,i)=>i+1));assert.equal(new Set(elements.map(e=>e.symbol)).size,118);
const source=await readFile('ciaaw-source.html','utf8');
for(const e of elements){
 assert.ok(source.includes(e.symbol),e.symbol);assert.ok(e.period>=1&&e.period<=7);assert.equal(properties(e).find(p=>p[3]==='electrons')[1],e.number);assert.ok(valenceNote(e).includes('convention'));assert.ok(massNote(e).includes(e.mass.startsWith('[')?'isotope':'average'));
 if(e.row>=9){assert.ok((e.number>=57&&e.number<=71)||(e.number>=89&&e.number<=103));assert.equal(e.period,e.row===9?6:7);}else assert.equal(e.row,e.period);
}
// Verify retained data against the unchanged initial source, ignoring module syntax.
import { execFileSync } from 'node:child_process';
const previous=execFileSync('git',['show','10eda2f30f04270aaf003633ab4a41f4ed35e4f2:dist/elements.js'],{encoding:'utf8'});
assert.deepEqual(elements,JSON.parse(previous.slice(previous.indexOf('['),previous.lastIndexOf(']')+1)));
const layouts=makeLayouts(elements);
for(const [name,targets]of Object.entries(layouts)){assert.equal(targets.length,118);assert.equal(new Set(targets.map(t=>t.position.toArray().join(','))).size,118);for(const t of targets){assert.ok(t.position.toArray().every(Number.isFinite));assert.ok(Math.abs(t.quaternion.length()-1)<1e-10);}if(name==='Sphere')for(const t of targets)assert.ok(Math.abs(t.position.length()-1120)<1e-8);}
assert.equal(new Set(layouts.Grid.map(t=>t.position.z)).size,4);assert.ok(new Set(layouts.Helix.map(t=>Math.round(t.position.z))).size>30);
for(let i=0;i<118;i++){assert.deepEqual(layouts.Table[i].position,tablePoint(elements[i].col,elements[i].row));}
function inside(px,py,points){let yes=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j];if((yi>py)!==(yj>py)&&px<(xj-xi)*(py-yi)/(yj-yi)+xi)yes=!yes;}return yes;}
for(const region of blockRegions)for(const e of elements){const p=tablePoint(e.col,e.row);if(region.members(e)){for(const sx of [-1,1])for(const sy of [-1,1])assert.ok(inside(p.x+sx*cardSize.width/2,p.y+sy*cardSize.height/2,region.points),`${e.name} inside ${region.name}`);}else assert.equal(inside(p.x,p.y,region.points),false,`${e.name} outside ${region.name}`);}
for(const region of blockRegions){
 const shape=blockOutlineShape(region.points),inner=shape.holes[0].getPoints(12).map(p=>[p.x,p.y]);
 assert.ok(shape.getPoints(12).every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 for(const e of elements.filter(region.members)){const p=tablePoint(e.col,e.row);for(const sx of [-1,1])for(const sy of [-1,1])assert.ok(inside(p.x+sx*cardSize.width/2,p.y+sy*cardSize.height/2,inner),`${region.name} rounded stroke clears ${e.name}'s corners`);}
}
const outlineBounds=blockRegions.map(region=>{const p=blockOutlineShape(region.points).getPoints(12);return{minX:Math.min(...p.map(p=>p.x)),maxX:Math.max(...p.map(p=>p.x)),minY:Math.min(...p.map(p=>p.y)),maxY:Math.max(...p.map(p=>p.y))};});
assert.ok(outlineBounds[0].maxX<outlineBounds[1].minX,'s/d border colors stay separated');
assert.ok(outlineBounds[1].maxX<outlineBounds[2].minX,'d/p border colors stay separated');
assert.ok(outlineBounds[4].minY>outlineBounds[2].maxY,'Helium and p-block border colors stay separated');
assert.equal(elements.filter(e=>matchElement(e,'26','','')).length,1);assert.equal(elements.filter(e=>matchElement(e,'Iron','',''))[0].number,26);assert.ok(matchElement(elements[12],'aluminum','',''));assert.equal(elements.filter(e=>matchElement(e,'','Noble gas','')).length,7);assert.equal(elements.filter(e=>matchElement(e,'','','6')).length,32);assert.equal(elements.filter(e=>matchElement(e,'','Lanthanide','7')).length,0);
assert.ok(valenceNote(elements[25]).includes('s + d'));assert.ok(valenceNote(elements[102]).includes('7s²7p¹'));assert.ok(massNote(elements[42]).includes('not an exact mass'));
console.log('PASS: 118 unchanged scientific records, neutral electrons, all four unique layouts, sphere/helix/depth geometry, every outline/card corner, searches, filters, and scientific qualifications.');
