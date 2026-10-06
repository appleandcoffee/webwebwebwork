// Fixed-step planar rigid bodies. Lengths are meters, velocities m/s, mass kg.
export const STEP=1/120;
export function body(x=0,z=0,yaw=0,mass=1350,hx=1.05,hz=2.35){return {x,z,yaw,vx:0,vz:0,omega:0,mass,inv:mass?1/mass:0,inertia:mass?3/(mass*(hx*hx+hz*hz)):0,hx,hz,damage:0};}
const dot=(a,b)=>a.x*b.x+a.z*b.z;
function axes(b){return [{x:Math.cos(b.yaw),z:-Math.sin(b.yaw)},{x:Math.sin(b.yaw),z:Math.cos(b.yaw)}]}
export function forward(b){return {x:Math.sin(b.yaw),z:Math.cos(b.yaw)}}
export function drive(b,input,dt){const f=forward(b),r={x:f.z,z:-f.x};let longitudinal=b.vx*f.x+b.vz*f.z,lateral=b.vx*r.x+b.vz*r.z;const steer=input.steer||0;
const grip=input.drift?2.4:9.5;
const steering=steer*.49/(1+Math.abs(longitudinal)*.021);
const yawTarget=longitudinal/2.8*Math.tan(steering);
b.omega+=(yawTarget-b.omega)*(1-Math.exp(-5.5*dt));
const engine=(input.gas?1:0)*(input.boost?12:7.8)*(1-Math.min(Math.max(longitudinal,0)/(input.boost?68:48),1));
let accel=engine;if(input.brake)accel-=longitudinal>1?17:longitudinal>-12?5:0;
accel-=longitudinal*.035+longitudinal*Math.abs(longitudinal)*.003;
if(input.drift)accel-=longitudinal*.25;
b.vx+=(f.x*accel-r.x*lateral*grip)*dt;b.vz+=(f.z*accel-r.z*lateral*grip)*dt;
if(!input.gas&&!input.brake&&Math.abs(longitudinal)<.07){b.vx*=.96;b.vz*=.96}
}
export function integrate(b,dt){b.x+=b.vx*dt;b.z+=b.vz*dt;b.yaw+=b.omega*dt;}
function support(b,dir){const [r,f]=axes(b);const dr=dot(r,dir),df=dot(f,dir);return {x:b.x+r.x*b.hx*(Math.abs(dr)<1e-7?0:Math.sign(dr))+f.x*b.hz*(Math.abs(df)<1e-7?0:Math.sign(df)),z:b.z+r.z*b.hx*(Math.abs(dr)<1e-7?0:Math.sign(dr))+f.z*b.hz*(Math.abs(df)<1e-7?0:Math.sign(df))}}
export function collide(a,b){if(!a.inv&&!b.inv)return null;if(Math.abs(a.x-b.x)>a.hx+a.hz+b.hx+b.hz||Math.abs(a.z-b.z)>a.hx+a.hz+b.hx+b.hz)return null;const aa=axes(a),ba=axes(b),delta={x:a.x-b.x,z:a.z-b.z};let overlap=Infinity,n;
for(const axis of [...aa,...ba]){const ra=Math.abs(dot(aa[0],axis))*a.hx+Math.abs(dot(aa[1],axis))*a.hz,rb=Math.abs(dot(ba[0],axis))*b.hx+Math.abs(dot(ba[1],axis))*b.hz;const penetration=ra+rb-Math.abs(dot(delta,axis));if(penetration<=0)return null;if(penetration<overlap){overlap=penetration;const sign=dot(delta,axis)>=0?1:-1;n={x:axis.x*sign,z:axis.z*sign}}}
const inv=a.inv+b.inv,sep=Math.max(overlap-.005,0)*.85/inv;a.x+=n.x*sep*a.inv;a.z+=n.z*sep*a.inv;b.x-=n.x*sep*b.inv;b.z-=n.z*sep*b.inv;
const sa=support(a,{x:-n.x,z:-n.z}),sb=support(b,n);const p=b.inv?{x:(sa.x+sb.x)/2,z:(sa.z+sb.z)/2}:sa;
const ar={x:p.x-a.x,z:p.z-a.z},br={x:p.x-b.x,z:p.z-b.z};const va={x:a.vx+a.omega*ar.z,z:a.vz-a.omega*ar.x},vb={x:b.vx+b.omega*br.z,z:b.vz-b.omega*br.x};const rel={x:va.x-vb.x,z:va.z-vb.z},vn=dot(rel,n);if(vn>=0)return null;
const ca=ar.z*n.x-ar.x*n.z,cb=br.z*n.x-br.x*n.z;const impulse=-(1.18)*vn/(inv+ca*ca*a.inertia+cb*cb*b.inertia);
function apply(x,z){a.vx+=x*a.inv;a.vz+=z*a.inv;a.omega+=(ar.z*x-ar.x*z)*a.inertia;b.vx-=x*b.inv;b.vz-=z*b.inv;b.omega-=(br.z*x-br.x*z)*b.inertia}apply(n.x*impulse,n.z*impulse);
const t={x:-n.z,z:n.x},ta=ar.z*t.x-ar.x*t.z,tb=br.z*t.x-br.x*t.z;const jt=Math.max(-impulse*.42,Math.min(impulse*.42,-dot(rel,t)/(inv+ta*ta*a.inertia+tb*tb*b.inertia)));apply(t.x*jt,t.z*jt);
return {x:p.x,z:p.z,nx:n.x,nz:n.z,impact:-vn,impulse};}
