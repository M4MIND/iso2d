var iso2d = iso2d;

var _ = new iso2d.Core(document.getElementById("_ID"));

_.resource.addList([
    new iso2d.resource.Image('/resource/assets.jpg'),
    new iso2d.resource.Image('/resource/assets1.jpg'),
]);

_.run().then(() => {
    _.addPrimitive(new iso2d.primitive.Cube(new iso2d.coordinate.Point(0, 0, 0), 48, 32, 16))
});