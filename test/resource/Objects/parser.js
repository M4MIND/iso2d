const fs = require('fs');
const path = require('path');

let out = fs.readFileSync(path.join(__dirname, 'Cylinder.obj'))

for (let ln of out.toString().split('\n')) {

    if (ln.indexOf('v ') === 0) {
        ln = ln.split(' ');
        console.log(`new Vertex(${ln[1]}, ${ln[2]}, ${ln[3]}),`);
    }

    if (ln.indexOf('f ') === 0) {
        ln = ln.split(' ');

        let f1 = ln[1].split('/')[0];
        let f2 = ln[2].split('/')[0];
        let f3 = ln[3].split('/')[0];

        console.log(`[${f1-1}, ${f2-1}, ${f3-1}],`);
    }
}