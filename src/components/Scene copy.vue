<template>
  <div>
    <div class="scene" ref="sceneDiv"></div>

  </div>


</template>

<script setup>

import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import gsap from "gsap";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入场景
import scene from "@/three/scene";
// 导入相机
import camera from "@/three/camera";
// 导入控制器
import controls from "@/three/controls";
// 导入辅助坐标轴
import axesHelper from "@/three/axesHelper";
// 导入渲染器
import renderers from "@/three/renderer";
const { renderer, css3drender } = renderers;
// 初始化调整屏幕
import "@/three/init";
// 导入添加物体函数
import createMesh from "@/three/createMesh";
// 导入每一帧的执行函数
import animate from "@/three/animate";
import eventHub from "@/utils/eventHub";
// // 添加人物模型函数
// import { addPeopleModel, WalkAction } from "@/three/addPeopleModel/index.js";

// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const props = defineProps(["eventList"]);
// 场景元素div
let sceneDiv = ref(null);
// 添加相机
scene.add(camera);
// 添加辅助坐标轴
scene.add(axesHelper);

// 创建物体
let createmesh = new createMesh();
createmesh.setupEventListeners((clickedObject) => {
  eventHub.emit("dblClickModel");
});
eventHub.on('dblClickModel', (e) => {
  if (e) {
    createmesh.hideSonModel();
    createmesh.showMainModel();

  }
})
// 改变视角
eventHub.on('changeView', (e) => {
  gsap.killTweensOf(camera.position);
  if (e.type === 'inital') {
    gsap.to(camera.position, {
      x: 0,
      y: 1000,
      z: 2000,
      duration: 2,
      onStart: () => {
        controls.enabled = false;
      },
      onComplete: () => {
        controls.enabled = true;
      }
    });
  }

  if (e.type === 'lblc') {
    gsap.to(camera.position, {
      x: -1500,
      y: 400,
      z: 0,
      duration: 2,
      onStart: () => {
        controls.enabled = false;
      },
      onComplete: () => {
        controls.enabled = true;
      }
    });
  }

  // 添加全景漫游，绕着 Y 轴转一圈
  if (e.type === 'panorama') {
    const radius = 20; // 半径
    const duration = 10; // 动画持续时间
    const totalSteps = 100; // 总步数

    // 计算每一步的角度
    const angleStep = (Math.PI * 2) / totalSteps;

    for (let i = 0; i <= totalSteps; i++) {
      const angle = angleStep * i;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      gsap.to(camera.position, {
        x: x,
        y: 1000, // 固定高度
        z: z,
        duration: duration / totalSteps,
        delay: (duration / totalSteps) * i, // 每个位置之间的延迟
        onStart: () => {
          controls.enabled = false;
        },
        onComplete: () => {
          controls.enabled = true;
        }
      });

      // 全景漫游结束后回到初始视角
      gsap.to(camera.position, {
        x: 0,
        y: 1000,
        z: 2000,
        duration: 0.5,
        delay: duration, // 在漫游结束后延迟执行
        onStart: () => {
          controls.enabled = false;
        },
        onComplete: () => {
          controls.enabled = true;
        }
      });
    }
  }
});

// 人物巡检
eventHub.on('inspection', (e) => {
  console.log(scene);
  console.log(controls.target, controls.getDistance(), camera.getWorldPosition(new THREE.Vector3()), camera.position);
  // 创建gltf模型加载器
  const gltfLoader = new GLTFLoader();
  gltfLoader.loadAsync("./model/worker.glb").then(gltf => {
    gltf.scene.name = '人物模型';
    gltf.scene.scale.set(50, 50, 50);
    gltf.scene.position.set(-500, 0, 500);
    // 旋转人物模型
    gltf.scene.rotateY(Math.PI / 2); // 90度转换为弧度
    // gltf.scene.add(camera)
    scene.add(gltf.scene);
    // 相机角度重置
    // camera.rotation.x = -2.94155980184249;
    // camera.rotation.y = -0.7112669230146991;
    // camera.rotation.z = -3.010007178052975;


    // // 相机位置重置
    // camera.position.set(
    //   -2.7124095703748665,
    //   2.9312702742680115,
    //   -4.457970849195001);


    let workerP = gltf.scene.getWorldPosition(new THREE.Vector3())

    // // 定义摄像头的相对位置偏移
    const offset = new THREE.Vector3(-30, 105, 0); // y: 高度, z: 后方位置
    // // 更新摄像头的位置，使其在人物的后上方
    camera.position.copy(workerP).add(offset)
    // 让摄像头始终朝向人物
    camera.lookAt(workerP);



    // gsap.to(gltf.scene.position, {
    //   x: 500,
    //   y: 0,
    //   z: 500,
    //   duration: 5,
    //   delay: 2,
    //   onComplete: () => {
    //     controls.enabled = true;
    //     gltf.scene.remove(camera);
    //     scene.remove(gltf.scene);
    //     camera.lookAt(0, 0, 0)
    //     //  还原相机
    //     camera.position.set(1000, 1000, 1000);
    //     controls.target.set(0, 0, 0)

    //   },
    //   onUpdate: () => {
    //     // camera.lookAt(gltf.scene.position.x, 82, gltf.scene.position.z)
    //     // controls.target.set(gltf.scene.position.x, 82, gltf.scene.position.z);

    //     // 定义摄像头的相对位置偏移
    //     const offset = new THREE.Vector3(0, 5, -10); // y: 高度, z: 后方位置

    //     // 更新摄像头的位置，使其在人物的后上方
    //     camera.position.copy(gltf.scene.position).add(offset);
    //     controls.target.set(camera.position);


    //     controls.update()
    //   },
    //   onStart: () => {
    //     controls.enabled = false;
    //   },

    // });

  })

});

// 排水充水模拟
eventHub.on('waterSimulation', (e) => {
  gsap.to(camera.position, {
    x: 0,
    y: 1000,
    z: 1000,
    duration: 0.5,
    onStart: () => {
      controls.enabled = false;
    },
    onComplete: () => {
      controls.enabled = true;
    }
  });

  let y = e.type ? 1 : 100
  gsap.to(createmesh.waterGroups[0].position, {
    x: 55,
    y: y,
    z: 200,
    duration: 5,
    onStart: () => {
      controls.enabled = false;
    },
    onComplete: () => {
      controls.enabled = true;
    }
  });

})

eventHub.on('waterPollution', (e) => {
  gsap.to(camera.position, {
    x: 0,
    y: 1000,
    z: 1000,
    duration: 0.5,
    onStart: () => {
      controls.enabled = false;
    },
    onComplete: () => {
      controls.enabled = true;
    }
  });
  const targetColor = e.type ? new THREE.Color(0xd08d1b) : new THREE.Color(0xffffff);
  gsap.to(createmesh.waterGroups[0].material.uniforms.color.value, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    duration: 3, // 动画持续时间
    onUpdate: () => {
      createmesh.waterGroups[0].material.needsUpdate = true; // 需要更新材质
    },
    onStart: () => {
      controls.enabled = false;
    },
    onComplete: () => {
      controls.enabled = true;
    }
  });
})
eventHub.on('togglePanel', (e) => {
  if (e.type) {
    createmesh.showMainModelTags();
  } else {
    createmesh.hideMainModelTags();
  }
})

onMounted(() => {
  // // 创建GUI
  // const gui = new GUI();
  // // 创建几何体
  // const geometry = new THREE.BoxGeometry(10, 10, 10);
  // // 创建材质
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // cube.position.set(-639, 0, 471)
  // scene.add(cube)

  // let folder = gui.addFolder("立方体位置");
  // folder
  //   .add(cube.position, "x")
  //   .min(-1000)
  //   .max(1000)
  //   .step(1)
  //   .name("立方体x轴位置")
  //   .onChange((val) => {
  //     console.log("立方体x轴位置", val);
  //   });
  // folder
  //   .add(cube.position, "y")
  //   .min(-1000)
  //   .max(1000)
  //   .step(1)
  //   .name("立方体y轴位置")
  //   .onFinishChange((val) => {
  //     console.log("立方体y轴位置", val);
  //   });
  // folder.add(cube.position, "z").min(-1000).max(1000).step(1).name("立方体z轴位置");



  sceneDiv.value.appendChild(renderer.domElement);
  sceneDiv.value.appendChild(css3drender.domElement);
  animate();
});

eventHub.on('highLightModel', (e) => {
  if (!e.type) {
    createmesh.removeOutLine()
  } else {
    createmesh.addOutLine()
  }

})



</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
