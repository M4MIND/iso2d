const GameObject = require("../GameObject/GameObject");

class Component {
    constructor () {
        this._gameObject = null;
    }

    /** @returns {GameObject} */
    get gameObject () {
        return this._gameObject;
    }

    /** @param {GameObject} gameObject */
    set gameObject (gameObject) {
        this._gameObject = gameObject;
    }

    onUpdate() {

    }

    onDraw() {
        
    }
}

module.exports = Component;