const Vector3 = require("./Vector3");

class Matrix3 {
    constructor(params) {
        this.Matrix3 = params || [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]
    }

    /**
     * 
     * @param Matrix3 {Matrix3} 
     */
    multiple(matrix) {

        let values = [];
        //let matrix = new Matrix3();

        for (let row = 0; row < 3; row++) {
            values.push([]);
            for (let col = 0; col < 3; col++) {
                values[row][col] = 0;
                for (let i = 0; i < 3; i++) {
                    values[row][col] += this.Matrix3[row][i] * matrix.Matrix3[i][col];
                }
            }
        }

        return new Matrix3(values);
    }

    /**
     * @param vector3 {Vector3} 
     * @returns {Vector3}
     */
    transform(vector3) {
        return new Vector3(
            vector3.x * this.Matrix3[0][0] + vector3.y * this.Matrix3[1][0] + vector3.z * this.Matrix3[2][0],
            vector3.x * this.Matrix3[0][1] + vector3.y * this.Matrix3[1][1] + vector3.z * this.Matrix3[2][1],
            vector3.x * this.Matrix3[0][2] + vector3.y * this.Matrix3[1][2] + vector3.z * this.Matrix3[2][2],
        )
    }
}

Matrix3.multiple = (a, b) => {
    let values = [];

    for (let row = 0; row < 3; row++) {
        values.push([]);
        for (let col = 0; col < 3; col++) {
            values[row][col] = 0;
            for (let i = 0; i < 3; i++) {
                values[row][col] += a.Matrix3[row][i] * b.Matrix3[i][col];
            }
        }
    }

    return new Matrix3(values);
}

module.exports = Matrix3;