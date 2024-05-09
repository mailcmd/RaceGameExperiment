class Sensor {
    constructor(car, rayCount = 5) {
        this.car = car;
        this.rayCount = rayCount;
        this.rayLength = 240;
        this.raySpread = Math.PI / 0.9 ;

        this.rays = [];
        this.readings = [];
    }

    update(traffic) {
        this.#castRays();
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push( 
                this.#getReadings(this.rays[i], traffic)
            );
        }
    }

    draw({ctx}) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i].p2;
            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo( this.rays[i].p1.x, this.rays[i].p1.y );
            ctx.lineTo( end.x, end.y );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.moveTo( this.rays[i].p2.x, this.rays[i].p2.y );
            ctx.lineTo( end.x, end.y );
            ctx.stroke();
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount-2; i++) {
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount-3)
            ) + this.car._angle;
 
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }
            this.rays.push( new Segment(start, end) );
        }
        
        let rayAngle = Math.PI - Math.PI / 16 + this.car._angle;
        let start = { x: this.car.x, y: this.car.y };
        let end = {
            x: this.car.x - Math.sin(rayAngle) * this.rayLength,
            y: this.car.y - Math.cos(rayAngle) * this.rayLength
        }
        this.rays.push( new Segment(start, end) );
        
        rayAngle = Math.PI + Math.PI / 16 + this.car._angle;
        start = { x: this.car.x, y: this.car.y };
        end = {
            x: this.car.x - Math.sin(rayAngle) * this.rayLength,
            y: this.car.y - Math.cos(rayAngle) * this.rayLength
        }
        this.rays.push( new Segment(start, end) );
    }

    #getReadings(ray, traffic) {
        let touches = [];
        let segments = this.car.road.insidePoly.segments;
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const touch = getIntersection(ray, seg);
            if (touch) {
                touches.push(touch);
            }
        }
        segments = this.car.road.outsidePoly.segments;
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            const touch = getIntersection(ray, seg);
            if (touch) {
                touches.push(touch);
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0], ray[1],
                    poly[j], poly[(j+1) % poly.length]
                );
                if (value) {
                    touches.push(value);
                }
            }
        }

        if (touches.length > 0) {
            return touches.slice(1).reduce( (c, t) => t.offset < c.offset ? t : c , touches[0]);
            //const offsets = touches.map( t => t.offset );
            //const minOffset = Math.min(...offsets);
            //return touches.find( t => t.offset == minOffset );
        }
        return null;
    }
}