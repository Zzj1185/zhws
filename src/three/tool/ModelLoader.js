import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import * as THREE from "three";

class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.loadedModels = []; // Store loaded models for easy access
    }

    loadModel(mtlPath, objPath, scale = 1, position = new THREE.Vector3(0, 0, 0), onLoadCallback) {
        const mtlLoader = new MTLLoader();
        mtlLoader.load(mtlPath, (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(objPath, (object) => {
                object.scale.set(scale, scale, scale);
                object.position.copy(position);
                this.scene.add(object);
                this.group.add(object);
                this.loadedModels.push(object); // Keep track of the loaded model

                if (onLoadCallback) {
                    onLoadCallback(object);
                }
            });
        });
    }

    showModel(index) {
        if (this.loadedModels[index]) {
            this.loadedModels[index].visible = true;
        }
    }

    hideModel(index) {
        if (this.loadedModels[index]) {
            this.loadedModels[index].visible = false;
        }
    }

    getGroup() {
        return this.group;
    }
}

export default ModelLoader;