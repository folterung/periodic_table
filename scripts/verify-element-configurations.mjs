import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { elements } from '../dist/elements.js';
import { elementConfigurations, elementConfiguration, configurationSources } from '../src/element-configurations.js';
import { parseConfiguration } from '../src/electron-config.js';
import { configurationSurfaces } from '../src/orbital-overview.js';

assert.equal(elementConfigurations.length,118);
assert.deepEqual(elementConfigurations.map(record=>record.number),elements.map(element=>element.number));
const entries=raw=>parseConfiguration(raw).entries.map(({key,count})=>[key,count]);
for(const record of elementConfigurations){
 const configuration=parseConfiguration(record.configuration);
 assert.equal(configuration.total,record.number,`Neutral electron total for ${record.number}`);
 assert.equal(configurationSurfaces(configuration).reduce((sum,surface)=>sum+surface.occupancy,0),record.number,`All electrons visualized for ${record.number}`);
 assert.ok(configuration.entries.every(entry=>entry.count<=entry.capacity));
 assert.ok(configurationSources[record.source]);
 assert.equal(record.predicted,record.number>=103);
 assert.equal(elementConfiguration(record.number),record);
}
for(const invalid of [0,119,1.5,'26',null])assert.throws(()=>elementConfiguration(invalid),RangeError);

// Compare every NIST-backed assignment with the retained source export,
// including its [Cd]/[Hg] abbreviations and implicit occupancy of one.
const snapshot=await readFile(new URL('../docs/data/nist-neutral-ground-shells.csv',import.meta.url),'utf8');
const rows=snapshot.split('\n').filter(line=>line.startsWith('"=""')).map(line=>[...line.matchAll(/"=""((?:""|[^"\n])*)"""/g)].map(match=>match[1]));
assert.equal(rows.length,108);
for(const row of rows){
 const number=Number(row[0]),record=elementConfiguration(number);
 const raw=row[3].replace('[Cd]','[Kr].4d10.5s2').replace('[Hg]','[Xe].4f14.5d10.6s2').split('.').map(token=>/^\d+[spdf]$/.test(token)?token+'1':token).join(' ');
 assert.equal(row[1],elements[number-1].symbol+' I');
 assert.equal(record.source,'nist');
 assert.deepEqual(entries(record.configuration),entries(raw),`NIST ground shells for ${number}`);
}

// Independently specified exception expectations catch simple filling-order regressions.
for(const [number,expected] of [[1,'1s1'],[8,'[He] 2s2 2p4'],[24,'[Ar] 3d5 4s1'],[29,'[Ar] 3d10 4s1'],[41,'[Kr] 4d4 5s1'],[42,'[Kr] 4d5 5s1'],[46,'[Kr] 4d10'],[58,'[Xe] 4f1 5d1 6s2'],[64,'[Xe] 4f7 5d1 6s2'],[78,'[Xe] 4f14 5d9 6s1'],[96,'[Rn] 5f7 6d1 7s2'],[103,'[Rn] 5f14 7s2 7p1']])assert.deepEqual(entries(elementConfiguration(number).configuration),entries(expected),`Exception/reference configuration for ${number}`);

const predictions=JSON.parse(await readFile(new URL('../docs/data/predicted-ground-shells.json',import.meta.url),'utf8'));
assert.equal(predictions.length,10);
for(const row of predictions){
 const record=elementConfiguration(row.number);
 assert.equal(record.source,row.source);
 assert.deepEqual(entries(record.configuration),entries(row.configuration),`Published prediction for ${row.number}`);
 assert.ok(row.url.startsWith('https://'));
}
console.log('PASS: 118 sourced neutral configurations, full visual electron coverage, 108 retained NIST assignments, published superheavy predictions, ground-state exceptions, and prediction labels.');
