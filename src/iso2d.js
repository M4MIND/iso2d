const Behaviour = require("./Behaviour/Behaviour");
const Camera = require("./Camera/Camera");
const Scene = require("./Scene/Scene");

class iso2d {
    constructor(camera, scene) {
        this._camera = camera || new Camera();
        this._scene = scene || new Scene();
        this._behaviours = [];
    }

    /** @returns {Camera} */
    get camera() {
        return this._camera;
    }

    /** @param {Camera} camera */
    set camera(camera) {
        this._camera = camera;
    }

    /** @returns {Scene} */
    get scene() {
        return this._scene;
    }

    /** @param {Scene} scene */
    set scene(scene) {
        this._scene = scene;
    }

    /** @param {Behaviour} behaviour */
    addBehaviour(behaviour) {
        if (behaviour.__proto__.name !== "Behaviour") {
            return null;
        }

        behaviour = new behaviour(this._scene);

        this._behaviours.push(behaviour);
    }

    start() {
        for (let bh of this._behaviours) {
            bh.start();
        }

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}

module.exports = iso2d;