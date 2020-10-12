class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        
        this.canvas.width = window.document.body.clientWidth;
        this.canvas.height = window.document.body.clientHeight;
        this.ctx = this.canvas.getContext('2d');
        this.color = ["#0099ff", "#257686", "red"]
    }
    drawPrimitive(primitive) {
        for (let path of primitive.paths) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.color.shift();
            
            for (let point of path.points) {
                this.ctx.arc(point.iso().x, point.iso().y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.save();
            }

            this.ctx.restore();
        }
    }
}

module.exports = Canvas;