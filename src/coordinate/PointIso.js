const Point2D = require("./Point2D");

class PointIso {
    constructor(x, y, z) {
        this.transformation = [
            [
                5 * Math.cos(Math.PI / 6),
                5 * Math.sin(Math.PI / 6)
            ],
            [
                5 * Math.cos(Math.PI - Math.PI / 6),
                5 * Math.sin(Math.PI - Math.PI / 6)
            ]
        ];


        this.isoX = new Point2D(x * this.transformation[0][0], x * this.transformation[0][1])
        this.isoY = new Point2D(y * this.transformation[1][0], y * this.transformation[1][1])

        this.x = 1769 / 2 + this.isoX.x + this.isoY.x;
        this.y = 937 * 0.9 - this.isoX.y - this.isoY.y - (z * 5);
    }
}

module.exports = PointIso;