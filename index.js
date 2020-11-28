const Camera = require("./src/Camera/Camera");
const Projection = require("./src/Camera/Projection");
const ScreenMatrix = require("./src/Camera/ScreenMatrix");
const Mesh = require("./src/Components/Mesh/Mesh");
const Cube = require("./src/GameObject/Primitive/Cube");
const Sphere = require("./src/GameObject/Primitive/Sphere");
const Suzanne = require("./src/GameObject/Primitive/Suzanne");
const iso2d = require("./src/iso2d");
const Mathf = require("./src/Mathf/Mathf");
const { Vector3 } = require("./src/Mathf/Mathf");
const Quaternion = require("./src/Mathf/Quaternion");
const Vertex = require("./src/Mathf/Vertex");
const Bitmap = require("./src/Render/Bitmap");


let game = new iso2d();


let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let cam = new Camera();
let projection = new Projection(cam);
let screenMatrix = new ScreenMatrix();

cam.position = new Vector3(0, -1, 40)
cam.rotation = Quaternion.fromVector(new Vector3(1, 0, 0), Mathf.Angle.degreesToRadians(0))

let screen = {
    x: document.body.clientWidth,
    y: document.body.clientHeight
}

canvas.width = screen.x;
canvas.height = screen.y;
document.body.appendChild(canvas);

let suzanne = new Suzanne();

suzanne.transform.position = new Vector3(0, 0, -2);
suzanne.transform.scale = new Vector3(1, 1, 1);
suzanne.color = [255, 255, 255, 255]

let cube = new Cube();
cube.transform.position = new Vector3(1, 3, 0);
cube.transform.scale = new Vector3(1, 1, 1);
cube.color = [255, 255, 255, 255];

let sphere = new Sphere();
sphere.transform.position = new Vector3(-2, 3, 0);

game.scene.add(suzanne);
game.scene.add(cube);

game.scene.add(sphere);

let angle = 0;
let angleCamX = 0;
let angleCamY = 0;
let angleCamZ = 0;

let light = new Vector3(0, 0, -1);


document.addEventListener('keypress', (e) => {
    if (e.keyCode === 119) {
        light.y -= 1 * 0.1;
    } if (e.keyCode === 115) {
        light.y += 1 * 0.1;
    } if (e.keyCode === 97) {
        light.x += 1 * 0.1;
    } if (e.keyCode === 100) {
        light.x -= 1 * 0.1;
    } if (e.keyCode === 114) {
        light.z += 1 * 0.1;
    } if (e.keyCode === 102) {
        light.z -= 1 * 0.1;
    }

    if (e.keyCode === 105) {
        angleCamX += 1;
        cam.rotation = Quaternion.fromVector(new Vector3(1, 0, 0), Mathf.Angle.degreesToRadians(angleCamX));
    }

    if (e.keyCode === 107) {
        angleCamX -= 1;
        cam.rotation = Quaternion.fromVector(new Vector3(1, 0, 0), Mathf.Angle.degreesToRadians(angleCamX));
    }

    if (e.keyCode == 106) {
        angleCamY += 1;
        cam.rotation = Quaternion.fromVector(new Vector3(0, 1, 0), Mathf.Angle.degreesToRadians(angleCamY));
    }

    if (e.keyCode === 108) {
        angleCamY -= 1;
        cam.rotation = Quaternion.fromVector(new Vector3(0, 1, 0), Mathf.Angle.degreesToRadians(angleCamY));
    }

    if (e.keyCode === 112) {
        angleCamZ -= 1;
        cam.rotation = Quaternion.fromVector(new Vector3(0, 0, 1), Mathf.Angle.degreesToRadians(angleCamZ));
    }


})

let zBuffer = new Array(screen.x * screen.y);


setInterval(function () {
    for (let i = 0; i < zBuffer.length; i++) {
        zBuffer[i] = Number.NEGATIVE_INFINITY;
    }

    let bitmap = new Bitmap(ctx.createImageData(screen.x, screen.y))
    angle += 1;

    if (angle >= 360) {
        angle = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    let camM = cam.getMatrix();

    let l = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
    light.x /= l;
    light.y /= l;
    light.z /= l;


    for (let gameObject of game.scene.all()) {

        gameObject.transform.rotation = Quaternion.fromVector(new Vector3(0, 1, 0), Mathf.Angle.degreesToRadians(angle));

        let gameObjectM = gameObject.transform.getMatrix();
        let mesh = gameObject.getComponent(Mesh);

        for (let face of mesh.faces) {
            /** @type {Vertex} */
            let v1 = mesh.verteces[face[0]];
            /** @type {Vertex} */
            let v2 = mesh.verteces[face[1]];
            /** @type {Vertex} */
            let v3 = mesh.verteces[face[2]];

            v1 = v1
                .multiplyOnMatrix(gameObjectM)
            v2 = v2
                .multiplyOnMatrix(gameObjectM)
            v3 = v3
                .multiplyOnMatrix(gameObjectM)


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

            if (normal.z < 0) {
                v1 = v1.multiplyOnMatrix(camM)
                    .multiplyOnMatrix(projection)
                    .normal()
                v2 = v2.multiplyOnMatrix(camM)
                    .multiplyOnMatrix(projection)
                    .normal()
                v3 = v3.multiplyOnMatrix(camM)
                    .multiplyOnMatrix(projection)
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
    }

    ctx.putImageData(bitmap.bitmap, 0, 0);
}, 1000 / 30)

const _triangle = (v1, v2, v3, bitmap, color, normal) => {
    let minX = Math.max(0, Math.ceil(Math.min(v1.x, Math.min(v2.x, v3.x))));
    let maxX = Math.min(screen.x - 1, Math.floor(Math.max(v1.x, Math.max(v2.x, v3.x))));
    let minY = Math.max(0, Math.ceil(Math.min(v1.y, Math.min(v2.y, v3.y))));
    let maxY = Math.min(screen.y - 1, Math.floor(Math.max(v1.y, Math.max(v2.y, v3.y))));

    let triangleArea = (v1.y - v3.y) * (v2.x - v3.x) + (v2.y - v3.y) * (v3.x - v1.x);
    let dp = normal.x * light.x + normal.y * light.y + normal.z * light.z;

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            let b1 = ((y - v3.y) * (v2.x - v3.x) + (v2.y - v3.y) * (v3.x - x)) / triangleArea;
            let b2 = ((y - v1.y) * (v3.x - v1.x) + (v3.y - v1.y) * (v1.x - x)) / triangleArea;
            let b3 = ((y - v2.y) * (v1.x - v2.x) + (v1.y - v2.y) * (v2.x - x)) / triangleArea;

            if (b1 >= 0 && b1 <= 1 && b2 >= 0 && b2 <= 1 && b3 >= 0 && b3 <= 1) {
                let depth = b1 * v1.z + b2 * v2.z + b3 * v3.z;
                let index = y * screen.x + x;

                if (zBuffer[index] < depth) {

                    let norm = new Vertex(
                        v1.y * v3.z - v1.z * v3.y,
                        v1.z * v3.x - v1.x * v3.z,
                        v1.x * v3.y - v1.y * v3.x
                    )

                    let cl = [];

                    cl[0] = color[0] * dp;
                    cl[1] = color[1] * dp;
                    cl[2] = color[2] * dp;
                    cl[3] = color[3];

                    zBuffer[index] = depth;
                    bitmap.draw(x, y, cl);
                }
            }
        }
    }
}