const Mesh = require("../../Components/Mesh/Mesh");
const Vertex = require("../../Mathf/Vertex");
const GameObject = require("../GameObject");

class Cube extends GameObject {
    constructor() {
        super();
        /** @type {Mesh} */
        let mesh = this.addComponent(Mesh);

        mesh.verteces = [
            new Vertex(-1.000000, -1.000000, 1.000000),
            new Vertex(-1.000000, 1.000000, 1.000000),
            new Vertex(-1.000000, -1.000000, -1.000000),
            new Vertex(-1.000000, 1.000000, -1.000000),
            new Vertex(1.000000, -1.000000, 1.000000),
            new Vertex(1.000000, 1.000000, 1.000000),
            new Vertex(1.000000, -1.000000, -1.000000),
            new Vertex(1.000000, 1.000000, -1.000000),
        ]

        mesh.faces = [
            [1, 2, 0],
            [3, 6, 2],
            [7, 4, 6],
            [5, 0, 4],
            [6, 0, 2],
            [3, 5, 7],
            [1, 3, 2],
            [3, 7, 6],
            [7, 5, 4],
            [5, 1, 0],
            [6, 4, 0],
            [3, 1, 5],
        ]
    }
}

module.exports = Cube;