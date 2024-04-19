class TrackEditor {
    constructor(canvas, { hidden = false } = {}) {
        this.canvas = canvas;
        this.canvas.style.backgroundColor = terrainColor;
        this.canvas.style.position = 'fixed';
        this.canvas.style.border = '1px solid black';
        this.canvas.height = window.innerHeight*0.9;
        this.canvas.width = this.canvas.height; 
        this.canvas.style.left = ((window.innerWidth - this.canvas.width) / 2) + 'px';
        this.canvas.style.top = ((window.innerHeight - this.canvas.height) / 2) + 'px';
        this.ctx = this.canvas.getContext('2d');

        this.undoSnapshots = [];
        this.points = [];
        this.mouse = null;
        this.pointHovered = null;
        this.segmentHovered = null;
        this.segmentHoveredPoint = null;
        this.dragging = false;
        this.selected = new Point(0, 0);
        this.currentName = '';
        
        if (!hidden) {
            this.#addEventListeners();
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gridEnabled) {
            const step = this.canvas.width / gridDensity;
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.setLineDash([1,1,0]);
            this.ctx.lineWidth = 0.2;
            //this.ctx.globalCompositeOperation = 'destination-atop';
            //this.ctx.globalAlpha = 0.1;
            this.ctx.strokeStyle = 'rgb(0,0,0, 0.1)';            
            for (let x = step; x < this.canvas.width; x += step) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (let y = step; y < this.canvas.height; y += step) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
            this.ctx.restore();            
        }
        
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
                lineDash: [ 3, 0, 3 ]
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

    addUndoSnapshot() {
        this.undoSnapshots.push( this.points.slice() );
        if (this.undoSnapshots.length >= 10) this.undoSnapshots.splice(0, this.undoSnapshots.length-10); 
    }
    
    undo() {
        if (this.undoSnapshots.length > 0) {
            this.points = this.undoSnapshots.pop();
        }
    }
    
    addPoint({x, y}) {
        this.addUndoSnapshot();
        this.points.push( new Point(x, y) );
        return this.points[this.points.length-1];
    }

    insertPoint(point, segment) {
        const segments = this.getSegments();
        for (let i = 0; i < segments.length; i++) {
            if (segment.equalTo(segments[i])) {
                this.addUndoSnapshot();
                this.points.splice(i+1, 0, point);
                return i;
            }
        }
        return -1;
    }

    removePoint(point) {
        this.addUndoSnapshot();
        return this.points.splice(this.points.findIndex( p => p == point), 1);
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

    toggleGrid() {
        this.gridEnabled = !this.gridEnabled;
    }

    getNormalized() {
        return this.points.map( p => new Point(p.x / this.canvas.width, p.y / this.canvas.height) );
    }
    
    getUnnormalized(width, height) {
        const w = width ?? this.canvas.width;
        const h = height ?? (width ?? this.canvas.height);        
        return this.points.map( p => new Point(Math.ceil(p.x * w), Math.ceil(p.y * h)) );
    }
    
    getScalated(width, height = width) {
        const w = width / this.canvas.width;
        const h = height / this.canvas.height;        
        return this.points.map( p => new Point(Math.ceil(p.x * w), Math.ceil(p.y * h)) );        
    }
    
    load(data, normalized = false) {
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
        }
        this.points = data.map( p => new Point(p.x, p.y) );
        if (normalized) {
            this.points = this.getUnnormalized();
        }
    }
    
    saveToFile(e = {}) {
        if (!this.currentName || e.ctrlKey) {
            this.currentName = prompt('Ingrese el nombre', this.currentName);
        }
        if (!this.currentName) return;
        save(this.getNormalized(), this.currentName + '.json');
        localStorage.editorFileName = this.currentName;
    }
    
    loadFromFile(callback = ()=>{}) {
        const handle = function(e){
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', (ev) => {
                const result = ev.target.result;
                if (result) {
                    this.currentName = file.name.replace('.json', '');
                    this.load(result, true);
                    callback(this);
                }
            });
            reader.readAsText(file);
        };
        const input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', handle.bind(this));
        input.click();
    }
    
    #addEventListeners() {
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
        document.addEventListener('keydown', this.#handleKeyDown.bind(this));
        document.oncontextmenu = function(e){e.preventDefault()};
    }

    #handleMouseMove(evt) {
        this.mouse = new Point(evt.offsetX, evt.offsetY);
        this.pointHovered = getNearestPoint(this.mouse, this.points, 15);
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
             if (this.pointHovered) {
                 this.removePoint(this.pointHovered);
             } else {
                 this.selected = null;
             }
        }
        if (evt.button == 0) { // left click
            if (this.pointHovered) {
                this.select(this.pointHovered);
                this.dragging = true;
            } else if (this.segmentHoveredPoint) {
                this.insertPoint(this.segmentHoveredPoint, this.segmentHovered); 
                this.select(this.segmentHoveredPoint);
                this.pointHovered = this.selected;
                [ this.segmentHovered, this.segmentHoveredPoint ] = [null, null];
                this.dragging = true;
            } else {
                this.select(this.addPoint(this.mouse));
                this.pointHovered = this.selected;
            }
        }
    }

    #handleMouseUp(evt) {
        if (evt.button == 2) { // right click
        }
        if (evt.button == 0) { // left click
            this.dragging = false;
        }
    }
    
    #handleKeyDown(evt) {
        if (evt.ctrlKey && evt.key == 'z') {
            evt.preventDefault();
            this.undo();
        }
    }

}