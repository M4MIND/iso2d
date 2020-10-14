const Camera = require("./classes/Camera");
const Canvas = require("./classes/Canvas");
const Path = require("./classes/Path");
const Point2 = require("./classes/Point2");
const Point3 = require("./classes/Point3");
const Vector2 = require("./classes/Vector2");
const Vector3 = require("./classes/Vector3");
const PrimitiveType = require("./primitiveType/PrimitiveType");

class iso2d {
    /**
     * @param canvas {Canvas} 
     * @param property {object}
     */
    constructor(canvas, property) {
        this.property = Object.assign({}, property);
        this.canvas = canvas;
    }

    run() {
    }
}

iso2d.Point2 = Point2;
iso2d.Point3 = Point3;
iso2d.Vector2 = Vector2;
iso2d.Vector3 = Vector3;
iso2d.Path = Path;
iso2d.Canvas = Canvas;
iso2d.PrimitiveType = PrimitiveType
iso2d.Camera = Camera;

module.exports = iso2d;