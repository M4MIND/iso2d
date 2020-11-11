const Camera = require("./src/Camera/Camera");
const Projection = require("./src/Camera/Projection");
const ScreenMatrix = require("./src/Camera/ScreenMatrix");
const Mesh = require("./src/Components/Mesh/Mesh");
const Cube = require("./src/GameObject/Primitive/Cube");
const Suzanne = require("./src/GameObject/Primitive/Suzanne");
const iso2d = require("./src/iso2d");
const Mathf = require("./src/Mathf/Mathf");
const { Vector3, Matrix4 } = require("./src/Mathf/Mathf");
const Quaternion = require("./src/Mathf/Quaternion");
const Vertex = require("./src/Mathf/Vertex");
const Bitmap = require("./src/Render/Bitmap");

let game = new iso2d();

let COLOR = [
    [0, 0, 0, 255],
    [126, 126, 126, 255],
]

let cube = new Cube();
let suzanne = new Suzanne();

suzanne.transform.position = new Vector3(0, 0, 0)
suzanne.transform.scale = new Vector3(0.05, 0.05, 0.05)

cube.transform.position = new Vector3(0, 0, 0);
cube.transform.scale = new Vector3(0.05, 0.05, 0.05)

//game.scene.add(cube);
game.scene.add(suzanne);


let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;

document.body.appendChild(canvas);



let cam = new Camera();

cam.position = new Vector3(-0.25, -0.25, 0)

let projection = new Projection(cam);
let screenMatrix = new ScreenMatrix();

let angle = 0;

document.addEventListener('keypress', (e) => {
    if (e.keyCode === 119) {
        cam.position.y += 1 * .002;
    } if (e.keyCode === 115) {
        cam.position.y -= 1 * .002;
    } if (e.keyCode === 97) {
        cam.position.x -= 1 * .002;
    } if (e.keyCode === 100) {
        cam.position.x += 1 * .002;
    } if (e.keyCode === 114) {
        cam.position.z += 1 * .002;
    } if (e.keyCode === 102) {
        cam.position.z -= 1 * .002;
    }

    console.dir(suzanne.transform.getMatrix())
    console.log(cam.position);
})

setInterval(function () {
    angle += 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let bitmap = new Bitmap(ctx.createImageData(canvas.width, canvas.height))
    //cube.transform.rotation = Quaternion.fromVector(new Vector3(1, 1, 1), Mathf.Angle.degreesToRadians(angle))
    suzanne.transform.rotation = Quaternion.fromVector(new Vector3(0, 1, 0), Mathf.Angle.degreesToRadians(angle))

    for (let gameObject of game.scene.all()) {
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
                .multiplyOnMatrix(screenMatrix)
            v2 = v2
                .multiplyOnMatrix(gameObject.transform.getMatrix())
                .multiplyOnMatrix(cam.getMatrix())
                .multiplyOnMatrix(projection)
                .normal()
                .multiplyOnMatrix(screenMatrix)
            v3 = v3
                .multiplyOnMatrix(gameObject.transform.getMatrix())
                .multiplyOnMatrix(cam.getMatrix())
                .multiplyOnMatrix(projection)
                
                .multiplyOnMatrix(screenMatrix)

            /* let v1 = new Matrix4([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [mesh.verteces[face[0]].x, mesh.verteces[face[0]].y, mesh.verteces[face[0]].z, 1]
            ]).multiply(gameObject.transform.getMatrix()).multiply(cam.getMatrix()).multiply(projection).multiply(screenMatrix)

            let v2 = new Matrix4([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [mesh.verteces[face[1]].x, mesh.verteces[face[1]].y, mesh.verteces[face[1]].z, 1]
            ]).multiply(gameObject.transform.getMatrix()).multiply(cam.getMatrix()).multiply(projection).multiply(screenMatrix)

            let v3 = new Matrix4([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [mesh.verteces[face[2]].x, mesh.verteces[face[2]].y, mesh.verteces[face[2]].z, 1]
            ]).multiply(gameObject.transform.getMatrix()).multiply(cam.getMatrix()).multiply(projection).multiply(screenMatrix)


            v1 = new Vector3(v1.e[3][0], v1.e[3][1], v1.e[3][2])
            v2 = new Vector3(v2.e[3][0], v2.e[3][1], v2.e[3][2])
            v3 = new Vector3(v3.e[3][0], v3.e[3][1], v3.e[3][2]) */


            bitmap.draw(parseInt(v1.x), parseInt(v1.y), [0, 0, 0, 255])
            bitmap.draw(parseInt(v2.x), parseInt(v2.y), [0, 0, 0, 255])
            bitmap.draw(parseInt(v3.x), parseInt(v3.y), [0, 0, 0, 255])
        }
    }

    ctx.putImageData(bitmap.bitmap, 0, 0);
}, 1000 / 60)
