/* TODO

 [√] grilla
 [√] CTRL-z 
 [√] guardar
   
 
*/

// DATA CONSTANTS

// config constants
const terrainColor = '#60AF60';
const roadColor = '#707070';
const roadSignals = 'white';
const roadWidth = 100;
const gridDensity = 10;

// global variables
let roadPoints = [];

// admin actions control
let paused = false;

document.onkeypress = e => {
    console.log(e.keyCode)
    if (e.keyCode == 32) {
        (paused = !paused) || animate() ;
        document.getElementById('paused').style.display = paused ? 'flex' : 'none';        
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

    if (!paused) {
        requestAnimationFrame(animate);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////
// LIBS //

