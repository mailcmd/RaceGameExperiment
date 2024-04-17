class Viewport {
    constructor({ 
            world,
            ctx,
            centerX = 0,
            centerY = 0,
            angle = 0,
            mode = STATIC,
            showFPS = true
        }) {
        this.world = world;
        this.ctx = ctx;
        this.angle = angle;
        this.mode = mode;
        this.showFPS = showFPS;
        this.setCenter(centerX, centerY, angle);
    }

    rotate(angle) {
        this.angle = angle;
    }
    moveCenter(offsetX = 0, offsetY = 0) {
        this.x += offsetX;
        this.y += offsetY;
    }
    setCenter(x, y, angle = 0) {
        this.x = x; 
        this.y = y; 
        this.rotate(angle);
    }

    display() {
        let width = this.ctx.canvas.width;
        let height = this.ctx.canvas.height;
        let x0 = 0;
        let y0 = 0;

        if (this.mode == ROTATE) {
            width = (width**2 + height**2)**0.5;
            height = width;

            this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);        
            this.ctx.save();
            
            this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
            this.ctx.rotate(this.angle);

            x0 = - width/2 ;
            y0 = - height/2;
        } else {
            this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);        
        }       

        this.ctx.drawImage(world.canvas, 
            this.x - width/2, this.y - height/2, width, height,
            x0, y0, width, height
        );

        this.ctx.restore();
        if (this.showFPS) this.displayFPS();
        
    }
    
    displayFPS() {
        this.ctx.font = '14px Courier';
        this.ctx.strokeText("FPS: "+Math.round(1000/deltaTime), 5, 15);        
    }

    // display() {
    //     this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);        
        
    //     let width = this.ctx.canvas.width;
    //     let height = this.ctx.canvas.height;

    //     if (this.mode == ROTATE) {
    //         width = (width**2 + height**2)**0.5;
    //         height = width;
    //         this.ctx.restore();
    //         this.ctx.save();
    //         this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
    //         this.ctx.rotate(this.angle);
    //         this.ctx.translate(-this.ctx.canvas.width/2, -this.ctx.canvas.height/2);
    //     }        
    //     this.ctx.drawImage(world.canvas, 
    //         this.x - this.ctx.canvas.width/2, this.y - this.ctx.canvas.height/2, this.ctx.canvas.width, this.ctx.canvas.height,
    //         //this.x - cutWidth/2, this.y - cutHeight/2, cutWidth, cutHeight,
    //         0,0, this.ctx.canvas.width, this.ctx.canvas.height
    //         //0, 0, cutWidth, cutHeight
    //     );
    //     if (this.showFPS) {
    //         this.ctx.font = '14px Courier';
    //         this.ctx.strokeText("FPS: "+Math.round(1000/deltaTime), 5, 15);
    //     }
    // }


}