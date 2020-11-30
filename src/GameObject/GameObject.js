const RGBA = require("../Color/RGBA");
const Component = require("../Components/Component");
const Transform = require("../Mathf/Transform");

class GameObject {
    constructor() {
        this.tag = null;
        this.components = new Map();
        this.transform = new Transform();
        this.shadow = true;
        this.color = new RGBA(255, 255, 255, 255);
    }

    /**
     * 
     * @param {Component} component 
     */
    addComponent(component) {
        let name = component.name;
        component = new component();
        component.gameObject = this;

        this.components.set(name, component);
        return this.components.get(name);
    }

    /**
     * @returns {Component}
     */
    getComponent(component) {
        return this.components.get(component.name);
    }

    /**
     * @returns {Component[]}
     */
    allComponents() {
        return this.components.values();
    }

    onStart() {

    }

    onUpdate() {

    }

    onDraw(render) {
        for (let component of this.components.values()) {
            component.onDraw(render);
        }
    }

    start() {

    }

    update() {

    }
}

module.exports = GameObject;