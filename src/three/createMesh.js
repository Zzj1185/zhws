import * as THREE from "three";
import scene from "./scene";
import camera from "./camera";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import ElementTag from "./tool/ElementTag"; // Import the ElementTag class
import { Water } from "three/examples/jsm/objects/Water2";
class createMesh {
  constructor() {
    this.mainModel = null;
    this.sonModel = null;

    this.mainModelTags = [];

    this.waterGroups = []

    this.addLights()

    this.loadModel('./model/wumuObj/石桥铺.mtl', './model/wumuObj/石桥铺.obj', this.mainModel, (e) => {
      this.mainModel = e
      this.mainModel.scale.set(0.02, 0.02, 0.02);
      this.renderDeviceStauts(e);
      this.hideMainModelTags()
      this.addWater()
      let test = scene.getObjectByName('Material__1134')
      console.log(test, "test");
    })
    this.loadModel('./model/zaixianjifangObj/在线机房.mtl', './model/zaixianjifangObj/在线机房.obj', this.sonModel, (e) => {
      this.sonModel = e;
      this.sonModel.scale.set(0.2, 0.2, 0.2);
      this.sonModel.visible = false;
    })
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 颜色和强度
    scene.add(ambientLight);
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(hemisphereLight);
  }

  // 加载设备状态
  renderDeviceStauts(modelName = this.mainModel) {
    modelName.traverse((child) => {
      if (child.isMesh) {
        if (child.material.name === 'Material__1134') {
          child.material = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });
          const elementTag = new ElementTag(child);
          this.mainModelTags.push(elementTag.getCSS2DObject());
          modelName.add(elementTag.getCSS2DObject());

        }
      }
    });
  }

  addWater() {
    // 创建水面 
    const waterGeometry = new THREE.PlaneGeometry(14, 8);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        '/textures/water/Water_1_M_Normal.jpg',
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    })
    water.rotation.x = -Math.PI / 2;
    water.position.set(1, 2, 4); // 设置水面位置
    this.waterGroups.push(water)
    scene.add(water);
  }


  loadModel(mtlSrc = './model/wumuObj/石桥铺.mtl', objSrc = './model/wumuObj/石桥铺.obj', modelName = this.mainModel, callback) {
    const mtlLoader = new MTLLoader();

    mtlLoader.load(mtlSrc, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();

      objLoader.setMaterials(materials);

      // 监听加载进度
      objLoader.load(objSrc,
        (object) => {
          object.position.set(0, 0, 0);
          scene.add(object);

          // 调用回调函数
          if (callback && typeof callback === 'function') {
            callback(object);
          }
        },
        (xhr) => {
          // 计算进度并输出
          const progress = (xhr.loaded / xhr.total) * 100;
          console.log(`模型加载进度: ${progress.toFixed(2)}%`, mtlSrc);
        },
        (error) => {
          console.error('加载模型时出错:', error, mtlSrc);
        }
      );
    });
  }

  // loadModel(mtlSrc = './model/wumuObj/石桥铺.mtl', objSrc = './model/wumuObj/石桥铺.obj', modelName = this.mainModel, callback) {
  //   const mtlLoader = new MTLLoader();
  //   mtlLoader.load(mtlSrc, (materials) => {
  //     materials.preload();
  //     const objLoader = new OBJLoader();
  //     objLoader.setMaterials(materials);
  //     objLoader.load(objSrc, (e) => {
  //       e.position.set(0, 0, 0);
  //       scene.add(e);
  //       // 调用回调函数
  //       if (callback && typeof callback === 'function') {
  //         callback(e);
  //       }
  //     });
  //   });
  // }

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
    this.sonModel.visible = true
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

          that.hideMainModel();
          that.showSonModel()// 调用回调函数

          if (callback && typeof callback === 'function') {
            callback(clickedObject); // 传递被点击的对象
          }
        }
      }
    });
  }

}

export default createMesh;
