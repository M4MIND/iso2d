const GameObject = require("../GameObject/GameObject");

class Scene {
    constructor() {
        this.gameObjects = [];
    }

    /** @param {GameObject} gameObject */
    add(gameObject) {
        this.gameObjects.push(gameObject);
    }

    /** @returns {GameObject[]} */
    all() {
        return this.gameObjects;
    }
}

module.exports = Scene;