
// DATA CONSTANTS

// config constants
const terrainColor = '#60AF60';
const roadColor = '#707070';
const roadSignals = 'white';
const roadWidth = 100;

// global variables
let roadPoints = [];

// admin actions control

document.onkeypress = e => {
    console.log(e.keyCode)
    if (e.keyCode == 32) {
    } else if (e.keyCode == 13) {
    } else if (e.keyCode == 82 || e.keyCode == 114) {
    } else if (e.keyCode == 100) {
    } else if (e.keyCode == 97) {
    } else if (e.keyCode == 115) {
    } else if (e.keyCode == 119) {
    }
};

// main settings
document.body.style.backgroundColor = 'black';

const editor = new TrackEditor(editorCanvas);

animate();

////////////////////////////////////////////////////////////////////////////////////////////
// Main //

function animate() {
    editor.update();
    requestAnimationFrame(animate);
}



////////////////////////////////////////////////////////////////////////////////////////////
// LIBS //

function getNearestPoint(point, points, thresold = 10) {
    return points.find( p => p.distanceTo(point) <= thresold );
}