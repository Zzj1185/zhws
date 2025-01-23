import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";

class ElementTag {
    constructor(object3d) {
        this.object3d = object3d;
        this.element = this.createElement();
        this.css2dObject = new CSS2DObject(this.element);
        // this.css2dObject.position.copy(this.object3d.position);
        this.css2dObject.position.copy(new THREE.Vector3(-704, 131, 404));//暂时写死，因为模型位置都是0,0,0


    }

    createElement() {
        const element = document.createElement("div");
        element.className = "elementTag";
        element.innerHTML = `
      <div class="elementContent">
        <p>PH:5.5</p>
      </div>
    `;
        return element;
    }

    getCSS2DObject() {
        return this.css2dObject;
    }
}

export default ElementTag;