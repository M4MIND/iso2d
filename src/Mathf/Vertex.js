const Matrix4 = require("./Matrix4");

class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = 1;
    }

    /** 
     * @param {Matrix4} M
     * @returns {Vertex}
     */
    multiplyOnMatrix(M) {
        let e = M.e;

        return new Vertex(
            e[0][0] * this.x + e[0][1] * this.y + e[0][2] * this.z + e[0][3] * this.w,
            e[1][0] * this.x + e[1][1] * this.y + e[1][2] * this.z + e[1][3] * this.w,
            e[2][0] * this.x + e[2][1] * this.y + e[2][2] * this.z + e[2][3] * this.w,
            e[3][0] * this.x + e[3][1] * this.y + e[3][2] * this.z + e[3][3] * this.w
        )
    }
    normal() {
        return new Vertex(
            this.x / this.w,
            this.y / this.w,
            this.z / this.w,
            this.w / this.w
        )
    }
}

module.exports = Vertex;