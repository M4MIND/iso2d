const Mesh = require("../../Components/Mesh/Mesh");
const { Vertex } = require("../../Mathf/Mathf");
const GameObject = require("../GameObject");

class Plane extends GameObject {
    constructor() {
        super();
        /**@type {Mesh} */
        let mesh = this.addComponent(Mesh);

        mesh.verteces = [
            new Vertex(-1, 0, -1),
            new Vertex(-1, 0, 1),
            new Vertex(1, 0, 1),
            new Vertex(1, 0, -1),
        ]

        mesh.faces = [
            [0, 1, 2],
            [0, 3, 2]
        ]
    }
}

module.exports = Plane;