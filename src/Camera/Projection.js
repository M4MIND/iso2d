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

        let m00 = 1 / Math.tan(90 * 0.5 * Math.PI / 180);
        let m11 = 1 / Math.tan(90 * 0.5 * Math.PI / 180);
        let m22 = -far / (far - near);
        let m32 = -far * near / (far - near);

        let n = 0.1;
        let f = 100;
        let r = -document.body.clientWidth / document.body.clientHeight;
        let l = document.body.clientWidth / document.body.clientHeight;
        let t = -document.body.clientHeight / document.body.clientWidth;
        let b = document.body.clientHeight / document.body.clientWidth;

        return new Matrix4([
            [m00, 0, 0, 0],
            [0, m11, 0, 0],
            [0, 0, m22, -1],
            [0, 0, m32, 0],
        ])

        return new Matrix4([
            [(2 * n) / (r - l), 0, (r + l) / (r - l), 0],
            [0, (2 * n) / (t - b), (t + b) / (t - b), 0],
            [0, 0, (f + n) / (n - f), (2 * f * n) / (n - f)],
            [0, 0, -1, 0]
        ])
    }
}

module.exports = Projection;