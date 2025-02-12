import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";

class ElementBuildTag {
    constructor(object3d) {
        this.object3d = object3d;
        this.element = this.createElement();
        this.css2dObject = new CSS2DObject(this.element);
        // this.css2dObject.position.copy(this.object3d.position);
        this.css2dObject.position.copy(new THREE.Vector3(0, 131, 0));//暂时写死，因为模型位置都是0,0,0; 
    }

    createElement() {
        const element = document.createElement("div");
        element.className = "elementTag";

        element.innerHTML = `
      <div id="buildLabel">
        <p class=name>buid</p>
      </div>
    `;
        return element;
    }

    getCSS2DObject() {
        return this.css2dObject;
    }
}

export default ElementBuildTag;