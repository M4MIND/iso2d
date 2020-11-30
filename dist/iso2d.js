(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["iso2d"] = factory();
	else
		root["iso2d"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const Camera = __webpack_require__(1);
	const ScreenMatrix = __webpack_require__(9);
	const RGBA = __webpack_require__(10);
	const Mesh = __webpack_require__(11);
	const Sphere = __webpack_require__(16);
	const Suzanne = __webpack_require__(17);
	const iso2d = __webpack_require__(18);
	const Mathf = __webpack_require__(2);
	const { Vector3, Quaternion } = __webpack_require__(2);
	const Vertex = __webpack_require__(7);
	const Bitmap = __webpack_require__(22);
	
	let game = new iso2d(document.getElementById('_CANVAS'));
	
	game.scene.addGameObject(new Suzanne());
	
	function render() {
	
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
	    let angle = 0;
	
	
	    setInterval(function () {
	        for (let i = 0; i < zBuffer.length; i++) {
	            zBuffer[i] = Number.NEGATIVE_INFINITY;
	        }
	
	        let bitmap = new Bitmap(ctx.createImageData(screen.x, screen.y))
	
	        ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	        let camM = cam.getMatrix();
	
	        lightCache = light.normalize();
	
	        angle += 0.3;
	
	        for (let gameObject of game.scene.allGameObjects()) {
	            gameObject.transform.rotation = Quaternion.fromVector(new Vector3(0,1,0), Mathf.Angle.degreesToRadians(angle))
	
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
	}
	
	render();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	const Mathf = __webpack_require__(2);
	const { Vector3, Matrix4, Quaternion } = __webpack_require__(2);
	const Projection = __webpack_require__(8);
	
	class Camera {
	    constructor(core) {
	        this._core = core;
	        this._position = new Vector3(0, 0, 0, 1);
	        this._forward = new Vector3(0, 0, 1, 1);
	        this._up = new Vector3(0, 1, 0, 1);
	        this._right = new Vector3(1, 0, 0, 1);
	        this._near = 0.1;
	        this._far = 100;
	        this._h_fov = Mathf.Angle.degreesToRadians(120);
	        this._v_fov = this._h_fov * (document.body.clientHeight / document.body.clientWidth);
	
	        this.rotation = Quaternion.fromVector(new Vector3(0, 0, 0), 0);
	
	        this.projection = new Projection(this);
	    }
	
	    get position() {
	        return this._position;
	    }
	
	    set position(v) {
	        this._position = v;
	    }
	
	    getMatrix() {
	        return this.rotationMatrix().multiply(this.positionMatrix());
	    }
	
	    positionMatrix() {
	        return new Matrix4([
	            [1, 0, 0, this._position.x],
	            [0, 1, 0, this._position.y],
	            [0, 0, 1, this._position.z],
	            [0, 0, 0, 1],
	        ])
	    }
	
	    rotationMatrix() {
	        return this.rotation.toMatrix4();
	    }
	}
	
	module.exports = Camera;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	const Angle = __webpack_require__(3);
	const Matrix4 = __webpack_require__(4);
	const Quaternion = __webpack_require__(6);
	const Vector3 = __webpack_require__(5);
	const Vertex = __webpack_require__(7);
	
	class Mathf {}
	
	Mathf.Vector3 = Vector3;
	Mathf.Matrix4 = Matrix4;
	Mathf.Angle = Angle;
	Mathf.Quaternion = Quaternion;
	Mathf.Vertex = Vertex;
	
	module.exports = Mathf;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	class Angle {
	    static degreesToRadians(a) {
	        return a * (Math.PI / 180);
	    }
	    static radiansToDegrees(a) {
	        return a / (Math.PI / 180);
	    }
	}
	
	module.exports = Angle;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	const Vector3 = __webpack_require__(5);
	
	class Matrix4 {
	    constructor(m) {
	        this.e = m || [
	            [1, 0, 0, 0],
	            [0, 1, 0, 0],
	            [0, 0, 1, 0],
	            [0, 0, 0, 1]
	        ]
	    }
	
	    /**
	     * 
	     * @param {Matrix4} m 
	     */
	    multiply(M) {
	        let A = this.e;
	        let B = M.e;
	        let m = [];
	        for (let row = 0; row < A.length; row++) {
	            let newRow = [];
	            for (let col = 0; col < B[row].length; col++) {
	                let dot = 0;
	
	                for (let i = 0; i < A[row].length; i++) {
	                    dot += A[row][i] * B[i][col];
	                }
	
	                newRow.push(dot);
	            }
	            m.push(newRow);
	        }
	
	        return new Matrix4(m);
	    }
	
	    /** @param {Matrix4} M */
	    multiplyOfMatrix(M) {
	
	    }
	
	    /** @param {Matrix4[]} list */
	    multiplyArrayOfMatrices(list) {
	        let m = this;
	        for (let matrix of list) {
	            m = m.multiply(matrix);
	        }
	
	        return m;
	    }
	
	    /**
	     * @param {Vector3} v 
	     */
	    multipleOnVector(v) {
	        let e = this.e;
	
	        return new Vector3(
	            e[0][0] * v.x + e[0][1] * v.y + e[0][2] * v.z + e[0][3] * v.w,
	            e[1][0] * v.x + e[1][1] * v.y + e[1][2] * v.z + e[1][3] * v.w,
	            e[2][0] * v.x + e[2][1] * v.y + e[2][2] * v.z + e[2][3] * v.w,
	            e[3][0] * v.x + e[3][1] * v.y + e[3][2] * v.z + e[3][3] * v.w
	        )
	    }
	}
	
	
	module.exports = Matrix4;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	class Vector3 {
	    constructor(x, y, z, w) {
	        this._x = x || 0.0;
	        this._y = y || 0.0;
	        this._z = z || 0.0;
	        this._w = w || 0.0;
	    }
	
	    /**
	     * @returns {Number}
	     */
	    get x() {
	        return this._x;
	    }
	
	    /**
	     * @returns {Number}
	     */
	    get y() {
	        return this._y;
	    }
	
	    /**
	     * @returns {Number}
	     */
	    get z() {
	        return this._z;
	    }
	
	    set x(x) {
	        this._x = x;
	    }
	
	    set y(y) {
	        this._y = y;
	    }
	
	    set z(z) {
	        this._z = z;
	    }
	
	    get w () {
	        this._w;
	    }
	
	    /**
	     * @returns {Number}
	     */
	    length() {
	        return Vector3.length(this);
	    }
	
	    /**
	     * @returns {Vector3};
	     */
	    normalize() {
	        return Vector3.normalize(this);
	    }
	
	    /**
	     * @param {Vector3} v 
	     * 
	     * @returns {Number}
	     */
	    static length(v) {
	        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
	    }
	
	    /**
	     * @param {Vector3} v 
	     * @returns {Vector3}
	     */
	    static normalize(v) {
	        let len = v.length();
	        return new Vector3(v.x / len, v.y / len, v.z / len);
	    }
	}
	
	module.exports = Vector3;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	const Matrix4 = __webpack_require__(4);
	const Vector3 = __webpack_require__(5);
	
	class Quaternion {
	    constructor(x, y, z, w) {
	        this._x = x || 0;
	        this._y = y || 0;
	        this._z = z || 0;
	        this._w = w || 0;
	    }
	
	    get x() {
	        return this._x;
	    }
	
	    get y() {
	        return this._y;
	    }
	
	    get z() {
	        return this._z;
	    }
	
	    get w() {
	        return this._w;
	    }
	
	    set x(x) {
	        this._x = x;
	    }
	
	    set y(y) {
	        this._y = y;
	    }
	
	    set z(z) {
	        this._z = z;
	    }
	
	    set w(w) {
	        this._w = w;
	    }
	
	    toMatrix4() {
	        let w = this.w;
	        let x = this.x;
	        let y = this.y;
	        let z = this.z;
	
	        let n = w * w + x * x + y * y + z * z;
	        let s = n === 0 ? 0 : 2 / n;
	        let wx = s * w * x, wy = s * w * y, wz = s * w * z;
	        let xx = s * x * x, xy = s * x * y, xz = s * x * z;
	        let yy = s * y * y, yz = s * y * z, zz = s * z * z;
	
	        return new Matrix4([
	            [1 - (yy + zz), xy - wz, xz + wy, 0],
	            [xy + wz, 1 - (xx + zz), yz - wx, 0],
	            [xz - wy, yz + wx, 1 - (xx + yy), 0],
	            [0, 0, 0, 1]]
	        );
	    }
	
	    /**
	     * 
	     * @param {Quaternion} q 
	     */
	    multiple(q) {
	        var w1 = this.w;
	        var x1 = this.x;
	        var y1 = this.y;
	        var z1 = this.z;
	
	        var w2 = q.w;
	        var x2 = q.x;
	        var y2 = q.y;
	        var z2 = q.z;
	
	        return new Quaternion(
	            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
	            w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2,
	            w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2,
	            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
	        );
	    }
	
	    /**
	     * @param {Vector3} v 
	     * @param {Number} a 
	     */
	    static fromVector(v, a) {
	        v = v.normalize();
	        let sin = Math.sin(a / 2);
	        let cos = Math.cos(a / 2);
	        return new Quaternion(sin * v.x, sin * v.y, sin * v.z, cos)
	    }
	}
	
	module.exports = Quaternion;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	const Matrix4 = __webpack_require__(4);
	
	class Vertex {
	    constructor(x, y, z, w) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	        this.w = w || 1;
	    }
	
	    /** 
	     * @param {Matrix4} M
	     * @returns {Vertex}
	     */
	    multiplyOnMatrix(M) {
	        let e = M.e;
	
	        return new Vertex(
	            e[0][0] * this.x + e[0][1] * this.y + e[0][2] * this.z + e[0][3] * this.w,
	            e[1][0] * this.x + e[1][1] * this.y + e[1][2] * this.z + e[1][3] * this.w,
	            e[2][0] * this.x + e[2][1] * this.y + e[2][2] * this.z + e[2][3] * this.w,
	            e[3][0] * this.x + e[3][1] * this.y + e[3][2] * this.z + e[3][3] * this.w
	        )
	    }
	    normal() {
	        return new Vertex(
	            this.x / this.w,
	            this.y / this.w,
	            this.z / this.w,
	            this.w / this.w
	        )
	    }
	
	    pluseVertex(v) {
	        return new Vertex(this.x + v.x, this.y + v.y, this.z + v.z);
	    }
	
	    minusVertex(v) {
	        return new Vertex(this.x - v.x, this.y - v.y, this.z - v.z);
	    }
	
	    multiplyNumber(n) {
	        return new Vertex(this.x * n, this.y * n, this.z * n);
	    }
	
	}
	
	module.exports = Vertex;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	const { Matrix4 } = __webpack_require__(2);
	const Camera = __webpack_require__(1);
	
	class Projection {
	    /**
	     * 
	     * @param {Camera} camera 
	     */
	    constructor(camera) {
	        let near = camera.near || 0.1;
	        let far = camera.far || 100;
	
	        let m00 = document.body.clientHeight / document.body.clientWidth;
	        let m11 = 1 / Math.tan(90 * 0.5 * Math.PI / 180);
	        let m22 = -far / (far - near);
	        let m32 = -far * near / (far - near);
	
	        return new Matrix4([
	            [m00, 0, 0, 0],
	            [0, m11, 0, 0],
	            [0, 0, m22, 1],
	            [0, 0, m32, 0],
	        ])
	    }
	}
	
	module.exports = Projection;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	const { Matrix4 } = __webpack_require__(2);
	const Camera = __webpack_require__(1);
	
	class ScreenMatrix {
	    /**
	     * 
	     * @param {Camera} camera 
	     */
	    constructor(camera) {
	        return new Matrix4([
	            [document.body.clientWidth / 2, 0, 0, document.body.clientWidth / 2],
	            [0, document.body.clientHeight / 2, 0, document.body.clientHeight / 2],
	            [0, 0, 1, 0],
	            [0, 0, 0, 1],
	        ])
	    }
	}
	
	module.exports = ScreenMatrix;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	class RGBA {
	    constructor(r, g, b, a) {
	        this._r = r;
	        this._g = g;
	        this._b = b;
	        this._a = a;
	    }
	
	    get r() {
	        return this._r;
	    }
	
	    get g() {
	        return this._g;
	    }
	
	    get b() {
	        return this._b;
	    }
	
	    get a() {
	        return this._a;
	    }
	
	    set r(v) {
	        this._r = v;
	        return this;
	    }
	
	    set g(v) {
	        this._g = v;
	        return this;
	    }
	
	    set b(v) {
	        this._b = v;
	        return this;
	    }
	
	    set a(v) {
	        this._a = v;
	        return this;
	    }
	
	    multiply(v) {
	        this.r *= v;
	        this.g *= v;
	        this.b *= v;
	
	        return this;
	    }
	
	    static multiply(color, v) {
	        return new RGBA(color.r * v, color.g * v, color.b * v, color.a)
	    }
	}
	
	module.exports = RGBA;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	const Render = __webpack_require__(12);
	const Component = __webpack_require__(13);
	
	class Mesh extends Component {
	    constructor() {
	        super();
	        this._verteces = [];
	        this._faces = [];
	    }
	
	    /** @returns {Vertex[]} */
	    get verteces() {
	        return this._verteces;
	    }
	
	    /** @param {Vertex[]} v */
	    set verteces(v) {
	        this._verteces = v;
	    }
	
	    /** @returns {[]} */
	    get faces() {
	        return this._faces;
	    }
	
	    /** @param {[]} f */
	    set faces(f) {
	        this._faces = f;
	    }
	
	    /** @param {Render} render */
	    onDraw(render) {
	    }
	}
	
	module.exports = Mesh;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	class Render {
	    /** @param {iso2d} core */
	    constructor(core) {
	        this._core = core;
	        this._canvas = core.canvas;
	        this._verteces = [];
	    }
	
	    pushVerteces(verteces) {
	    }
	}
	
	module.exports = Render;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	const GameObject = __webpack_require__(14);
	
	class Component {
	    constructor () {
	        this._gameObject = null;
	    }
	
	    /** @returns {GameObject} */
	    get gameObject () {
	        return this._gameObject;
	    }
	
	    /** @param {GameObject} gameObject */
	    set gameObject (gameObject) {
	        this._gameObject = gameObject;
	    }
	
	    onUpdate() {
	
	    }
	
	    onDraw() {
	        
	    }
	}
	
	module.exports = Component;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	const RGBA = __webpack_require__(10);
	const Component = __webpack_require__(13);
	const Transform = __webpack_require__(15);
	
	class GameObject {
	    constructor() {
	        this.tag = null;
	        this.components = new Map();
	        this.transform = new Transform();
	        this.shadow = true;
	        this.color = new RGBA(255, 255, 255, 255);
	    }
	
	    /**
	     * 
	     * @param {Component} component 
	     */
	    addComponent(component) {
	        let name = component.name;
	        component = new component();
	        component.gameObject = this;
	
	        this.components.set(name, component);
	        return this.components.get(name);
	    }
	
	    /**
	     * @returns {Component}
	     */
	    getComponent(component) {
	        return this.components.get(component.name);
	    }
	
	    /**
	     * @returns {Component[]}
	     */
	    allComponents() {
	        return this.components.values();
	    }
	
	    onStart() {
	
	    }
	
	    onUpdate() {
	
	    }
	
	    onDraw(render) {
	        for (let component of this.components.values()) {
	            component.onDraw(render);
	        }
	    }
	
	    start() {
	
	    }
	
	    update() {
	
	    }
	}
	
	module.exports = GameObject;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	const { Vector3, Quaternion, Matrix4 } = __webpack_require__(2);
	
	class Transform {
	    constructor() {
	        this._position = new Vector3(0, 0, 0);
	        this._scale = new Vector3(1, 1, 1)
	        this._rotation = new Quaternion();
	    }
	
	    get position() {
	        return this._position;
	    }
	
	    set position(v) {
	        this._position = v;
	    }
	
	    get rotation() {
	        return this._rotation;
	    }
	
	    set rotation(q) {
	        this._rotation = q;
	    }
	
	    get scale() {
	        return this._scale;
	    }
	
	    set scale(v) {
	        this._scale = v;
	    }
	
	    getMatrix() {
	        return new Matrix4().multiplyArrayOfMatrices([
	            new Matrix4([
	                [1, 0, 0, this.position.x],
	                [0, 1, 0, this.position.y],
	                [0, 0, 1, this.position.z],
	                [0, 0, 0, 1]
	            ]),
	            this.rotation.toMatrix4(),
	            
	            new Matrix4([
	                [this.scale.x, 0, 0, 0],
	                [0, this.scale.y, 0, 0],
	                [0, 0, this.scale.z, 0],
	                [0, 0, 0, 1]
	            ]),
	            
	        ])
	
	    }
	
	    /** @param {Quaternion} q */
	    rotate(q) {
	        this.rotation = this.rotation.multiple(q);
	    }
	}
	
	module.exports = Transform;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	const Mesh = __webpack_require__(11);
	const { Vertex } = __webpack_require__(2);
	const GameObject = __webpack_require__(14);
	
	class Sphere extends GameObject {
	    constructor() {
	        super();
	        /** @type {Mesh} */
	        let mesh = this.addComponent(Mesh);
	
	        mesh.verteces = [
	            new Vertex(0.000000, 0.980785, -0.195090),
	            new Vertex(0.000000, 0.923880, -0.382683),
	            new Vertex(0.000000, 0.831470, -0.555570),
	            new Vertex(0.000000, 0.707107, -0.707107),
	            new Vertex(0.000000, 0.555570, -0.831470),
	            new Vertex(0.000000, 0.382683, -0.923880),
	            new Vertex(0.000000, 0.195090, -0.980785),
	            new Vertex(0.000000, 0.000000, -1.000000),
	            new Vertex(0.000000, -0.195090, -0.980785),
	            new Vertex(0.000000, -0.831470, -0.555570),
	            new Vertex(0.038060, 0.980785, -0.191342),
	            new Vertex(0.074658, 0.923880, -0.375330),
	            new Vertex(0.108386, 0.831470, -0.544895),
	            new Vertex(0.137950, 0.707107, -0.693520),
	            new Vertex(0.162212, 0.555570, -0.815493),
	            new Vertex(0.180240, 0.382683, -0.906127),
	            new Vertex(0.191342, 0.195090, -0.961940),
	            new Vertex(0.195090, 0.000000, -0.980785),
	            new Vertex(0.191342, -0.195090, -0.961940),
	            new Vertex(0.180240, -0.382683, -0.906127),
	            new Vertex(0.162212, -0.555570, -0.815493),
	            new Vertex(0.137950, -0.707107, -0.693520),
	            new Vertex(0.108386, -0.831470, -0.544895),
	            new Vertex(0.074658, -0.923880, -0.375330),
	            new Vertex(0.038060, -0.980785, -0.191341),
	            new Vertex(0.074658, 0.980785, -0.180240),
	            new Vertex(0.146447, 0.923880, -0.353553),
	            new Vertex(0.212608, 0.831470, -0.513280),
	            new Vertex(0.270598, 0.707107, -0.653281),
	            new Vertex(0.318190, 0.555570, -0.768178),
	            new Vertex(0.353553, 0.382683, -0.853553),
	            new Vertex(0.375330, 0.195090, -0.906127),
	            new Vertex(0.382684, 0.000000, -0.923879),
	            new Vertex(0.375330, -0.195090, -0.906127),
	            new Vertex(0.353554, -0.382683, -0.853553),
	            new Vertex(0.318190, -0.555570, -0.768178),
	            new Vertex(0.270598, -0.707107, -0.653281),
	            new Vertex(0.212608, -0.831470, -0.513280),
	            new Vertex(0.146447, -0.923880, -0.353553),
	            new Vertex(0.074658, -0.980785, -0.180240),
	            new Vertex(0.108387, 0.980785, -0.162212),
	            new Vertex(0.212608, 0.923880, -0.318190),
	            new Vertex(0.308658, 0.831470, -0.461940),
	            new Vertex(0.392848, 0.707107, -0.587938),
	            new Vertex(0.461940, 0.555570, -0.691342),
	            new Vertex(0.513280, 0.382683, -0.768178),
	            new Vertex(0.544895, 0.195090, -0.815493),
	            new Vertex(0.555570, 0.000000, -0.831469),
	            new Vertex(0.544895, -0.195090, -0.815493),
	            new Vertex(0.513280, -0.382683, -0.768178),
	            new Vertex(0.461940, -0.555570, -0.691342),
	            new Vertex(0.392848, -0.707107, -0.587938),
	            new Vertex(0.308658, -0.831470, -0.461940),
	            new Vertex(0.212608, -0.923880, -0.318189),
	            new Vertex(0.108386, -0.980785, -0.162211),
	            new Vertex(0.137950, 0.980785, -0.137950),
	            new Vertex(0.270598, 0.923880, -0.270598),
	            new Vertex(0.392848, 0.831470, -0.392847),
	            new Vertex(0.500000, 0.707107, -0.500000),
	            new Vertex(0.587938, 0.555570, -0.587938),
	            new Vertex(0.653282, 0.382683, -0.653281),
	            new Vertex(0.693520, 0.195090, -0.693520),
	            new Vertex(0.707107, 0.000000, -0.707107),
	            new Vertex(0.693520, -0.195090, -0.693520),
	            new Vertex(0.653282, -0.382683, -0.653281),
	            new Vertex(0.587938, -0.555570, -0.587938),
	            new Vertex(0.500000, -0.707107, -0.500000),
	            new Vertex(0.392848, -0.831470, -0.392847),
	            new Vertex(0.270598, -0.923880, -0.270598),
	            new Vertex(0.137950, -0.980785, -0.137949),
	            new Vertex(0.162212, 0.980785, -0.108386),
	            new Vertex(0.318190, 0.923880, -0.212607),
	            new Vertex(0.461940, 0.831470, -0.308658),
	            new Vertex(0.587938, 0.707107, -0.392847),
	            new Vertex(0.691342, 0.555570, -0.461940),
	            new Vertex(0.768178, 0.382683, -0.513280),
	            new Vertex(0.815493, 0.195090, -0.544895),
	            new Vertex(0.831470, 0.000000, -0.555570),
	            new Vertex(0.815493, -0.195090, -0.544895),
	            new Vertex(0.768178, -0.382683, -0.513280),
	            new Vertex(0.691342, -0.555570, -0.461940),
	            new Vertex(0.587938, -0.707107, -0.392847),
	            new Vertex(0.461940, -0.831470, -0.308658),
	            new Vertex(0.318190, -0.923880, -0.212607),
	            new Vertex(0.162212, -0.980785, -0.108386),
	            new Vertex(0.180240, 0.980785, -0.074658),
	            new Vertex(0.353554, 0.923880, -0.146446),
	            new Vertex(0.513280, 0.831470, -0.212607),
	            new Vertex(0.653282, 0.707107, -0.270598),
	            new Vertex(0.768178, 0.555570, -0.318189),
	            new Vertex(0.853554, 0.382683, -0.353553),
	            new Vertex(0.906128, 0.195090, -0.375330),
	            new Vertex(0.923880, 0.000000, -0.382683),
	            new Vertex(0.906128, -0.195090, -0.375330),
	            new Vertex(0.853554, -0.382683, -0.353553),
	            new Vertex(0.768178, -0.555570, -0.318189),
	            new Vertex(0.653282, -0.707107, -0.270598),
	            new Vertex(0.513280, -0.831470, -0.212607),
	            new Vertex(0.353554, -0.923880, -0.146446),
	            new Vertex(0.180240, -0.980785, -0.074658),
	            new Vertex(0.191342, 0.980785, -0.038060),
	            new Vertex(0.375331, 0.923880, -0.074658),
	            new Vertex(0.544895, 0.831470, -0.108386),
	            new Vertex(0.693520, 0.707107, -0.137949),
	            new Vertex(0.815493, 0.555570, -0.162211),
	            new Vertex(0.906128, 0.382683, -0.180240),
	            new Vertex(0.961940, 0.195090, -0.191341),
	            new Vertex(0.980785, 0.000000, -0.195090),
	            new Vertex(0.961940, -0.195090, -0.191341),
	            new Vertex(0.906128, -0.382683, -0.180240),
	            new Vertex(0.815493, -0.555570, -0.162211),
	            new Vertex(0.693520, -0.707107, -0.137949),
	            new Vertex(0.544895, -0.831470, -0.108386),
	            new Vertex(0.375330, -0.923880, -0.074658),
	            new Vertex(0.191342, -0.980785, -0.038060),
	            new Vertex(0.195091, 0.980785, 0.000000),
	            new Vertex(0.382684, 0.923880, 0.000000),
	            new Vertex(0.555570, 0.831470, 0.000000),
	            new Vertex(0.707107, 0.707107, 0.000000),
	            new Vertex(0.831470, 0.555570, 0.000000),
	            new Vertex(0.923880, 0.382683, 0.000000),
	            new Vertex(0.980785, 0.195090, 0.000000),
	            new Vertex(1.000000, 0.000000, 0.000000),
	            new Vertex(0.980785, -0.195090, 0.000000),
	            new Vertex(0.923880, -0.382683, 0.000000),
	            new Vertex(0.831470, -0.555570, 0.000000),
	            new Vertex(0.707107, -0.707107, 0.000000),
	            new Vertex(0.555570, -0.831470, 0.000000),
	            new Vertex(0.382684, -0.923880, 0.000000),
	            new Vertex(0.195090, -0.980785, 0.000000),
	            new Vertex(0.191342, 0.980785, 0.038061),
	            new Vertex(0.375331, 0.923880, 0.074658),
	            new Vertex(0.544895, 0.831470, 0.108387),
	            new Vertex(0.693520, 0.707107, 0.137950),
	            new Vertex(0.815493, 0.555570, 0.162212),
	            new Vertex(0.906128, 0.382683, 0.180240),
	            new Vertex(0.961940, 0.195090, 0.191342),
	            new Vertex(0.980785, 0.000000, 0.195091),
	            new Vertex(0.961940, -0.195090, 0.191342),
	            new Vertex(0.906128, -0.382683, 0.180240),
	            new Vertex(0.815493, -0.555570, 0.162212),
	            new Vertex(0.693520, -0.707107, 0.137950),
	            new Vertex(0.544895, -0.831470, 0.108387),
	            new Vertex(0.375330, -0.923880, 0.074658),
	            new Vertex(0.191342, -0.980785, 0.038061),
	            new Vertex(0.180240, 0.980785, 0.074658),
	            new Vertex(0.353554, 0.923880, 0.146447),
	            new Vertex(0.513280, 0.831470, 0.212608),
	            new Vertex(0.653282, 0.707107, 0.270598),
	            new Vertex(0.768178, 0.555570, 0.318190),
	            new Vertex(0.853554, 0.382683, 0.353554),
	            new Vertex(0.906127, 0.195090, 0.375331),
	            new Vertex(0.923880, 0.000000, 0.382684),
	            new Vertex(0.906127, -0.195090, 0.375331),
	            new Vertex(0.853554, -0.382683, 0.353554),
	            new Vertex(0.768178, -0.555570, 0.318190),
	            new Vertex(0.653282, -0.707107, 0.270598),
	            new Vertex(0.513280, -0.831470, 0.212608),
	            new Vertex(0.353553, -0.923880, 0.146447),
	            new Vertex(0.180240, -0.980785, 0.074658),
	            new Vertex(0.162212, 0.980785, 0.108387),
	            new Vertex(0.318190, 0.923880, 0.212608),
	            new Vertex(0.461940, 0.831470, 0.308659),
	            new Vertex(0.587938, 0.707107, 0.392848),
	            new Vertex(0.691342, 0.555570, 0.461940),
	            new Vertex(0.768178, 0.382683, 0.513280),
	            new Vertex(0.815493, 0.195090, 0.544895),
	            new Vertex(0.831470, 0.000000, 0.555571),
	            new Vertex(0.815493, -0.195090, 0.544895),
	            new Vertex(0.768178, -0.382683, 0.513280),
	            new Vertex(0.691342, -0.555570, 0.461940),
	            new Vertex(0.587938, -0.707107, 0.392848),
	            new Vertex(0.461940, -0.831470, 0.308659),
	            new Vertex(0.318190, -0.923880, 0.212608),
	            new Vertex(0.162212, -0.980785, 0.108387),
	            new Vertex(0.137950, 0.980785, 0.137950),
	            new Vertex(0.270598, 0.923880, 0.270599),
	            new Vertex(0.392848, 0.831470, 0.392848),
	            new Vertex(0.500000, 0.707107, 0.500000),
	            new Vertex(0.587938, 0.555570, 0.587938),
	            new Vertex(0.653282, 0.382683, 0.653282),
	            new Vertex(0.693520, 0.195090, 0.693520),
	            new Vertex(0.707107, 0.000000, 0.707107),
	            new Vertex(0.693520, -0.195090, 0.693520),
	            new Vertex(0.653282, -0.382683, 0.653282),
	            new Vertex(0.587938, -0.555570, 0.587938),
	            new Vertex(0.500000, -0.707107, 0.500000),
	            new Vertex(0.392848, -0.831470, 0.392848),
	            new Vertex(0.270598, -0.923880, 0.270598),
	            new Vertex(0.137950, -0.980785, 0.137950),
	            new Vertex(0.108386, 0.980785, 0.162212),
	            new Vertex(0.212608, 0.923880, 0.318190),
	            new Vertex(0.308658, 0.831470, 0.461940),
	            new Vertex(0.392848, 0.707107, 0.587938),
	            new Vertex(0.461940, 0.555570, 0.691342),
	            new Vertex(0.513280, 0.382683, 0.768178),
	            new Vertex(0.544895, 0.195090, 0.815493),
	            new Vertex(0.555570, 0.000000, 0.831470),
	            new Vertex(0.544895, -0.195090, 0.815493),
	            new Vertex(0.513280, -0.382683, 0.768178),
	            new Vertex(0.461940, -0.555570, 0.691342),
	            new Vertex(0.392848, -0.707107, 0.587938),
	            new Vertex(0.308658, -0.831470, 0.461940),
	            new Vertex(0.212608, -0.923880, 0.318190),
	            new Vertex(0.108386, -0.980785, 0.162212),
	            new Vertex(0.000000, -1.000000, 0.000000),
	            new Vertex(0.074658, 0.980785, 0.180240),
	            new Vertex(0.146447, 0.923880, 0.353554),
	            new Vertex(0.212608, 0.831470, 0.513280),
	            new Vertex(0.270598, 0.707107, 0.653282),
	            new Vertex(0.318190, 0.555570, 0.768178),
	            new Vertex(0.353553, 0.382683, 0.853554),
	            new Vertex(0.375330, 0.195090, 0.906128),
	            new Vertex(0.382683, 0.000000, 0.923880),
	            new Vertex(0.375330, -0.195090, 0.906128),
	            new Vertex(0.353553, -0.382683, 0.853554),
	            new Vertex(0.318190, -0.555570, 0.768178),
	            new Vertex(0.270598, -0.707107, 0.653282),
	            new Vertex(0.212608, -0.831470, 0.513280),
	            new Vertex(0.146447, -0.923880, 0.353554),
	            new Vertex(0.074658, -0.980785, 0.180240),
	            new Vertex(0.038060, 0.980785, 0.191342),
	            new Vertex(0.074658, 0.923880, 0.375331),
	            new Vertex(0.108386, 0.831470, 0.544896),
	            new Vertex(0.137950, 0.707107, 0.693520),
	            new Vertex(0.162212, 0.555570, 0.815493),
	            new Vertex(0.180240, 0.382683, 0.906128),
	            new Vertex(0.191342, 0.195090, 0.961940),
	            new Vertex(0.195090, 0.000000, 0.980786),
	            new Vertex(0.191342, -0.195090, 0.961940),
	            new Vertex(0.180240, -0.382683, 0.906128),
	            new Vertex(0.162212, -0.555570, 0.815493),
	            new Vertex(0.137950, -0.707107, 0.693520),
	            new Vertex(0.108386, -0.831470, 0.544895),
	            new Vertex(0.074658, -0.923880, 0.375331),
	            new Vertex(0.038060, -0.980785, 0.191342),
	            new Vertex(-0.000000, 0.980785, 0.195091),
	            new Vertex(0.000000, 0.923880, 0.382684),
	            new Vertex(0.000000, 0.831470, 0.555571),
	            new Vertex(-0.000000, 0.707107, 0.707107),
	            new Vertex(-0.000000, 0.555570, 0.831470),
	            new Vertex(0.000000, 0.382683, 0.923880),
	            new Vertex(-0.000000, 0.195090, 0.980785),
	            new Vertex(-0.000000, 0.000000, 1.000000),
	            new Vertex(-0.000000, -0.195090, 0.980785),
	            new Vertex(0.000000, -0.382683, 0.923880),
	            new Vertex(-0.000000, -0.555570, 0.831470),
	            new Vertex(-0.000000, -0.707107, 0.707107),
	            new Vertex(-0.000000, -0.831470, 0.555570),
	            new Vertex(0.000000, -0.923880, 0.382684),
	            new Vertex(0.000000, -0.980785, 0.195091),
	            new Vertex(-0.038060, 0.980785, 0.191342),
	            new Vertex(-0.074658, 0.923880, 0.375331),
	            new Vertex(-0.108386, 0.831470, 0.544896),
	            new Vertex(-0.137950, 0.707107, 0.693520),
	            new Vertex(-0.162212, 0.555570, 0.815493),
	            new Vertex(-0.180240, 0.382683, 0.906128),
	            new Vertex(-0.191342, 0.195090, 0.961940),
	            new Vertex(-0.195090, 0.000000, 0.980786),
	            new Vertex(-0.191342, -0.195090, 0.961940),
	            new Vertex(-0.180240, -0.382683, 0.906128),
	            new Vertex(-0.162212, -0.555570, 0.815493),
	            new Vertex(-0.137950, -0.707107, 0.693520),
	            new Vertex(-0.108386, -0.831470, 0.544895),
	            new Vertex(-0.074658, -0.923880, 0.375331),
	            new Vertex(-0.038060, -0.980785, 0.191342),
	            new Vertex(-0.074658, 0.980785, 0.180240),
	            new Vertex(-0.146447, 0.923880, 0.353554),
	            new Vertex(-0.212608, 0.831470, 0.513280),
	            new Vertex(-0.270598, 0.707107, 0.653282),
	            new Vertex(-0.318190, 0.555570, 0.768178),
	            new Vertex(-0.353553, 0.382683, 0.853554),
	            new Vertex(-0.375330, 0.195090, 0.906127),
	            new Vertex(-0.382684, 0.000000, 0.923880),
	            new Vertex(-0.375330, -0.195090, 0.906127),
	            new Vertex(-0.353553, -0.382683, 0.853554),
	            new Vertex(-0.318190, -0.555570, 0.768178),
	            new Vertex(-0.270598, -0.707107, 0.653282),
	            new Vertex(-0.212608, -0.831470, 0.513280),
	            new Vertex(-0.146447, -0.923880, 0.353554),
	            new Vertex(-0.074658, -0.980785, 0.180240),
	            new Vertex(-0.108386, 0.980785, 0.162212),
	            new Vertex(-0.212608, 0.923880, 0.318190),
	            new Vertex(-0.308658, 0.831470, 0.461940),
	            new Vertex(-0.392847, 0.707107, 0.587938),
	            new Vertex(-0.461940, 0.555570, 0.691342),
	            new Vertex(-0.513280, 0.382683, 0.768178),
	            new Vertex(-0.544895, 0.195090, 0.815493),
	            new Vertex(-0.555570, 0.000000, 0.831470),
	            new Vertex(-0.544895, -0.195090, 0.815493),
	            new Vertex(-0.513280, -0.382683, 0.768178),
	            new Vertex(-0.461940, -0.555570, 0.691342),
	            new Vertex(-0.392847, -0.707107, 0.587938),
	            new Vertex(-0.308658, -0.831470, 0.461940),
	            new Vertex(-0.212607, -0.923880, 0.318190),
	            new Vertex(-0.108386, -0.980785, 0.162212),
	            new Vertex(-0.000000, 1.000000, 0.000001),
	            new Vertex(-0.137950, 0.980785, 0.137950),
	            new Vertex(-0.270598, 0.923880, 0.270598),
	            new Vertex(-0.392848, 0.831470, 0.392848),
	            new Vertex(-0.500000, 0.707107, 0.500000),
	            new Vertex(-0.587938, 0.555570, 0.587938),
	            new Vertex(-0.653281, 0.382683, 0.653282),
	            new Vertex(-0.693520, 0.195090, 0.693520),
	            new Vertex(-0.707107, 0.000000, 0.707107),
	            new Vertex(-0.693520, -0.195090, 0.693520),
	            new Vertex(-0.653281, -0.382683, 0.653282),
	            new Vertex(-0.587938, -0.555570, 0.587938),
	            new Vertex(-0.500000, -0.707107, 0.500000),
	            new Vertex(-0.392847, -0.831470, 0.392848),
	            new Vertex(-0.270598, -0.923880, 0.270598),
	            new Vertex(-0.137950, -0.980785, 0.137950),
	            new Vertex(-0.162212, 0.980785, 0.108387),
	            new Vertex(-0.318190, 0.923880, 0.212608),
	            new Vertex(-0.461940, 0.831470, 0.308659),
	            new Vertex(-0.587938, 0.707107, 0.392848),
	            new Vertex(-0.691342, 0.555570, 0.461940),
	            new Vertex(-0.768178, 0.382683, 0.513280),
	            new Vertex(-0.815493, 0.195090, 0.544895),
	            new Vertex(-0.831470, 0.000000, 0.555570),
	            new Vertex(-0.815493, -0.195090, 0.544895),
	            new Vertex(-0.768178, -0.382683, 0.513280),
	            new Vertex(-0.691342, -0.555570, 0.461940),
	            new Vertex(-0.587938, -0.707107, 0.392848),
	            new Vertex(-0.461940, -0.831470, 0.308658),
	            new Vertex(-0.318190, -0.923880, 0.212608),
	            new Vertex(-0.162212, -0.980785, 0.108387),
	            new Vertex(-0.180240, 0.980785, 0.074658),
	            new Vertex(-0.353553, 0.923880, 0.146447),
	            new Vertex(-0.513280, 0.831470, 0.212608),
	            new Vertex(-0.653281, 0.707107, 0.270598),
	            new Vertex(-0.768177, 0.555570, 0.318190),
	            new Vertex(-0.853553, 0.382683, 0.353554),
	            new Vertex(-0.906127, 0.195090, 0.375330),
	            new Vertex(-0.923880, 0.000000, 0.382684),
	            new Vertex(-0.906127, -0.195090, 0.375330),
	            new Vertex(-0.853553, -0.382683, 0.353554),
	            new Vertex(-0.768177, -0.555570, 0.318190),
	            new Vertex(-0.653281, -0.707107, 0.270598),
	            new Vertex(-0.513280, -0.831470, 0.212608),
	            new Vertex(-0.353553, -0.923880, 0.146447),
	            new Vertex(-0.180240, -0.980785, 0.074658),
	            new Vertex(-0.191342, 0.980785, 0.038061),
	            new Vertex(-0.375330, 0.923880, 0.074658),
	            new Vertex(-0.544895, 0.831470, 0.108387),
	            new Vertex(-0.693520, 0.707107, 0.137950),
	            new Vertex(-0.815493, 0.555570, 0.162212),
	            new Vertex(-0.906127, 0.382683, 0.180240),
	            new Vertex(-0.961939, 0.195090, 0.191342),
	            new Vertex(-0.980785, 0.000000, 0.195090),
	            new Vertex(-0.961939, -0.195090, 0.191342),
	            new Vertex(-0.906127, -0.382683, 0.180240),
	            new Vertex(-0.815493, -0.555570, 0.162212),
	            new Vertex(-0.693520, -0.707107, 0.137950),
	            new Vertex(-0.544895, -0.831470, 0.108387),
	            new Vertex(-0.375330, -0.923880, 0.074658),
	            new Vertex(-0.191342, -0.980785, 0.038061),
	            new Vertex(-0.195090, 0.980785, 0.000000),
	            new Vertex(-0.382683, 0.923880, 0.000000),
	            new Vertex(-0.555570, 0.831470, 0.000000),
	            new Vertex(-0.707107, 0.707107, 0.000000),
	            new Vertex(-0.831469, 0.555570, 0.000000),
	            new Vertex(-0.923879, 0.382683, 0.000000),
	            new Vertex(-0.980785, 0.195090, 0.000000),
	            new Vertex(-1.000000, 0.000000, 0.000000),
	            new Vertex(-0.980785, -0.195090, 0.000000),
	            new Vertex(-0.923879, -0.382683, 0.000000),
	            new Vertex(-0.831469, -0.555570, 0.000000),
	            new Vertex(-0.707107, -0.707107, 0.000000),
	            new Vertex(-0.555570, -0.831470, 0.000000),
	            new Vertex(-0.382683, -0.923880, 0.000000),
	            new Vertex(-0.195090, -0.980785, 0.000000),
	            new Vertex(-0.191342, 0.980785, -0.038060),
	            new Vertex(-0.375330, 0.923880, -0.074658),
	            new Vertex(-0.544895, 0.831470, -0.108386),
	            new Vertex(-0.693520, 0.707107, -0.137949),
	            new Vertex(-0.815493, 0.555570, -0.162211),
	            new Vertex(-0.906127, 0.382683, -0.180240),
	            new Vertex(-0.961939, 0.195090, -0.191342),
	            new Vertex(-0.980785, 0.000000, -0.195090),
	            new Vertex(-0.961939, -0.195090, -0.191342),
	            new Vertex(-0.906127, -0.382683, -0.180240),
	            new Vertex(-0.815493, -0.555570, -0.162211),
	            new Vertex(-0.693520, -0.707107, -0.137949),
	            new Vertex(-0.544895, -0.831470, -0.108386),
	            new Vertex(-0.375330, -0.923880, -0.074658),
	            new Vertex(-0.191342, -0.980785, -0.038060),
	            new Vertex(-0.180240, 0.980785, -0.074658),
	            new Vertex(-0.353553, 0.923880, -0.146446),
	            new Vertex(-0.513280, 0.831470, -0.212607),
	            new Vertex(-0.653281, 0.707107, -0.270598),
	            new Vertex(-0.768177, 0.555570, -0.318189),
	            new Vertex(-0.853553, 0.382683, -0.353553),
	            new Vertex(-0.906127, 0.195090, -0.375330),
	            new Vertex(-0.923879, 0.000000, -0.382683),
	            new Vertex(-0.906127, -0.195090, -0.375330),
	            new Vertex(-0.853553, -0.382683, -0.353553),
	            new Vertex(-0.768177, -0.555570, -0.318189),
	            new Vertex(-0.653281, -0.707107, -0.270598),
	            new Vertex(-0.513280, -0.831470, -0.212607),
	            new Vertex(-0.353553, -0.923880, -0.146446),
	            new Vertex(-0.180240, -0.980785, -0.074657),
	            new Vertex(-0.162212, 0.980785, -0.108386),
	            new Vertex(-0.318190, 0.923880, -0.212607),
	            new Vertex(-0.461940, 0.831470, -0.308658),
	            new Vertex(-0.587938, 0.707107, -0.392847),
	            new Vertex(-0.691341, 0.555570, -0.461939),
	            new Vertex(-0.768178, 0.382683, -0.513280),
	            new Vertex(-0.815493, 0.195090, -0.544895),
	            new Vertex(-0.831469, 0.000000, -0.555570),
	            new Vertex(-0.815493, -0.195090, -0.544895),
	            new Vertex(-0.768178, -0.382683, -0.513280),
	            new Vertex(-0.691341, -0.555570, -0.461939),
	            new Vertex(-0.587938, -0.707107, -0.392847),
	            new Vertex(-0.461940, -0.831470, -0.308658),
	            new Vertex(-0.318189, -0.923880, -0.212607),
	            new Vertex(-0.162212, -0.980785, -0.108386),
	            new Vertex(-0.137950, 0.980785, -0.137949),
	            new Vertex(-0.270598, 0.923880, -0.270598),
	            new Vertex(-0.392847, 0.831470, -0.392847),
	            new Vertex(-0.500000, 0.707107, -0.500000),
	            new Vertex(-0.587937, 0.555570, -0.587937),
	            new Vertex(-0.653281, 0.382683, -0.653281),
	            new Vertex(-0.693519, 0.195090, -0.693519),
	            new Vertex(-0.707106, 0.000000, -0.707106),
	            new Vertex(-0.693519, -0.195090, -0.693519),
	            new Vertex(-0.653281, -0.382683, -0.653281),
	            new Vertex(-0.587937, -0.555570, -0.587937),
	            new Vertex(-0.500000, -0.707107, -0.500000),
	            new Vertex(-0.392847, -0.831470, -0.392847),
	            new Vertex(-0.270598, -0.923880, -0.270598),
	            new Vertex(-0.137950, -0.980785, -0.137949),
	            new Vertex(-0.108386, 0.980785, -0.162211),
	            new Vertex(-0.212607, 0.923880, -0.318189),
	            new Vertex(-0.308658, 0.831470, -0.461939),
	            new Vertex(-0.392847, 0.707107, -0.587937),
	            new Vertex(-0.461939, 0.555570, -0.691341),
	            new Vertex(-0.513280, 0.382683, -0.768177),
	            new Vertex(-0.544895, 0.195090, -0.815492),
	            new Vertex(-0.555570, 0.000000, -0.831469),
	            new Vertex(-0.544895, -0.195090, -0.815492),
	            new Vertex(-0.513280, -0.382683, -0.768177),
	            new Vertex(-0.461939, -0.555570, -0.691341),
	            new Vertex(-0.392847, -0.707107, -0.587937),
	            new Vertex(-0.308658, -0.831470, -0.461939),
	            new Vertex(-0.212607, -0.923880, -0.318189),
	            new Vertex(-0.108386, -0.980785, -0.162211),
	            new Vertex(-0.074658, 0.980785, -0.180240),
	            new Vertex(-0.146447, 0.923880, -0.353553),
	            new Vertex(-0.212607, 0.831470, -0.513280),
	            new Vertex(-0.270598, 0.707107, -0.653281),
	            new Vertex(-0.318189, 0.555570, -0.768177),
	            new Vertex(-0.353553, 0.382683, -0.853553),
	            new Vertex(-0.375330, 0.195090, -0.906127),
	            new Vertex(-0.382683, 0.000000, -0.923879),
	            new Vertex(-0.375330, -0.195090, -0.906127),
	            new Vertex(-0.353553, -0.382683, -0.853553),
	            new Vertex(-0.318189, -0.555570, -0.768177),
	            new Vertex(-0.270598, -0.707107, -0.653281),
	            new Vertex(-0.212607, -0.831470, -0.513279),
	            new Vertex(-0.146446, -0.923880, -0.353553),
	            new Vertex(-0.074658, -0.980785, -0.180240),
	            new Vertex(-0.038060, 0.980785, -0.191342),
	            new Vertex(-0.074658, 0.923880, -0.375330),
	            new Vertex(-0.108386, 0.831470, -0.544895),
	            new Vertex(-0.137950, 0.707107, -0.693520),
	            new Vertex(-0.162211, 0.555570, -0.815492),
	            new Vertex(-0.180240, 0.382683, -0.906127),
	            new Vertex(-0.191341, 0.195090, -0.961939),
	            new Vertex(-0.195090, 0.000000, -0.980785),
	            new Vertex(-0.191341, -0.195090, -0.961939),
	            new Vertex(-0.180240, -0.382683, -0.906127),
	            new Vertex(-0.162211, -0.555570, -0.815492),
	            new Vertex(-0.137950, -0.707107, -0.693520),
	            new Vertex(-0.108386, -0.831470, -0.544895),
	            new Vertex(-0.074658, -0.923880, -0.375330),
	            new Vertex(-0.038060, -0.980785, -0.191341),
	            new Vertex(0.000000, -0.382683, -0.923879),
	            new Vertex(0.000000, -0.555570, -0.831469),
	            new Vertex(0.000000, -0.707107, -0.707106),
	            new Vertex(0.000000, -0.923880, -0.382683),
	            new Vertex(0.000000, -0.980785, -0.195090),
	        ];
	
	        mesh.faces = [
	            [4, 15, 5],
	            [9, 23, 480],
	            [5, 16, 6],
	            [480, 24, 481],
	            [6, 17, 7],
	            [0, 296, 10],
	            [205, 481, 24],
	            [7, 18, 8],
	            [0, 11, 1],
	            [8, 19, 477],
	            [2, 11, 12],
	            [477, 20, 478],
	            [2, 13, 3],
	            [478, 21, 479],
	            [3, 14, 4],
	            [479, 22, 9],
	            [21, 35, 36],
	            [13, 29, 14],
	            [21, 37, 22],
	            [14, 30, 15],
	            [22, 38, 23],
	            [15, 31, 16],
	            [23, 39, 24],
	            [16, 32, 17],
	            [10, 296, 25],
	            [205, 24, 39],
	            [18, 32, 33],
	            [10, 26, 11],
	            [19, 33, 34],
	            [11, 27, 12],
	            [19, 35, 20],
	            [12, 28, 13],
	            [205, 39, 54],
	            [32, 48, 33],
	            [25, 41, 26],
	            [33, 49, 34],
	            [26, 42, 27],
	            [35, 49, 50],
	            [27, 43, 28],
	            [36, 50, 51],
	            [28, 44, 29],
	            [36, 52, 37],
	            [29, 45, 30],
	            [37, 53, 38],
	            [31, 45, 46],
	            [38, 54, 39],
	            [31, 47, 32],
	            [25, 296, 40],
	            [51, 67, 52],
	            [44, 60, 45],
	            [52, 68, 53],
	            [45, 61, 46],
	            [53, 69, 54],
	            [47, 61, 62],
	            [40, 296, 55],
	            [205, 54, 69],
	            [47, 63, 48],
	            [40, 56, 41],
	            [48, 64, 49],
	            [41, 57, 42],
	            [50, 64, 65],
	            [42, 58, 43],
	            [50, 66, 51],
	            [43, 59, 44],
	            [55, 71, 56],
	            [63, 79, 64],
	            [56, 72, 57],
	            [65, 79, 80],
	            [57, 73, 58],
	            [65, 81, 66],
	            [59, 73, 74],
	            [67, 81, 82],
	            [59, 75, 60],
	            [68, 82, 83],
	            [60, 76, 61],
	            [68, 84, 69],
	            [62, 76, 77],
	            [55, 296, 70],
	            [205, 69, 84],
	            [62, 78, 63],
	            [74, 90, 75],
	            [83, 97, 98],
	            [76, 90, 91],
	            [83, 99, 84],
	            [76, 92, 77],
	            [70, 296, 85],
	            [205, 84, 99],
	            [77, 93, 78],
	            [70, 86, 71],
	            [78, 94, 79],
	            [71, 87, 72],
	            [80, 94, 95],
	            [72, 88, 73],
	            [81, 95, 96],
	            [74, 88, 89],
	            [81, 97, 82],
	            [93, 109, 94],
	            [86, 102, 87],
	            [95, 109, 110],
	            [88, 102, 103],
	            [96, 110, 111],
	            [88, 104, 89],
	            [96, 112, 97],
	            [89, 105, 90],
	            [97, 113, 98],
	            [91, 105, 106],
	            [99, 113, 114],
	            [91, 107, 92],
	            [85, 296, 100],
	            [205, 99, 114],
	            [92, 108, 93],
	            [85, 101, 86],
	            [113, 127, 128],
	            [106, 120, 121],
	            [114, 128, 129],
	            [106, 122, 107],
	            [100, 296, 115],
	            [205, 114, 129],
	            [108, 122, 123],
	            [100, 116, 101],
	            [108, 124, 109],
	            [101, 117, 102],
	            [110, 124, 125],
	            [102, 118, 103],
	            [110, 126, 111],
	            [103, 119, 104],
	            [112, 126, 127],
	            [104, 120, 105],
	            [116, 132, 117],
	            [125, 139, 140],
	            [117, 133, 118],
	            [125, 141, 126],
	            [119, 133, 134],
	            [127, 141, 142],
	            [119, 135, 120],
	            [127, 143, 128],
	            [121, 135, 136],
	            [129, 143, 144],
	            [121, 137, 122],
	            [115, 296, 130],
	            [205, 129, 144],
	            [122, 138, 123],
	            [116, 130, 131],
	            [123, 139, 124],
	            [136, 150, 151],
	            [143, 159, 144],
	            [136, 152, 137],
	            [130, 296, 145],
	            [205, 144, 159],
	            [137, 153, 138],
	            [130, 146, 131],
	            [138, 154, 139],
	            [132, 146, 147],
	            [140, 154, 155],
	            [132, 148, 133],
	            [140, 156, 141],
	            [133, 149, 134],
	            [141, 157, 142],
	            [134, 150, 135],
	            [143, 157, 158],
	            [155, 169, 170],
	            [147, 163, 148],
	            [155, 171, 156],
	            [149, 163, 164],
	            [157, 171, 172],
	            [149, 165, 150],
	            [157, 173, 158],
	            [151, 165, 166],
	            [158, 174, 159],
	            [151, 167, 152],
	            [145, 296, 160],
	            [205, 159, 174],
	            [153, 167, 168],
	            [145, 161, 146],
	            [153, 169, 154],
	            [146, 162, 147],
	            [174, 188, 189],
	            [166, 182, 167],
	            [160, 296, 175],
	            [205, 174, 189],
	            [167, 183, 168],
	            [160, 176, 161],
	            [168, 184, 169],
	            [161, 177, 162],
	            [169, 185, 170],
	            [162, 178, 163],
	            [170, 186, 171],
	            [163, 179, 164],
	            [172, 186, 187],
	            [164, 180, 165],
	            [172, 188, 173],
	            [166, 180, 181],
	            [185, 201, 186],
	            [179, 193, 194],
	            [187, 201, 202],
	            [179, 195, 180],
	            [187, 203, 188],
	            [181, 195, 196],
	            [189, 203, 204],
	            [181, 197, 182],
	            [175, 296, 190],
	            [205, 189, 204],
	            [183, 197, 198],
	            [175, 191, 176],
	            [183, 199, 184],
	            [176, 192, 177],
	            [185, 199, 200],
	            [178, 192, 193],
	            [190, 296, 206],
	            [205, 204, 220],
	            [197, 214, 198],
	            [190, 207, 191],
	            [198, 215, 199],
	            [192, 207, 208],
	            [200, 215, 216],
	            [192, 209, 193],
	            [200, 217, 201],
	            [193, 210, 194],
	            [202, 217, 218],
	            [194, 211, 195],
	            [202, 219, 203],
	            [196, 211, 212],
	            [203, 220, 204],
	            [196, 213, 197],
	            [209, 225, 210],
	            [217, 233, 218],
	            [210, 226, 211],
	            [218, 234, 219],
	            [212, 226, 227],
	            [220, 234, 235],
	            [212, 228, 213],
	            [206, 296, 221],
	            [205, 220, 235],
	            [213, 229, 214],
	            [206, 222, 207],
	            [214, 230, 215],
	            [207, 223, 208],
	            [216, 230, 231],
	            [208, 224, 209],
	            [216, 232, 217],
	            [228, 244, 229],
	            [221, 237, 222],
	            [229, 245, 230],
	            [223, 237, 238],
	            [231, 245, 246],
	            [224, 238, 239],
	            [231, 247, 232],
	            [224, 240, 225],
	            [233, 247, 248],
	            [225, 241, 226],
	            [233, 249, 234],
	            [227, 241, 242],
	            [235, 249, 250],
	            [227, 243, 228],
	            [221, 296, 236],
	            [205, 235, 250],
	            [247, 263, 248],
	            [240, 256, 241],
	            [248, 264, 249],
	            [242, 256, 257],
	            [249, 265, 250],
	            [242, 258, 243],
	            [236, 296, 251],
	            [205, 250, 265],
	            [243, 259, 244],
	            [236, 252, 237],
	            [244, 260, 245],
	            [237, 253, 238],
	            [246, 260, 261],
	            [239, 253, 254],
	            [246, 262, 247],
	            [240, 254, 255],
	            [251, 267, 252],
	            [259, 275, 260],
	            [252, 268, 253],
	            [261, 275, 276],
	            [254, 268, 269],
	            [261, 277, 262],
	            [255, 269, 270],
	            [262, 278, 263],
	            [255, 271, 256],
	            [264, 278, 279],
	            [257, 271, 272],
	            [265, 279, 280],
	            [257, 273, 258],
	            [251, 296, 266],
	            [205, 265, 280],
	            [259, 273, 274],
	            [270, 286, 271],
	            [278, 294, 279],
	            [272, 286, 287],
	            [280, 294, 295],
	            [272, 288, 273],
	            [266, 296, 281],
	            [205, 280, 295],
	            [273, 289, 274],
	            [266, 282, 267],
	            [274, 290, 275],
	            [267, 283, 268],
	            [276, 290, 291],
	            [268, 284, 269],
	            [276, 292, 277],
	            [270, 284, 285],
	            [278, 292, 293],
	            [289, 306, 290],
	            [282, 299, 283],
	            [291, 306, 307],
	            [284, 299, 300],
	            [291, 308, 292],
	            [285, 300, 301],
	            [292, 309, 293],
	            [285, 302, 286],
	            [293, 310, 294],
	            [287, 302, 303],
	            [294, 311, 295],
	            [288, 303, 304],
	            [281, 296, 297],
	            [205, 295, 311],
	            [288, 305, 289],
	            [281, 298, 282],
	            [310, 324, 325],
	            [303, 317, 318],
	            [310, 326, 311],
	            [303, 319, 304],
	            [297, 296, 312],
	            [205, 311, 326],
	            [304, 320, 305],
	            [297, 313, 298],
	            [305, 321, 306],
	            [298, 314, 299],
	            [307, 321, 322],
	            [300, 314, 315],
	            [307, 323, 308],
	            [301, 315, 316],
	            [308, 324, 309],
	            [301, 317, 302],
	            [322, 336, 337],
	            [315, 329, 330],
	            [323, 337, 338],
	            [316, 330, 331],
	            [323, 339, 324],
	            [316, 332, 317],
	            [325, 339, 340],
	            [318, 332, 333],
	            [326, 340, 341],
	            [318, 334, 319],
	            [312, 296, 327],
	            [205, 326, 341],
	            [319, 335, 320],
	            [312, 328, 313],
	            [320, 336, 321],
	            [313, 329, 314],
	            [340, 356, 341],
	            [333, 349, 334],
	            [327, 296, 342],
	            [205, 341, 356],
	            [334, 350, 335],
	            [328, 342, 343],
	            [335, 351, 336],
	            [328, 344, 329],
	            [337, 351, 352],
	            [330, 344, 345],
	            [337, 353, 338],
	            [331, 345, 346],
	            [338, 354, 339],
	            [331, 347, 332],
	            [340, 354, 355],
	            [333, 347, 348],
	            [345, 359, 360],
	            [352, 368, 353],
	            [345, 361, 346],
	            [354, 368, 369],
	            [346, 362, 347],
	            [355, 369, 370],
	            [348, 362, 363],
	            [355, 371, 356],
	            [348, 364, 349],
	            [342, 296, 357],
	            [205, 356, 371],
	            [350, 364, 365],
	            [343, 357, 358],
	            [350, 366, 351],
	            [343, 359, 344],
	            [352, 366, 367],
	            [363, 379, 364],
	            [357, 296, 372],
	            [205, 371, 386],
	            [365, 379, 380],
	            [358, 372, 373],
	            [365, 381, 366],
	            [358, 374, 359],
	            [367, 381, 382],
	            [360, 374, 375],
	            [367, 383, 368],
	            [361, 375, 376],
	            [368, 384, 369],
	            [361, 377, 362],
	            [370, 384, 385],
	            [363, 377, 378],
	            [370, 386, 371],
	            [382, 398, 383],
	            [375, 391, 376],
	            [383, 399, 384],
	            [376, 392, 377],
	            [385, 399, 400],
	            [378, 392, 393],
	            [385, 401, 386],
	            [378, 394, 379],
	            [372, 296, 387],
	            [205, 386, 401],
	            [379, 395, 380],
	            [372, 388, 373],
	            [380, 396, 381],
	            [373, 389, 374],
	            [382, 396, 397],
	            [375, 389, 390],
	            [387, 296, 402],
	            [205, 401, 416],
	            [395, 409, 410],
	            [387, 403, 388],
	            [395, 411, 396],
	            [389, 403, 404],
	            [397, 411, 412],
	            [390, 404, 405],
	            [397, 413, 398],
	            [391, 405, 406],
	            [398, 414, 399],
	            [391, 407, 392],
	            [400, 414, 415],
	            [393, 407, 408],
	            [400, 416, 401],
	            [393, 409, 394],
	            [406, 420, 421],
	            [413, 429, 414],
	            [406, 422, 407],
	            [414, 430, 415],
	            [408, 422, 423],
	            [415, 431, 416],
	            [408, 424, 409],
	            [402, 296, 417],
	            [205, 416, 431],
	            [410, 424, 425],
	            [402, 418, 403],
	            [410, 426, 411],
	            [403, 419, 404],
	            [412, 426, 427],
	            [404, 420, 405],
	            [412, 428, 413],
	            [424, 440, 425],
	            [417, 433, 418],
	            [425, 441, 426],
	            [418, 434, 419],
	            [427, 441, 442],
	            [419, 435, 420],
	            [427, 443, 428],
	            [421, 435, 436],
	            [429, 443, 444],
	            [421, 437, 422],
	            [429, 445, 430],
	            [423, 437, 438],
	            [430, 446, 431],
	            [424, 438, 439],
	            [417, 296, 432],
	            [205, 431, 446],
	            [443, 459, 444],
	            [436, 452, 437],
	            [444, 460, 445],
	            [438, 452, 453],
	            [445, 461, 446],
	            [438, 454, 439],
	            [432, 296, 447],
	            [205, 446, 461],
	            [439, 455, 440],
	            [433, 447, 448],
	            [440, 456, 441],
	            [434, 448, 449],
	            [442, 456, 457],
	            [435, 449, 450],
	            [442, 458, 443],
	            [436, 450, 451],
	            [455, 471, 456],
	            [448, 464, 449],
	            [457, 471, 472],
	            [449, 465, 450],
	            [457, 473, 458],
	            [451, 465, 466],
	            [458, 474, 459],
	            [451, 467, 452],
	            [459, 475, 460],
	            [453, 467, 468],
	            [461, 475, 476],
	            [453, 469, 454],
	            [447, 296, 462],
	            [205, 461, 476],
	            [454, 470, 455],
	            [447, 463, 448],
	            [474, 480, 475],
	            [468, 5, 6],
	            [475, 481, 476],
	            [469, 6, 7],
	            [462, 296, 0],
	            [205, 476, 481],
	            [469, 8, 470],
	            [463, 0, 1],
	            [470, 477, 471],
	            [464, 1, 2],
	            [472, 477, 478],
	            [465, 2, 3],
	            [472, 479, 473],
	            [466, 3, 4],
	            [473, 9, 474],
	            [467, 4, 5],
	            [4, 14, 15],
	            [9, 22, 23],
	            [5, 15, 16],
	            [480, 23, 24],
	            [6, 16, 17],
	            [7, 17, 18],
	            [0, 10, 11],
	            [8, 18, 19],
	            [2, 1, 11],
	            [477, 19, 20],
	            [2, 12, 13],
	            [478, 20, 21],
	            [3, 13, 14],
	            [479, 21, 22],
	            [21, 20, 35],
	            [13, 28, 29],
	            [21, 36, 37],
	            [14, 29, 30],
	            [22, 37, 38],
	            [15, 30, 31],
	            [23, 38, 39],
	            [16, 31, 32],
	            [18, 17, 32],
	            [10, 25, 26],
	            [19, 18, 33],
	            [11, 26, 27],
	            [19, 34, 35],
	            [12, 27, 28],
	            [32, 47, 48],
	            [25, 40, 41],
	            [33, 48, 49],
	            [26, 41, 42],
	            [35, 34, 49],
	            [27, 42, 43],
	            [36, 35, 50],
	            [28, 43, 44],
	            [36, 51, 52],
	            [29, 44, 45],
	            [37, 52, 53],
	            [31, 30, 45],
	            [38, 53, 54],
	            [31, 46, 47],
	            [51, 66, 67],
	            [44, 59, 60],
	            [52, 67, 68],
	            [45, 60, 61],
	            [53, 68, 69],
	            [47, 46, 61],
	            [47, 62, 63],
	            [40, 55, 56],
	            [48, 63, 64],
	            [41, 56, 57],
	            [50, 49, 64],
	            [42, 57, 58],
	            [50, 65, 66],
	            [43, 58, 59],
	            [55, 70, 71],
	            [63, 78, 79],
	            [56, 71, 72],
	            [65, 64, 79],
	            [57, 72, 73],
	            [65, 80, 81],
	            [59, 58, 73],
	            [67, 66, 81],
	            [59, 74, 75],
	            [68, 67, 82],
	            [60, 75, 76],
	            [68, 83, 84],
	            [62, 61, 76],
	            [62, 77, 78],
	            [74, 89, 90],
	            [83, 82, 97],
	            [76, 75, 90],
	            [83, 98, 99],
	            [76, 91, 92],
	            [77, 92, 93],
	            [70, 85, 86],
	            [78, 93, 94],
	            [71, 86, 87],
	            [80, 79, 94],
	            [72, 87, 88],
	            [81, 80, 95],
	            [74, 73, 88],
	            [81, 96, 97],
	            [93, 108, 109],
	            [86, 101, 102],
	            [95, 94, 109],
	            [88, 87, 102],
	            [96, 95, 110],
	            [88, 103, 104],
	            [96, 111, 112],
	            [89, 104, 105],
	            [97, 112, 113],
	            [91, 90, 105],
	            [99, 98, 113],
	            [91, 106, 107],
	            [92, 107, 108],
	            [85, 100, 101],
	            [113, 112, 127],
	            [106, 105, 120],
	            [114, 113, 128],
	            [106, 121, 122],
	            [108, 107, 122],
	            [100, 115, 116],
	            [108, 123, 124],
	            [101, 116, 117],
	            [110, 109, 124],
	            [102, 117, 118],
	            [110, 125, 126],
	            [103, 118, 119],
	            [112, 111, 126],
	            [104, 119, 120],
	            [116, 131, 132],
	            [125, 124, 139],
	            [117, 132, 133],
	            [125, 140, 141],
	            [119, 118, 133],
	            [127, 126, 141],
	            [119, 134, 135],
	            [127, 142, 143],
	            [121, 120, 135],
	            [129, 128, 143],
	            [121, 136, 137],
	            [122, 137, 138],
	            [116, 115, 130],
	            [123, 138, 139],
	            [136, 135, 150],
	            [143, 158, 159],
	            [136, 151, 152],
	            [137, 152, 153],
	            [130, 145, 146],
	            [138, 153, 154],
	            [132, 131, 146],
	            [140, 139, 154],
	            [132, 147, 148],
	            [140, 155, 156],
	            [133, 148, 149],
	            [141, 156, 157],
	            [134, 149, 150],
	            [143, 142, 157],
	            [155, 154, 169],
	            [147, 162, 163],
	            [155, 170, 171],
	            [149, 148, 163],
	            [157, 156, 171],
	            [149, 164, 165],
	            [157, 172, 173],
	            [151, 150, 165],
	            [158, 173, 174],
	            [151, 166, 167],
	            [153, 152, 167],
	            [145, 160, 161],
	            [153, 168, 169],
	            [146, 161, 162],
	            [174, 173, 188],
	            [166, 181, 182],
	            [167, 182, 183],
	            [160, 175, 176],
	            [168, 183, 184],
	            [161, 176, 177],
	            [169, 184, 185],
	            [162, 177, 178],
	            [170, 185, 186],
	            [163, 178, 179],
	            [172, 171, 186],
	            [164, 179, 180],
	            [172, 187, 188],
	            [166, 165, 180],
	            [185, 200, 201],
	            [179, 178, 193],
	            [187, 186, 201],
	            [179, 194, 195],
	            [187, 202, 203],
	            [181, 180, 195],
	            [189, 188, 203],
	            [181, 196, 197],
	            [183, 182, 197],
	            [175, 190, 191],
	            [183, 198, 199],
	            [176, 191, 192],
	            [185, 184, 199],
	            [178, 177, 192],
	            [197, 213, 214],
	            [190, 206, 207],
	            [198, 214, 215],
	            [192, 191, 207],
	            [200, 199, 215],
	            [192, 208, 209],
	            [200, 216, 217],
	            [193, 209, 210],
	            [202, 201, 217],
	            [194, 210, 211],
	            [202, 218, 219],
	            [196, 195, 211],
	            [203, 219, 220],
	            [196, 212, 213],
	            [209, 224, 225],
	            [217, 232, 233],
	            [210, 225, 226],
	            [218, 233, 234],
	            [212, 211, 226],
	            [220, 219, 234],
	            [212, 227, 228],
	            [213, 228, 229],
	            [206, 221, 222],
	            [214, 229, 230],
	            [207, 222, 223],
	            [216, 215, 230],
	            [208, 223, 224],
	            [216, 231, 232],
	            [228, 243, 244],
	            [221, 236, 237],
	            [229, 244, 245],
	            [223, 222, 237],
	            [231, 230, 245],
	            [224, 223, 238],
	            [231, 246, 247],
	            [224, 239, 240],
	            [233, 232, 247],
	            [225, 240, 241],
	            [233, 248, 249],
	            [227, 226, 241],
	            [235, 234, 249],
	            [227, 242, 243],
	            [247, 262, 263],
	            [240, 255, 256],
	            [248, 263, 264],
	            [242, 241, 256],
	            [249, 264, 265],
	            [242, 257, 258],
	            [243, 258, 259],
	            [236, 251, 252],
	            [244, 259, 260],
	            [237, 252, 253],
	            [246, 245, 260],
	            [239, 238, 253],
	            [246, 261, 262],
	            [240, 239, 254],
	            [251, 266, 267],
	            [259, 274, 275],
	            [252, 267, 268],
	            [261, 260, 275],
	            [254, 253, 268],
	            [261, 276, 277],
	            [255, 254, 269],
	            [262, 277, 278],
	            [255, 270, 271],
	            [264, 263, 278],
	            [257, 256, 271],
	            [265, 264, 279],
	            [257, 272, 273],
	            [259, 258, 273],
	            [270, 285, 286],
	            [278, 293, 294],
	            [272, 271, 286],
	            [280, 279, 294],
	            [272, 287, 288],
	            [273, 288, 289],
	            [266, 281, 282],
	            [274, 289, 290],
	            [267, 282, 283],
	            [276, 275, 290],
	            [268, 283, 284],
	            [276, 291, 292],
	            [270, 269, 284],
	            [278, 277, 292],
	            [289, 305, 306],
	            [282, 298, 299],
	            [291, 290, 306],
	            [284, 283, 299],
	            [291, 307, 308],
	            [285, 284, 300],
	            [292, 308, 309],
	            [285, 301, 302],
	            [293, 309, 310],
	            [287, 286, 302],
	            [294, 310, 311],
	            [288, 287, 303],
	            [288, 304, 305],
	            [281, 297, 298],
	            [310, 309, 324],
	            [303, 302, 317],
	            [310, 325, 326],
	            [303, 318, 319],
	            [304, 319, 320],
	            [297, 312, 313],
	            [305, 320, 321],
	            [298, 313, 314],
	            [307, 306, 321],
	            [300, 299, 314],
	            [307, 322, 323],
	            [301, 300, 315],
	            [308, 323, 324],
	            [301, 316, 317],
	            [322, 321, 336],
	            [315, 314, 329],
	            [323, 322, 337],
	            [316, 315, 330],
	            [323, 338, 339],
	            [316, 331, 332],
	            [325, 324, 339],
	            [318, 317, 332],
	            [326, 325, 340],
	            [318, 333, 334],
	            [319, 334, 335],
	            [312, 327, 328],
	            [320, 335, 336],
	            [313, 328, 329],
	            [340, 355, 356],
	            [333, 348, 349],
	            [334, 349, 350],
	            [328, 327, 342],
	            [335, 350, 351],
	            [328, 343, 344],
	            [337, 336, 351],
	            [330, 329, 344],
	            [337, 352, 353],
	            [331, 330, 345],
	            [338, 353, 354],
	            [331, 346, 347],
	            [340, 339, 354],
	            [333, 332, 347],
	            [345, 344, 359],
	            [352, 367, 368],
	            [345, 360, 361],
	            [354, 353, 368],
	            [346, 361, 362],
	            [355, 354, 369],
	            [348, 347, 362],
	            [355, 370, 371],
	            [348, 363, 364],
	            [350, 349, 364],
	            [343, 342, 357],
	            [350, 365, 366],
	            [343, 358, 359],
	            [352, 351, 366],
	            [363, 378, 379],
	            [365, 364, 379],
	            [358, 357, 372],
	            [365, 380, 381],
	            [358, 373, 374],
	            [367, 366, 381],
	            [360, 359, 374],
	            [367, 382, 383],
	            [361, 360, 375],
	            [368, 383, 384],
	            [361, 376, 377],
	            [370, 369, 384],
	            [363, 362, 377],
	            [370, 385, 386],
	            [382, 397, 398],
	            [375, 390, 391],
	            [383, 398, 399],
	            [376, 391, 392],
	            [385, 384, 399],
	            [378, 377, 392],
	            [385, 400, 401],
	            [378, 393, 394],
	            [379, 394, 395],
	            [372, 387, 388],
	            [380, 395, 396],
	            [373, 388, 389],
	            [382, 381, 396],
	            [375, 374, 389],
	            [395, 394, 409],
	            [387, 402, 403],
	            [395, 410, 411],
	            [389, 388, 403],
	            [397, 396, 411],
	            [390, 389, 404],
	            [397, 412, 413],
	            [391, 390, 405],
	            [398, 413, 414],
	            [391, 406, 407],
	            [400, 399, 414],
	            [393, 392, 407],
	            [400, 415, 416],
	            [393, 408, 409],
	            [406, 405, 420],
	            [413, 428, 429],
	            [406, 421, 422],
	            [414, 429, 430],
	            [408, 407, 422],
	            [415, 430, 431],
	            [408, 423, 424],
	            [410, 409, 424],
	            [402, 417, 418],
	            [410, 425, 426],
	            [403, 418, 419],
	            [412, 411, 426],
	            [404, 419, 420],
	            [412, 427, 428],
	            [424, 439, 440],
	            [417, 432, 433],
	            [425, 440, 441],
	            [418, 433, 434],
	            [427, 426, 441],
	            [419, 434, 435],
	            [427, 442, 443],
	            [421, 420, 435],
	            [429, 428, 443],
	            [421, 436, 437],
	            [429, 444, 445],
	            [423, 422, 437],
	            [430, 445, 446],
	            [424, 423, 438],
	            [443, 458, 459],
	            [436, 451, 452],
	            [444, 459, 460],
	            [438, 437, 452],
	            [445, 460, 461],
	            [438, 453, 454],
	            [439, 454, 455],
	            [433, 432, 447],
	            [440, 455, 456],
	            [434, 433, 448],
	            [442, 441, 456],
	            [435, 434, 449],
	            [442, 457, 458],
	            [436, 435, 450],
	            [455, 470, 471],
	            [448, 463, 464],
	            [457, 456, 471],
	            [449, 464, 465],
	            [457, 472, 473],
	            [451, 450, 465],
	            [458, 473, 474],
	            [451, 466, 467],
	            [459, 474, 475],
	            [453, 452, 467],
	            [461, 460, 475],
	            [453, 468, 469],
	            [454, 469, 470],
	            [447, 462, 463],
	            [474, 9, 480],
	            [468, 467, 5],
	            [475, 480, 481],
	            [469, 468, 6],
	            [469, 7, 8],
	            [463, 462, 0],
	            [470, 8, 477],
	            [464, 463, 1],
	            [472, 471, 477],
	            [465, 464, 2],
	            [472, 478, 479],
	            [466, 465, 3],
	            [473, 479, 9],
	            [467, 466, 4],
	        ]
	    }
	}
	
	module.exports = Sphere;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	const Mesh = __webpack_require__(11);
	const { Vertex } = __webpack_require__(2);
	const GameObject = __webpack_require__(14);
	
	class Suzanne extends GameObject {
	    constructor() {
	        super()
	        /**@type {Mesh} */
	        let mesh = this.addComponent(Mesh);
	
	        mesh.verteces = [
	            new Vertex(0.437500, 0.164062, 0.765625),
	            new Vertex(-0.437500, 0.164062, 0.765625),
	            new Vertex(0.500000, 0.093750, 0.687500),
	            new Vertex(-0.500000, 0.093750, 0.687500),
	            new Vertex(0.546875, 0.054688, 0.578125),
	            new Vertex(-0.546875, 0.054688, 0.578125),
	            new Vertex(0.351562, -0.023438, 0.617188),
	            new Vertex(-0.351562, -0.023438, 0.617188),
	            new Vertex(0.351562, 0.031250, 0.718750),
	            new Vertex(-0.351562, 0.031250, 0.718750),
	            new Vertex(0.351562, 0.132812, 0.781250),
	            new Vertex(-0.351562, 0.132812, 0.781250),
	            new Vertex(0.273438, 0.164062, 0.796875),
	            new Vertex(-0.273438, 0.164062, 0.796875),
	            new Vertex(0.203125, 0.093750, 0.742188),
	            new Vertex(-0.203125, 0.093750, 0.742188),
	            new Vertex(0.156250, 0.054688, 0.648438),
	            new Vertex(-0.156250, 0.054688, 0.648438),
	            new Vertex(0.078125, 0.242188, 0.656250),
	            new Vertex(-0.078125, 0.242188, 0.656250),
	            new Vertex(0.140625, 0.242188, 0.742188),
	            new Vertex(-0.140625, 0.242188, 0.742188),
	            new Vertex(0.242188, 0.242188, 0.796875),
	            new Vertex(-0.242188, 0.242188, 0.796875),
	            new Vertex(0.273438, 0.328125, 0.796875),
	            new Vertex(-0.273438, 0.328125, 0.796875),
	            new Vertex(0.203125, 0.390625, 0.742188),
	            new Vertex(-0.203125, 0.390625, 0.742188),
	            new Vertex(0.156250, 0.437500, 0.648438),
	            new Vertex(-0.156250, 0.437500, 0.648438),
	            new Vertex(0.351562, 0.515625, 0.617188),
	            new Vertex(-0.351562, 0.515625, 0.617188),
	            new Vertex(0.351562, 0.453125, 0.718750),
	            new Vertex(-0.351562, 0.453125, 0.718750),
	            new Vertex(0.351562, 0.359375, 0.781250),
	            new Vertex(-0.351562, 0.359375, 0.781250),
	            new Vertex(0.437500, 0.328125, 0.765625),
	            new Vertex(-0.437500, 0.328125, 0.765625),
	            new Vertex(0.500000, 0.390625, 0.687500),
	            new Vertex(-0.500000, 0.390625, 0.687500),
	            new Vertex(0.546875, 0.437500, 0.578125),
	            new Vertex(-0.546875, 0.437500, 0.578125),
	            new Vertex(0.625000, 0.242188, 0.562500),
	            new Vertex(-0.625000, 0.242188, 0.562500),
	            new Vertex(0.562500, 0.242188, 0.671875),
	            new Vertex(-0.562500, 0.242188, 0.671875),
	            new Vertex(0.468750, 0.242188, 0.757812),
	            new Vertex(-0.468750, 0.242188, 0.757812),
	            new Vertex(0.476562, 0.242188, 0.773438),
	            new Vertex(-0.476562, 0.242188, 0.773438),
	            new Vertex(0.445312, 0.335938, 0.781250),
	            new Vertex(-0.445312, 0.335938, 0.781250),
	            new Vertex(0.351562, 0.375000, 0.804688),
	            new Vertex(-0.351562, 0.375000, 0.804688),
	            new Vertex(0.265625, 0.335938, 0.820312),
	            new Vertex(-0.265625, 0.335938, 0.820312),
	            new Vertex(0.226562, 0.242188, 0.820312),
	            new Vertex(-0.226562, 0.242188, 0.820312),
	            new Vertex(0.265625, 0.156250, 0.820312),
	            new Vertex(-0.265625, 0.156250, 0.820312),
	            new Vertex(0.351562, 0.242188, 0.828125),
	            new Vertex(-0.351562, 0.242188, 0.828125),
	            new Vertex(0.351562, 0.117188, 0.804688),
	            new Vertex(-0.351562, 0.117188, 0.804688),
	            new Vertex(0.445312, 0.156250, 0.781250),
	            new Vertex(-0.445312, 0.156250, 0.781250),
	            new Vertex(0.000000, 0.429688, 0.742188),
	            new Vertex(0.000000, 0.351562, 0.820312),
	            new Vertex(0.000000, -0.679688, 0.734375),
	            new Vertex(0.000000, -0.320312, 0.781250),
	            new Vertex(0.000000, -0.187500, 0.796875),
	            new Vertex(0.000000, -0.773438, 0.718750),
	            new Vertex(0.000000, 0.406250, 0.601562),
	            new Vertex(0.000000, 0.570312, 0.570312),
	            new Vertex(0.000000, 0.898438, -0.546875),
	            new Vertex(0.000000, 0.562500, -0.851562),
	            new Vertex(0.000000, 0.070312, -0.828125),
	            new Vertex(0.000000, -0.382812, -0.351562),
	            new Vertex(0.203125, -0.187500, 0.562500),
	            new Vertex(-0.203125, -0.187500, 0.562500),
	            new Vertex(0.312500, -0.437500, 0.570312),
	            new Vertex(-0.312500, -0.437500, 0.570312),
	            new Vertex(0.351562, -0.695312, 0.570312),
	            new Vertex(-0.351562, -0.695312, 0.570312),
	            new Vertex(0.367188, -0.890625, 0.531250),
	            new Vertex(-0.367188, -0.890625, 0.531250),
	            new Vertex(0.328125, -0.945312, 0.523438),
	            new Vertex(-0.328125, -0.945312, 0.523438),
	            new Vertex(0.179688, -0.968750, 0.554688),
	            new Vertex(-0.179688, -0.968750, 0.554688),
	            new Vertex(0.000000, -0.984375, 0.578125),
	            new Vertex(0.437500, -0.140625, 0.531250),
	            new Vertex(-0.437500, -0.140625, 0.531250),
	            new Vertex(0.632812, -0.039062, 0.539062),
	            new Vertex(-0.632812, -0.039062, 0.539062),
	            new Vertex(0.828125, 0.148438, 0.445312),
	            new Vertex(-0.828125, 0.148438, 0.445312),
	            new Vertex(0.859375, 0.429688, 0.593750),
	            new Vertex(-0.859375, 0.429688, 0.593750),
	            new Vertex(0.710938, 0.484375, 0.625000),
	            new Vertex(-0.710938, 0.484375, 0.625000),
	            new Vertex(0.492188, 0.601562, 0.687500),
	            new Vertex(-0.492188, 0.601562, 0.687500),
	            new Vertex(0.320312, 0.757812, 0.734375),
	            new Vertex(-0.320312, 0.757812, 0.734375),
	            new Vertex(0.156250, 0.718750, 0.757812),
	            new Vertex(-0.156250, 0.718750, 0.757812),
	            new Vertex(0.062500, 0.492188, 0.750000),
	            new Vertex(-0.062500, 0.492188, 0.750000),
	            new Vertex(0.164062, 0.414062, 0.773438),
	            new Vertex(-0.164062, 0.414062, 0.773438),
	            new Vertex(0.125000, 0.304688, 0.765625),
	            new Vertex(-0.125000, 0.304688, 0.765625),
	            new Vertex(0.203125, 0.093750, 0.742188),
	            new Vertex(-0.203125, 0.093750, 0.742188),
	            new Vertex(0.375000, 0.015625, 0.703125),
	            new Vertex(-0.375000, 0.015625, 0.703125),
	            new Vertex(0.492188, 0.062500, 0.671875),
	            new Vertex(-0.492188, 0.062500, 0.671875),
	            new Vertex(0.625000, 0.187500, 0.648438),
	            new Vertex(-0.625000, 0.187500, 0.648438),
	            new Vertex(0.640625, 0.296875, 0.648438),
	            new Vertex(-0.640625, 0.296875, 0.648438),
	            new Vertex(0.601562, 0.375000, 0.664062),
	            new Vertex(-0.601562, 0.375000, 0.664062),
	            new Vertex(0.429688, 0.437500, 0.718750),
	            new Vertex(-0.429688, 0.437500, 0.718750),
	            new Vertex(0.250000, 0.468750, 0.757812),
	            new Vertex(-0.250000, 0.468750, 0.757812),
	            new Vertex(0.000000, -0.765625, 0.734375),
	            new Vertex(0.109375, -0.718750, 0.734375),
	            new Vertex(-0.109375, -0.718750, 0.734375),
	            new Vertex(0.117188, -0.835938, 0.710938),
	            new Vertex(-0.117188, -0.835938, 0.710938),
	            new Vertex(0.062500, -0.882812, 0.695312),
	            new Vertex(-0.062500, -0.882812, 0.695312),
	            new Vertex(0.000000, -0.890625, 0.687500),
	            new Vertex(0.000000, -0.195312, 0.750000),
	            new Vertex(0.000000, -0.140625, 0.742188),
	            new Vertex(0.101562, -0.148438, 0.742188),
	            new Vertex(-0.101562, -0.148438, 0.742188),
	            new Vertex(0.125000, -0.226562, 0.750000),
	            new Vertex(-0.125000, -0.226562, 0.750000),
	            new Vertex(0.085938, -0.289062, 0.742188),
	            new Vertex(-0.085938, -0.289062, 0.742188),
	            new Vertex(0.398438, -0.046875, 0.671875),
	            new Vertex(-0.398438, -0.046875, 0.671875),
	            new Vertex(0.617188, 0.054688, 0.625000),
	            new Vertex(-0.617188, 0.054688, 0.625000),
	            new Vertex(0.726562, 0.203125, 0.601562),
	            new Vertex(-0.726562, 0.203125, 0.601562),
	            new Vertex(0.742188, 0.375000, 0.656250),
	            new Vertex(-0.742188, 0.375000, 0.656250),
	            new Vertex(0.687500, 0.414062, 0.726562),
	            new Vertex(-0.687500, 0.414062, 0.726562),
	            new Vertex(0.437500, 0.546875, 0.796875),
	            new Vertex(-0.437500, 0.546875, 0.796875),
	            new Vertex(0.312500, 0.640625, 0.835938),
	            new Vertex(-0.312500, 0.640625, 0.835938),
	            new Vertex(0.203125, 0.617188, 0.851562),
	            new Vertex(-0.203125, 0.617188, 0.851562),
	            new Vertex(0.101562, 0.429688, 0.843750),
	            new Vertex(-0.101562, 0.429688, 0.843750),
	            new Vertex(0.125000, -0.101562, 0.812500),
	            new Vertex(-0.125000, -0.101562, 0.812500),
	            new Vertex(0.210938, -0.445312, 0.710938),
	            new Vertex(-0.210938, -0.445312, 0.710938),
	            new Vertex(0.250000, -0.703125, 0.687500),
	            new Vertex(-0.250000, -0.703125, 0.687500),
	            new Vertex(0.265625, -0.820312, 0.664062),
	            new Vertex(-0.265625, -0.820312, 0.664062),
	            new Vertex(0.234375, -0.914062, 0.632812),
	            new Vertex(-0.234375, -0.914062, 0.632812),
	            new Vertex(0.164062, -0.929688, 0.632812),
	            new Vertex(-0.164062, -0.929688, 0.632812),
	            new Vertex(0.000000, -0.945312, 0.640625),
	            new Vertex(0.000000, 0.046875, 0.726562),
	            new Vertex(0.000000, 0.210938, 0.765625),
	            new Vertex(0.328125, 0.476562, 0.742188),
	            new Vertex(-0.328125, 0.476562, 0.742188),
	            new Vertex(0.164062, 0.140625, 0.750000),
	            new Vertex(-0.164062, 0.140625, 0.750000),
	            new Vertex(0.132812, 0.210938, 0.757812),
	            new Vertex(-0.132812, 0.210938, 0.757812),
	            new Vertex(0.117188, -0.687500, 0.734375),
	            new Vertex(-0.117188, -0.687500, 0.734375),
	            new Vertex(0.078125, -0.445312, 0.750000),
	            new Vertex(-0.078125, -0.445312, 0.750000),
	            new Vertex(0.000000, -0.445312, 0.750000),
	            new Vertex(0.000000, -0.328125, 0.742188),
	            new Vertex(0.093750, -0.273438, 0.781250),
	            new Vertex(-0.093750, -0.273438, 0.781250),
	            new Vertex(0.132812, -0.226562, 0.796875),
	            new Vertex(-0.132812, -0.226562, 0.796875),
	            new Vertex(0.109375, -0.132812, 0.781250),
	            new Vertex(-0.109375, -0.132812, 0.781250),
	            new Vertex(0.039062, -0.125000, 0.781250),
	            new Vertex(-0.039062, -0.125000, 0.781250),
	            new Vertex(0.000000, -0.203125, 0.828125),
	            new Vertex(0.046875, -0.148438, 0.812500),
	            new Vertex(-0.046875, -0.148438, 0.812500),
	            new Vertex(0.093750, -0.156250, 0.812500),
	            new Vertex(-0.093750, -0.156250, 0.812500),
	            new Vertex(0.109375, -0.226562, 0.828125),
	            new Vertex(-0.109375, -0.226562, 0.828125),
	            new Vertex(0.078125, -0.250000, 0.804688),
	            new Vertex(-0.078125, -0.250000, 0.804688),
	            new Vertex(0.000000, -0.289062, 0.804688),
	            new Vertex(0.257812, -0.312500, 0.554688),
	            new Vertex(-0.257812, -0.312500, 0.554688),
	            new Vertex(0.164062, -0.242188, 0.710938),
	            new Vertex(-0.164062, -0.242188, 0.710938),
	            new Vertex(0.179688, -0.312500, 0.710938),
	            new Vertex(-0.179688, -0.312500, 0.710938),
	            new Vertex(0.234375, -0.250000, 0.554688),
	            new Vertex(-0.234375, -0.250000, 0.554688),
	            new Vertex(0.000000, -0.875000, 0.687500),
	            new Vertex(0.046875, -0.867188, 0.687500),
	            new Vertex(-0.046875, -0.867188, 0.687500),
	            new Vertex(0.093750, -0.820312, 0.710938),
	            new Vertex(-0.093750, -0.820312, 0.710938),
	            new Vertex(0.093750, -0.742188, 0.726562),
	            new Vertex(-0.093750, -0.742188, 0.726562),
	            new Vertex(0.000000, -0.781250, 0.656250),
	            new Vertex(0.093750, -0.750000, 0.664062),
	            new Vertex(-0.093750, -0.750000, 0.664062),
	            new Vertex(0.093750, -0.812500, 0.640625),
	            new Vertex(-0.093750, -0.812500, 0.640625),
	            new Vertex(0.046875, -0.851562, 0.632812),
	            new Vertex(-0.046875, -0.851562, 0.632812),
	            new Vertex(0.000000, -0.859375, 0.632812),
	            new Vertex(0.171875, 0.218750, 0.781250),
	            new Vertex(-0.171875, 0.218750, 0.781250),
	            new Vertex(0.187500, 0.156250, 0.773438),
	            new Vertex(-0.187500, 0.156250, 0.773438),
	            new Vertex(0.335938, 0.429688, 0.757812),
	            new Vertex(-0.335938, 0.429688, 0.757812),
	            new Vertex(0.273438, 0.421875, 0.773438),
	            new Vertex(-0.273438, 0.421875, 0.773438),
	            new Vertex(0.421875, 0.398438, 0.773438),
	            new Vertex(-0.421875, 0.398438, 0.773438),
	            new Vertex(0.562500, 0.351562, 0.695312),
	            new Vertex(-0.562500, 0.351562, 0.695312),
	            new Vertex(0.585938, 0.289062, 0.687500),
	            new Vertex(-0.585938, 0.289062, 0.687500),
	            new Vertex(0.578125, 0.195312, 0.679688),
	            new Vertex(-0.578125, 0.195312, 0.679688),
	            new Vertex(0.476562, 0.101562, 0.718750),
	            new Vertex(-0.476562, 0.101562, 0.718750),
	            new Vertex(0.375000, 0.062500, 0.742188),
	            new Vertex(-0.375000, 0.062500, 0.742188),
	            new Vertex(0.226562, 0.109375, 0.781250),
	            new Vertex(-0.226562, 0.109375, 0.781250),
	            new Vertex(0.179688, 0.296875, 0.781250),
	            new Vertex(-0.179688, 0.296875, 0.781250),
	            new Vertex(0.210938, 0.375000, 0.781250),
	            new Vertex(-0.210938, 0.375000, 0.781250),
	            new Vertex(0.234375, 0.359375, 0.757812),
	            new Vertex(-0.234375, 0.359375, 0.757812),
	            new Vertex(0.195312, 0.296875, 0.757812),
	            new Vertex(-0.195312, 0.296875, 0.757812),
	            new Vertex(0.242188, 0.125000, 0.757812),
	            new Vertex(-0.242188, 0.125000, 0.757812),
	            new Vertex(0.375000, 0.085938, 0.726562),
	            new Vertex(-0.375000, 0.085938, 0.726562),
	            new Vertex(0.460938, 0.117188, 0.703125),
	            new Vertex(-0.460938, 0.117188, 0.703125),
	            new Vertex(0.546875, 0.210938, 0.671875),
	            new Vertex(-0.546875, 0.210938, 0.671875),
	            new Vertex(0.554688, 0.281250, 0.671875),
	            new Vertex(-0.554688, 0.281250, 0.671875),
	            new Vertex(0.531250, 0.335938, 0.679688),
	            new Vertex(-0.531250, 0.335938, 0.679688),
	            new Vertex(0.414062, 0.390625, 0.750000),
	            new Vertex(-0.414062, 0.390625, 0.750000),
	            new Vertex(0.281250, 0.398438, 0.765625),
	            new Vertex(-0.281250, 0.398438, 0.765625),
	            new Vertex(0.335938, 0.406250, 0.750000),
	            new Vertex(-0.335938, 0.406250, 0.750000),
	            new Vertex(0.203125, 0.171875, 0.750000),
	            new Vertex(-0.203125, 0.171875, 0.750000),
	            new Vertex(0.195312, 0.226562, 0.750000),
	            new Vertex(-0.195312, 0.226562, 0.750000),
	            new Vertex(0.109375, 0.460938, 0.609375),
	            new Vertex(-0.109375, 0.460938, 0.609375),
	            new Vertex(0.195312, 0.664062, 0.617188),
	            new Vertex(-0.195312, 0.664062, 0.617188),
	            new Vertex(0.335938, 0.687500, 0.593750),
	            new Vertex(-0.335938, 0.687500, 0.593750),
	            new Vertex(0.484375, 0.554688, 0.554688),
	            new Vertex(-0.484375, 0.554688, 0.554688),
	            new Vertex(0.679688, 0.453125, 0.492188),
	            new Vertex(-0.679688, 0.453125, 0.492188),
	            new Vertex(0.796875, 0.406250, 0.460938),
	            new Vertex(-0.796875, 0.406250, 0.460938),
	            new Vertex(0.773438, 0.164062, 0.375000),
	            new Vertex(-0.773438, 0.164062, 0.375000),
	            new Vertex(0.601562, 0.000000, 0.414062),
	            new Vertex(-0.601562, 0.000000, 0.414062),
	            new Vertex(0.437500, -0.093750, 0.468750),
	            new Vertex(-0.437500, -0.093750, 0.468750),
	            new Vertex(0.000000, 0.898438, 0.289062),
	            new Vertex(0.000000, 0.984375, -0.078125),
	            new Vertex(0.000000, -0.195312, -0.671875),
	            new Vertex(0.000000, -0.460938, 0.187500),
	            new Vertex(0.000000, -0.976562, 0.460938),
	            new Vertex(0.000000, -0.804688, 0.343750),
	            new Vertex(0.000000, -0.570312, 0.320312),
	            new Vertex(0.000000, -0.484375, 0.281250),
	            new Vertex(0.851562, 0.234375, 0.054688),
	            new Vertex(-0.851562, 0.234375, 0.054688),
	            new Vertex(0.859375, 0.320312, -0.046875),
	            new Vertex(-0.859375, 0.320312, -0.046875),
	            new Vertex(0.773438, 0.265625, -0.437500),
	            new Vertex(-0.773438, 0.265625, -0.437500),
	            new Vertex(0.460938, 0.437500, -0.703125),
	            new Vertex(-0.460938, 0.437500, -0.703125),
	            new Vertex(0.734375, -0.046875, 0.070312),
	            new Vertex(-0.734375, -0.046875, 0.070312),
	            new Vertex(0.593750, -0.125000, -0.164062),
	            new Vertex(-0.593750, -0.125000, -0.164062),
	            new Vertex(0.640625, -0.007812, -0.429688),
	            new Vertex(-0.640625, -0.007812, -0.429688),
	            new Vertex(0.335938, 0.054688, -0.664062),
	            new Vertex(-0.335938, 0.054688, -0.664062),
	            new Vertex(0.234375, -0.351562, 0.406250),
	            new Vertex(-0.234375, -0.351562, 0.406250),
	            new Vertex(0.179688, -0.414062, 0.257812),
	            new Vertex(-0.179688, -0.414062, 0.257812),
	            new Vertex(0.289062, -0.710938, 0.382812),
	            new Vertex(-0.289062, -0.710938, 0.382812),
	            new Vertex(0.250000, -0.500000, 0.390625),
	            new Vertex(-0.250000, -0.500000, 0.390625),
	            new Vertex(0.328125, -0.914062, 0.398438),
	            new Vertex(-0.328125, -0.914062, 0.398438),
	            new Vertex(0.140625, -0.757812, 0.367188),
	            new Vertex(-0.140625, -0.757812, 0.367188),
	            new Vertex(0.125000, -0.539062, 0.359375),
	            new Vertex(-0.125000, -0.539062, 0.359375),
	            new Vertex(0.164062, -0.945312, 0.437500),
	            new Vertex(-0.164062, -0.945312, 0.437500),
	            new Vertex(0.218750, -0.281250, 0.429688),
	            new Vertex(-0.218750, -0.281250, 0.429688),
	            new Vertex(0.210938, -0.226562, 0.468750),
	            new Vertex(-0.210938, -0.226562, 0.468750),
	            new Vertex(0.203125, -0.171875, 0.500000),
	            new Vertex(-0.203125, -0.171875, 0.500000),
	            new Vertex(0.210938, -0.390625, 0.164062),
	            new Vertex(-0.210938, -0.390625, 0.164062),
	            new Vertex(0.296875, -0.312500, -0.265625),
	            new Vertex(-0.296875, -0.312500, -0.265625),
	            new Vertex(0.343750, -0.148438, -0.539062),
	            new Vertex(-0.343750, -0.148438, -0.539062),
	            new Vertex(0.453125, 0.867188, -0.382812),
	            new Vertex(-0.453125, 0.867188, -0.382812),
	            new Vertex(0.453125, 0.929688, -0.070312),
	            new Vertex(-0.453125, 0.929688, -0.070312),
	            new Vertex(0.453125, 0.851562, 0.234375),
	            new Vertex(-0.453125, 0.851562, 0.234375),
	            new Vertex(0.460938, 0.523438, 0.429688),
	            new Vertex(-0.460938, 0.523438, 0.429688),
	            new Vertex(0.726562, 0.406250, 0.335938),
	            new Vertex(-0.726562, 0.406250, 0.335938),
	            new Vertex(0.632812, 0.453125, 0.281250),
	            new Vertex(-0.632812, 0.453125, 0.281250),
	            new Vertex(0.640625, 0.703125, 0.054688),
	            new Vertex(-0.640625, 0.703125, 0.054688),
	            new Vertex(0.796875, 0.562500, 0.125000),
	            new Vertex(-0.796875, 0.562500, 0.125000),
	            new Vertex(0.796875, 0.617188, -0.117188),
	            new Vertex(-0.796875, 0.617188, -0.117188),
	            new Vertex(0.640625, 0.750000, -0.195312),
	            new Vertex(-0.640625, 0.750000, -0.195312),
	            new Vertex(0.640625, 0.679688, -0.445312),
	            new Vertex(-0.640625, 0.679688, -0.445312),
	            new Vertex(0.796875, 0.539062, -0.359375),
	            new Vertex(-0.796875, 0.539062, -0.359375),
	            new Vertex(0.617188, 0.328125, -0.585938),
	            new Vertex(-0.617188, 0.328125, -0.585938),
	            new Vertex(0.484375, 0.023438, -0.546875),
	            new Vertex(-0.484375, 0.023438, -0.546875),
	            new Vertex(0.820312, 0.328125, -0.203125),
	            new Vertex(-0.820312, 0.328125, -0.203125),
	            new Vertex(0.406250, -0.171875, 0.148438),
	            new Vertex(-0.406250, -0.171875, 0.148438),
	            new Vertex(0.429688, -0.195312, -0.210938),
	            new Vertex(-0.429688, -0.195312, -0.210938),
	            new Vertex(0.890625, 0.406250, -0.234375),
	            new Vertex(-0.890625, 0.406250, -0.234375),
	            new Vertex(0.773438, -0.140625, -0.125000),
	            new Vertex(-0.773438, -0.140625, -0.125000),
	            new Vertex(1.039062, -0.101562, -0.328125),
	            new Vertex(-1.039062, -0.101562, -0.328125),
	            new Vertex(1.281250, 0.054688, -0.429688),
	            new Vertex(-1.281250, 0.054688, -0.429688),
	            new Vertex(1.351562, 0.320312, -0.421875),
	            new Vertex(-1.351562, 0.320312, -0.421875),
	            new Vertex(1.234375, 0.507812, -0.421875),
	            new Vertex(-1.234375, 0.507812, -0.421875),
	            new Vertex(1.023438, 0.476562, -0.312500),
	            new Vertex(-1.023438, 0.476562, -0.312500),
	            new Vertex(1.015625, 0.414062, -0.289062),
	            new Vertex(-1.015625, 0.414062, -0.289062),
	            new Vertex(1.187500, 0.437500, -0.390625),
	            new Vertex(-1.187500, 0.437500, -0.390625),
	            new Vertex(1.265625, 0.289062, -0.406250),
	            new Vertex(-1.265625, 0.289062, -0.406250),
	            new Vertex(1.210938, 0.078125, -0.406250),
	            new Vertex(-1.210938, 0.078125, -0.406250),
	            new Vertex(1.031250, -0.039062, -0.304688),
	            new Vertex(-1.031250, -0.039062, -0.304688),
	            new Vertex(0.828125, -0.070312, -0.132812),
	            new Vertex(-0.828125, -0.070312, -0.132812),
	            new Vertex(0.921875, 0.359375, -0.218750),
	            new Vertex(-0.921875, 0.359375, -0.218750),
	            new Vertex(0.945312, 0.304688, -0.289062),
	            new Vertex(-0.945312, 0.304688, -0.289062),
	            new Vertex(0.882812, -0.023438, -0.210938),
	            new Vertex(-0.882812, -0.023438, -0.210938),
	            new Vertex(1.039062, 0.000000, -0.367188),
	            new Vertex(-1.039062, 0.000000, -0.367188),
	            new Vertex(1.187500, 0.093750, -0.445312),
	            new Vertex(-1.187500, 0.093750, -0.445312),
	            new Vertex(1.234375, 0.250000, -0.445312),
	            new Vertex(-1.234375, 0.250000, -0.445312),
	            new Vertex(1.171875, 0.359375, -0.437500),
	            new Vertex(-1.171875, 0.359375, -0.437500),
	            new Vertex(1.023438, 0.343750, -0.359375),
	            new Vertex(-1.023438, 0.343750, -0.359375),
	            new Vertex(0.843750, 0.289062, -0.210938),
	            new Vertex(-0.843750, 0.289062, -0.210938),
	            new Vertex(0.835938, 0.171875, -0.273438),
	            new Vertex(-0.835938, 0.171875, -0.273438),
	            new Vertex(0.757812, 0.093750, -0.273438),
	            new Vertex(-0.757812, 0.093750, -0.273438),
	            new Vertex(0.820312, 0.085938, -0.273438),
	            new Vertex(-0.820312, 0.085938, -0.273438),
	            new Vertex(0.843750, 0.015625, -0.273438),
	            new Vertex(-0.843750, 0.015625, -0.273438),
	            new Vertex(0.812500, -0.015625, -0.273438),
	            new Vertex(-0.812500, -0.015625, -0.273438),
	            new Vertex(0.726562, 0.000000, -0.070312),
	            new Vertex(-0.726562, 0.000000, -0.070312),
	            new Vertex(0.718750, -0.023438, -0.171875),
	            new Vertex(-0.718750, -0.023438, -0.171875),
	            new Vertex(0.718750, 0.039062, -0.187500),
	            new Vertex(-0.718750, 0.039062, -0.187500),
	            new Vertex(0.796875, 0.203125, -0.210938),
	            new Vertex(-0.796875, 0.203125, -0.210938),
	            new Vertex(0.890625, 0.242188, -0.265625),
	            new Vertex(-0.890625, 0.242188, -0.265625),
	            new Vertex(0.890625, 0.234375, -0.320312),
	            new Vertex(-0.890625, 0.234375, -0.320312),
	            new Vertex(0.812500, -0.015625, -0.320312),
	            new Vertex(-0.812500, -0.015625, -0.320312),
	            new Vertex(0.851562, 0.015625, -0.320312),
	            new Vertex(-0.851562, 0.015625, -0.320312),
	            new Vertex(0.828125, 0.078125, -0.320312),
	            new Vertex(-0.828125, 0.078125, -0.320312),
	            new Vertex(0.765625, 0.093750, -0.320312),
	            new Vertex(-0.765625, 0.093750, -0.320312),
	            new Vertex(0.843750, 0.171875, -0.320312),
	            new Vertex(-0.843750, 0.171875, -0.320312),
	            new Vertex(1.039062, 0.328125, -0.414062),
	            new Vertex(-1.039062, 0.328125, -0.414062),
	            new Vertex(1.187500, 0.343750, -0.484375),
	            new Vertex(-1.187500, 0.343750, -0.484375),
	            new Vertex(1.257812, 0.242188, -0.492188),
	            new Vertex(-1.257812, 0.242188, -0.492188),
	            new Vertex(1.210938, 0.085938, -0.484375),
	            new Vertex(-1.210938, 0.085938, -0.484375),
	            new Vertex(1.046875, 0.000000, -0.421875),
	            new Vertex(-1.046875, 0.000000, -0.421875),
	            new Vertex(0.882812, -0.015625, -0.265625),
	            new Vertex(-0.882812, -0.015625, -0.265625),
	            new Vertex(0.953125, 0.289062, -0.343750),
	            new Vertex(-0.953125, 0.289062, -0.343750),
	            new Vertex(0.890625, 0.109375, -0.328125),
	            new Vertex(-0.890625, 0.109375, -0.328125),
	            new Vertex(0.937500, 0.062500, -0.335938),
	            new Vertex(-0.937500, 0.062500, -0.335938),
	            new Vertex(1.000000, 0.125000, -0.367188),
	            new Vertex(-1.000000, 0.125000, -0.367188),
	            new Vertex(0.960938, 0.171875, -0.351562),
	            new Vertex(-0.960938, 0.171875, -0.351562),
	            new Vertex(1.015625, 0.234375, -0.375000),
	            new Vertex(-1.015625, 0.234375, -0.375000),
	            new Vertex(1.054688, 0.187500, -0.382812),
	            new Vertex(-1.054688, 0.187500, -0.382812),
	            new Vertex(1.109375, 0.210938, -0.390625),
	            new Vertex(-1.109375, 0.210938, -0.390625),
	            new Vertex(1.085938, 0.273438, -0.390625),
	            new Vertex(-1.085938, 0.273438, -0.390625),
	            new Vertex(1.023438, 0.437500, -0.484375),
	            new Vertex(-1.023438, 0.437500, -0.484375),
	            new Vertex(1.250000, 0.468750, -0.546875),
	            new Vertex(-1.250000, 0.468750, -0.546875),
	            new Vertex(1.367188, 0.296875, -0.500000),
	            new Vertex(-1.367188, 0.296875, -0.500000),
	            new Vertex(1.312500, 0.054688, -0.531250),
	            new Vertex(-1.312500, 0.054688, -0.531250),
	            new Vertex(1.039062, -0.085938, -0.492188),
	            new Vertex(-1.039062, -0.085938, -0.492188),
	            new Vertex(0.789062, -0.125000, -0.328125),
	            new Vertex(-0.789062, -0.125000, -0.328125),
	            new Vertex(0.859375, 0.382812, -0.382812),
	            new Vertex(-0.859375, 0.382812, -0.382812),
	        ];
	
	        mesh.faces = [
	            [46, 2, 44],
	            [3, 47, 45],
	            [44, 4, 42],
	            [5, 45, 43],
	            [2, 6, 4],
	            [7, 3, 5],
	            [0, 8, 2],
	            [9, 1, 3],
	            [10, 14, 8],
	            [15, 11, 9],
	            [8, 16, 6],
	            [17, 9, 7],
	            [20, 16, 14],
	            [21, 17, 19],
	            [12, 20, 14],
	            [21, 13, 15],
	            [22, 26, 20],
	            [27, 23, 21],
	            [26, 18, 20],
	            [27, 19, 29],
	            [32, 28, 26],
	            [33, 29, 31],
	            [34, 26, 24],
	            [35, 27, 33],
	            [36, 32, 34],
	            [37, 33, 39],
	            [38, 30, 32],
	            [39, 31, 41],
	            [44, 40, 38],
	            [45, 41, 43],
	            [46, 38, 36],
	            [47, 39, 45],
	            [36, 48, 46],
	            [37, 49, 51],
	            [34, 50, 36],
	            [35, 51, 53],
	            [24, 52, 34],
	            [25, 53, 55],
	            [22, 54, 24],
	            [23, 55, 57],
	            [22, 58, 56],
	            [59, 23, 57],
	            [12, 62, 58],
	            [63, 13, 59],
	            [10, 64, 62],
	            [65, 11, 63],
	            [0, 48, 64],
	            [49, 1, 65],
	            [60, 64, 48],
	            [49, 65, 61],
	            [62, 64, 60],
	            [61, 65, 63],
	            [60, 58, 62],
	            [63, 59, 61],
	            [60, 56, 58],
	            [59, 57, 61],
	            [60, 54, 56],
	            [57, 55, 61],
	            [60, 52, 54],
	            [55, 53, 61],
	            [60, 50, 52],
	            [53, 51, 61],
	            [60, 48, 50],
	            [51, 49, 61],
	            [173, 90, 88],
	            [174, 90, 175],
	            [171, 88, 86],
	            [172, 89, 174],
	            [84, 171, 86],
	            [172, 85, 87],
	            [82, 169, 84],
	            [170, 83, 85],
	            [80, 167, 82],
	            [168, 81, 83],
	            [78, 145, 163],
	            [146, 79, 164],
	            [93, 145, 91],
	            [94, 146, 148],
	            [93, 149, 147],
	            [150, 94, 148],
	            [97, 149, 95],
	            [98, 150, 152],
	            [99, 151, 97],
	            [100, 152, 154],
	            [101, 153, 99],
	            [102, 154, 156],
	            [101, 157, 155],
	            [158, 102, 156],
	            [105, 157, 103],
	            [106, 158, 160],
	            [107, 159, 105],
	            [108, 160, 162],
	            [66, 161, 107],
	            [66, 162, 67],
	            [127, 161, 109],
	            [128, 162, 160],
	            [127, 157, 159],
	            [158, 128, 160],
	            [155, 178, 125],
	            [156, 179, 158],
	            [153, 125, 123],
	            [154, 126, 156],
	            [151, 123, 121],
	            [152, 124, 154],
	            [149, 121, 119],
	            [150, 122, 152],
	            [147, 119, 117],
	            [148, 120, 150],
	            [145, 117, 115],
	            [146, 118, 148],
	            [163, 115, 113],
	            [164, 116, 146],
	            [113, 176, 163],
	            [176, 114, 164],
	            [161, 111, 109],
	            [162, 112, 67],
	            [111, 177, 182],
	            [177, 112, 183],
	            [180, 177, 176],
	            [181, 177, 183],
	            [134, 175, 173],
	            [175, 135, 174],
	            [132, 173, 171],
	            [174, 133, 172],
	            [132, 169, 130],
	            [133, 170, 172],
	            [165, 184, 167],
	            [185, 166, 168],
	            [130, 167, 184],
	            [168, 131, 185],
	            [189, 186, 143],
	            [189, 187, 188],
	            [186, 68, 184],
	            [187, 68, 188],
	            [130, 68, 129],
	            [131, 68, 185],
	            [141, 190, 143],
	            [191, 142, 144],
	            [139, 192, 141],
	            [193, 140, 142],
	            [196, 139, 138],
	            [197, 140, 195],
	            [70, 138, 137],
	            [70, 138, 197],
	            [143, 69, 189],
	            [144, 69, 191],
	            [190, 207, 69],
	            [191, 207, 206],
	            [70, 199, 196],
	            [200, 70, 197],
	            [196, 201, 194],
	            [202, 197, 195],
	            [201, 192, 194],
	            [202, 193, 204],
	            [192, 205, 190],
	            [206, 193, 191],
	            [203, 199, 198],
	            [204, 200, 202],
	            [198, 205, 203],
	            [206, 198, 204],
	            [138, 163, 176],
	            [164, 138, 176],
	            [139, 210, 163],
	            [211, 140, 164],
	            [143, 210, 141],
	            [144, 211, 213],
	            [186, 212, 143],
	            [187, 213, 166],
	            [208, 165, 80],
	            [209, 166, 213],
	            [214, 212, 208],
	            [215, 213, 211],
	            [78, 210, 214],
	            [211, 79, 215],
	            [129, 221, 130],
	            [129, 222, 71],
	            [132, 221, 219],
	            [222, 133, 220],
	            [134, 219, 217],
	            [220, 135, 218],
	            [136, 217, 216],
	            [218, 136, 216],
	            [217, 230, 216],
	            [218, 230, 229],
	            [217, 226, 228],
	            [227, 218, 229],
	            [219, 224, 226],
	            [225, 220, 227],
	            [71, 224, 221],
	            [71, 225, 223],
	            [223, 228, 224],
	            [229, 223, 225],
	            [224, 228, 226],
	            [227, 229, 225],
	            [182, 233, 231],
	            [234, 183, 232],
	            [111, 231, 253],
	            [232, 112, 254],
	            [111, 255, 109],
	            [112, 256, 254],
	            [113, 233, 180],
	            [114, 234, 252],
	            [113, 249, 251],
	            [250, 114, 252],
	            [115, 247, 249],
	            [248, 116, 250],
	            [117, 245, 247],
	            [246, 118, 248],
	            [119, 243, 245],
	            [244, 120, 246],
	            [123, 243, 121],
	            [124, 244, 242],
	            [125, 241, 123],
	            [126, 242, 240],
	            [125, 235, 239],
	            [236, 126, 240],
	            [178, 237, 235],
	            [238, 179, 236],
	            [127, 255, 237],
	            [256, 128, 238],
	            [255, 275, 237],
	            [256, 276, 258],
	            [235, 275, 277],
	            [276, 236, 278],
	            [235, 273, 239],
	            [236, 274, 278],
	            [239, 271, 241],
	            [240, 272, 274],
	            [243, 271, 269],
	            [272, 244, 270],
	            [243, 267, 245],
	            [244, 268, 270],
	            [247, 267, 265],
	            [268, 248, 266],
	            [247, 263, 249],
	            [248, 264, 266],
	            [249, 261, 251],
	            [250, 262, 264],
	            [233, 261, 279],
	            [262, 234, 280],
	            [255, 259, 257],
	            [260, 256, 258],
	            [253, 281, 259],
	            [282, 254, 260],
	            [231, 279, 281],
	            [280, 232, 282],
	            [66, 283, 72],
	            [284, 66, 72],
	            [107, 285, 283],
	            [286, 108, 284],
	            [103, 285, 105],
	            [104, 286, 288],
	            [101, 287, 103],
	            [102, 288, 290],
	            [99, 289, 101],
	            [100, 290, 292],
	            [99, 293, 291],
	            [294, 100, 292],
	            [95, 293, 97],
	            [96, 294, 296],
	            [95, 297, 295],
	            [298, 96, 296],
	            [93, 299, 297],
	            [300, 94, 298],
	            [308, 337, 307],
	            [308, 338, 328],
	            [307, 335, 306],
	            [307, 336, 338],
	            [306, 339, 305],
	            [306, 340, 336],
	            [88, 305, 339],
	            [305, 89, 340],
	            [86, 339, 333],
	            [340, 87, 334],
	            [84, 333, 329],
	            [334, 85, 330],
	            [82, 329, 331],
	            [330, 83, 332],
	            [329, 337, 331],
	            [338, 330, 332],
	            [333, 335, 329],
	            [334, 336, 340],
	            [331, 327, 325],
	            [332, 328, 338],
	            [80, 331, 325],
	            [332, 81, 326],
	            [341, 214, 208],
	            [342, 215, 344],
	            [325, 208, 80],
	            [326, 209, 342],
	            [214, 345, 78],
	            [215, 346, 344],
	            [345, 91, 78],
	            [346, 92, 300],
	            [323, 303, 76],
	            [324, 303, 352],
	            [351, 77, 303],
	            [352, 77, 350],
	            [77, 347, 304],
	            [348, 77, 304],
	            [304, 327, 308],
	            [328, 304, 308],
	            [327, 341, 325],
	            [328, 342, 348],
	            [295, 317, 309],
	            [318, 296, 310],
	            [315, 76, 75],
	            [316, 76, 324],
	            [357, 302, 301],
	            [358, 302, 356],
	            [302, 353, 74],
	            [354, 302, 74],
	            [74, 315, 75],
	            [316, 74, 75],
	            [291, 361, 363],
	            [362, 292, 364],
	            [363, 367, 365],
	            [368, 364, 366],
	            [365, 369, 371],
	            [370, 366, 372],
	            [371, 375, 373],
	            [376, 372, 374],
	            [377, 375, 313],
	            [378, 376, 374],
	            [315, 373, 377],
	            [374, 316, 378],
	            [353, 371, 373],
	            [372, 354, 374],
	            [355, 365, 371],
	            [366, 356, 372],
	            [357, 363, 365],
	            [364, 358, 366],
	            [291, 359, 289],
	            [292, 360, 364],
	            [359, 301, 73],
	            [360, 301, 358],
	            [283, 287, 289],
	            [288, 284, 290],
	            [283, 359, 73],
	            [360, 284, 73],
	            [72, 283, 73],
	            [73, 284, 72],
	            [295, 361, 293],
	            [296, 362, 310],
	            [309, 367, 361],
	            [368, 310, 362],
	            [311, 369, 367],
	            [370, 312, 368],
	            [375, 381, 313],
	            [376, 382, 370],
	            [349, 383, 347],
	            [350, 384, 386],
	            [383, 319, 317],
	            [384, 320, 386],
	            [297, 383, 317],
	            [384, 298, 318],
	            [299, 341, 383],
	            [342, 300, 384],
	            [341, 347, 383],
	            [384, 348, 342],
	            [299, 345, 343],
	            [344, 346, 300],
	            [321, 377, 313],
	            [322, 378, 380],
	            [377, 323, 315],
	            [378, 324, 380],
	            [385, 321, 319],
	            [386, 322, 380],
	            [351, 385, 349],
	            [352, 386, 380],
	            [323, 379, 351],
	            [352, 380, 324],
	            [387, 401, 399],
	            [388, 402, 414],
	            [399, 403, 397],
	            [404, 400, 398],
	            [403, 395, 397],
	            [404, 396, 406],
	            [405, 393, 395],
	            [406, 394, 408],
	            [407, 391, 393],
	            [408, 392, 410],
	            [391, 411, 389],
	            [412, 392, 390],
	            [409, 417, 411],
	            [418, 410, 412],
	            [407, 419, 409],
	            [420, 408, 410],
	            [423, 407, 405],
	            [424, 408, 422],
	            [425, 405, 403],
	            [426, 406, 424],
	            [427, 403, 401],
	            [428, 404, 426],
	            [401, 415, 427],
	            [416, 402, 428],
	            [319, 441, 317],
	            [320, 442, 444],
	            [389, 443, 319],
	            [390, 444, 412],
	            [309, 441, 311],
	            [442, 310, 312],
	            [381, 413, 387],
	            [414, 382, 388],
	            [411, 439, 443],
	            [440, 412, 444],
	            [445, 439, 437],
	            [446, 440, 444],
	            [433, 437, 435],
	            [438, 434, 436],
	            [447, 433, 431],
	            [448, 434, 446],
	            [447, 449, 429],
	            [448, 450, 432],
	            [429, 415, 413],
	            [430, 416, 450],
	            [311, 429, 381],
	            [430, 312, 382],
	            [441, 447, 311],
	            [442, 448, 446],
	            [441, 443, 445],
	            [446, 444, 442],
	            [415, 451, 475],
	            [452, 416, 476],
	            [431, 451, 449],
	            [432, 452, 462],
	            [431, 459, 461],
	            [460, 432, 462],
	            [435, 459, 433],
	            [436, 460, 458],
	            [437, 457, 435],
	            [438, 458, 456],
	            [437, 453, 455],
	            [454, 438, 456],
	            [439, 473, 453],
	            [474, 440, 454],
	            [427, 475, 463],
	            [476, 428, 464],
	            [425, 463, 465],
	            [464, 426, 466],
	            [423, 465, 467],
	            [466, 424, 468],
	            [423, 469, 421],
	            [424, 470, 468],
	            [421, 471, 419],
	            [422, 472, 470],
	            [419, 473, 417],
	            [420, 474, 472],
	            [455, 477, 457],
	            [456, 478, 480],
	            [479, 483, 477],
	            [480, 484, 482],
	            [483, 487, 485],
	            [488, 484, 486],
	            [487, 491, 485],
	            [488, 492, 490],
	            [463, 485, 491],
	            [486, 464, 492],
	            [483, 475, 451],
	            [484, 476, 486],
	            [461, 483, 451],
	            [462, 484, 478],
	            [457, 461, 459],
	            [462, 458, 460],
	            [473, 455, 453],
	            [474, 456, 480],
	            [471, 479, 473],
	            [480, 472, 474],
	            [487, 471, 469],
	            [488, 472, 482],
	            [489, 469, 467],
	            [490, 470, 488],
	            [465, 489, 467],
	            [490, 466, 468],
	            [463, 491, 465],
	            [466, 492, 464],
	            [391, 503, 501],
	            [504, 392, 502],
	            [393, 501, 499],
	            [502, 394, 500],
	            [393, 497, 395],
	            [394, 498, 500],
	            [395, 495, 397],
	            [396, 496, 498],
	            [397, 493, 399],
	            [398, 494, 496],
	            [399, 505, 387],
	            [400, 506, 494],
	            [501, 505, 493],
	            [502, 506, 504],
	            [493, 499, 501],
	            [500, 494, 502],
	            [495, 497, 499],
	            [500, 498, 496],
	            [381, 505, 313],
	            [382, 506, 388],
	            [313, 503, 321],
	            [504, 314, 322],
	            [319, 503, 389],
	            [504, 320, 390],
	            [46, 0, 2],
	            [3, 1, 47],
	            [44, 2, 4],
	            [5, 3, 45],
	            [2, 8, 6],
	            [7, 9, 3],
	            [0, 10, 8],
	            [9, 11, 1],
	            [10, 12, 14],
	            [15, 13, 11],
	            [8, 14, 16],
	            [17, 15, 9],
	            [20, 18, 16],
	            [21, 15, 17],
	            [12, 22, 20],
	            [21, 23, 13],
	            [22, 24, 26],
	            [27, 25, 23],
	            [26, 28, 18],
	            [27, 21, 19],
	            [32, 30, 28],
	            [33, 27, 29],
	            [34, 32, 26],
	            [35, 25, 27],
	            [36, 38, 32],
	            [37, 35, 33],
	            [38, 40, 30],
	            [39, 33, 31],
	            [44, 42, 40],
	            [45, 39, 41],
	            [46, 44, 38],
	            [47, 37, 39],
	            [36, 50, 48],
	            [37, 47, 49],
	            [34, 52, 50],
	            [35, 37, 51],
	            [24, 54, 52],
	            [25, 35, 53],
	            [22, 56, 54],
	            [23, 25, 55],
	            [22, 12, 58],
	            [59, 13, 23],
	            [12, 10, 62],
	            [63, 11, 13],
	            [10, 0, 64],
	            [65, 1, 11],
	            [0, 46, 48],
	            [49, 47, 1],
	            [173, 175, 90],
	            [174, 89, 90],
	            [171, 173, 88],
	            [172, 87, 89],
	            [84, 169, 171],
	            [172, 170, 85],
	            [82, 167, 169],
	            [170, 168, 83],
	            [80, 165, 167],
	            [168, 166, 81],
	            [78, 91, 145],
	            [146, 92, 79],
	            [93, 147, 145],
	            [94, 92, 146],
	            [93, 95, 149],
	            [150, 96, 94],
	            [97, 151, 149],
	            [98, 96, 150],
	            [99, 153, 151],
	            [100, 98, 152],
	            [101, 155, 153],
	            [102, 100, 154],
	            [101, 103, 157],
	            [158, 104, 102],
	            [105, 159, 157],
	            [106, 104, 158],
	            [107, 161, 159],
	            [108, 106, 160],
	            [66, 67, 161],
	            [66, 108, 162],
	            [127, 159, 161],
	            [128, 110, 162],
	            [127, 178, 157],
	            [158, 179, 128],
	            [155, 157, 178],
	            [156, 126, 179],
	            [153, 155, 125],
	            [154, 124, 126],
	            [151, 153, 123],
	            [152, 122, 124],
	            [149, 151, 121],
	            [150, 120, 122],
	            [147, 149, 119],
	            [148, 118, 120],
	            [145, 147, 117],
	            [146, 116, 118],
	            [163, 145, 115],
	            [164, 114, 116],
	            [113, 180, 176],
	            [176, 181, 114],
	            [161, 67, 111],
	            [162, 110, 112],
	            [111, 67, 177],
	            [177, 67, 112],
	            [180, 182, 177],
	            [181, 176, 177],
	            [134, 136, 175],
	            [175, 136, 135],
	            [132, 134, 173],
	            [174, 135, 133],
	            [132, 171, 169],
	            [133, 131, 170],
	            [165, 186, 184],
	            [185, 187, 166],
	            [130, 169, 167],
	            [168, 170, 131],
	            [189, 188, 186],
	            [189, 144, 187],
	            [186, 188, 68],
	            [187, 185, 68],
	            [130, 184, 68],
	            [131, 129, 68],
	            [141, 192, 190],
	            [191, 193, 142],
	            [139, 194, 192],
	            [193, 195, 140],
	            [196, 194, 139],
	            [197, 138, 140],
	            [70, 196, 138],
	            [70, 137, 138],
	            [143, 190, 69],
	            [144, 189, 69],
	            [190, 205, 207],
	            [191, 69, 207],
	            [70, 198, 199],
	            [200, 198, 70],
	            [196, 199, 201],
	            [202, 200, 197],
	            [201, 203, 192],
	            [202, 195, 193],
	            [192, 203, 205],
	            [206, 204, 193],
	            [203, 201, 199],
	            [204, 198, 200],
	            [198, 207, 205],
	            [206, 207, 198],
	            [138, 139, 163],
	            [164, 140, 138],
	            [139, 141, 210],
	            [211, 142, 140],
	            [143, 212, 210],
	            [144, 142, 211],
	            [186, 165, 212],
	            [187, 144, 213],
	            [208, 212, 165],
	            [209, 81, 166],
	            [214, 210, 212],
	            [215, 209, 213],
	            [78, 163, 210],
	            [211, 164, 79],
	            [129, 71, 221],
	            [129, 131, 222],
	            [132, 130, 221],
	            [222, 131, 133],
	            [134, 132, 219],
	            [220, 133, 135],
	            [136, 134, 217],
	            [218, 135, 136],
	            [217, 228, 230],
	            [218, 216, 230],
	            [217, 219, 226],
	            [227, 220, 218],
	            [219, 221, 224],
	            [225, 222, 220],
	            [71, 223, 224],
	            [71, 222, 225],
	            [223, 230, 228],
	            [229, 230, 223],
	            [182, 180, 233],
	            [234, 181, 183],
	            [111, 182, 231],
	            [232, 183, 112],
	            [111, 253, 255],
	            [112, 110, 256],
	            [113, 251, 233],
	            [114, 181, 234],
	            [113, 115, 249],
	            [250, 116, 114],
	            [115, 117, 247],
	            [248, 118, 116],
	            [117, 119, 245],
	            [246, 120, 118],
	            [119, 121, 243],
	            [244, 122, 120],
	            [123, 241, 243],
	            [124, 122, 244],
	            [125, 239, 241],
	            [126, 124, 242],
	            [125, 178, 235],
	            [236, 179, 126],
	            [178, 127, 237],
	            [238, 128, 179],
	            [127, 109, 255],
	            [256, 110, 128],
	            [255, 257, 275],
	            [256, 238, 276],
	            [235, 237, 275],
	            [276, 238, 236],
	            [235, 277, 273],
	            [236, 240, 274],
	            [239, 273, 271],
	            [240, 242, 272],
	            [243, 241, 271],
	            [272, 242, 244],
	            [243, 269, 267],
	            [244, 246, 268],
	            [247, 245, 267],
	            [268, 246, 248],
	            [247, 265, 263],
	            [248, 250, 264],
	            [249, 263, 261],
	            [250, 252, 262],
	            [233, 251, 261],
	            [262, 252, 234],
	            [255, 253, 259],
	            [260, 254, 256],
	            [253, 231, 281],
	            [282, 232, 254],
	            [231, 233, 279],
	            [280, 234, 232],
	            [66, 107, 283],
	            [284, 108, 66],
	            [107, 105, 285],
	            [286, 106, 108],
	            [103, 287, 285],
	            [104, 106, 286],
	            [101, 289, 287],
	            [102, 104, 288],
	            [99, 291, 289],
	            [100, 102, 290],
	            [99, 97, 293],
	            [294, 98, 100],
	            [95, 295, 293],
	            [96, 98, 294],
	            [95, 93, 297],
	            [298, 94, 96],
	            [93, 91, 299],
	            [300, 92, 94],
	            [308, 327, 337],
	            [308, 307, 338],
	            [307, 337, 335],
	            [307, 306, 336],
	            [306, 335, 339],
	            [306, 305, 340],
	            [88, 90, 305],
	            [305, 90, 89],
	            [86, 88, 339],
	            [340, 89, 87],
	            [84, 86, 333],
	            [334, 87, 85],
	            [82, 84, 329],
	            [330, 85, 83],
	            [329, 335, 337],
	            [338, 336, 330],
	            [333, 339, 335],
	            [334, 330, 336],
	            [331, 337, 327],
	            [332, 326, 328],
	            [80, 82, 331],
	            [332, 83, 81],
	            [341, 343, 214],
	            [342, 209, 215],
	            [325, 341, 208],
	            [326, 81, 209],
	            [214, 343, 345],
	            [215, 79, 346],
	            [345, 299, 91],
	            [346, 79, 92],
	            [323, 351, 303],
	            [324, 76, 303],
	            [351, 349, 77],
	            [352, 303, 77],
	            [77, 349, 347],
	            [348, 350, 77],
	            [304, 347, 327],
	            [328, 348, 304],
	            [327, 347, 341],
	            [328, 326, 342],
	            [295, 297, 317],
	            [318, 298, 296],
	            [315, 323, 76],
	            [316, 75, 76],
	            [357, 355, 302],
	            [358, 301, 302],
	            [302, 355, 353],
	            [354, 356, 302],
	            [74, 353, 315],
	            [316, 354, 74],
	            [291, 293, 361],
	            [362, 294, 292],
	            [363, 361, 367],
	            [368, 362, 364],
	            [365, 367, 369],
	            [370, 368, 366],
	            [371, 369, 375],
	            [376, 370, 372],
	            [377, 373, 375],
	            [378, 314, 376],
	            [315, 353, 373],
	            [374, 354, 316],
	            [353, 355, 371],
	            [372, 356, 354],
	            [355, 357, 365],
	            [366, 358, 356],
	            [357, 359, 363],
	            [364, 360, 358],
	            [291, 363, 359],
	            [292, 290, 360],
	            [359, 357, 301],
	            [360, 73, 301],
	            [283, 285, 287],
	            [288, 286, 284],
	            [283, 289, 359],
	            [360, 290, 284],
	            [295, 309, 361],
	            [296, 294, 362],
	            [309, 311, 367],
	            [368, 312, 310],
	            [311, 381, 369],
	            [370, 382, 312],
	            [375, 369, 381],
	            [376, 314, 382],
	            [349, 385, 383],
	            [350, 348, 384],
	            [383, 385, 319],
	            [384, 318, 320],
	            [297, 299, 383],
	            [384, 300, 298],
	            [299, 343, 341],
	            [342, 344, 300],
	            [321, 379, 377],
	            [322, 314, 378],
	            [377, 379, 323],
	            [378, 316, 324],
	            [385, 379, 321],
	            [386, 320, 322],
	            [351, 379, 385],
	            [352, 350, 386],
	            [387, 413, 401],
	            [388, 400, 402],
	            [399, 401, 403],
	            [404, 402, 400],
	            [403, 405, 395],
	            [404, 398, 396],
	            [405, 407, 393],
	            [406, 396, 394],
	            [407, 409, 391],
	            [408, 394, 392],
	            [391, 409, 411],
	            [412, 410, 392],
	            [409, 419, 417],
	            [418, 420, 410],
	            [407, 421, 419],
	            [420, 422, 408],
	            [423, 421, 407],
	            [424, 406, 408],
	            [425, 423, 405],
	            [426, 404, 406],
	            [427, 425, 403],
	            [428, 402, 404],
	            [401, 413, 415],
	            [416, 414, 402],
	            [319, 443, 441],
	            [320, 318, 442],
	            [389, 411, 443],
	            [390, 320, 444],
	            [309, 317, 441],
	            [442, 318, 310],
	            [381, 429, 413],
	            [414, 430, 382],
	            [411, 417, 439],
	            [440, 418, 412],
	            [445, 443, 439],
	            [446, 438, 440],
	            [433, 445, 437],
	            [438, 446, 434],
	            [447, 445, 433],
	            [448, 432, 434],
	            [447, 431, 449],
	            [448, 430, 450],
	            [429, 449, 415],
	            [430, 414, 416],
	            [311, 447, 429],
	            [430, 448, 312],
	            [441, 445, 447],
	            [442, 312, 448],
	            [415, 449, 451],
	            [452, 450, 416],
	            [431, 461, 451],
	            [432, 450, 452],
	            [431, 433, 459],
	            [460, 434, 432],
	            [435, 457, 459],
	            [436, 434, 460],
	            [437, 455, 457],
	            [438, 436, 458],
	            [437, 439, 453],
	            [454, 440, 438],
	            [439, 417, 473],
	            [474, 418, 440],
	            [427, 415, 475],
	            [476, 416, 428],
	            [425, 427, 463],
	            [464, 428, 426],
	            [423, 425, 465],
	            [466, 426, 424],
	            [423, 467, 469],
	            [424, 422, 470],
	            [421, 469, 471],
	            [422, 420, 472],
	            [419, 471, 473],
	            [420, 418, 474],
	            [455, 479, 477],
	            [456, 458, 478],
	            [479, 481, 483],
	            [480, 478, 484],
	            [483, 481, 487],
	            [488, 482, 484],
	            [487, 489, 491],
	            [488, 486, 492],
	            [463, 475, 485],
	            [486, 476, 464],
	            [483, 485, 475],
	            [484, 452, 476],
	            [461, 477, 483],
	            [462, 452, 484],
	            [457, 477, 461],
	            [462, 478, 458],
	            [473, 479, 455],
	            [474, 454, 456],
	            [471, 481, 479],
	            [480, 482, 472],
	            [487, 481, 471],
	            [488, 470, 472],
	            [489, 487, 469],
	            [490, 468, 470],
	            [465, 491, 489],
	            [490, 492, 466],
	            [391, 389, 503],
	            [504, 390, 392],
	            [393, 391, 501],
	            [502, 392, 394],
	            [393, 499, 497],
	            [394, 396, 498],
	            [395, 497, 495],
	            [396, 398, 496],
	            [397, 495, 493],
	            [398, 400, 494],
	            [399, 493, 505],
	            [400, 388, 506],
	            [501, 503, 505],
	            [502, 494, 506],
	            [493, 495, 499],
	            [500, 496, 494],
	            [381, 387, 505],
	            [382, 314, 506],
	            [313, 505, 503],
	            [504, 506, 314],
	            [319, 321, 503],
	            [504, 322, 320],
	        ]
	    }
	}
	
	module.exports = Suzanne;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	const Behaviour = __webpack_require__(19);
	const Camera = __webpack_require__(1);
	const Render = __webpack_require__(12);
	const Scene = __webpack_require__(20);
	const Screen = __webpack_require__(21);
	
	class iso2d {
	    constructor(canvas, camera, scene) {
	        this._canvas = canvas || null;
	        this._scene = scene || new Scene(this);
	        this._camera = camera || new Camera(this);
	        this._screeen = screen || new Screen(this);
	        this._render = new Render(this);
	        this._behaviours = [];
	    }
	
	    /** @returns {Camera} */
	    get camera() {
	        return this._camera;
	    }
	
	    /** @param {Camera} camera */
	    set camera(camera) {
	        this._camera = camera;
	    }
	
	    /** @returns {Scene} */
	    get scene() {
	        return this._scene;
	    }
	
	    /** @param {Scene} scene */
	    set scene(scene) {
	        this._scene = scene;
	    }
	
	    /** @returns {Render} */
	    get render() {
	        return this._render;
	    }
	
	    /** @param {Behaviour} behaviour */
	    addBehaviour(behaviour) {
	        if (behaviour.__proto__.name !== "Behaviour") {
	            return null;
	        }
	
	        behaviour = new behaviour(this._scene);
	
	        this._behaviours.push(behaviour);
	    }
	
	    start() {
	        for (let bh of this._behaviours) {
	            bh.start();
	        }
	
	        window.requestAnimationFrame(() => {
	            this.tick();
	        });
	    }
	
	    tick() {
	        for (let gm of this.scene.gameObjects) {
	            for (let component of gm.allComponents()) {
	                component.onUpdate(this);
	                component.onDraw(this);
	            };
	        }
	
	        this.render.render();
	        window.requestAnimationFrame(() => {
	            this.tick();
	        })
	    }
	}
	
	module.exports = iso2d;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	class Behaviour {
	    constructor(scene) {
	        this._scene = scene;
	    }
	
	    start() {
	
	    }
	
	    update() {
	
	    }
	}
	
	module.exports = Behaviour;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	const GameObject = __webpack_require__(14);
	class Scene {
	    constructor(core) {
	        this._core = core;
	        this._gameObjects = [];
	        this._lights = [];
	    }
	
	    get core () {
	        return this._core;
	    }
	
	    /** @returns {GameObject[]} */
	    get gameObjects() {
	        return this._gameObjects;
	    }
	
	    get lights () {
	        return this._lights;
	    }
	
	    /** @param {GameObject} gameObject */
	    addGameObject(gameObject) {
	        this.gameObjects.push(gameObject);
	
	        return gameObject;
	    }
	
	
	    /** @returns {GameObject[]} */
	    allGameObjects() {
	        return this.gameObjects;
	    }
	
	    
	    addLight(light) {
	        this.lights.push(light);
	    }
	
	    allLights() {
	        return this.lights;
	    }
	}
	
	module.exports = Scene;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	class Screen {
	    constructor(core) {
	        this._core = core;
	        this._width = document.body.clientWidth;
	        this._height = document.body.clientHeight;
	
	        document.addEventListener('resize', e => {
	            this._width = document.body.clientWidth;
	            this._height = document.body.clientHeight;
	        });
	    }
	}
	
	module.exports = Screen;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	const RGBA = __webpack_require__(10);
	class Bitmap {
	    /** @param {ImageData} imageData */
	    constructor(imageData) {
	        this._bitmap = imageData;
	        this._w = imageData.width;
	        this._h = imageData.height;
	    }
	
	    get bitmap () {
	        return this._bitmap;
	    }
	
	    /**
	     * 
	     * @param x {Number} 
	     * @param y {Number} 
	     * @param color {RGBA};
	     */
	    set(x, y, color) {
	        x = parseInt(x);
	        y = parseInt(y);
	
	        var i = (x + y * this._w) * 4
	        
	        this.bitmap.data[i + 0] = color.r;
	        this.bitmap.data[i + 1] = color.g;
	        this.bitmap.data[i + 2] = color.b;
	        this.bitmap.data[i + 3] = color.a;
	    }
	
	    get() {
	        return this.bitmap;
	    }
	}
	
	module.exports = Bitmap;

/***/ })
/******/ ])
});
;
//# sourceMappingURL=iso2d.js.map