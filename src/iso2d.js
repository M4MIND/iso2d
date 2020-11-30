const Behaviour = require("./Behaviour/Behaviour");
const Camera = require("./Camera/Camera");
const Render = require("./Render/Render");
const Scene = require("./Scene/Scene");
const Screen = require("./System/Screen");

class iso2d {
    constructor(canvas, camera, scene) {
        this._canvas = canvas || null;
        this._scene = scene || new Scene(this);
        this._camera = camera || new Camera(this);
        this._screeen = screen || new Screen(this);
        this._render = new Render(this);
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

    /** @returns {Render} */
    get render() {
        return this._render;
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
        for (let gm of this.scene.gameObjects) {
            for (let component of gm.allComponents()) {
                component.onUpdate(this);
                component.onDraw(this);
            };
        }

        this.render.render();
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}

module.exports = iso2d;