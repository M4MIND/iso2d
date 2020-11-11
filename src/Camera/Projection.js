const { Matrix4 } = require("../Mathf/Mathf");
const Camera = require("./Camera");

class Projection {
    /**
     * 
     * @param {Camera} camera 
     */
    constructor(camera) {
        let near = camera._near;
        let far = camera._far;
        let right = Math.tan(camera._h_fov / 2);
        let left = -right;
        let top = Math.tan(camera._v_fov / 2);
        let bootom = -top;

        let m00 = 2 / (right - left);
        let m11 = 2 / (top - bootom);
        let m22 = (far + near) / (far - near);
        let m32 = -2 * near * far / (far - near);

        return new Matrix4([
            [m00, 0, 0, 0],
            [0, m11, 0, 0],
            [0, 0, m22, 1],
            [0, 0, m32, 0],
        ])
    }
}

module.exports = Projection;