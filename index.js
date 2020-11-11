const Camera = require("./src/Camera/Camera");
const Projection = require("./src/Camera/Projection");
const ScreenMatrix = require("./src/Camera/ScreenMatrix");
const Mesh = require("./src/Components/Mesh/Mesh");
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

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
document.body.appendChild(canvas);

for (var x = -1; x < 1; x++) {
    for (var y = -1; y < 1; y++) {
        for (z = -1; z < 0; z++) {
            let temp = new Suzanne();

            temp.transform.position = new Vector3(x, y, z);
            temp.transform.scale = new Vector3(0.3, 0.3, 0.3);
            temp.color = [255, 255, 255, 255];

            game.scene.add(temp);
        }
    }
}

cam.position = new Vector3(0, 0, 0)


let angle = 0;
let angleCamX = 0;
let angleCamY = 0;
let angleCamZ = 0;

document.addEventListener('keypress', (e) => {

    console.log(e.keyCode);

    if (e.keyCode === 119) {
        cam.position.y -= 1 * 0.01;
    } if (e.keyCode === 115) {
        cam.position.y += 1 * 0.01;
    } if (e.keyCode === 97) {
        cam.position.x += 1 * 0.01;
    } if (e.keyCode === 100) {
        cam.position.x -= 1 * 0.01;
    } if (e.keyCode === 114) {
        cam.position.z += 1 * 0.1;
    } if (e.keyCode === 102) {
        cam.position.z -= 1 * 0.1;
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

setInterval(function () {

    document.getElementById('x').innerText = cam.position.x;
    document.getElementById('y').innerText = cam.position.y;
    document.getElementById('z').innerText = cam.position.z;
    document.getElementById('rX').innerText = angleCamX;
    document.getElementById('rY').innerText = angleCamY;
    document.getElementById('rZ').innerText = angleCamZ;

    let bitmap = new Bitmap(ctx.createImageData(canvas.width, canvas.height))
    angle += 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    for (let gameObject of game.scene.all()) {

        gameObject.transform.rotation = Quaternion.fromVector(new Vector3(1, 1, 1), Mathf.Angle.degreesToRadians(angle));

        let mesh = gameObject.getComponent(Mesh);

        for (let face of mesh.faces) {
            /** @type {Vertex} */
            let v1 = mesh.verteces[face[0]];
            /** @type {Vertex} */
            let v2 = mesh.verteces[face[1]];
            /** @type {Vertex} */
            let v3 = mesh.verteces[face[2]];

            v1 = v1
                .multiplyOnMatrix(gameObject.transform.getMatrix())
                .multiplyOnMatrix(cam.getMatrix())
                .multiplyOnMatrix(projection)
                .normal()
            v2 = v2
                .multiplyOnMatrix(gameObject.transform.getMatrix())
                .multiplyOnMatrix(cam.getMatrix())
                .multiplyOnMatrix(projection)
                .normal()
            v3 = v3
                .multiplyOnMatrix(gameObject.transform.getMatrix())
                .multiplyOnMatrix(cam.getMatrix())
                .multiplyOnMatrix(projection)
                .normal()

            if (v1.x < -1 || v1.x > 1 || v1.y < -1 || v1.y > 1) {
                continue;
            }
            if (v2.x < -1 || v2.x > 1 || v2.y < -1 || v2.y > 1) {
                continue;
            }

            if (v3.x < -1 || v3.x > 1 || v3.y < -1 || v3.y > 1) {
                continue;
            }

            v1 = v1.multiplyOnMatrix(screenMatrix);
            v2 = v2.multiplyOnMatrix(screenMatrix);
            v3 = v3.multiplyOnMatrix(screenMatrix);

            bitmap.draw(parseInt(v1.x + document.body.clientWidth / 2), parseInt(v1.y + document.body.clientHeight / 2), gameObject.color);
            bitmap.draw(parseInt(v2.x + document.body.clientWidth / 2), parseInt(v2.y + document.body.clientHeight / 2), gameObject.color);
            bitmap.draw(parseInt(v3.x + document.body.clientWidth / 2), parseInt(v3.y + document.body.clientHeight / 2), gameObject.color);
        }
    }

    ctx.putImageData(bitmap.bitmap, 0, 0);
}, 1000 / 60)
