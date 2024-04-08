class Road {
    constructor(world, { roadPoints, roadWidth = 50 }) {
        this.world = world;
        this.leftSegments = [];
        this.rightSegments = [];
        const leftPoints = [];
        const rightPoints = [];
        for (let i = 0; i < roadPoints.length; i++) {
            const prevPoint = i == 0 
                ? roadPoints[roadPoints.length-1] 
                : roadPoints[i-1];
            const nextPoint = i == roadPoints.length - 1 
                ? roadPoints[0]
                : roadPoints[i+1];
            const prevAngle = Point.getAngle(roadPoints[i], prevPoint);
            const nextAngle = Point.getAngle(roadPoints[i], nextPoint);
            const angle = prevAngle - nextAngle / 2;
            leftPoints.push( 
                roadPoints[i].project(roadWidth, angle) 
            );
            rightPoints.push( 
                roadPoints[i].project(roadWidth, angle + Math.PI) 
            );
        }
        for (let i = 0; i < leftPoints.length-1; i++) {
            this.leftSegments.push(
                new Segment( leftPoints[i], leftPoints[i+1] )
            );    
            this.rightSegments.push(
                new Segment( rightPoints[i], rightPoints[i+1] )
            );    
        }
        this.leftSegments.push(
            new Segment( leftPoints[leftPoints.length-1], leftPoints[0] )
        );    
        this.rightSegments.push(
            new Segment( rightPoints[rightPoints.length-1], rightPoints[0] )
        );    
    }

    draw() {
        log(this.leftSegments)
        for (let i = 0; i < this.leftSegments.length; i++) {

            this.world.ctx.beginPath();
            this.world.ctx.moveTo(this.leftSegments[i].p1.x, this.leftSegments[i].p1.y);
            this.world.ctx.lineTo(this.leftSegments[i].p2.x, this.leftSegments[i].p2.y);
            this.world.ctx.lineTo(this.rightSegments[i].p2.x, this.rightSegments[i].p2.y);
            this.world.ctx.lineTo(this.rightSegments[i].p1.x, this.rightSegments[i].p1.y);
            this.world.ctx.closePath();
            this.world.ctx.fillStyle = 'gray';
            this.world.ctx.fill();
            this.world.ctx.strokeStyle = 'white';
            this.world.ctx.lineWidth = 2;
            this.world.ctx.stroke();
        }        
    }
}