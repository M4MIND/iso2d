const Render = require("../../Render/Render");
const Component = require("../Component");

class Mesh extends Component {
    constructor() {
        super();
        this._verteces = [];
        this._faces = [];
    }

    /** @returns {Vertex[]} */
    get verteces() {
        return this._verteces;
    }

    /** @param {Vertex[]} v */
    set verteces(v) {
        this._verteces = v;
    }

    /** @returns {[]} */
    get faces() {
        return this._faces;
    }

    /** @param {[]} f */
    set faces(f) {
        this._faces = f;
    }

    /** @param {Render} render */
    onDraw(render) {
    }
}

module.exports = Mesh;