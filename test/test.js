var iso2d = iso2d;

var _ = new iso2d.Core(document.getElementById("_ID"));

_.resource.addList([
    new iso2d.resource.Image('/resource/assets.jpg'),
    new iso2d.resource.Image('/resource/assets1.jpg'),
]);

_.run().then(() => {
    /* _.addPrimitive(new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 0, 0), 16, 16, 16)) */

    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(192, 192, 0), 0, 0, 192))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(192, 192, 0), 0, -192, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(192, 192, 0), -192, 0, 0))

    _.addPrimitive(new iso2d.primitive.Plate(new iso2d.coordinate.Point(192, 192, 0), -192, -192, 0))

    var collection = [
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 16, 0), 16, 16, 16),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 16, 16), 16, 16, 16),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 16, 32), 16, 16, 16),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 0, 0), 16, 16, 16),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 0, 16), 16, 16, 16),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 0, 32), 16, 16, 16),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 0), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 8), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 16), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 24), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 32), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 40), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 48), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 56), 16, 16, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 64), 16, 16, 32),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(112, 64, 96), 32, 32, 32),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(80, 64, 96), 32, 32, 32),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(48, 64, 96), 32, 32, 32),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 96), 32, 32, 32),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 72, 0), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 72, 0), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 64, 0), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 0), 8, 8, 8),

        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 72, 8), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 72, 8), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 64, 8), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 8), 8, 8, 8),

        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 72, 16), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 72, 16), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 64, 16), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 16), 8, 8, 8),

        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 72, 24), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 72, 24), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 64, 24), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 24), 8, 8, 8),

        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 72, 32), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 72, 32), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(24, 64, 32), 8, 8, 8),
        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 32), 8, 8, 8),

        new iso2d.primitive.Cube(new iso2d.coordinate.Point(16, 64, 40), 16, 16, 16),
    ]

    var current = 0;





    setInterval(function () {
        if (collection[current]) {
            _.addPrimitive(collection[current]);

        }
        current++;
    }, 160);




    /* _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 0, 0), 0, 0, 128))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 0, 0), 0, 128, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 0, 0), 128, 0, 0))

    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 32, 0), 128, 0, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 64, 0), 128, 0, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 96, 0), 128, 0, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(0, 128, 0), 128, 0, 0))

    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(32, 0, 0), 0, 128, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(64, 0, 0), 0, 128, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(96, 0, 0), 0, 128, 0))
    _.addPrimitive(new iso2d.primitive.Line(new iso2d.coordinate.Point(128, 0, 0), 0, 128, 0)) */

    //_.addPrimitive(new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 0, 0), 32, 32, 32))

});