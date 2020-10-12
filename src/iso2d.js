const Vector = require("./coordinate/Vector");
const Canvas = require("./system/canvas/Canvas");
const Resource = require("./system/resource/Resource");

class iso2d {
    constructor(canvas) {
        this.canvas = new Canvas(canvas);
        this.resource = new Resource();
    }

    addPrimitive(primitive) {
        let v1 = Vector.fromTwoPoints(primitive.paths[0].points[1], primitive.paths[0].points[0])
        let v2 = Vector.fromTwoPoints(primitive.paths[0].points[2], primitive.paths[0].points[1])

        var normal = Vector.crossProduct(v1, v2).normalize();

        this.canvas.drawPrimitive(primitive);
    }

    run() {
        return Promise.all([this.resource.load]);
    }
}

module.exports = iso2d;