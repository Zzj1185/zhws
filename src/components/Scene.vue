<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import gsap from "gsap";

// 导入gui对象
import gui from "@/three/gui";
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
      y: 10,
      z: 20,
      duration: 2,
      onUpdate: () => {
      }
    });
  }

  if (e.type === 'lblc') {
    gsap.to(camera.position, {
      x: -15,
      y: 4,
      z: 0,
      duration: 2,
      onUpdate: () => {
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
        y: 10, // 固定高度
        z: z,
        duration: duration / totalSteps,
        delay: (duration / totalSteps) * i, // 每个位置之间的延迟
        onUpdate: () => {
        }
      });

      // 全景漫游结束后回到初始视角
      gsap.to(camera.position, {
        x: 0,
        y: 10,
        z: 20,
        duration: 0.5,
        delay: duration, // 在漫游结束后延迟执行
        onUpdate: () => {
        }
      });
    }
  }
});

// 排水充水模拟
eventHub.on('waterSimulation', (e) => {
  gsap.to(camera.position, {
    x: 0,
    y: 10,
    z: 10,
    duration: 0.5,
    onUpdate: () => {
    }
  });
  let y = e.type ? 0.2 : 2
  gsap.to(createmesh.waterGroups[0].position, {
    x: 1,
    y: y,
    z: 4,
    duration: 5,
    onUpdate: () => {
    }
  });

})

eventHub.on('waterPollution', (e) => {
  gsap.to(camera.position, {
    x: 0,
    y: 10,
    z: 10,
    duration: 0.5,
    onUpdate: () => {
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
eventHub.on("eventToggle", (i) => {
  eventListMesh.forEach((item) => {
    if (item.eventListIndex === i) {
      item.mesh.visible = true;
    } else {
      item.mesh.visible = false;
    }
  });
  const position = {
    x: props.eventList[i].position.x / 5 - 10,
    y: 0,
    z: props.eventList[i].position.y / 5 - 10,
  };
  //   controls.target.set(position.x, position.y, position.z);
  gsap.to(controls.target, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
  });
});


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
