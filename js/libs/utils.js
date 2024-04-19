// wrappers
let log = console.log;

const PI = Math.PI;
const tan = Math.tan;
const cos = Math.cos;
const sin = Math.sin;
const atan = Math.atan;
const atan2 = Math.atan2;
const acos = Math.acos;
const asin = Math.asin;
const abs = Math.abs;
const sign = Math.sign;
const max = Math.max;
const min = Math.min;

// extensions
Number.prototype.deg = function() { return this*180/Math.PI ;}
Number.prototype.rad = function() { return this*Math.PI/180 ;}

// functions
function lerp(a, b, t) {
    return a + (b - a) * t;
}

function relu(n) {
    return Math.max(0, n);
}

function normalize(n, t) {    
    return n / t;
}

function standarizeAngle2M(a) {
    if (a >= -PI && a <= PI) return a;    
    if (a > PI) {
        return standarizeAngle2M(a - 2*PI);
    } else if (a < -PI) {
        return standarizeAngle2M(2*PI + a);
    }
}

function standarizeAngle1E(a) {
    a = standarizeAngle2M(a);
    if (a >= 0) return a;    
    return 2*PI + a;
}


function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    const eps = 0.001;    
    if (Math.abs(bottom) > 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            };
        }
    }
    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            if (poly1[i].intersectionWith(poly2[j])) return true;
        }
    }
    return false;
}

function getNearestPoint(point, points, thresold = 10) {
    const nearest = points.slice(0).sort( (a, b) => a.distanceTo(point) - b.distanceTo(point) )[0];
    return nearest && nearest.distanceTo(point) <= thresold ? nearest : null;
}

function getNearestSegment(point, segments, thresold = 10) {
    const distances = segments.map( (seg, i) => { 
        const seg_angle = Math.min(seg.angle, seg.inverseAngle);
        const p1 = point.translate(seg_angle + PI / 2, 10000);
        const p2 = point.translate(seg_angle - PI / 2, 10000);
        const newPoint = seg.intersectionWith(new Segment(p1, p2));
        const dist = newPoint ? point.distanceTo(newPoint) : 10000;
        return newPoint && dist <= thresold ? [ i, dist, newPoint ] : null;
    } ).filter( d => d != null );
    if (distances.length) {
        const nearest = distances.sort( (a,b) => b[1] - a[1] )[0];
        return [ segments[ nearest[0] ], nearest[2] ];
    }
    return [ null, null ]
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value > 0 ? 255 : 0;
    const G = R;
    const B = value < 0 ? 255 : 0;
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 60%)`;
}

async function fetchdata(file) {
    const response = await fetch(file);
    return await response.json();
}

// Standard Normal variate using Box-Muller transform.
function randomGaussian(mean = 0, stdev = 1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function random(max) {
    return Math.random() * max;  
}

function imagedata2image(imagedata) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}


//(function(console){

//    console.
function save(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
//})(console)

