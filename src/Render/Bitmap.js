const RGBA = require("../Color/RGBA");
class Bitmap {
    /** @param {ImageData} imageData */
    constructor(imageData) {
        this._bitmap = imageData;
        this._w = imageData.width;
        this._h = imageData.height;
    }

    get bitmap () {
        return this._bitmap;
    }

    /**
     * 
     * @param x {Number} 
     * @param y {Number} 
     * @param color {RGBA};
     */
    set(x, y, color) {
        x = parseInt(x);
        y = parseInt(y);

        var i = (x + y * this._w) * 4
        
        this.bitmap.data[i + 0] = color.r;
        this.bitmap.data[i + 1] = color.g;
        this.bitmap.data[i + 2] = color.b;
        this.bitmap.data[i + 3] = color.a;
    }

    get() {
        return this.bitmap;
    }
}

module.exports = Bitmap;