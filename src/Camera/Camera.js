const Mathf = require("../Mathf/Mathf");
const { Vector3, Matrix4, Quaternion } = require("../Mathf/Mathf");
const Canvas2d = require("../Render/Canvas2d");
const Scene = require("../Scene/Scene");

class Camera {
    constructor() {
        this._position = new Vector3(0, 0, 0, 1);
        this._forward = new Vector3(0, 0, 1, 1);
        this._up = new Vector3(0, 1, 0, 1);
        this._right = new Vector3(1, 0, 0, 1);
        this._near = 0.1;
        this._far = 100;
        this._h_fov = Mathf.Angle.degreesToRadians(120);
        this._v_fov = this._h_fov * (document.body.clientHeight / document.body.clientWidth);

        this.rotation = Quaternion.fromVector(new Vector3(0, 0, 0), 0);

        this._scene = null;
        this._render = null;
    }

    /** @param {Scene} scene */
    set scene(scene) {
        this._scene = scene;
    }

    /** @returns {Scene} */
    get scene() {
        return this._scene;
    }

    get render() {
        return this._render;
    }

    /** @param {Canvas2d} */
    set render(render) {
        this._render = render;
    }

    get position() {
        return this._position;
    }

    set position(v) {
        this._position = v;
    }

    getMatrix() {
        return this.rotationMatrix().multiply(this.positionMatrix());
    }

    positionMatrix() {
        return new Matrix4([
            [1, 0, 0, this._position.x],
            [0, 1, 0, this._position.y],
            [0, 0, 1, this._position.z],
            [0, 0, 0, 1],
        ])
    }

    rotationMatrix() {
        return this.rotation.toMatrix4();

        return new Matrix4([
            [this._right.x, this._up.x, this._forward.x, 0],
            [this._right.y, this._up.y, this._forward.y, 0],
            [this._right.z, this._up.z, this._forward.z, 0],
            [0, 0, 0, 1],
        ])
    }

    Render() {
        this.render.clear();

        /** Пользовательский скрипт */
        for (let obj of this.scene.all()) {
            obj.update();
        }

        /** Вызываем методы компонетов */
        for (let obj of this.scene.all()) {
            obj.onUpdate();
        }

        this.render.startDraw();

        for (let obj of this.scene.all()) {
            obj.onDraw(this.render);
        }

        this.render.render();
    }
}

module.exports = Camera;