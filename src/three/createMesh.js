import * as THREE from "three";
import scene from "./scene";
import camera from "./camera";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import ElementTag from "./tool/ElementTag"; // Import the ElementTag class

import { Water } from "three/examples/jsm/objects/Water2";
import composers from "./composer"
import controls from "./controls";
const { composer, outLinePass } = composers
class createMesh {
  constructor() {

    this.mainModel = null;
    this.sonModel = null;
    this.percent = 0

    this.mainModelTags = [];

    this.waterGroups = [];

    this.addLights()


    this.loadModel('./model/wumuObj/石桥铺.mtl', './model/wumuObj/石桥铺.obj', this.mainModel, (e) => {
      this.mainModel = e;
      this.renderDeviceStauts(e);
      this.hideMainModelTags()
      this.addWater();

      // 获取模型的包围盒
      const box = new THREE.Box3().setFromObject(this.mainModel);
      // 计算模型的尺寸
      const size = box.getSize(new THREE.Vector3());
      // 输出模型的尺寸
      // console.log('模型的宽度：', size.x);
      // console.log('模型的高度：', size.y);
      // console.log('模型的深度：', size.z);
    })

  }
  loadSonModel() {
    this.loadModel('./model/zaixianjifangObj/在线机房.mtl', './model/zaixianjifangObj/在线机房.obj', this.sonModel, (e) => {
      this.sonModel = e;
      this.sonModel.scale.set(5, 5, 5);
      this.sonModel.visible = true;
    })
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 颜色和强度
    scene.add(ambientLight);
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(hemisphereLight);
  }

  addOutLine(modelName = this.mainModel) {




  }

  removeOutLine() {
    outLinePass.selectedObjects = []
  }

  // 加载设备状态
  renderDeviceStauts(modelName = this.mainModel) {
    modelName.traverse((child) => {
      if (child.isMesh) {
        if (child.material.name === 'Material__809') {//Material__1134
          child.material = new THREE.MeshBasicMaterial({
            color: 0x00beff,
            transparent: true,
            opacity: .1,
            //开启线框
            wireframe: true
          });
          const elementTag = new ElementTag(child);
          this.mainModelTags.push(elementTag.getCSS2DObject());
          modelName.add(elementTag.getCSS2DObject());
          outLinePass.selectedObjects.push(child)


        }
        modelName.traverse((child) => {
          if (child.isMesh) {
            if (child.name == 'mixer') {
              const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
              child.material = material;


            }
            if (child.material.name === 'Material__1134') {//Material__1134
              const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
              child.material = material
            }

            if (child.name == 'pool') {
              const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
              child.material = material
            }
          }
        });

      }
    });


  }

  addWater() {
    // 创建水面 
    const waterGeometry = new THREE.PlaneGeometry(700, 400);
    const water = new Water(waterGeometry, {
      // textureWidth: 512,
      // textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        '/textures/water/test.jpg',
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x7f5e4c,
      color: 0xffffff,
      distortionScale: 5,
      fog: scene.fog !== undefined,
    })
    water.rotation.x = -Math.PI / 2;
    water.position.set(55, 100, 200); // 设置水面位置
    this.waterGroups.push(water)
    scene.add(water);
  }

  loadModel(mtlSrc = './model/wumuObj/石桥铺.mtl', objSrc = './model/wumuObj/石桥铺.obj', modelName = this.mainModel, callback) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlSrc, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      // 进度条文字百分比元素
      const progressText = document.getElementsByClassName('progress-loading')[0];
      // 监听加载进度
      objLoader.load(objSrc,
        (object) => {
          object.position.set(0, 0, 0);
          scene.add(object);
          // 调用回调函数
          if (callback && typeof callback === 'function') {
            callback(object);
          }
          document.getElementsByClassName('progress-circle-container')[0].style.display = 'none';

        },
        (xhr) => {

          // 模型加载百分比进度
          const percent = ((xhr.loaded / xhr.total) * 100).toFixed(1);
          // 告诉用户加载进度百分比
          progressText.innerText = `${percent}%`;
          // if (percent == 100) {
          //   progressText.innerText = 'Loading'
          // }
          // console.log(percent);
        },
        (error) => {
          console.error('加载模型时出错:', error, mtlSrc);
        }
      );
    });
  }



  showMainModel() {
    this.mainModel.visible = true
    this.mainModelTags.forEach((tag) => {
      tag.visible = true;
    });

    this.waterGroups.forEach((water) => {
      water.visible = true
    })
  };
  showSonModel() {
    if (!this.sonModel) {
      this.loadSonModel()
    } else {
      this.sonModel.visible = true
    }

  };
  hideMainModel() {
    this.mainModel.visible = false;
    this.mainModelTags.forEach((tag) => {
      tag.visible = false;
    });
    this.waterGroups.forEach((water) => {
      water.visible = false
    })
  };
  hideSonModel() {
    this.sonModel.visible = false
  };

  showMainModelTags() {
    this.mainModelTags.forEach((tag) => {
      tag.visible = true;
    });
  }

  hideMainModelTags() {
    this.mainModelTags.forEach((tag) => {
      tag.visible = false;
    });
  }

  setupEventListeners(callback) {
    let that = this
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
          if (callback && typeof callback === 'function') {
            callback(clickedObject); // 传递被点击的对象
          }
        }
      }
    });
    window.addEventListener('click', (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        console.log(intersectedObject);
        // console.log('模型名称:', intersectedObject.name);
        // console.log('模型位置:', intersectedObject.position);
        // console.log('相机getWorldDirection:', camera, camera.getWorldDirection(new THREE.Vector3()));
        console.log('相机getWorldPosition:', camera, camera.getWorldPosition(new THREE.Vector3()));
        // console.log('相机getWorldScale:', camera, camera.getWorldScale(new THREE.Vector3()));
        // console.log('相机getWorldRotation:', camera, camera.getWorldQuaternion(new THREE.Euler()));

        // console.log('控制器:', controls.target);
        // console.log('控制器:', controls.getDistance());


        // const clickedObject = intersects[0].object;
        // if (clickedObject.name === clickedObject.name) {

        //   that.hideMainModel();
        //   that.showSonModel()// 调用回调函数

        //   if (callback && typeof callback === 'function') {
        //     callback(clickedObject); // 传递被点击的对象
        //   }
        // }
      }
    });
  }

}

export default createMesh;
