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
import AlarmSprite from "@/three/mesh/AlarmSprite";
import LightWall from "@/three/mesh/LightWall";
import FlyLineShader from "@/three/mesh/FlyLineShader";
import LightRadar from "@/three/mesh/LightRadar";
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
const eventListMesh = [];
let mapFn = {
  火警: (position, i) => {
    const lightWall = new LightWall(1, 2, position);
    lightWall.eventListIndex = i;
    // scene.add(lightWall.mesh);
    // eventListMesh.push(lightWall);
  },
  治安: (position, i) => {
    //   生成随机颜色
    const color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    ).getHex();
    // 添加着色器飞线
    const flyLineShader = new FlyLineShader(position, color);
    flyLineShader.eventListIndex = i;
    // scene.add(flyLineShader.mesh);
    // eventListMesh.push(flyLineShader);
  },
  电力: (position, i) => {
    // 添加雷达
    const lightRadar = new LightRadar(2, position);
    lightRadar.eventListIndex = i;
    // scene.add(lightRadar.mesh);
    // eventListMesh.push(lightRadar);
  },
};

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

watch(
  () => props.eventList,
  (val) => {
    // console.log(val);
    eventListMesh.forEach((item) => {
      item.remove();
    });
    props.eventList.forEach((item, i) => {
      const position = {
        x: item.position.x / 5 - 10,
        z: item.position.y / 5 - 10,
      };
      const alarmSprite = new AlarmSprite(item.name, position);
      alarmSprite.onClick(() => {
        // console.log(item.name, i);
        eventHub.emit("spriteClick", { event: item, i });
      });
      alarmSprite.eventListIndex = i;
      eventListMesh.push(alarmSprite);
      // scene.add(alarmSprite.mesh);
      if (mapFn[item.name]) {
        mapFn[item.name](position, i);
      }
    });
  }
);
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
