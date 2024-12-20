import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
  // logarithmicDepthBuffer: true,
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMappingExposure = 1.5

// 创建css3drender
const css3drender = new CSS2DRenderer();
css3drender.setSize(window.innerWidth, window.innerHeight);
document.querySelector(".cssrender").appendChild(css3drender.domElement);

export default { renderer, css3drender };
