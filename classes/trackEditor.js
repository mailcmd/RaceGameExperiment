class TrackEditor {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.style.backgroundColor = terrainColor;
        this.canvas.style.position = 'fixed';
        this.canvas.style.border = '1px solid black';
        this.canvas.height = window.innerHeight*0.9;
        this.canvas.width = this.canvas.height; 
        this.canvas.style.left = ((window.innerWidth - this.canvas.width) / 2) + 'px';
        this.canvas.style.top = ((window.innerHeight - this.canvas.height) / 2) + 'px';
        this.ctx = this.canvas.getContext('2d');

        this.points = [];
        this.mouse = null;
        this.hovered = null;
        this.dragging = false;
        this.selected = new Point(0, 0);

        this.#addEventListeners();
    }

    addPoint({x, y}) {
        this.points.push( new Point(x, y) );
    }

    removePoint(point) {
        this.points.splice(this.points.findIndex( p => p == point), 1);
    }

    select(point) {
        this.selected = point;
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
    }

    #handleMouseMove(evt) {
        this.mouse = new Point(evt.offsetX, evt.offsetY);
        this.hovered = getNearestPoint(this.mouse, this.points, 10);
        if (this.dragging == true) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }    
    }

    #handleMouseDown(evt) {
        if (evt.button == 2) { // right click
            if (this.selected) {
                this.selected = null;
             } else if (this.hovered) {
                this.removePoint(this.hovered);
             }
        }
        if (evt.button == 0) { // left click
            if (this.hovered) {
                this.select(this.hovered);
                this.dragging = true;
                return;
            }
            this.addPoint(this.mouse);
            this.select(this.mouse);
            this.hovered = this.mouse;
        }
    }

    #handleMouseUp(evt) {
        if (evt.button == 2) { // right click
        }
        if (evt.button == 0) { // left click
            if (this.hovered) {
                this.select(this.hovered);
                this.dragging = true;
                return;
            }
            this.addPoint(this.mouse);
            this.select(this.mouse);
            this.hovered = this.mouse;
        }
    }


}