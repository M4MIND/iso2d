const Camera = require("./src/Camera/Camera");
const Projection = require("./src/Camera/Projection");
const ScreenMatrix = require("./src/Camera/ScreenMatrix");
const Mesh = require("./src/Components/Mesh/Mesh");
const Cone = require("./src/GameObject/Primitive/Cone");
const Cube = require("./src/GameObject/Primitive/Cube");
const Cylinder = require("./src/GameObject/Primitive/Cylinder");
const Plane = require("./src/GameObject/Primitive/Plane");
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

cam.position = new Vector3(0, 0, 23)
cam.rotation = Quaternion.fromVector(new Vector3(1, 0, 0), Mathf.Angle.degreesToRadians(0))

let screen = {
    x: document.body.clientWidth,
    y: document.body.clientHeight
}

canvas.width = screen.x;
canvas.height = screen.y;
document.body.appendChild(canvas);

/* for (var x = -16; x <16; x++) {
    for (var y = -1; y < 0; y++) {
        for (z = -16; z < 16; z++) {
            let temp = new Cube();

            temp.transform.position = new Vector3(x * 2, y, z * 2);
            temp.transform.scale = new Vector3(1, 1, 1);
            temp.color = [255, 255, 255, 255];

            game.scene.add(temp);
        }
    }
} */
let suzanne = new Cube();
suzanne.transform.position = new Vector3(0, 0, -2);
suzanne.transform.scale = new Vector3(1, 1, 1);
suzanne.color = [255, 255, 255, 255]
game.scene.add(suzanne)


let angle = 0;
let angleCamX = 0;
let angleCamY = 0;
let angleCamZ = 0;

document.addEventListener('keypress', (e) => {

    if (e.keyCode === 119) {
        cam.position.y -= 1 * 1;
    } if (e.keyCode === 115) {
        cam.position.y += 1 * 1;
    } if (e.keyCode === 97) {
        cam.position.x += 1 * 1;
    } if (e.keyCode === 100) {
        cam.position.x -= 1 * 1;
    } if (e.keyCode === 114) {
        cam.position.z += 1 * 1;
    } if (e.keyCode === 102) {
        cam.position.z -= 1 * 1;
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
                .multiplyOnMatrix(camM)
                .multiplyOnMatrix(projection)
                .normal()
            v2 = v2
                .multiplyOnMatrix(gameObjectM)
                .multiplyOnMatrix(camM)
                .multiplyOnMatrix(projection)
                .normal()
            v3 = v3
                .multiplyOnMatrix(gameObjectM)
                .multiplyOnMatrix(camM)
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

            /* bitmap.draw(parseInt(v1.x + screen.x / 2), parseInt(v1.y + screen.y / 2), gameObject.color);
            bitmap.draw(parseInt(v2.x + screen.x / 2), parseInt(v2.y + screen.y / 2), gameObject.color);
            bitmap.draw(parseInt(v3.x + screen.x / 2), parseInt(v3.y + screen.y / 2), gameObject.color); */

            triangle(v1, v2, v3, bitmap, gameObject.color);
        }
    }

    ctx.putImageData(bitmap.bitmap, 0, 0);
}, 1000 / 60)



/** 
 * @param {Vertex} t0 
 * @param {Vertex} t1 
 * @param {Vertex} t2 
 * */
function triangle(t0, t1, t2, bitmap, color) {

    let norm = new Vertex(
        t0.y * t2.z - t0.z * t2.y, 
        t0.z * t2.x - t0.x * t2.z, 
        t0.x * t2.y - t0.y * t2.x
    )

    if (t0.y > t1.y) { [t0, t1] = [t1, t0] }
    if (t0.y > t2.y) { [t0, t2] = [t2, t0] }
    if (t1.y > t2.y) { [t1, t2] = [t2, t1] }

    let total_height = t2.y - t0.y;

    
    let len = Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);

    norm.x /= len;
    norm.y /= len;
    norm.z /= len;

    let sh = Math.abs(norm.y);

    let cl = [];

    cl[0] = color [0] * sh;
    cl[1] = color [1] * sh;
    cl[2] = color [2] * sh;
    cl[3] = 255;


    for (let i = 0; i < total_height; i++) {
        let second_half = i > t1.y - t0.y || t1.y == t0.y;
        let segment_height = second_half ? t2.y - t1.y : t1.y - t0.y;

        let alpha = i / total_height;
        let beta = (i - (second_half ? t1.y - t0.y : 0)) / segment_height;

        let A = t0.pluseVertex(t2.minusVertex(t0).multiplyNumber(alpha));
        let B = second_half ?
            t1.pluseVertex(t2.minusVertex(t1).multiplyNumber(beta)):
            t0.pluseVertex(t1.minusVertex(t0).multiplyNumber(beta));

        if (A.x > B.x) { [A, B] = [B, A] }

        for (let j = A.x; j <= B.x; j++) {

            
            bitmap.draw(j, t0.y + i, cl);
        }
    }

    /* drawLine(t0.x, t0.y, t1.x, t1.y, bitmap, color);
    drawLine(t1.x, t1.y, t2.x, t2.y, bitmap, color);
    drawLine(t2.x, t2.y, t0.x, t0.y, bitmap, color); */

}

function drawLine(x0, y0, x1, y1, bitmap, color) {
    let steep = false;

    if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
        [x0, y0] = [y0, x0];
        [x1, y1] = [y1, x1];
        steep = true;
    }

    if (x0 > x1) {
        [x0, x1] = [x1, x0];
        [y0, y1] = [y1, y0];
    }

    let dx = x1 - x0;
    let dy = y1 - y0;

    for (let x = x0; x <= x1; x++) {
        let t = (x - x0) / parseFloat(x1 - x0);
        let y = y0 * (1.0 - t) + y1 * t;

        if (steep) {
            bitmap.draw(y, x, color);
        }
        else {
            bitmap.draw(x, y, color)
        }
    }

    /* for (t = 0.0; t < 1; t += 0.01) {
        let x = x0 * (1.0 - t) + x1 * t;
        let y = y0 * (1.0 - t) + y1 * t;


        bitmap.draw(parseInt(x + screen.x / 2), parseInt(y + screen.y / 2), color)
    } */
}