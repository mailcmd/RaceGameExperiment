class Polygon {
    constructor(points) {
        this.points = points;
    }

    get segments() {
        const segments = [];
        for (let i = 1; i <= this.points.length; i++) {
            segments.push(
                new Segment(this.points[i - 1], this.points[i % this.points.length])
            );
        }
        return segments;
    }
     
    unionWidth(poly) {
        return Polygon.union([ this, poly ]);
    }

    containsSegment(seg) {
        const midpoint = Point.average(seg.p1, seg.p2);
        return this.containsPoint(midpoint);
    }

    containsPoint(point) {
        const outerPoint = new Point(-10000, -10000);
        let intersectionCount = 0;
        for (const seg of this.segments) {
            const int = getIntersection(outerPoint, point, seg.p1, seg.p2);
            if(int){
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1;
    }
    
    drawSegments({ ctx, color = roadColor, width = 5 }) {
        for (const seg of this.segments) {
            seg.draw({ ctx, color , width });
        }
    }

    draw({
            ctx,
            color = 'red', 
            width = 2, 
            fill = false,
            subtract = false
        }) {
    
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        if (subtract) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fill();
            ctx.restore();
            return;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        }
        ctx.restore();
    }

    static union(polys) {
        Polygon.multiBreak(polys);
        const keptSegments = [];
        for (let i = 0; i < polys.length; i++) {
            for (const seg of polys[i].segments) {
                let keep = true;
                for (let j = 0; j < polys.length; j++) {
                    if (i != j) {
                        if (polys[j].containsSegment(seg)) {
                            keep = false;
                            break;
                        }
                    }
                }
                if (keep) {
                    keptSegments.push(seg);
                }
            }
        }
        return keptSegments;
    }

    static multiBreak(polys) {
        for (let i = 0; i < polys.length - 1; i++) {
            for (let j = i + 1; j < polys.length; j++) {
                Polygon.break(polys[i], polys[j]);
            }
        }
    }

    static break(poly1, poly2) {
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;
        for (let i = 0; i < segs1.length; i++) {
            for (let j = 0; j < segs2.length; j++) {
                const int = getIntersection(
                    segs1[i].p1,
                    segs1[i].p2,
                    segs2[j].p1,
                    segs2[j].p2
                );

                if (int && int.offset != 1 && int.offset != 0) {
                    const point = new Point(int.x, int.y);
                    let aux = segs1[i].p2;
                    segs1[i].p2 = point;
                    segs1.splice(i + 1, 0, new Segment(point, aux));
                    aux = segs2[j].p2;
                    segs2[j].p2 = point;
                    segs2.splice(j + 1, 0, new Segment(point, aux));
                }
            }
        }
    }

}