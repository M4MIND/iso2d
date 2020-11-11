const Angle = require("./Angle");
const Matrix4 = require("./Matrix4");
const Quaternion = require("./Quaternion");
const Vector3 = require("./Vector3");
const Vertex = require("./Vertex");

class Mathf {}

Mathf.Vector3 = Vector3;
Mathf.Matrix4 = Matrix4;
Mathf.Angle = Angle;
Mathf.Quaternion = Quaternion;
Mathf.Vertex = Vertex;

module.exports = Mathf;