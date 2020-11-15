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
     * @param point {Point2} 
     * @param color {Array};
     */
    draw(x, y, color) {
        x = parseInt(x);
        y = parseInt(y);

        var i = (x + y * this._w) * 4
        
        this.bitmap.data[i + 0] = color[0]
        this.bitmap.data[i + 1] = color[1]
        this.bitmap.data[i + 2] = color[2]
        this.bitmap.data[i + 3] = color[3]
    }

    get() {
        return this.bitmap;
    }
}

module.exports = Bitmap;