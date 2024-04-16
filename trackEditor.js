
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

addPoint() {
    roadPoints()
}

handleMouseMove(evt) {
    this.mouse = new Point(evt.offsetX, evt.offsetY);
    this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
    if (this.dragging == true) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
    }
}

handleMouseDown(evt) {
    if (evt.button == 2) { // right click
        if (this.selected) {
            this.selected = null;
         } else if (this.hovered) {
            this.#removePoint(this.hovered);
         }
    }
    if (evt.button == 0) { // left click
        if (this.hovered) {
            this.#select(this.hovered);
            this.dragging = true;
            return;
        }
        this.graph.addPoint(this.mouse);
        this.#select(this.mouse);
        this.hovered = this.mouse;
    }
}