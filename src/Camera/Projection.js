const { Matrix4 } = require("../Mathf/Mathf");
const Camera = require("./Camera");

class Projection {
    /**
     * 
     * @param {Camera} camera 
     */
    constructor(camera) {
        let near = 0.1;
        let far = 100;

        let m00 = 1 / Math.tan(120 * 0.5 * Math.PI / 180);
        let m11 = 1 / Math.tan(120 * 0.5 * Math.PI / 180);
        let m22 = -far / (far - near);
        let m32 = -2 * near * far / (far - near);

        return new Matrix4([
            [m00, 0, 0, 0],
            [0, m11, 0, 0],
            [0, 0, m22, -1],
            [0, 0, m32, 0],
        ])
    }
}

module.exports = Projection;