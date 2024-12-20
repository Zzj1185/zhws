import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";

class ElementTag {
    constructor(object3d) {
        this.object3d = object3d;
        this.element = this.createElement();
        this.css2dObject = new CSS2DObject(this.element);
        this.css2dObject.position.copy(this.object3d.position);
    }

    createElement() {
        const element = document.createElement("div");
        element.className = "elementTag";
        element.innerHTML = `
      <div class="elementContent">
        <p>状态：开启</p>
      </div>
    `;
        return element;
    }

    getCSS2DObject() {
        return this.css2dObject;
    }
}

export default ElementTag;