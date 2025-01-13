import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import scene from "./scene";
import camera from "./camera";
import renderers from "./renderer";
const { renderer, css3drender } = renderers;



// 添加效果合成
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);


const outLinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
);
const outlineParams = {
    edgeStrength: 4,
    edgeGlow: 1.0,
    edgeThickness: 4,
    pulsePeriod: 1
};

outLinePass.edgeStrength = outlineParams.edgeStrength; //粗
outLinePass.edgeGlow = outlineParams.edgeGlow; //发光
outLinePass.edgeThickness = outlineParams.edgeThickness; //光晕粗
outLinePass.pulsePeriod = outlineParams.pulsePeriod; //闪烁                                                                                                                                                                .usePatternTexture = false; //true
outLinePass.visibleEdgeColor.set('#ff0000');
outLinePass.hiddenEdgeColor.set('#ff0000');
composer.addPass(outLinePass);
outLinePass.selectedObjects = [];

export default { composer, outLinePass }