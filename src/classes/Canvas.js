const Cube = require("../primitiveType/Cube");
const Bitmap = require("./Bitmap");
const Matrix3 = require("./Matrix3");
const Point2 = require("./Point2");
const Point3 = require("./Point3");

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

class Canvas {
    /**
     * @param canvas {HTMLCanvasElement}
     * @param property {object}
     */
    constructor(canvas, property) {
        this.property = Object.assign({
            width: window.document.body.clientWidth,
            height: window.document.body.clientHeight
        }, property);

        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.property.width;
        this.canvas.height = this.property.height;

        this.fillStyle = [
            [141, 108, 115, 255], [141, 108, 115, 255],
            [53, 68, 101, 255], [53, 68, 101, 255],
            [141, 108, 115, 255], [141, 108, 115, 255],
            [53, 68, 101, 255], [53, 68, 101, 255],
            [208, 163, 234, 255], [208, 163, 234, 255],
            [208, 163, 234, 255], [208, 163, 234, 255],
        ];

        this.oldDate = Date.now();
        this.diff = 0;

        this.obj = [
            new Cube(new Point3(-32, -32, -32), 64, 64, 64)
        ];

        for (var i = 0; i < 1000; i++) {
            var size = randomInteger(1, 32);
            this.obj.push(new Cube(new Point3(randomInteger(-this.property.width / 2, this.property.width / 2), randomInteger(-1000, 1000), randomInteger(-this.property.height / 2, this.property.height / 2)), size, size, size))
        }

        this.angle = 0;

        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        this.ctx.clearRect(0, 0, this.property.width, this.property.height)

        this.ctx.save();

        this.angle += this.diff * 0.00002;

        this.angle %= 2 * Math.PI;

        let headingMatrix = new Matrix3([
            [Math.cos(this.angle), 0, - Math.sin(this.angle)],
            [0, 1, 0],
            [Math.sin(this.angle), 0, Math.cos(this.angle)]
        ]);

        let pitchMatrix = new Matrix3([
            [1, 0, 0],
            [0, Math.cos(this.angle), Math.sin(this.angle)],
            [0, -Math.sin(this.angle), Math.cos(this.angle)]
        ])

        let matrix = Matrix3.multiple(headingMatrix, pitchMatrix);

        let image = new Bitmap(this.ctx.createImageData(this.property.width, this.property.height));
        let zBuffer = new Array(this.property.width * this.property.height);

        for (let q = 0; q < zBuffer.length; q++) {
            zBuffer[q] = -9999.0;
        }

        for (let object of this.obj) {
            for (let _tris of object.triangles) {
                let v1 = matrix.transform(_tris.v1);
                let v2 = matrix.transform(_tris.v2);
                let v3 = matrix.transform(_tris.v3);

                v1.x += this.property.width / 2;
                v1.y += this.property.height / 2;
                v2.x += this.property.width / 2;
                v2.y += this.property.height / 2;
                v3.x += this.property.width / 2;
                v3.y += this.property.height / 2;

                this.fillStyle.push(this.fillStyle.shift());

                let minX = Math.max(0, Math.ceil(Math.min(v1.x, Math.min(v2.x, v3.x))));
                let maxX = Math.min(this.property.width - 1, Math.floor(Math.max(v1.x, Math.max(v2.x, v3.x))));
                let minY = Math.max(0, Math.ceil(Math.min(v1.y, Math.min(v2.y, v3.y))));
                let maxY = Math.min(this.property.height - 1, Math.floor(Math.max(v1.y, Math.max(v2.y, v3.y))));

                let triangleArea = (v1.y - v3.y) * (v2.x - v3.x) + (v2.y - v3.y) * (v3.x - v1.x);

                for (let y = minY; y <= maxY; y++) {
                    for (let x = minX; x <= maxX; x++) {
                        let b1 = ((y - v3.y) * (v2.x - v3.x) + (v2.y - v3.y) * (v3.x - x)) / triangleArea;
                        let b2 = ((y - v1.y) * (v3.x - v1.x) + (v3.y - v1.y) * (v1.x - x)) / triangleArea;
                        let b3 = ((y - v2.y) * (v1.x - v2.x) + (v1.y - v2.y) * (v2.x - x)) / triangleArea;

                        let depth = b1 * v1.z + b2 * v2.z + b3 * v3.z;

                        let zIndex = y * this.property.width + x;

                        if (b1 >= 0 && b1 <= 1 && b2 >= 0 && b2 <= 1 && b3 >= 0 && b3 <= 1) {
                            if (zBuffer[zIndex] < depth) {
                                image.draw(new Point2(x, y), this.fillStyle[0]);
                                zBuffer[zIndex] = depth;
                            }
                        }
                    }
                }
            }
        }

        this.diff = Date.now() - this.oldDate;
        this.oldDate = Date.now()

        this.ctx.putImageData(image.get(), 0, 0);

        this.ctx.restore();

        requestAnimationFrame(this.update.bind(this));
    }

    getCtx() {
        return this.ctx;
    }
}

module.exports = Canvas;