const Path = require("../../../coordinate/Path");
const Point = require("../../../coordinate/Point");
const Primitive = require("../Primitive");

class Cube extends Primitive {
    constructor(position, dx, dy, dz) {
        super(position, dx, dy, dz)

        this.addPath(
            new Path([
                this.position,
                new Point(this.position.x + this.dx, this.position.y, this.position.z),
                new Point(this.position.x + this.dx, this.position.y, this.position.z + this.dz),
                new Point(this.position.x, this.position.y, this.position.z + this.dz)
            ])
        )

        this.addPath(
            new Path([
                this.position,
                new Point(this.position.x, this.position.y, this.position.z + this.dz),
                new Point(this.position.x, this.position.y + this.dy, this.position.z + this.dz),
                new Point(this.position.x, this.position.y + this.dy, this.position.z)
            ])
        )
        
        this.addPath(
            new Path([
                this.position,
                new Point(this.position.x + this.dx, this.position.y, this.position.z),
                new Point(this.position.x + this.dx, this.position.y + this.dy, this.position.z),
                new Point(this.position.x, this.position.y + this.dy, this.position.z)
            ]).translate(0, 0, this.dz)
        )
    }
}

module.exports = Cube;