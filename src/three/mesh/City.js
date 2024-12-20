

// import * as THREE from "three";
// import scene from "../scene";
// import camera from "../camera";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// import ElementTag from "../tool/ElementTag"; // Import the ElementTag class

// export default function createCity() {
//   // 添加光源
//   const ambientLight = new THREE.AmbientLight(0xffffff, 2);
//   scene.add(ambientLight);

//   const spotLight = new THREE.SpotLight(0xffffff);
//   spotLight.position.set(20, 80, 40);
//   spotLight.intensity = 2; // 增加点光源强度
//   scene.add(spotLight);



//   // 添加模型
//   const mtlLoader = new MTLLoader();
//   let plant_cube;
//   const group = new THREE.Group();

//   mtlLoader.load("./model/wumuObj/石桥铺.mtl", (materials) => {
//     materials.preload();
//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(materials);
//     objLoader.load("./model/wumuObj/石桥铺.obj", (object) => {
//       plant_cube = object;
//       object.scale.set(0.02, 0.02, 0.02);
//       object.position.set(0, 0, 0);
//       scene.add(plant_cube);

//       // 遍历子模型
//       object.traverse((child) => {
//         if (child.isMesh) {
//           console.log(child.material.name, child.position, child, "child.material.name");
//           if (child.material.name === 'Material__1070') {
//             // 设置为红色
//             child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });

//             // 添加标签
//             const elementTag = new ElementTag(child);
//             group.add(elementTag.getCSS2DObject());
//             object.add(elementTag.getCSS2DObject());
//           }
//         }
//       });

//       window.addEventListener('dblclick', (event) => {
//         const raycaster = new THREE.Raycaster();
//         const mouse = new THREE.Vector2();
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//         raycaster.setFromCamera(mouse, camera);
//         const intersects = raycaster.intersectObjects(scene.children, true);
//         if (intersects.length > 0) {
//           const clickedObject = intersects[0].object;
//           if (clickedObject.name === clickedObject.name) {
//             plant_cube.visible = false;
//           }
//         }
//       });
//     });
//   });
// }


import * as THREE from "three";
import scene from "../scene";
import camera from "../camera";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import ElementTag from "../tool/ElementTag"; // Import the ElementTag class

class City {
  constructor() {
    this.group = new THREE.Group();
    this.plantCube = null;
    this.init();
  }

  init() {
    this.addLights();
    this.loadModel();
    this.setupEventListeners();
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(20, 80, 40);
    spotLight.intensity = 2; // Increase light intensity
    scene.add(spotLight);
  }

  loadModel() {
    const mtlLoader = new MTLLoader();

    mtlLoader.load("./model/wumuObj/石桥铺.mtl", (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load("./model/wumuObj/石桥铺.obj", (object) => {
        this.plantCube = object;
        object.scale.set(0.02, 0.02, 0.02);
        object.position.set(0, 0, 0);
        scene.add(this.plantCube);

        // Traverse child models
        object.traverse((child) => {
          if (child.isMesh) {
            console.log(child.material.name, child.position, child, "child.material.name");
            if (child.material.name === 'Material__1070') {
              // Set to red
              child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });

              // Add tag
              const elementTag = new ElementTag(child);
              this.group.add(elementTag.getCSS2DObject());
              object.add(elementTag.getCSS2DObject());
            }
          }
        });
      });
    });
  }

  setupEventListeners() {
    window.addEventListener('dblclick', (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.name === clickedObject.name) {
          this.plantCube.visible = false;
        }
      }
    });
  }
}

export default City;