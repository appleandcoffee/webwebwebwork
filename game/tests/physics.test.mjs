import assert from 'node:assert/strict';
import {body,drive,integrate,collide,STEP} from '../physics.mjs';
// Chase camera is behind +Z travel: world +X projects to screen left.
for(const steering of [-1,1]){const b=body();b.vz=15;for(let i=0;i<60;i++){drive(b,{steer:steering,gas:true},STEP);integrate(b,STEP)}assert.equal(Math.sign(b.x),steering);}
const car=body(0,0);car.vz=20;const wall=body(0,2.8,0,0,20,.5);const impact=collide(car,wall);assert(impact?.impact>=19);assert(car.vz<0);assert(Math.abs(car.omega)<1e-6);
const a=body(0,0),b=body(1.3,4);a.vz=20;const before=a.mass*a.vz;const hit=collide(a,b);assert(hit);assert(b.vz>0);assert(Math.abs(a.omega)+Math.abs(b.omega)>.1);assert(Math.abs(a.mass*a.vz+b.mass*b.vz-before)<.01);
const runner=body();const barrier=body(0,30,0,0,20,1);let crashed=false;for(let i=0;i<600;i++){drive(runner,{gas:true},STEP);integrate(runner,STEP);crashed=!!collide(runner,barrier)||crashed;assert(Number.isFinite(runner.x+runner.z+runner.omega));assert(runner.z<30)}assert(crashed);
console.log('Passed: left/right steering, wall rebound, off-center angular impulse, momentum transfer, high-speed wall containment.');
