import assert from 'node:assert/strict';
import { elements } from '../dist/elements.js';
import { elementConfiguration } from '../src/element-configurations.js';
import { parseConfiguration } from '../src/electron-config.js';
import { configurationValence } from '../src/valence.js';

for(const element of elements){
 const configuration=parseConfiguration(elementConfiguration(element.number).configuration);
 const valence=configurationValence(configuration,element);
 assert.equal(valence.count,element.valence,`${element.symbol}: existing Table convention`);
 assert.equal(valence.label,'Valence electrons');
 assert.ok(valence.count<=configuration.total);
 assert.ok(valence.explanation&&valence.convention);
}
// Explicit source-backed examples, including Pd's empty period-5 shell and Lr's 7p electron.
for(const [number,count,keys] of [[1,1,['1s']],[2,2,['1s']],[6,4,['2s','2p']],[8,6,['2s','2p']],[10,8,['2s','2p']],[11,1,['3s']],[17,7,['3s','3p']],[24,6,['3d','4s']],[26,8,['3d','4s']],[29,11,['3d','4s']],[46,10,['4d']],[58,2,['6s']],[63,2,['6s']],[96,2,['7s']],[103,3,['7s','7p']]]){
 const result=configurationValence(parseConfiguration(elementConfiguration(number).configuration),elements[number-1]);
 assert.equal(result.count,count);assert.deepEqual(result.keys,keys);
}
for(const [raw,count,n] of [['1s1',1,1],['[He]',2,1],['[Ne]',8,2],['[Ar] 3d5 4s1',1,4],['[Ar] 4s1 3d10',1,4],['[Kr] 4d10',18,4],['[Rn] 5f14 7s2 7p1',3,7],['20f14',14,20]]){
 const result=configurationValence(parseConfiguration(raw));
 assert.equal(result.count,count,raw);assert.equal(result.n,n);
 assert.equal(result.label,'Valence estimate');assert.equal(result.formal,false);
 assert.match(result.explanation,/identity, charge and bonding/);
}
const oxygen=parseConfiguration('1s2 2s2 2p4'),excited=parseConfiguration('1s2 2s2 3s2 3p2');
assert.equal(oxygen.total,excited.total);
assert.equal(configurationValence(oxygen).count,6);
assert.equal(configurationValence(excited).count,4,'Same total does not imply the same valence estimate');
assert.deepEqual(configurationValence(parseConfiguration('[Ar] 4s1 3d5'),elements[23]),configurationValence(parseConfiguration('1s2 2s2 2p6 3s2 3p6 3d5 4s1'),elements[23]),'Expanded cores and token order preserve the result');
console.log('PASS: valence counts match all 118 Table conventions; independent main-group/d/f exceptions, empty 5s in Pd, 7p in Lr, custom estimates, expanded cores and same-total excited configurations.');
