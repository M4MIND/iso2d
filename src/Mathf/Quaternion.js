const Matrix4 = require("./Matrix4");
const Vector3 = require("./Vector3");

class Quaternion {
    constructor(x, y, z, w) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = w || 0;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    get w() {
        return this._w;
    }

    set x(x) {
        this._x = x;
    }

    set y(y) {
        this._y = y;
    }

    set z(z) {
        this._z = z;
    }

    set w(w) {
        this._w = w;
    }

    toMatrix4() {
        let w = this.w;
        let x = this.x;
        let y = this.y;
        let z = this.z;

        let n = w * w + x * x + y * y + z * z;
        let s = n === 0 ? 0 : 2 / n;
        let wx = s * w * x, wy = s * w * y, wz = s * w * z;
        let xx = s * x * x, xy = s * x * y, xz = s * x * z;
        let yy = s * y * y, yz = s * y * z, zz = s * z * z;

        return new Matrix4([
            [1 - (yy + zz), xy - wz, xz + wy, 0],
            [xy + wz, 1 - (xx + zz), yz - wx, 0],
            [xz - wy, yz + wx, 1 - (xx + yy), 0],
            [0, 0, 0, 1]]
        );
    }

    /**
     * 
     * @param {Quaternion} q 
     */
    multiple(q) {
        var w1 = this.w;
        var x1 = this.x;
        var y1 = this.y;
        var z1 = this.z;

        var w2 = q.w;
        var x2 = q.x;
        var y2 = q.y;
        var z2 = q.z;

        return new Quaternion(
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
            w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
        );
    }

    /**
     * @param {Vector3} v 
     * @param {Number} a 
     */
    static fromVector(v, a) {
        v = v.normalize();
        return new Quaternion(Math.sin(a / 2) * v.x, Math.sin(a / 2) * v.y, Math.sin(a / 2) * v.z, Math.cos(a / 2))
    }
}

module.exports = Quaternion;