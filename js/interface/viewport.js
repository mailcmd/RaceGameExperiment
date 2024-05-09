class Viewport {
    constructor({ 
            world,
            ctx,
            centerX = 0,
            centerY = 0,
            angle = 0,
            mode = STATIC,
            showFPS = true,
            width,
            height
        }) {

        this.canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = terrainColor;
        this.canvas.style.position = 'fixed';
        this.canvas.style.border = '1px solid black';
        this.canvas.height = height;
        this.canvas.width = width;
        this.canvas.style.left = ((window.innerWidth - this.canvas.width) / 2) + 'px';
        this.canvas.style.top = ((window.innerHeight - this.canvas.height) / 2) + 'px';
        document.body.insertBefore(this.canvas, document.querySelector('#pause'));
        this.ctx = this.canvas.getContext('2d');        

        this.world = world;
        this.angle = angle;
        this.mode = mode;
        this.showFPS = showFPS;
        this.setCenter(centerX, centerY, angle, true);
    }
    
    setMode(mode) {
        this.mode = mode;
    }

    rotate(angle) {
        this.angle = angle;
    }
    moveCenter(offsetX = 0, offsetY = 0) {
        this.x += offsetX;
        this.y += offsetY;
    }
    setCenter(x, y, angle = 0, force = false) {
        if (!force && this.mode == FULLSCREEN) return;
        this.x = x; 
        this.y = y; 
        this.rotate(angle);
    }

    display() {

        if (this.mode == ROTATE) {
            const width = (this.ctx.canvas.width**2 + this.ctx.canvas.height**2)**0.5;
            const height = width;

            this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);        
            
            this.ctx.save();
            
            this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
            this.ctx.rotate(this.angle);

            this.ctx.drawImage(world.canvas, 
                this.x - width/2, this.y - height/2, width, height,
                -width/2, -height/2, width, height
            );
        } else { // STATIC or FULLSCREEN
            this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);        
            this.ctx.putImageData(
                this.world.getImageData(this.x - this.ctx.canvas.width/2, this.y - this.ctx.canvas.height/2, this.ctx.canvas.width, this.ctx.canvas.height), 
                0, 0
            );
        }       

        this.ctx.restore();

        if (this.showFPS) this.displayFPS();        
    }
    
    displayFPS() {
        this.ctx.font = '14px Courier';
        this.ctx.strokeText("FPS: "+Math.round(1000/deltaTime), 5, 15);        
    }

}