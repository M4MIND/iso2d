const Path = require("../../../coordinate/Path");
const Point = require("../../../coordinate/Point");
const Primitive = require("../Primitive");

class Line extends Primitive {
    constructor(position, dx, dy, dz) {
        super(position, dx, dy, dz);

        this.addPathList([
            new Path([
                position,
                new Point(this.position.x + dx, this.position.y + dy, this.position.z + dz)
            ]).reverse()
        ])
    }
}

module.exports = Line;