class Viewport {
    constructor({ 
            world,
            ctx,
            centerX = 0,
            centerY = 0
        }) {
        this.world = world;
        this.ctx = ctx;
        this.setCenter(centerX, centerY);
    }
    
    moveCenter(offsetX = 0, offsetY = 0) {
        this.x += offsetX;
        this.y += offsetY;
    }
    setCenter(x, y) {
        this.x = x; //x + this.ctx.canvas.width / 2;
        this.y = y; //y + this.ctx.canvas.height / 2;        
    }

    display() {
        this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);        
        this.ctx.putImageData(
            this.world.getImageData(this.x - this.ctx.canvas.width/2, this.y - this.ctx.canvas.height/2, this.ctx.canvas.width, this.ctx.canvas.height), 
            0,0
        );
    }
}