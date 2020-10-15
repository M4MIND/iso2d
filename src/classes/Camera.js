const Matrix4 = require("./Matrix4");

class Camera {
    constructor(angle, near, far) {
        let scale = 1 / Math.tan(angle * 0.5 * Math.PI / 180);
        this.matrix = matrix = new Matrix4([
            [scale, 0, 0, 0],
            [0, scale, -1, 0],
            [0, 0, -far / (far - near), 0],
            [0, 0, -far * near / (far - near), 0],
        ])
    }
}

module.exports = Camera;