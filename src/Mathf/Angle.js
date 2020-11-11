class Angle {
    static degreesToRadians(a) {
        return a * (Math.PI / 180);
    }
    static radiansToDegrees(a) {
        return a / (Math.PI / 180);
    }
}

module.exports = Angle;