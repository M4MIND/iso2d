const Camera = require("./src/Camera/Camera");
const ScreenMatrix = require("./src/Camera/ScreenMatrix");
const RGBA = require("./src/Color/RGBA");
const Mesh = require("./src/Components/Mesh/Mesh");
const Sphere = require("./src/GameObject/Primitive/Sphere");
const Suzanne = require("./src/GameObject/Primitive/Suzanne");
const iso2d = require("./src/iso2d");
const { Vector3 } = require("./src/Mathf/Mathf");
const Vertex = require("./src/Mathf/Vertex");
const Bitmap = require("./src/Render/Bitmap");

let game = new iso2d();

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let cam = new Camera();
let screenMatrix = new ScreenMatrix();

cam.position = new Vector3(0, 0, 60)

let screen = {
    x: document.body.clientWidth,
    y: document.body.clientHeight
}

canvas.width = screen.x;
canvas.height = screen.y;
document.body.appendChild(canvas);

let light = new Vector3(2, 2, 1);
let lightCache = new Vector3(0, 0, 0);
let lightPoint = new Sphere();

lightPoint.transform.scale = new Vector3(0.05, 0.05, 0.05)
lightPoint.transform.position = light;

game.scene.addGameObject(lightPoint);
game.scene.addGameObject(new Suzanne)

let zBuffer = new Array(screen.x * screen.y);


setInterval(function () {
    for (let i = 0; i < zBuffer.length; i++) {
        zBuffer[i] = Number.NEGATIVE_INFINITY;
    }

    let bitmap = new Bitmap(ctx.createImageData(screen.x, screen.y))

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let camM = cam.getMatrix();

    lightCache = light.normalize();


    for (let gameObject of game.scene.allGameObjects()) {

        let gameObjectM = gameObject.transform.getMatrix();
        let mesh = gameObject.getComponent(Mesh);

        for (let face of mesh.faces) {
            /** @type {Vertex} */
            let v1 = mesh.verteces[face[0]];
            /** @type {Vertex} */
            let v2 = mesh.verteces[face[1]];
            /** @type {Vertex} */
            let v3 = mesh.verteces[face[2]];

            v1 = v1.multiplyOnMatrix(gameObjectM)
            v2 = v2.multiplyOnMatrix(gameObjectM)
            v3 = v3.multiplyOnMatrix(gameObjectM)


            let normal = new Vector3();
            let line1 = new Vector3();
            let line2 = new Vector3();
            let l = 0;

            line1.x = v2.x - v1.x
            line1.y = v2.y - v1.y
            line1.z = v2.z - v1.z

            line2.x = v3.x - v1.x
            line2.y = v3.y - v1.y
            line2.z = v3.z - v1.z

            normal.x = line1.y * line2.z - line1.z * line2.y;
            normal.y = line1.z * line2.x - line1.x * line2.z;
            normal.z = line1.x * line2.y - line1.y * line2.x;

            l = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

            normal.x /= l;
            normal.y /= l;
            normal.z /= l;

            v1 = v1.multiplyOnMatrix(camM)
                .multiplyOnMatrix(cam.projection)
                .normal()
            v2 = v2.multiplyOnMatrix(camM)
                .multiplyOnMatrix(cam.projection)
                .normal()
            v3 = v3.multiplyOnMatrix(camM)
                .multiplyOnMatrix(cam.projection)
                .normal()

            if (v1.x < -1 || v1.x > 1 || v1.y < -1 || v1.y > 1 || v1.z < 0) {
                continue;
            }
            if (v2.x < -1 || v2.x > 1 || v2.y < -1 || v2.y > 1 || v3.z < 0) {
                continue;
            }

            if (v3.x < -1 || v3.x > 1 || v3.y < -1 || v3.y > 1 || v3.z < 0) {
                continue;
            }

            v1 = v1.multiplyOnMatrix(screenMatrix);
            v2 = v2.multiplyOnMatrix(screenMatrix);
            v3 = v3.multiplyOnMatrix(screenMatrix);

            _triangle(v1, v2, v3, bitmap, gameObject.color, normal);
        }
    }

    ctx.putImageData(bitmap.bitmap, 0, 0);
}, 1000 / 30)

const _triangle = (v1, v2, v3, bitmap, color, normal) => {
    let minX = Math.max(0, Math.ceil(Math.min(v1.x, Math.min(v2.x, v3.x))));
    let maxX = Math.min(screen.x - 1, Math.floor(Math.max(v1.x, Math.max(v2.x, v3.x))));
    let minY = Math.max(0, Math.ceil(Math.min(v1.y, Math.min(v2.y, v3.y))));
    let maxY = Math.min(screen.y - 1, Math.floor(Math.max(v1.y, Math.max(v2.y, v3.y))));

    let triangleArea = (v1.y - v3.y) * (v2.x - v3.x) + (v2.y - v3.y) * (v3.x - v1.x);
    let dp = normal.x * lightCache.x + normal.y * lightCache.y + normal.z * lightCache.z;

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            let b1 = ((y - v3.y) * (v2.x - v3.x) + (v2.y - v3.y) * (v3.x - x)) / triangleArea;
            let b2 = ((y - v1.y) * (v3.x - v1.x) + (v3.y - v1.y) * (v1.x - x)) / triangleArea;
            let b3 = ((y - v2.y) * (v1.x - v2.x) + (v1.y - v2.y) * (v2.x - x)) / triangleArea;

            if (b1 >= 0 && b1 <= 1 && b2 >= 0 && b2 <= 1 && b3 >= 0 && b3 <= 1) {
                let depth = b1 * v1.z + b2 * v2.z + b3 * v3.z;
                let index = y * screen.x + x;

                if (zBuffer[index] < depth) {
                    zBuffer[index] = depth;
                    bitmap.set(x, y, RGBA.multiply(color, dp));
                }
            }
        }
    }
}