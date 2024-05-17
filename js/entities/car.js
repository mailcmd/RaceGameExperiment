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
        this.initialPosition = new Point(x, y);
        this.width = width;
        this.height = height;
        this.controlMode = controlMode;
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
        this.acceleration = 25;
        this.friction = 5;
        this._angle = 0;
        this.derrapeAngle = 0;
        this.angle = road ? road.points[0].angleTo(road.points[1]) : 0;        
        this.damaged = false;
        this.fitness = 0;
        this.score = 0;
        this.updateCounter = 0;                

        if (controlType == CPU) {
            this.useBrain = true;
            this.sensor = new Sensor(this, this.sensorsCount);
            const center = this.sensorsCount % 2 == 1 ? 4 : 5;
            const sides = this.sensorsCount - center + 1;        
            this.brain = new NeuralNetwork(center, sides);
            if (model) {
                this.brain.load(model);
            }
        }        

        this.control = new Control({ entity: this, type: controlType });

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
    
    setMode(mode) {
        this.controlMode = mode;
    }    
    
    update() {
        if (this.idiotCounter >= 60 * 3) {
            this.damaged = true;
        }
        if (!this.damaged) {            
            if (this.useBrain) {
                this.calculateScore(traffic);
                this.sensor.update(road, traffic);
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
                this.control.left = outputs[0];
                this.control.up = outputs[1];
                this.control.right = outputs[2];
                this.control.down = outputs[3];                
            } 

            if (this.control.type == USER_KEYBOARD1 || this.control.type == USER_KEYBOARD2) {
                if (this.controlMode == STATIC || this.controlMode == FULLSCREEN) {
                    this.#directionalMove();
                } else {
                    this.#linearMove();
                }
            } else if (this.control.type >= USER_JOYSTICK1 && this.control.type <= USER_JOYSTICK4) {
                this.#angularMove();
            } else if (this.control.type == CPU) {
                this.#linearMove();
            }

            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage();
            if (this.damaged && this.control.type != CPU) {
                setTimeout((function(){
                    this.repair();
                }).bind(this), 1500);
            }
        }
    }

    rotateTo(angle) {    
        const eps = 0.1;
        const deltaCoef = deltaTime / 1000;
        const flip = (this.rotateSpeed+1) * deltaCoef;
        if (abs(this.angle - angle) <= eps) {
            this.angle = angle; 
            return;
        }
        
        if (angle == 0) {
            if (this.angle > PI) {
                this.angle += flip; 
                this.derrapeAngle = -flip;
            } else {
                this.angle -= flip; 
                this.derrapeAngle = flip;
            }
        } else if (standarizeAngle1E(angle + 2*PI - this.angle) < PI) {
            this.angle += flip; 
            this.derrapeAngle = -flip;
        } else {
            this.angle -= flip; 
            this.derrapeAngle = flip;;
        }
    }

    #directionalMove() {
        const deltaCoef = deltaTime / 1000;

        if (this.control.userAction[0] || this.control.userAction[1]) {
            this.speed += this.acceleration * (this.control.userAction[1] ? -0.5 : 1);
        } 
        
        this.speed -= this.friction;

        this.speed = this.speed > this.maxSpeed 
            ? this.maxSpeed 
            : this.speed <= this.friction ? 0 : this.speed;            

        this.derrapeAngle = -sign(this.derrapeAngle)*0.05;
        this.derrapeAngle = this.derrapeAngle < 0.05 ? 0 : this.derrapeAngle;

        if (this.speed > 0) {        
            if (this.control.up && this.control.right) {
                this.rotateTo(PI/4);
            } else if (this.control.up && this.control.left) {
                this.rotateTo(3*PI/4);
            } else if (this.control.down && this.control.left) {
                this.rotateTo(5*PI/4);
            } else if (this.control.down && this.control.right) {
                this.rotateTo(7*PI/4);
            } else if (this.control.up) {
                this.rotateTo(PI/2);
            } else if (this.control.down) {
                this.rotateTo(3*PI/2);
            } else if (this.control.left) {
                this.rotateTo(PI);
            } else if (this.control.right) {
                this.rotateTo(0);
            }
        }

        const mx = Math.sin(this._angle) * this.speed * deltaCoef;
        const my = Math.cos(this._angle) * this.speed * deltaCoef;

        this.x -= mx;
        this.y -= my;

        this.distance += Math.sign(this.speed) * Math.hypot(mx, my);
    }

    #linearMove() {
        const deltaCoef = deltaTime / 1000;

        if (this.control.up) {
            this.speed += this.acceleration;
        }
        if (this.control.down) {
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
            if (this.control.left) {
                this.angle += this.rotateSpeed * flipDir * deltaCoef;
            }
            if (this.control.right) {
                this.angle -= this.rotateSpeed * flipDir * deltaCoef ;
            }
        }

        const mx = Math.sin(this._angle) * this.speed * deltaCoef;
        const my = Math.cos(this._angle) * this.speed * deltaCoef;

        this.x -= mx;
        this.y -= my;

        this.distance += Math.sign(this.speed) * Math.hypot(mx, my);
    }

    #angularMove() {
        const deltaCoef = deltaTime / 1000;

        if (this.control.userAction[0] || this.control.userAction[1]) {
            this.speed += this.acceleration * (this.control.userAction[1] ? -0.5 : 1);
        }

        this.speed -= this.friction;

        this.speed = this.speed > this.maxSpeed 
            ? this.maxSpeed 
            : this.speed <= this.friction ? 0 : this.speed;            

        if (!isNaN(this.control.angle) && this.speed != 0) this.rotateTo(this.control.angle);        
        
        const mx = Math.sin(this._angle) * this.speed * deltaCoef;
        const my = Math.cos(this._angle) * this.speed * deltaCoef;

        this.x -= mx;
        this.y -= my;

        this.distance += Math.sign(this.speed) * Math.hypot(mx, my);
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
    
    repair() {
        let nearest = null;
        const carPos = new Point(this.x, this.y);
        const minDistance = Math.min(...this.road.points.map( a => carPos.distanceTo(new Point(a.x, a.y)) ));
        const idx = this.road.points.findIndex( a => carPos.distanceTo(new Point(a.x, a.y)) == minDistance );
        this.x = this.road.points[idx].x;
        this.y = this.road.points[idx].y; 
        this.angle = this.road.points[idx].angleTo( this.road.points[idx == this.road.points.length-1 ? 0 : idx+1 ] );
        this.derrapeAngle = 0;
        this.damaged = false;
        this.speed = 0;
    }
    
    draw({ ctx, drawSensors = false}) {        
        if (drawSensors && this.sensor || this == bestCar) {
            this.sensor.draw({ctx});
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this._angle+8*this.derrapeAngle);
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

    reset() {
        [ this.x, this.y ] =  [ this.initialPosition.x, this.initialPosition.y ];
        this.overpassedCars = 0;
        this.distance = 0;
        this.fitness = 0;
        this.angle = 0;
        this.derrapeAngle = 0;
        this.speed = 0;
        this.damaged = false;
        this.superiorRace = false;
        this.control.up = 0;
        this.control.down = 0; 
        this.control.left = 0; 
        this.control.right = 0;
        this.idiotCounter = 0;
    }

    getInputs() {
        return [ ...this.sensor.readings.map( r => r==null ? 0 : 1-r.offset ), this.speed/this.maxSpeed ];
    }

    getProgress() {
        return this.overpassedCars / traffic.length;
    }

    calculateScore() {   
        if (this.distance <= this.score) {
            this.idiotCounter++;
        }
        this.score = this.distance;             
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

}

