const Point3 = require("../classes/Point3");
const Vertex = require("../classes/Vertex");
const Triangle = require("./Triangle");

class Cube {

    /**
     * 
     * @param  point {Point3} 
     * @param {*} dx 
     * @param {*} dy 
     * @param {*} dz 
     */
    constructor(point, dx, dy, dz, color) {
        this.triangles = [new Triangle(
            new Vertex(point.x, point.y, point.z),
            new Vertex(point.x, point.y, point.z + dz),
            new Vertex(point.x + dx, point.y, point.z),
        ),
        new Triangle(
            new Vertex(point.x + dx, point.y, point.z),
            new Vertex(point.x + dx, point.y, point.z + dz),
            new Vertex(point.x, point.y, point.z + dz),
        ),

        new Triangle(
            new Vertex(point.x, point.y + dy, point.z),
            new Vertex(point.x, point.y + dy, point.z + dz),
            new Vertex(point.x + dx, point.y + dy, point.z),
        ),
        new Triangle(
            new Vertex(point.x + dx, point.y + dy, point.z),
            new Vertex(point.x + dx, point.y + dy, point.z + dz),
            new Vertex(point.x, point.y + dy, point.z + dz),
        ),

        new Triangle(
            new Vertex(point.x, point.y, point.z),
            new Vertex(point.x, point.y, point.z + dz),
            new Vertex(point.x, point.y + dy, point.z),
        ),
        new Triangle(
            new Vertex(point.x, point.y + dy, point.z + dz),
            new Vertex(point.x, point.y, point.z + dz),
            new Vertex(point.x, point.y + dy, point.z),
        ),

        new Triangle(
            new Vertex(point.x + dx, point.y, point.z),
            new Vertex(point.x + dx, point.y, point.z + dz),
            new Vertex(point.x + dx, point.y + dy, point.z),
        ),
        new Triangle(
            new Vertex(point.x + dx, point.y + dy, point.z + dz),
            new Vertex(point.x + dx, point.y, point.z + dz),
            new Vertex(point.x + dx, point.y + dy, point.z),
        ),

        new Triangle(
            new Vertex(point.x, point.y, point.z),
            new Vertex(point.x + dx, point.y, point.z),
            new Vertex(point.x + dx, point.y + dy, point.z),
        ),
        new Triangle(
            new Vertex(point.x, point.y + dy, point.z),
            new Vertex(point.x + dx, point.y + dy, point.z),
            new Vertex(point.x, point.y, point.z),
        ),

        new Triangle(
            new Vertex(point.x, point.y, point.z + dz),
            new Vertex(point.x + dx, point.y, point.z + dz),
            new Vertex(point.x + dx, point.y + dy, point.z + dz),
        ),
        new Triangle(
            new Vertex(point.x, point.y + dy, point.z + dz),
            new Vertex(point.x + dx, point.y + dy, point.z + dz),
            new Vertex(point.x, point.y, point.z + dz),
        )];
    }
}

module.exports = Cube;