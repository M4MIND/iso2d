class Matrix4 {
    constructor(matrix) {
        this.matrix = matrix || [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1],
        ]
    }
}

module.exports = Matrix4;