import * as THREE from "three";

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerHeight / window.innerHeight,
  1,
  100000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(1000, 1000, 1000);
camera.lookAt(0, 0, 0)

export default camera;
