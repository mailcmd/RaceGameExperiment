class Road {
    constructor(world, { roadPoints, roadWidth = 50 }) {
        this.world = world;
        this.leftSegments = [];
        this.rightSegments = [];

        const leftPoints = [];
        const rightPoints = [];
        const rightSegments = [];
        for (let i = 0; i < roadPoints.length; i++) {
            const nextPoint = i == roadPoints.length - 1 
                ? roadPoints[0]
                : roadPoints[i+1];
            const nextAngle = Point.getAngle(roadPoints[i], nextPoint);
            const angle = nextAngle + Math.PI / 2;            
            const p1 = roadPoints[i].project(roadWidth, angle);
            const p2 = nextPoint.project(roadWidth, angle);
            leftPoints.push( 
                p1, p2
            );
            const p3 = roadPoints[i].project(roadWidth, angle + Math.PI);
            const p4 = nextPoint.project(roadWidth, angle + Math.PI);
            rightPoints.push( 
                p3, p4
            );
        }

        let newSegments;
        
        // Left side segments
        for (let i = 0; i < leftPoints.length-1; i++) {
            this.leftSegments.push(
                new Segment( leftPoints[i], leftPoints[i+1] )
            );    
        }
        this.leftSegments.push(
            new Segment( leftPoints[leftPoints.length-1], leftPoints[0] )
        );    

        for (let i = 0; i < this.leftSegments.length-1; i++) {
            newSegments = Segment.addCurve(this.leftSegments[i], this.leftSegments[i+1]); //, { granularity: 3, amplitude: 20 } ));
            if (!newSegments.length) continue;
            this.leftSegments.splice(i, 2, ...newSegments);
            i += newSegments.length-2;
        }
        newSegments = Segment.addCurve(this.leftSegments[ this.leftSegments.length-1 ], this.leftSegments[ 0 ]); //, { granularity: 3, amplitude: 20 } ));               
        this.leftSegments.splice(this.leftSegments.length-1, 1, ...newSegments);
        this.leftSegments.shift();


        // Right side segments
        for (let i = 0; i < rightPoints.length-1; i+=2) {
            rightSegments.push(
                new Segment( rightPoints[i], rightPoints[i+1] )
            );
        }

        for (let i = 0; i < rightSegments.length; i++) {
            const prevSeg = i == 0 ? rightSegments[rightSegments.length-1] : rightSegments[i-1];
            const curSeg = rightSegments[i];
            const nextSeg = i == rightSegments.length-1 ? rightSegments[0] : rightSegments[i+1];

            const p1 = Segment.getIntersection( curSeg, prevSeg);
            const p2 = Segment.getIntersection( curSeg, nextSeg);

            this.rightSegments.push(new Segment(p1, p2));
        }
        
        for (let i = 0; i < this.rightSegments.length-1; i++) {
            newSegments = Segment.addCurve(this.rightSegments[i], this.rightSegments[i+1]); //, { granularity: 3, amplitude: 20 } ));
            if (!newSegments.length) continue;
            this.rightSegments.splice(i, 2, ...newSegments);
            i += newSegments.length-2;
        }
        newSegments = Segment.addCurve(this.rightSegments[ this.rightSegments.length-1 ], this.rightSegments[ 0 ]); //, { granularity: 3, amplitude: 20 } ));               
        this.rightSegments.splice(this.rightSegments.length-1, 1, ...newSegments);
        this.rightSegments.shift();
        
    }

    draw() {

        this.world.ctx.beginPath();
        this.world.ctx.moveTo(this.leftSegments[0].p1.x, this.leftSegments[0].p1.y);
        for (let i = 0; i < this.leftSegments.length-1; i++) {
            this.world.ctx.lineTo(this.leftSegments[i].p2.x, this.leftSegments[i].p2.y);
            this.world.ctx.lineTo(this.leftSegments[i+1].p1.x, this.leftSegments[i+1].p1.y);
        }                
        this.world.ctx.lineTo(this.leftSegments[0].p1.x, this.leftSegments[0].p1.y);
        this.world.ctx.closePath();
        this.world.ctx.fillStyle = roadColor;
        this.world.ctx.fill();
                
        this.world.ctx.strokeStyle = roadColor;
        this.world.ctx.lineWidth = 10;
        this.world.ctx.stroke();
        this.world.ctx.strokeStyle = roadSignals;
        this.world.ctx.lineWidth = 4;
        this.world.ctx.stroke();
        
        this.world.ctx.beginPath();
        this.world.ctx.lineTo(this.rightSegments[0].p1.x, this.rightSegments[0].p1.y);
        for (let i = 0; i < this.rightSegments.length-1; i++) {
            this.world.ctx.lineTo(this.rightSegments[i].p2.x, this.rightSegments[i].p2.y);
            this.world.ctx.lineTo(this.rightSegments[i+1].p1.x, this.rightSegments[i+1].p1.y);
        }                
        this.world.ctx.lineTo(this.rightSegments[0].p1.x, this.rightSegments[0].p1.y);

        this.world.ctx.closePath();
        this.world.ctx.save();
        this.world.ctx.globalCompositeOperation = 'destination-out';
        this.world.ctx.fill();
        this.world.ctx.restore();

        this.world.ctx.strokeStyle = roadColor;
        this.world.ctx.lineWidth = 10;
        this.world.ctx.stroke();
        this.world.ctx.strokeStyle = roadSignals;
        this.world.ctx.lineWidth = 4;
        this.world.ctx.stroke();
    }
}