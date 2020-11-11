const Vector3 = require("./Vector3");

class Matrix4 {
    constructor(m) {
        this.e = m || [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    }

    /**
     * 
     * @param {Matrix4} m 
     */
    multiply(M) {
        let A = this.e;
        let B = M.e;
        let m = [];
        for (let row = 0; row < A.length; row++) {
            let newRow = [];
            for (let col = 0; col < B[row].length; col++) {
                let dot = 0;

                for (let i = 0; i < A[row].length; i++) {
                    dot += A[row][i] * B[i][col];
                }

                newRow.push(dot);
            }
            m.push(newRow);
        }

        return new Matrix4(m);
    }

    /** @param {Matrix4} M */
    multiplyOfMatrix(M) {

    }

    /** @param {Matrix4[]} list */
    multiplyArrayOfMatrices(list) {
        let m = this;
        for (let matrix of list) {
            m = m.multiply(matrix);
        }

        return m;
    }

    /**
     * @param {Vector3} v 
     */
    multipleOnVector(v) {
        let e = this.e;

        return new Vector3(
            e[0][0] * v.x + e[0][1] * v.y + e[0][2] * v.z + e[0][3] * v.w,
            e[1][0] * v.x + e[1][1] * v.y + e[1][2] * v.z + e[1][3] * v.w,
            e[2][0] * v.x + e[2][1] * v.y + e[2][2] * v.z + e[2][3] * v.w,
            e[3][0] * v.x + e[3][1] * v.y + e[3][2] * v.z + e[3][3] * v.w
        )
    }
}


module.exports = Matrix4;