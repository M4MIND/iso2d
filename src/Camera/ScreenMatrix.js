const { Matrix4 } = require("../Mathf/Mathf");
const Camera = require("./Camera");

class ScreenMatrix {
    /**
     * 
     * @param {Camera} camera 
     */
    constructor(camera) {

        /**
         * 
         * [HW,0,0,0]
         * [0, -HH, 0,0]
         * [0,0,1,0]
         * [HW,HH, 0 1]
         */

        return new Matrix4([
            [document.body.clientWidth / 2, 0, 0, document.body.clientWidth / 2],
            [0, document.body.clientHeight / 2, 0, document.body.clientHeight / 2],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ])
    }
}

module.exports = ScreenMatrix;
