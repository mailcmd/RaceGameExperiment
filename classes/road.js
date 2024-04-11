class Road {
    constructor(world, { roadPoints, roadWidth }) {
        this.world = world;
        this.leftSegments = [];
        this.rightSegments = [];

        const leftPoints = [];
        const rightPoints = [];
        for (let i = 0; i < roadPoints.length; i++) {
            const nextPoint = i == roadPoints.length - 1 
                ? roadPoints[0]
                : roadPoints[i+1];
            
            const nextAngle = roadPoints[i].angleTo(nextPoint);
            const angle = nextAngle + Math.PI / 2;            
            const p1 = roadPoints[i].translate(angle, roadWidth);
            const p2 = nextPoint.translate(angle, roadWidth);
            
            if (i > 0 && Segment.getIntersection(
                new Segment(p1, p2),
                new Segment(leftPoints[leftPoints.length-2], leftPoints[leftPoints.length-1])
            )) { 
                leftPoints.push( 
                    p2
                );                
            } else {
                leftPoints.push( 
                    p1, p2
                );
            }
            
            const p3 = roadPoints[i].translate(angle + Math.PI, roadWidth);
            const p4 = nextPoint.translate(angle + Math.PI, roadWidth);            

            rightPoints.push( 
                p3, p4
            );
        }

        let newSegments;
        
        // Left side segments
        for (let i = 0; i < leftPoints.length-1; i++) {
            this.leftSegments.push(
                (new Segment( leftPoints[i], leftPoints[i+1] ))
            );    
        }
        this.leftSegments.push(
            (new Segment( leftPoints[leftPoints.length-1], leftPoints[0] ))
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
        let rightSegments = [];
        for (let i = 0; i < rightPoints.length-1; i+=2) {
            const newSegment = new Segment( rightPoints[i], rightPoints[i+1] );
            if (i > 0 && !Segment.getIntersection(newSegment, rightSegments[rightSegments.length-1])) {
                rightSegments.push(
                    (new Segment(rightSegments[rightSegments.length-1].p2, newSegment.p1))
                );                
            }            
            rightSegments.push(
                newSegment
            );
        }

//        this.rightSegments = rightSegments;
        const temp = [];
        for (let i = 0; i < rightSegments.length; i++) {
            const prevSeg = i == 0 ? rightSegments[rightSegments.length-1] : rightSegments[i-1];
            const curSeg = rightSegments[i];
            const nextSeg = i == rightSegments.length-1 ? rightSegments[0] : rightSegments[i+1];

            const p1 = Segment.getIntersection( curSeg, prevSeg);//.draw(raceCtx, 'white');
            const p2 = Segment.getIntersection( curSeg, nextSeg);//.draw(raceCtx, 'red');
            temp.push((new Segment(p1, p2)));
        }
        
        this.rightSegments = temp;

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