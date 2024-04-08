class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    angleTo(p) {
        return Point.getAngle(this, p);
    }

    project(length, angle) {
        return new Point(
            this.y + length * Math.sin(angle),
            this.x + length * Math.cos(angle)
        );
    }

    // static
    static getAngle(p1, p2) {
        return Math.atan2(p2.y-p1.y, p2.x-p1.x);
    }
}