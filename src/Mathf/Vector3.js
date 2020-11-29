class Vector3 {
    constructor(x, y, z, w) {
        this._x = x || 0.0;
        this._y = y || 0.0;
        this._z = z || 0.0;
        this._w = w || 0.0;
    }

    /**
     * @returns {Number}
     */
    get x() {
        return this._x;
    }

    /**
     * @returns {Number}
     */
    get y() {
        return this._y;
    }

    /**
     * @returns {Number}
     */
    get z() {
        return this._z;
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

    get w () {
        this._w;
    }

    /**
     * @returns {Number}
     */
    length() {
        return Vector3.length(this);
    }

    /**
     * @returns {Vector3};
     */
    normalize() {
        return Vector3.normalize(this);
    }

    /**
     * @param {Vector3} v 
     * 
     * @returns {Number}
     */
    static length(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
    }

    /**
     * @param {Vector3} v 
     * @returns {Vector3}
     */
    static normalize(v) {
        let len = v.length();
        return new Vector3(v.x / len, v.y / len, v.z / len);
    }
}

module.exports = Vector3;