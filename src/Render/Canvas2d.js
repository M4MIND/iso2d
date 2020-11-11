const Camera = require("../Camera/Camera");
const Scene = require("../Scene/Scene");
const Bitmap = require("./Bitmap");
const Render = require("./Render");


class Canvas2d extends Render {
    constructor(w, h) {
        super();
        this.w = document.body.clientWidth;
        this.h = document.body.clientHeight;
        this.e = document.createElement('canvas');
        this.ctx = this.e.getContext("2d");
        this.e.width = this.w;
        this.e.height = this.h;
        this.bitmap = null;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

    startDraw() {
        this.bitmap = new Bitmap(this.ctx.createImageData(this.w, this.h))
    }

    drawPoint(x, y, color) {
        this.bitmap.draw(x, y, color);
    }

    render() {
        this.ctx.putImageData(this.bitmap.bitmap, 0, 0);
    }
}

module.exports = Canvas2d;