class Road {
    constructor({ roadPoints, roadWidth }) {
        this.points = roadPoints;
        this.width = roadWidth;

        this.poly = new Polygon(this.points);        

        this.segments = [];
        this.polys = [];        

        const outsidePoints = [];
        const insidePoints = [];
        for (let i = 1; i <= this.points.length; i++) {
            const p1 = this.points[i - 1];
            const p2 = this.points[i % this.points.length];
            const p3 = this.points[(i + 1) % this.points.length];

            const s1 = new Segment(p2, p1);
            const s2 = new Segment(p2, p3);
            
            const a1 = standarizeAngle1E(s1.angle);
            const a2 = standarizeAngle1E(s2.angle);
            const ma = s1.angleWidth(s2) ;
            
            const angle = ma > PI   
                ? standarizeAngle1E(max(a1, a2) + (2*PI - ma)/2)
                : standarizeAngle1E(min(a1, a2) + ma / 2);
            
            const width = (this.width / 2) * (PI / abs(standarizeAngle2M(ma)))**0.5;
            
            const np1 = p2.translate(angle, -width);
            const np2 = p2.translate(angle, width);
            
            if (this.poly.containsPoint(np1)) {
                insidePoints.push( np1 );
                outsidePoints.push( np2 );
            } else {
                insidePoints.push( np2 );
                outsidePoints.push( np1 );            
            }         
        }

        this.insidePoly = new Polygon( insidePoints );
        this.outsidePoly = new Polygon( outsidePoints );        

        let newSegments;

        const insideSegments = this.insidePoly.segments;
        for (let i = 0; i < insideSegments.length-1; i++) {
            newSegments = Segment.addCurve(insideSegments[i], insideSegments[i+1], { amplitude: 60 }); 
            if (!newSegments.length) continue;
            insideSegments.splice(i, 2, ...newSegments);
            i += newSegments.length-2;
        }
        newSegments = Segment.addCurve(insideSegments[ insideSegments.length-1 ], insideSegments[ 0 ], { amplitude: 60 });
        insideSegments.splice(insideSegments.length-1, 1, ...newSegments);
        insideSegments.shift();        
        this.insidePoly.points = [ insideSegments[0].p1, ...insideSegments.map( s => s.p2 ) ];

        const outsideSegments = this.outsidePoly.segments;
        for (let i = 0; i < outsideSegments.length-1; i++) {  
            newSegments = Segment.addCurve(outsideSegments[i], outsideSegments[i+1], { amplitude: 60 }); 

            if (!newSegments.length) continue;
            outsideSegments.splice(i, 2, ...newSegments);
            i += newSegments.length-2;
        }
        newSegments = Segment.addCurve(outsideSegments[ outsideSegments.length-1 ], outsideSegments[ 0 ], { amplitude: 60 });
        outsideSegments.splice(outsideSegments.length-1, 1, ...newSegments);
        outsideSegments.shift();        
        this.outsidePoly.points = [ outsideSegments[0].p1, ...outsideSegments.map( s => s.p2 ) ];

        const segments = this.poly.segments;
        for (let i = 0; i < segments.length-1; i++) {  
            newSegments = Segment.addCurve(segments[i], segments[i+1], { amplitude: 60 }); 

            if (!newSegments.length) continue;
            segments.splice(i, 2, ...newSegments);
            i += newSegments.length-2;
        }
        newSegments = Segment.addCurve(segments[ segments.length-1 ], segments[ 0 ], { amplitude: 60 });
        segments.splice(segments.length-1, 1, ...newSegments);
        segments.shift();        
        this.poly.points = [ segments[0].p1, ...segments.map( s => s.p2 ) ];

    }

    draw({ ctx }) {
        this.outsidePoly.draw({ ctx, color: roadColor, fill: true });
        this.outsidePoly.draw({ ctx, color: roadColor, width: 10 }) ;
        this.outsidePoly.draw({ ctx, color: roadSignals, width: 6 }) ;

        this.insidePoly.draw({ ctx, subtract: true, color: 'red' });
        this.insidePoly.draw({ ctx, color: roadColor, width: 10 }) ;
        this.insidePoly.draw({ ctx, color: roadSignals, width: 6 }) ;
        
        this.poly.segments.forEach( s => s.draw({ ctx, color: roadSignals, width: 6, lineDash: [12,0,20] }) );
    }

    #generatePolygon(segment, { width, roundness = 10}) {
        const { p1, p2 } = segment;

        const radius = width / 2;
        const alpha = -p1.subtract(p2).angle;
        const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;

        const points = [];
        const step = Math.PI / Math.max(1, roundness);
        const eps = step / 2;
        for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
            points.push(p1.translate(i, -radius));
        }
        for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
            points.push(p2.translate(Math.PI + i, -radius));
        }

        return new Polygon(points);     
    }
    
}

/*


        this.leftSegments = [];
        this.rightSegments = [];

        const leftPoints = [];
        const rightPoints = [];
        for (let i = 0; i < points.length; i++) {
            const nextPoint = i == points.length - 1 
                ? points[0]
                : points[i+1];
            
            const nextAngle = points[i].angleTo(nextPoint);
            const angle = nextAngle + Math.PI / 2;            
            const p1 = points[i].translate(angle, width);
            const p2 = nextPoint.translate(angle, width);
            
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
            
            const p3 = points[i].translate(angle + Math.PI, width);
            const p4 = nextPoint.translate(angle + Math.PI, width);            

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
        const rightSegments = [];
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

        for (let i = 0; i < rightSegments.length; i++) {
            const prevSeg = i == 0 ? rightSegments[rightSegments.length-1] : rightSegments[i-1];
            const curSeg = rightSegments[i];
            const nextSeg = i == rightSegments.length-1 ? rightSegments[0] : rightSegments[i+1];
            const p1 = Segment.getIntersection( curSeg, prevSeg); //.draw({ ctx: this.world.ctx, color: 'white' });
            const p2 = Segment.getIntersection( curSeg, nextSeg); //.draw({ ctx: this.world.ctx, color : 'red' });
            this.rightSegments.push((new Segment(p1, p2)));
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



////////////////

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
        this.world.ctx.lineWidth = 14;
        this.world.ctx.stroke();
        this.world.ctx.strokeStyle = roadSignals;
        this.world.ctx.lineWidth = 6;
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
        this.world.ctx.lineWidth = 14;
        this.world.ctx.stroke();
        this.world.ctx.strokeStyle = roadSignals;
        this.world.ctx.lineWidth = 6;
        this.world.ctx.stroke();        


    

*/