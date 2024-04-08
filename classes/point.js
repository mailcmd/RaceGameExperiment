class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        raceCtx.beginPath();
        raceCtx.arc(this.x, this.y, 4, 0, Math.PI*2);
        raceCtx.fillStyle = 'red';
        raceCtx.fill()
    }
    angleTo(p) {
        return Point.getAngle(this, p);
    }

    project(length, angle) {
        return new Point(
            this.x + length * Math.sin(angle),
            this.y + length * Math.cos(angle)
        );
    }

    // static
    static getAngle(p1, p2) {
        return Math.atan2(p2.y-p1.y, p2.x-p1.x);
    }
}