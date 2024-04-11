class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, color = 'red') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill()
        return this;
    }
    angleTo(p) {
        return Point.getAngle(this, p);
    }
    distanceTo(p) {
        return Point.distance(this, p);
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
}