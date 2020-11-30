const Mathf = require("../Mathf/Mathf");
const { Vector3, Matrix4, Quaternion } = require("../Mathf/Mathf");
const Projection = require("./Projection");

class Camera {
    constructor(core) {
        this._core = core;
        this._position = new Vector3(0, 0, 0, 1);
        this._forward = new Vector3(0, 0, 1, 1);
        this._up = new Vector3(0, 1, 0, 1);
        this._right = new Vector3(1, 0, 0, 1);
        this._near = 0.1;
        this._far = 100;
        this._h_fov = Mathf.Angle.degreesToRadians(120);
        this._v_fov = this._h_fov * (document.body.clientHeight / document.body.clientWidth);

        this.rotation = Quaternion.fromVector(new Vector3(0, 0, 0), 0);

        this.projection = new Projection(this);
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
    }
}

module.exports = Camera;