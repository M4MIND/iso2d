const { Vector3, Quaternion, Matrix4 } = require("./Mathf");

class Transform {
    constructor() {
        this._position = new Vector3(0, 0, 0);
        this._scale = new Vector3(1, 1, 1)
        this._rotation = new Quaternion();
    }

    get position() {
        return this._position;
    }

    set position(v) {
        this._position = v;
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(q) {
        this._rotation = q;
    }

    get scale() {
        return this._scale;
    }

    set scale(v) {
        this._scale = v;
    }

    getMatrix() {
        return new Matrix4().multiplyArrayOfMatrices([
            new Matrix4([
                [1, 0, 0, this.position.x],
                [0, 1, 0, this.position.y],
                [0, 0, 1, this.position.z],
                [0, 0, 0, 1]
            ]),
            this.rotation.toMatrix4(),
            new Matrix4([
                [this.scale.x, 0, 0, 0],
                [0, this.scale.y, 0, 0],
                [0, 0, this.scale.z, 0],
                [0, 0, 0, 1]
            ]),
            
        ])

    }

    /** @param {Quaternion} q */
    rotate(q) {
        this.rotation = this.rotation.multiple(q);
    }
}

module.exports = Transform;