class RGBA {
    constructor(r, g, b, a) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    get r() {
        return this._r;
    }

    get g() {
        return this._g;
    }

    get b() {
        return this._b;
    }

    get a() {
        return this._a;
    }

    set r(v) {
        this._r = v;
        return this;
    }

    set g(v) {
        this._g = v;
        return this;
    }

    set b(v) {
        this._b = v;
        return this;
    }

    set a(v) {
        this._a = v;
        return this;
    }

    multiply(v) {
        this.r *= v;
        this.g *= v;
        this.b *= v;

        return this;
    }

    static multiply(color, v) {
        return new RGBA(color.r * v, color.g * v, color.b * v, color.a)
    }
}

module.exports = RGBA;