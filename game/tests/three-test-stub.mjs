export * from '../three.module.js';
import {Texture} from '../three.module.js';
export class WebGLRenderer{constructor(){this.domElement=document.createElement('canvas');globalThis.testCanvas=this.domElement;this.shadowMap={}}setSize(){}setPixelRatio(){}render(scene,camera){scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);scene.traverse(o=>{if(!Number.isFinite(o.position.x+o.position.y+o.position.z+o.rotation.x+o.rotation.y+o.rotation.z))throw Error('Nonfinite scene transform')})}}
export class PMREMGenerator{fromScene(){return {texture:new Texture()}}dispose(){}}
