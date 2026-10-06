export const ENTRY_DURATION=1.65;
export const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
export function localPoint(b,x,z){return {x:b.x+Math.cos(b.yaw)*x+Math.sin(b.yaw)*z,z:b.z-Math.sin(b.yaw)*x+Math.cos(b.yaw)*z}}
export function doorPoint(b,side=1){return localPoint(b,side*1.85,.15)}
export function nearestVehicle(person,vehicles,maxDistance=3){let result=null,distance=maxDistance;for(const v of vehicles){if(!v.active||v.police||Math.hypot(v.b.vx,v.b.vz)>2.5)continue;const door=doorPoint(v.b),d=Math.hypot(person.x-door.x,person.z-door.z);if(d<distance){result=v;distance=d}}return result}
export function clearPosition(x,z,obstacles,r=.35){return !obstacles.some(b=>{const dx=x-b.x,dz=z-b.z,c=Math.cos(b.yaw||0),s=Math.sin(b.yaw||0);return Math.abs(dx*c-dz*s)<b.hx+r&&Math.abs(dx*s+dz*c)<b.hz+r})}
export function movePerson(p,dx,dz,obstacles){if(clearPosition(p.x+dx,p.z,obstacles))p.x+=dx;if(clearPosition(p.x,p.z+dz,obstacles))p.z+=dz}
export function exitPoint(b,obstacles){for(const side of [1,-1]){const p=doorPoint(b,side);if(clearPosition(p.x,p.z,obstacles))return {...p,side}}return null}
export function transitionPose(t,from,to,entering){const u=entering?t:1-t;const slide=smooth((u-.3)/.5);return {x:from.x+(to.x-from.x)*slide,z:from.z+(to.z-from.z)*slide,y:-.48*smooth((u-.25)/.5),crouch:Math.sin(Math.PI*Math.min(1,u))* .7,door:Math.sin(Math.PI*smooth(Math.min(1,u/.95))),visible:u<.86}}
export const WEAPONS=[{name:'Unarmed',short:'HANDS',capacity:0,reserve:0,interval:.5},{name:'Pistol',short:'PISTOL',capacity:12,reserve:72,interval:.28},{name:'SMG',short:'SMG',capacity:30,reserve:150,interval:.085}];
export function loadout(){return WEAPONS.map(w=>({ammo:w.capacity,reserve:w.reserve,reload:0,cooldown:0}))}
export function fireWeapon(slot,index){if(index===0||slot.reload>0||slot.cooldown>0||slot.ammo<=0)return false;slot.ammo--;slot.cooldown=WEAPONS[index].interval;return true}
export function reloadWeapon(slot,index){if(index===0||slot.reload>0||slot.reserve<=0||slot.ammo===WEAPONS[index].capacity)return false;slot.reload=1.4;return true}
export function tickWeapon(slot,index,dt){slot.cooldown=Math.max(0,slot.cooldown-dt);if(slot.reload>0){slot.reload=Math.max(0,slot.reload-dt);if(slot.reload===0){const n=Math.min(WEAPONS[index].capacity-slot.ammo,slot.reserve);slot.ammo+=n;slot.reserve-=n}}}
