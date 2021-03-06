module.exports = {
    Core: require('./src/iso2d'),
    resource: {
        Image: require('./src/system/resource/image/Image')
    },
    primitive: {
        Primitive: require('./src/object/primitive/Primitive'),
        Plate: require('./src/object/primitive/plate/Plate'),
        Cube: require('./src/object/primitive/cube/Cube'),
        Line: require('./src/object/primitive/line/Line')
    },
    coordinate: {
        Point: require('./src/coordinate/Point')
    }
}