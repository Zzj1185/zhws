import * as THREE from "three";

// 初始化场景
const scene = new THREE.Scene();

// 场景天空盒
const textureCubeLoader = new THREE.CubeTextureLoader().setPath("./textures/");
const textureCube = textureCubeLoader.load([
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
]);



scene.background = textureCube;
scene.environment = textureCube;

export default scene;


// import * as THREE from 'three';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// // 初始化场景
// const scene = new THREE.Scene();

// // 创建 HDR 加载器
// const rgbeLoader = new RGBELoader();

// // 加载 HDR 文件
// rgbeLoader.load('./textures/01.hdr', (texture) => {

//   // 设置为环境贴图
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   // scene.environment = texture; // 设置环境光照
//   scene.background = texture;   // 设置背景

// });

// // 导出场景
// export default scene;


