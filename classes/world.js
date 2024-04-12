class World {
    constructor({ roadPoints }) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.id = 'worldCanvas';
        this.canvas.width = window.innerWidth * 5;
        this.canvas.height = window.innerHeight * 5;                
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;

        this.entitiesCanvas = document.createElement('canvas');
        this.entitiesCtx = this.canvas.getContext("2d");
        this.entitiesCanvas.id = 'entitiesCanvas';

        this.bgImage = null;
        
        this.entities = [];

        this.road = new Road(this, {
            roadPoints: roadPoints,
            roadWidth: roadWidth
        });
        
        this.#renderizeBG();
    }        

    addEntity(entity) {
        this.entities.push(entity);        
    }
    
    update() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(this.bgImage, 0, 0);
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
            this.entities[i].draw({ ctx: this.ctx });
        }
    }
    
    getImageData(x, y, w, h) {
        return this.ctx.getImageData(x, y, w, h);
    }

    #renderizeBG() {
        this.road.draw();
        this.bgImage = imagedata2image(this.ctx.getImageData(0, 0, this.width, this.height));
    }
}