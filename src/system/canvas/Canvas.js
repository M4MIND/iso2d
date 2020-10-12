class Canvas {
    constructor(canvas) {
        this.canvas = canvas;

        this.canvas.width = window.document.body.clientWidth;
        this.canvas.height = window.document.body.clientHeight;
        this.ctx = this.canvas.getContext('2d');
    }
    drawPrimitive(primitive) {
        for (let path of primitive.paths) {
            this.ctx.beginPath();

            this.ctx.moveTo(path.points[0].iso().x, path.points[0].iso().y);

            for (let point of path.points) {
                this.ctx.lineTo(point.iso().x, point.iso().y);
            }

            this.ctx.save();

            this.ctx.fillStyle = "#CCC";
            this.ctx.strokeStyle = `rgba(0,0,0,0.2)`
            this.ctx.lineWidth = 1;
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.restore();
        }
    }
}

module.exports = Canvas;