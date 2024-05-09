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

