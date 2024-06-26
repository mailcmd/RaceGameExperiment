class Segment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw({ ctx, color = 'red', width = 2, lineDash = false }) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if (lineDash) ctx.setLineDash(lineDash);
        ctx.stroke();
        ctx.restore();
        return this;
    }
    
    get inverseAngle() {
        const angle = -Math.atan2(this.p1.y - this.p2.y, this.p1.x - this.p2.x);
        return standarizeAngle2M(angle);
    }
    get angle() {
        const angle = -Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
        return standarizeAngle2M(angle);
    }
  
    get length() {
        return Point.distance(this.p1, this.p2);
    }
    
    equalTo(s) {
        return this == s || (this.p1.equalTo(s.p1) && this.p2.equalTo(s.p2)) || (this.p1.equalTo(s.p2) && this.p2.equalTo(s.p1));
    }
    
    intersectionWith(s) {
        return Segment.getIntersection(this, s);
    }
    
    midpoint() {
        return new Point( (this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2 );
    }

    slope() {
        return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
    }
    
    angleWidth(s, minimize = false) {
        const a1 = standarizeAngle1E(this.angle);
        const a2 = standarizeAngle1E(s.angle);
        const angle = standarizeAngle1E(max(a1, a2) - min(a1, a2));
        return minimize  
            ? (angle > PI ? 2*PI - angle : angle)
            : angle;
    }

    static addCurve(s1, s2, { granularity = 6, amplitude = 20 } = {}) {
        while (s1.length < amplitude || s2.length < amplitude) {
            amplitude /= 2;            
        }         

        const a1 = s1.inverseAngle; 
        const a2 = s2.angle; 
        const pIntersect = Segment.getIntersection(s1, s2);
        if (!pIntersect) return [];

        const p1 = pIntersect.translate(a1, amplitude);
        const p2 = pIntersect.translate(a2, amplitude);

        const p1a = standarizeAngle2M(s1.angle + PI/2);
        const p2a = standarizeAngle2M(s2.angle + PI/2);
        
        const center = Segment.getIntersection( (new Segment(p1.translate(p1a, -100000), p1.translate(p1a, 100000))), (new Segment(p2.translate(p2a, -100000), p2.translate(p2a, 100000))) );
        const radius = p1.distanceTo(center);

        let c1 = standarizeAngle1E(center.angleTo(p1));
        let c2 = standarizeAngle1E(center.angleTo(p2));        
        
        let step;
        if (c1 > c2) {
            step = (standarizeAngle2M(c2 - c1)) / (granularity);        
        } else {
            step = (standarizeAngle2M(c2 - c1)) / (granularity);                
        }

        let c = c1 + step;

        const newPoints = [ p1 ];                 
        for (let i = 0; i < granularity-1; i++) {            
            newPoints.push( center.translate(c, radius) );
            c += step;
        }
        newPoints.push( p2 );
        
        const newSegments = [ new Segment( s1.p1, newPoints[0]) ];
        for (let i = 0; i < newPoints.length-1; i++) {
            newSegments.push( new Segment( newPoints[i], newPoints[i+1] ) );
        }
        newSegments.push( new Segment( newPoints[newPoints.length-1], s2.p2) );

        return newSegments;
    }

    static getIntersection(s1, s2) {
        const [ A, B, C, D ] = [ s1.p1, s1.p2, s2.p1, s2.p2 ];
        const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
        const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

        const eps = 0.001;
        if (Math.abs(bottom) > 0) {
            const t = tTop / bottom;
            const u = uTop / bottom;
            if (t >= 0-eps && t <= 1+eps && u >= 0-eps && u <= 1+eps) {
                return new Point(
                    lerp(A.x, B.x, t),
                    lerp(A.y, B.y, t)                    
                );
            }
        }
        return null;
    }
}