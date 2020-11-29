const GameObject = require("../GameObject/GameObject");

class Scene {
    constructor() {
        this.gameObjects = [];
        this.lights = [];
    }

    /** @param {GameObject} gameObject */
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }


    /** @returns {GameObject[]} */
    allGameObjects() {
        return this.gameObjects;
    }

    
    addLight(light) {
        this.lights.push(light);
    }

    allLights() {
        return this.lights;
    }
}

module.exports = Scene;