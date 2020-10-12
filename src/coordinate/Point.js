const PointIso = require("./PointIso");

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    translate(dx, dy, dz) {

        this.x = this.x + dx;
        this.y = this.y + dy;
        this.z = this.z + dz;

        return this;
    }

    iso() {
        return new PointIso(this.x, this.y, this.z);
    }

    rotateX(point, angle) {

    }

    rotateY(point, angle) {

    }

    rotateZ(point, angle) {

    }
}

module.exports = Point;