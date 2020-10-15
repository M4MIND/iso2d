const Point3 = require("../classes/Point3");

class Light {
    constructor(point3, color, radius) {
        this.postion = point3 || new Point3(0, 0, 0);
        this.color = color || [255, 255, 255, 255];
        this.type = "point";
        this.radius = radius || 50;
    }
}

module.exports = Light;