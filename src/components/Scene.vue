<template>
  <div class="sceneBox">
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
  console.log(createmesh, "createmesh dblClickModel");
  if (e) {
    createmesh.hideSonModel();
    createmesh.showMainModel();

  } else {
    createmesh.showSonModel()
    createmesh.hideMainModel();

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
      x: -247,
      y: 340,
      z: -828,
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
        y: 1500, // 固定高度
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
  // 创建gltf模型加载器
  const gltfLoader = new GLTFLoader();
  gltfLoader.loadAsync("./model/worker.glb").then(gltf => {
    gltf.scene.name = '人物模型';
    gltf.scene.scale.set(50, 50, 50);
    gltf.scene.position.set(-500, 0, 500); // 初始位置
    gltf.scene.rotateY(Math.PI / 2); // 90度转换为弧度
    scene.add(gltf.scene);

    // 设置初始摄像头位置
    camera.position.copy(gltf.scene.getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(-300, 120, 0));
    camera.lookAt(gltf.scene.position.x, 120, gltf.scene.position.z);
    controls.target.set(gltf.scene.position.x, 120, gltf.scene.position.z);
    controls.update();

    // 直线路径动画
    gsap.to(gltf.scene.position, {
      x: 600,   // 直线终点
      y: 0,
      z: 500,
      duration: 5,
      delay: 2,
      onComplete: () => {
        // 转弯后的动画
        gsap.to(gltf.scene.rotation, {
          y: Math.PI,  // 转弯，180度旋转
          duration: 1,  // 转弯的时间
          onComplete: () => {
            // 转弯后继续走直线
            gsap.to(gltf.scene.position, {
              x: 600,  // 新的目标位置
              y: 0,
              z: 0,
              duration: 5,
              onUpdate: () => {
                camera.position.copy(gltf.scene.getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(0, 120, 300));
                camera.lookAt(gltf.scene.position.x, 120, gltf.scene.position.z);
                controls.target.set(gltf.scene.position.x, 120, gltf.scene.position.z);
                controls.update();
              },
              onStart: () => {
                controls.enabled = false;  // 禁用控制器
              },
              onComplete: () => {
                controls.enabled = true;  // 启用控制器
                scene.remove(gltf.scene); // 完成后移除场景中的人物
                camera.lookAt(0, 0, 0); // 恢复相机视角
                camera.position.set(1000, 1000, 1000);
                controls.target.set(0, 0, 0);
              }
            });
          }
        });
      },
      onUpdate: () => {
        camera.position.copy(gltf.scene.getWorldPosition(new THREE.Vector3())).add(new THREE.Vector3(-300, 120, 0));
        camera.lookAt(gltf.scene.position.x, 120, gltf.scene.position.z);
        controls.target.set(gltf.scene.position.x, 120, gltf.scene.position.z);
        controls.update();
      },
      onStart: () => {
        controls.enabled = false; // 禁用控制器
      },
    });
  });
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

.sceneBox {
  border: 1px solid red;
}
</style>
