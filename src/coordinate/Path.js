class Path {
    constructor(points) {
        this.points = points || [];
    }

    push() {

    }

    reverse() {
        this.points = this.points.reverse();

        return this;
    }

    translate(dx, dy, dz) {
        this.points = this.points.map(item => item.translate(dx, dy, dz));

        return this;
    }

    rotateX() {

    }

    rotateY() {

    }

    rotateZ() {

    }

    scale() {

    }

    depth() {

    }
}

module.exports = Path