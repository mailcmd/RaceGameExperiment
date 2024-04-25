class Minimap {
    constructor({
        world,
        width,
        height,
        position = 'BOTTOM_RIGHT',
        visible = true
    }) {
    
        this.world = world;
        this.width = width ?? window.innerWidth * 0.1;
        this.height = height ?? window.innerHeight * 0.1;
        this.position = position;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.id = 'minimapCanvas';
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.border = '1px solid black';
        this.canvas.style.boxShadow = 'rgb(0, 61, 20) 0px 0px 5px';
        this.canvas.style.backgroundColor = terrainColor;        
        this.canvas.style.position = 'fixed';
        this.canvas.style.zIndex = '1';
        this.canvas.style.display = visible ? 'block' : 'none';
        this.position.split(/[ ,_]+/).map( p => p.toLowerCase() ).forEach( p => this.canvas.style[p] = '6px' ); 
        
        this.ctx.globalCompositeOperation = '';
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.globalAlpha = 1;
        
        document.body.appendChild(this.canvas);                
    }

    show() {
        this.canvas.style.display = 'block';
    }   
     
    hide() {
        this.canvas.style.display = 'none';
    }    
    
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(world.bgImage, 0,0, world.width, world.height, 0,0, this.width, this.height);
        world.dynamicEntities.forEach( e => {
            this.ctx.beginPath();
            this.ctx.arc(e.x * this.width / world.width, e.y * this.height / world.height, 2, 0, PI*2);
            this.ctx.fillStyle = e.color ?? getRandomColor;
            this.ctx.fill();
        });        
    }

}