import assert from 'node:assert/strict';
import { parseConfiguration, occupations, subshells, angularOrbitals } from '../src/electron-config.js';
import { orbitalGeometry } from '../src/orbital-geometry.js';
import { configurationSurfaces } from '../src/orbital-overview.js';
for(const raw of ['1s2 2s2 2p4','1s² 2s² 2p⁴','1s^2 2s^{2} 2p^4','1s22s22p4','1s2, 2s2; 2p4']){const c=parseConfiguration(raw);assert.equal(c.total,8);assert.equal(c.unpaired,2);assert.deepEqual(c.entries.at(-1).occupancy,[2,1,1]);assert.equal(c.normalized,'1s² 2s² 2p⁴');}
for(const [core,total]of [['He',2],['Ne',10],['Ar',18],['Kr',36],['Xe',54],['Rn',86],['Og',118]])assert.equal(parseConfiguration('['+core+']').total,total);
const iron=parseConfiguration('[Ar] 4s2 3d6');assert.equal(iron.total,26);assert.equal(iron.unpaired,4);assert.equal(iron.lastKey,'3d');assert.deepEqual(iron.shells,[{n:1,count:2},{n:2,count:8},{n:3,count:14},{n:4,count:2}]);
assert.equal(parseConfiguration('[Xe] 6s2 4f7').total,63);assert.equal(parseConfiguration('[Xe] 6s2 4f7').unpaired,7);assert.equal(parseConfiguration('20f14').total,14);
for(const invalid of ['', '1s3','2p7','2d1','3f1','0s1','21s1','1s0','1s2 1s1','[Ne] 2p5','[Fe] 4s2','2g1','1s','<script>bad</script>','1s2 trailing'])assert.throws(()=>parseConfiguration(invalid),undefined,invalid);
let shapes=0;
for(const [type,definition]of Object.entries(subshells)){
 for(let count=1;count<=definition.capacity;count++){const filled=occupations(type,count);assert.equal(filled.length,2*definition.l+1);assert.equal(filled.reduce((a,b)=>a+b),count);assert.ok(filled.every(n=>n>=0&&n<=2));if(count<=filled.length)assert.ok(!filled.includes(2));}
 assert.equal(angularOrbitals[type].length,2*definition.l+1);
 for(let index=0;index<angularOrbitals[type].length;index++){const geometry=orbitalGeometry(type,index,64);assert.ok(geometry.attributes.position.array.every(Number.isFinite));assert.ok(geometry.attributes.normal.array.every(Number.isFinite));assert.ok(geometry.boundingSphere.radius>1);assert.equal(geometry.groups.length,2);assert.equal(geometry.groups.reduce((sum,g)=>sum+g.count,0),geometry.index.count);if(type!=='s')assert.ok(geometry.groups.every(g=>g.count>0));geometry.dispose();shapes++;}
}
assert.equal(angularOrbitals.p[0].fn(0,1,0),0);assert.equal(angularOrbitals.d[0].fn(1,0,0),0);assert.ok(Math.abs(angularOrbitals.d[4].fn(Math.sqrt(2/3),0,1/Math.sqrt(3)))<1e-12);assert.equal(angularOrbitals.f[0].fn(0,1,0),0);
for(const raw of ['1s1','1s2 2s2 2p4','[Ar] 4s2 3d6','[Xe] 6s2 4f7','[Og]','20f14']){
 const configuration=parseConfiguration(raw),surfaces=configurationSurfaces(configuration);assert.equal(surfaces.reduce((sum,s)=>sum+s.occupancy,0),configuration.total);assert.equal(surfaces.length,configuration.entries.reduce((sum,e)=>sum+e.occupancy.filter(n=>n>0).length,0));assert.ok(surfaces.every(s=>Number.isFinite(s.radius)&&s.radius>0&&s.radius<=2.45));
 for(const entry of configuration.entries){const layer=surfaces.filter(s=>s.key===entry.key);assert.equal(layer.reduce((sum,s)=>sum+s.occupancy,0),entry.count);assert.ok(layer.every(s=>s.type===entry.type&&s.index<angularOrbitals[s.type].length));}
 const hidden=new Set([configuration.entries[0].key]),filtered=configurationSurfaces(configuration,hidden);assert.ok(filtered.every(s=>!hidden.has(s.key)));assert.equal(filtered.reduce((sum,s)=>sum+s.occupancy,0),configuration.total-configuration.entries[0].count);assert.equal(configurationSurfaces(configuration,new Set(configuration.entries.map(e=>e.key))).length,0);
}
console.log(`PASS: configuration formats, seven noble-gas cores, capacities, quantum-number validation, Hund filling, invalid input, all ${shapes} finite s/p/d/f angular surfaces, and complete overall-view electron coverage/layer filtering.`);
