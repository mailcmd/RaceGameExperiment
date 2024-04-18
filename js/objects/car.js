class Car {
    constructor({ 
            x, y, width, height, 
            controlType = CPU, 
            controlMode = STATIC,
            maxSpeed = maxSpeedCars, 
            color = 'blue', 
            model,
            road = null,
            sensorsCount = 5
        }) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controlMode = controlMode;
        this.controlType = controlType;
        this.sensorsCount = sensorsCount;
        this.color = color;
        this.road = road;
        
        this.maxSpeed = maxSpeed;
        this.rotateSpeed = maxSpeed / 250;
        this.saveMaxSpeed = maxSpeed;
        this.distance = 0;
        this.idiotCounter = 0;
        this.speed = 0;
        this.overpassedCars = 0;
        this.acceleration = 45;
        this.friction = 5;
        this._angle = 0;
        this.angle = road ? road.points[0].angleTo(road.points[1]) : 0;        
        this.damaged = false;
        this.fitness = 0;
        this.score = 0;
        this.updateCounter = 0;
        
        this.useBrain = controlType == CPU;

        if (this.useBrain) {
            this.sensor = new Sensor(this, this.sensorsCount);
            const center = this.sensorsCount % 2 == 1 ? 4 : 5;
            const sides = this.sensorsCount - center + 1;        
            this.brain = new NeuralNetwork(center, sides);
            if (model) {
                this.brain.load(model);
            }
        } else {
            this.controls = new Controls(controlType, this);
        }        

        this.img = new Image();
        this.mask = document.createElement('canvas');
        this.mask.width = this.width;
        this.mask.height = this.height;
        
        const maskCtx = this.mask.getContext('2d');

        this.img.onload = () => {
            maskCtx.fillStyle = this.color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();
            maskCtx.globalCompositeOperation = 'destination-atop';
            maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
        }

        this.img.src = 'images/car.png';
        this.repair();
    }

    get angle() {
        return standarizeAngle1E(this._angle + PI / 2);
    }
    set angle(a) {
        this._angle = standarizeAngle1E(a - PI / 2);
    }
    
    update() {
        //if (this.idiotCounter >= 60 * 3) {
        //    this.damaged = true;
        //}
        if (!this.damaged) {            
            if (this.useBrain) {
                //this.calculateScore(traffic);
                //this.sensor.update(road, traffic);
                const sensors = this.getInputs();
                    
                const inputs = [
                        ...sensors.slice(Math.ceil((this.sensorsCount - 4) / 2), Math.ceil((this.sensorsCount - 4) / 2) + (this.sensorsCount % 2 == 0 ? 2 : 1)),
                        ...sensors.slice(-3),
                        ...sensors.slice(0, Math.ceil((this.sensorsCount - 4) / 2)),
                        ...sensors.slice(Math.ceil((this.sensorsCount - 4) / 2) + 2, -3),
                        sensors[sensors.length-1]
                ];

                let outputs = [ 0,0,0,0 ];
                outputs = this.brain.feedForward(inputs);
                //log(outputs.toString())
                this.controls.left = outputs[0];
                this.controls.up = outputs[1];
                this.controls.right = outputs[2];
                this.controls.down = outputs[3];                
            } 
            
            if (this.controlMode == STATIC) {
                this.#arrowMove();
            } else {
                this.#linearMove();
            }
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage();
            if (this.damaged) {
                setTimeout((function(){
                    this.repair();
                }).bind(this), 1500);
            }
            /*    
            if (this.penalized) {
                this.maxSpeed = this.saveMaxSpeed * 0.2;
            } else {
                this.maxSpeed = this.saveMaxSpeed;
            }
            */
        }
        //if (this.useBrain) this.calculateScore(traffic);
    }

    repair() {
        let nearest = null;
        const carPos = new Point(this.x, this.y);
        const minDistance = Math.min(...this.road.points.map( a => carPos.distanceTo(new Point(a.x, a.y)) ));
        const idx = this.road.points.findIndex( a => carPos.distanceTo(new Point(a.x, a.y)) == minDistance );
        this.x = this.road.points[idx].x;
        this.y = this.road.points[idx].y; 
        this.angle = this.road.points[idx].angleTo( this.road.points[idx == this.road.points.length-1 ? 0 : idx+1 ] );
        this.damaged = false;
        this.speed = 0;
    }
    
    draw({ ctx, drawSensors = false}) {        
        if (drawSensors && this.sensor) {
            this.sensor.draw();
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this._angle);
        if (!this.damaged) {
            ctx.drawImage(
                this.mask, 
                -this.width / 2, -this.height / 2,
                this.width, this.height
            );
            ctx.globalCompositeOperation = 'multiply';
        }
        ctx.drawImage(
            this.img, 
            -this.width / 2, -this.height / 2,
            this.width, this.height
        );
        ctx.restore();
    }

    #assessDamage() {
        if (this.road) {
            if (polysIntersect(this.polygon, this.road.insidePoly.segments)) {
                return true;
            }                        
            if (polysIntersect(this.polygon, this.road.outsidePoly.segments)) {
                return true;
            } 
            
        }
        /*
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }            
        }
        */
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = 0.75*Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push(new Point(
             this.x - Math.sin(this.angle - alpha) * rad,
             this.y - Math.cos(this.angle - alpha) * rad
        ));
        points.push(new Point(
            this.x - Math.sin(this.angle + alpha) * rad,
            this.y - Math.cos(this.angle + alpha) * rad
        ));
        points.push(new Point(
            this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        ));
        points.push(new Point(
            this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        ));
        const segments = [];
        segments.push( new Segment(points[0], points[1]) );
        segments.push( new Segment(points[1], points[2]) );
        segments.push( new Segment(points[2], points[3]) );
        segments.push( new Segment(points[3], points[0]) );
        return segments;
    }
    
    #rotateTo(angle) {    
        const eps = 0.2;
        const deltaCoef = deltaTime / 1000;
        const flip = (this.rotateSpeed+1) * deltaCoef;
        if (abs(this.angle - angle) <= eps) {
            this.angle = angle; 
            return;
        }
        if (angle == 0) {
            if (this.angle > PI) {
                this.angle += flip; 
            } else {
                this.angle -= flip; 
            }
        } else if (angle > this.angle && abs(angle - this.angle) < PI) {
            this.angle += flip; 
        } else {
            this.angle -= flip; 
        }
    }

    #arrowMove() {
        const previousPos = { x: this.x, y: this.y };
        const deltaCoef = deltaTime / 1000;

        if (this.controls.userAction) {
            this.speed += this.acceleration*(this.controls.reverse?-0.5:1);
        } 
        
        this.speed -= this.friction;

        this.speed = this.speed > this.maxSpeed 
            ? this.maxSpeed 
            : this.speed <= this.friction ? 0 : this.speed;            

        if (this.speed > 0) {        
            if (this.controls.up && this.controls.right) {
                this.#rotateTo(PI/4);
            } else if (this.controls.up && this.controls.left) {
                this.#rotateTo(3*PI/4);
            } else if (this.controls.down && this.controls.left) {
                this.#rotateTo(5*PI/4);
            } else if (this.controls.down && this.controls.right) {
                this.#rotateTo(7*PI/4);
            } else if (this.controls.up) {
                this.#rotateTo(PI/2);
            } else if (this.controls.down) {
                this.#rotateTo(3*PI/2);
            } else if (this.controls.left) {
                this.#rotateTo(PI);
            } else if (this.controls.right) {
                this.#rotateTo(0);
            }
        }

        this.speed = this.speed > this.maxSpeed 
            ? this.maxSpeed 
            : this.speed <= this.friction ? 0 : this.speed;

        const mx = Math.sin(this._angle) * this.speed * deltaCoef;
        const my = Math.cos(this._angle) * this.speed * deltaCoef;

        this.x -= mx;
        this.y -= my;

        if (this.x < 0 || this.x > world.width) this.x = previousPos.x;
        if (this.y < 0 || this.y > world.height) this.y = previousPos.y;

        //this.distance += Math.hypot(mx, my);
    }

    #linearMove() {
        const previousPos = { x: this.x, y: this.y };
        const deltaCoef = deltaTime / 1000;

        if (this.controls.up) {
            this.speed += this.acceleration;
        }
        if (this.controls.down) {
            this.speed -= this.acceleration * 0.7;
        }

        this.speed = this.speed > this.maxSpeed 
            ? this.maxSpeed 
            : (this.speed < -this.maxSpeed/2 
                ? -this.maxSpeed/2 
                : (Math.abs(this.speed) < this.friction ? 0 : this.speed)
            );
        this.speed -= Math.sign(this.speed) * this.friction;

        if (this.speed != 0) {
            const flipDir = Math.sign(this.speed);
            if (this.controls.left) {
                this.angle += this.rotateSpeed * flipDir * deltaCoef;
            }
            if (this.controls.right) {
                this.angle -= this.rotateSpeed * flipDir * deltaCoef ;
            }
        }

        const mx = Math.sin(this._angle) * this.speed * deltaCoef;
        const my = Math.cos(this._angle) * this.speed * deltaCoef;

        this.x -= mx;
        this.y -= my;

        //this.distance += Math.hypot(mx, my);
    }

    calculateScore(traffic) {
        //if (!this.damaged) 
        //this.score = -this.y;// * this.speed;
        //return this.score;
        let overpassedCars = 0;
        for (let i = 0; i < traffic.length; i++) {
            overpassedCars += this.y < traffic[i].y ? 1 : 0; 
        }
        this.overpassedCars = Math.max(this.overpassedCars, overpassedCars);
        this.score = (this.overpassedCars + 1) * this.score;

        return this.score;
    }

    copy() {
        const newCarBrain = this.brain.copy();
        newCarBrain.mutate(mutateRatio);
		return new Car({
            x: road.getLaneCenter(1),
            y: 100,
            width: 30,
            height: 50,
            controlType: controlType,
            sensorsCount: 13,
            model: newCarBrain.model
        });
	}

    reset() {
        this.x = road.getLaneCenter(1);
        this.y = 100;
        this.overpassedCars = 0;
        this.distance = 0;
        this.fitness = 0;
        this.angle = 0;
        this.speed = 0;
        this.damaged = false;
        this.superiorRace = false;
        this.controls.up = 0;
        this.controls.down = 0; 
        this.controls.left = 0; 
        this.controls.right = 0;
        this.idiotCounter = 0;
    }


    getInputs() {
        return [ ...this.sensor.readings.map( r => r==null ? 0 : 1-r.offset ), this.speed/this.maxSpeed ];
    }

    getProgress() {
        return this.overpassedCars / traffic.length;
    }

}

