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

        this.fillStyle = [];

        for (var i = 0; i < 12; i++) {
            this.fillStyle[i] = [];
            for (var c = 0; c < 3; c++) {
                this.fillStyle[i].push(randomInteger(0, 255))
            }
            this.fillStyle[i].push(255);
        }

        this.oldDate = Date.now();
        this.diff = 0;

        this.obj = [
        ];

        this.angleX = Math.PI / 0.1;
        this.angleY = Math.PI / 3;
        this.angleZ = Math.PI / 3;
        /* 
                for (var x = -8; x < 8; x++) {
                    for (var y = -8; y < 8; y++) {
                        this.obj.push(new Cube(new Point3(x * 32, y * 32, x + y * 16), 32, 32, 32))
                    }
                } */

        this.obj.push(
            new Cube(new Point3(-64, -64, 64), 64, 64, 64),
            new Cube(new Point3(0, 0, 0), 64, 64, 64),
        )

        /*  for (var i = 0; i < 128; i++) {
             var size = 32
             this.obj.push(new Cube(new Point3(randomInteger(-this.property.width / 2, this.property.width / 2), randomInteger(-1000, 1000), randomInteger(-this.property.height / 2, this.property.height / 2)), size, size, size))
         }
  */
        this.angle = 0;

        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        this.ctx.clearRect(0, 0, this.property.width, this.property.height)

        this.ctx.save();


        this.angleX += this.diff * 0.0002;
        this.angleY += this.diff * 0.0002;
        this.angleZ += this.diff * 0.0006;

        let headingMatrix = new Matrix3([
            [Math.cos(this.angleX), 0, - Math.sin(this.angleX)],
            [0, 1, 0],
            [Math.sin(this.angleX), 0, Math.cos(this.angleX)]
        ]);

        let pitchMatrix = new Matrix3([
            [1, 0, 0],
            [0, Math.cos(this.angleY), Math.sin(this.angleY)],
            [0, -Math.sin(this.angleY), Math.cos(this.angleY)]
        ])

        let def = new Matrix3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ])

        let Z = new Matrix3([
            [Math.cos(this.angleZ), - Math.sin(this.angleZ), 0],
            [Math.sin(this.angleZ), Math.cos(this.angleZ), 0],
            [0, 1, 0],
        ])

        let matrix = Matrix3.multiple(pitchMatrix, headingMatrix);

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