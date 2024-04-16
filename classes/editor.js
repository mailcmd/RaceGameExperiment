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
        this.pointHovered = null;
        this.segmentHovered = null;
        this.segmentHoveredPoint = null;
        this.dragging = false;
        this.selected = new Point(0, 0);

        this.#addEventListeners();
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const segments = this.getSegments();
        if (this.points.length == 1) {
            this.points[0].draw({ 
                ctx: this.ctx,
                color: this.points[0] == this.selected || this.points[0] == this.pointHovered ? '#c80000' : 'black',
                double: this.points[0] == this.selected 
            });
            return;
        }
        for (let i = 0; i < segments.length; i++) {
            segments[i].draw({ 
                ctx: this.ctx, 
                width: 1, 
                color: this.segmentHovered && segments[i].equalTo(this.segmentHovered) ? '#c80000' : '#555', 
                lineDash: true 
            });
            segments[i].p1.draw({ 
                ctx: this.ctx,
                color: segments[i].p1 == this.selected || segments[i].p1 == this.pointHovered ? '#c80000' : 'black',
                double: segments[i].p1 == this.selected 
            });
            if (i == segments.length-1) {
                segments[i].p2.draw({  
                    ctx: this.ctx,
                    color: segments[segments.length-1].p2 == this.selected || segments[segments.length-1].p2 == this.pointHovered ? '#c80000' : 'black',
                    double: segments[segments.length-1].p2 == this.selected 
                });
            }
        }
        if (this.segmentHoveredPoint) {
            this.segmentHoveredPoint.draw({ctx: this.ctx, color: 'rgba(0,0,150, 0.5)', radius: 7, double: true });
        }
    }

    addPoint({x, y}) {
        this.points.push( new Point(x, y) );
    }

    insertPoint(point, segment) {
        const segments = this.getSegments();
        for (let i = 0; i < segments.length; i++) {
            if (segment.equalTo(segments[i])) {
                this.points.splice(i+1, 0, point);
                return i;
            }
        }
        return -1;
    }

    removePoint(point) {
        this.points.splice(this.points.findIndex( p => p == point), 1);
    }

    select(point) {
        this.selected = point;
    }
    
    getSegments() {
        const segments = [];
        for (let i = 1; i < this.points.length; i++) {
            segments.push( new Segment(this.points[i-1], this.points[i]) );
        }
        if (this.points.length > 2) {
            segments.push( new Segment(this.points[this.points.length-1], this.points[0]) );
        }
        return segments;
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
        document.oncontextmenu = function(e){e.preventDefault()};
    }

    #handleMouseMove(evt) {
        this.mouse = new Point(evt.offsetX, evt.offsetY);
        this.pointHovered = getNearestPoint(this.mouse, this.points, 10);
        if (!this.dragging && !this.pointHovered)  {
            [ this.segmentHovered, this.segmentHoveredPoint ] = getNearestSegment(this.mouse, this.getSegments(), 20);
        } else {
            [ this.segmentHovered, this.segmentHoveredPoint ] = [null, null];
        }
        if (this.dragging == true) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }    
    }    

    #handleMouseDown(evt) {
        if (evt.button == 2) { // right click
            if (this.selected) {
                this.selected = null;
             } else if (this.pointHovered) {
                this.removePoint(this.pointHovered);
             }
        }
        if (evt.button == 0) { // left click
            if (this.pointHovered) {
                this.select(this.pointHovered);
                this.dragging = true;
                return;
            } else if (this.segmentHoveredPoint) {
                this.insertPoint(this.segmentHoveredPoint, this.segmentHovered); 
                this.select(this.segmentHoveredPoint);
                return;
            }
            this.addPoint(this.mouse);
        }
    }

    #handleMouseUp(evt) {
        if (evt.button == 2) { // right click
        }
        if (evt.button == 0) { // left click
            this.dragging = false;
        }
    }


}