export const subshells={s:{l:0,capacity:2,color:'#ff38bc'},p:{l:1,capacity:6,color:'#497bff'},d:{l:2,capacity:10,color:'#ff951f'},f:{l:3,capacity:14,color:'#bc64ff'}};
const cores={He:'1s2',Ne:'1s2 2s2 2p6',Ar:'1s2 2s2 2p6 3s2 3p6',Kr:'1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6',Xe:'1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6',Rn:'1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s2 6p6',Og:'1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 5f14 6s2 6p6 6d10 7s2 7p6'};
const superscripts='⁰¹²³⁴⁵⁶⁷⁸⁹';
export const superscript=n=>String(n).replace(/\d/g,d=>superscripts[Number(d)]);
export function occupations(type,count){
 const slots=2*subshells[type].l+1;
 return Array.from({length:slots},(_,i)=>Number(count>i)+Number(count>slots+i));
}
export function parseConfiguration(raw){
 let input=String(raw).trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,d=>String(superscripts.indexOf(d))).replace(/\^\s*\{(\d+)\}/g,'^$1').replace(/[,;·]/g,' ');
 if(!input)throw Error('Enter a configuration, such as 1s2 2s2 2p4.');
 if(input.length>1200)throw Error('Please use a configuration shorter than 1,200 characters.');
 const core=input.match(/^\[([a-z]{1,2})\]/i);let coreName=null;
 if(core){coreName=Object.keys(cores).find(name=>name.toLowerCase()===core[1].toLowerCase());if(!coreName)throw Error('Use a noble-gas core: [He], [Ne], [Ar], [Kr], [Xe], [Rn], or [Og].');input=cores[coreName]+' '+input.slice(core[0].length);}
 const entries=[],seen=new Set(),token=/(\d{1,2})\s*([spdf])\s*(?:\^\s*)?(\d{1,2})(?=\s|$|\d{1,2}\s*[spdf])/iy;let cursor=0;
 while(cursor<input.length){
  while(/\s/.test(input[cursor]||'')&&cursor<input.length)cursor++;
  if(cursor===input.length)break;token.lastIndex=cursor;const match=token.exec(input);
  if(!match)throw Error(`Could not read “${input.slice(cursor,cursor+18)}”. Use shell + subshell + electron count, for example 2p4.`);
  const n=Number(match[1]),type=match[2].toLowerCase(),count=Number(match[3]),key=n+type,definition=subshells[type];
  if(n<1||n>20||match[1].startsWith('0'))throw Error('Use a shell number from 1 to 20.');
  if(n<=definition.l)throw Error(`${key} is not an allowed subshell. ${type} subshells start at shell ${definition.l+1}.`);
  if(count<1||count>definition.capacity)throw Error(`${key} can hold 1–${definition.capacity} electrons, not ${count}.`);
  if(seen.has(key))throw Error(`${key} appears more than once, including any noble-gas core. List each subshell once.`);
  seen.add(key);entries.push({key,n,type,count,l:definition.l,capacity:definition.capacity,occupancy:occupations(type,count)});cursor=token.lastIndex;
 }
 const lastKey=entries.at(-1)?.key;entries.sort((a,b)=>a.n-b.n||a.l-b.l);
 const total=entries.reduce((sum,e)=>sum+e.count,0),shells=[];
 for(const entry of entries){let shell=shells.find(s=>s.n===entry.n);if(!shell){shell={n:entry.n,count:0};shells.push(shell);}shell.count+=entry.count;}
 return{entries,total,shells,core:coreName,lastKey,unpaired:entries.reduce((sum,e)=>sum+e.occupancy.filter(n=>n===1).length,0),normalized:entries.map(e=>e.key+superscript(e.count)).join(' ')};
}

// Real angular functions on the unit sphere, up to an irrelevant scale/phase.
// Radius in the visualizer is proportional to |Y|; radial functions are omitted.
export const angularOrbitals={
 s:[{label:'s',fn:()=>1}],
 p:[{label:'pₓ',fn:(x,y,z)=>x},{label:'pᵧ',fn:(x,y,z)=>y},{label:'p_z',fn:(x,y,z)=>z}],
 d:[{label:'d_xy',fn:(x,y,z)=>x*y},{label:'d_yz',fn:(x,y,z)=>y*z},{label:'d_xz',fn:(x,y,z)=>x*z},{label:'d_x²−y²',fn:(x,y,z)=>x*x-y*y},{label:'d_z²',fn:(x,y,z)=>3*z*z-1}],
 f:[{label:'f_xyz',fn:(x,y,z)=>x*y*z},{label:'f_z(x²−y²)',fn:(x,y,z)=>z*(x*x-y*y)},{label:'f_x(x²−3y²)',fn:(x,y,z)=>x*(x*x-3*y*y)},{label:'f_y(3x²−y²)',fn:(x,y,z)=>y*(3*x*x-y*y)},{label:'f_xz²',fn:(x,y,z)=>x*(5*z*z-1)},{label:'f_yz²',fn:(x,y,z)=>y*(5*z*z-1)},{label:'f_z³',fn:(x,y,z)=>z*(5*z*z-3)}]
};
