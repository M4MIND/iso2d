const Primitive = require("../Primitive");
const Point = require("../../../coordinate/Point");
const Path = require("../../../coordinate/Path");

class Plate extends Primitive {
    constructor(position, dx, dy, dz) {
        super(position, dx, dy, dz);

        this.addPath(
            new Path([
                this.position,
                new Point(this.position.x + this.dx, this.position.y, this.position.z),
                new Point(this.position.x + this.dx, this.position.y, this.position.z + this.dz),
                new Point(this.position.x, this.position.y, this.position.z + this.dz)
            ])
        )
    }
}

module.exports = Plate;