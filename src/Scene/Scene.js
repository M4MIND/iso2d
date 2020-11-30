const GameObject = require("../GameObject/GameObject");
class Scene {
    constructor(core) {
        this._core = core;
        this._gameObjects = [];
        this._lights = [];
    }

    get core () {
        return this._core;
    }

    /** @returns {GameObject[]} */
    get gameObjects() {
        return this._gameObjects;
    }

    get lights () {
        return this._lights;
    }

    /** @param {GameObject} gameObject */
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);

        return gameObject;
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