const Point2D = require("./Point2D");

class PointIso {
    constructor(x, y, z) {
        this.transformation = [
            [
                3 * Math.cos(Math.PI / 7),
                3 * Math.sin(Math.PI / 7)
            ],
            [
                3 * Math.cos(Math.PI - Math.PI / 7),
                3 * Math.sin(Math.PI - Math.PI / 7)
            ]
        ];


        this.isoX = new Point2D(x * this.transformation[0][0], x * this.transformation[0][1])
        this.isoY = new Point2D(y * this.transformation[1][0], y * this.transformation[1][1])

        this.x = window.document.body.clientWidth / 2 + this.isoX.x + this.isoY.x;
        this.y = window.document.body.clientHeight * 0.9 - this.isoX.y - this.isoY.y - (z * 3);
    }
}

module.exports = PointIso;