const Point = require("../../coordinate/Point");

class Primitive {
    constructor(position, dx, dy, dz) {
        this.position = position || new Point(0, 0, 0);
        this.dx = dx || 64;
        this.dy = dy || 64;
        this.dz = dz || 64;
        this.paths = [];
    }

    addPath(path) {
        this.paths.push(path);
    }
    addPathList(paths) {
        for (let path of paths) {
            this.addPath(path);
        }
    }
}

module.exports = Primitive;