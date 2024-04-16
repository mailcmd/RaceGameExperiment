
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
editorCanvas.style.backgroundColor = terrainColor;
editorCanvas.style.position = 'fixed';
editorCanvas.style.border = '1px solid black';
editorCanvas.height = window.innerHeight*0.9;
editorCanvas.width = editorCanvas.height; 
editorCanvas.style.left = ((window.innerWidth - editorCanvas.width) / 2) + 'px';
editorCanvas.style.top = ((window.innerHeight - editorCanvas.height) / 2) + 'px';

editorCanvas.addEventListener('mousemove', handleMouseMove);
editorCanvas.addEventListener('mousedown', handleMouseDown);

const editorCtx = editorCanvas.getContext('2d');

////////////////////////////////////////////////////////////////////////////////////////////
// Main //

//editorCtx.


////////////////////////////////////////////////////////////////////////////////////////////
// LIBS //

