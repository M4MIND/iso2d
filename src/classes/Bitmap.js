const Point2 = require("./Point2");

class Bitmap {

    constructor(imageData) {
        this.bitmap = imageData;
        this.w = imageData.width;
        this.h = imageData.height;
    }

    /**
     * 
     * @param point {Point2} 
     * @param color {Array};
     */
    draw(point, color) {
        var i = (point.x + point.y * this.w) * 4
        
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