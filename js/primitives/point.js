class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw({ ctx, color = 'red', radius = 4, double = false}) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill()
        if (double) {
            ctx.arc(this.x, this.y, radius*1.5, 0, Math.PI*2);
            ctx.strokeStyle = color;
            ctx.setLineDash([1,0,1]);
            ctx.stroke();
        }
        ctx.restore();
        return this;
    }
    
    get angle() {
        return Point.getAngle(this, new Point(0,0));
    }
    
    angleTo(p) {
        return Point.getAngle(this, p);
    }
    distanceTo(p) {
        return Point.distance(this, p);
    }
    equalTo(p) {        
        return this == p || (this.x == p.x && this.y == p.y);
    }
    subtract(p) {
        return Point.subtract(this, p);
    }
    average(p) {
        return Point.average(this, p);
    }

    project(length, angle) {
        return new Point(
            this.x + length * Math.cos(angle),
            this.y - length * Math.sin(angle)
        );
    }
    
    translate(angle, length) {
        return this.project(length, angle);
    }

    // static
    static getAngle(p1, p2) {
        return standarizeAngle2M(-Math.atan2(p2.y-p1.y, p2.x-p1.x));
    }
    
    static distance(p1, p2) {
        return ((p2.y-p1.y)**2 + (p2.x-p1.x)**2)**(0.5);
    } 
    
    static subtract(p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }
    
    static average(p1, p2) {
        return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }

}