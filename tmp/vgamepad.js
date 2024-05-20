/*
      ___                                                                                     
    /     \                          (O)                                                         
   |  (x)  |                     (O)     (O)                                                           
    \ ___ /                          (O)           
                                            
*/

class Stick {
    constructor({
        background = 'gray',
        container = document.body,
        angleSlots = 36
    } = {}) {
        if (!isMobile() || !hasTouchSupport()) {
            document.body.innerHTML = 'This device is not supported';
            return;
        }

        this.discretsAnglesMoves = [];
        for (let i = 0; i <= angleSlots; i++) {
            this.discretsAnglesMoves.push( -Math.PI + i*(2*Math.PI/angleSlots) );
        }

        this.move = {x: 0, y: 0, startX: 0, startY: 0};
        this.container = container;
        
        this.circle = document.createElement('div');
        this.circle.style.margin = '20px';
        this.#resize();
        
        this.circle.style.position = 'relative';        
        this.circle.style.borderRadius = '50%';
        this.circle.style.backgroundColor = background;
        this.circle.style.border = '1px solid rgba(0,0,0,0.05)';
        this.circle.style.display = 'flex';
        this.circle.style.alignItems = 'center';
        this.circle.style.justifyContent = 'center';

        this.axis = document.createElement('div'); 

        this.axis.style.position = 'relative';
        this.axis.style.opacity = '0.9';
        this.axis.style.width = '45%';
        this.axis.style.height = '45%';
        this.axis.style.borderRadius = '50%';
        this.axis.style.backgroundColor = background;
        this.axis.style.border = '1px solid black';
        this.axis.style.filter = 'brightness(0.7)';

        this.fixAxis = this.axis.cloneNode();
        this.fixAxis.style.border = '1px dashed white';
        this.fixAxis.style.opacity = '0.7';
        this.fixAxis.style.filter = 'brightness(1.2)';
        this.fixAxis.style.width = '40%';
        this.fixAxis.style.height = '40%';
        this.fixAxis.style.position = 'absolute';
        this.fixAxis.style.left = '30%';
        this.fixAxis.style.top = '30%';

        this.circle.appendChild(this.fixAxis);
        this.circle.appendChild(this.axis);

        this.#addEventListeners();

        this.container.appendChild(this.circle);

        this.circle.radius = this.circle.clientWidth / 2;
        this.axis.radius = this.axis.clientWidth / 2;
    }

    #addEventListeners() {
        screen.orientation.addEventListener("change", this.#resize.bind(this));
        this.axis.addEventListener('touchstart', this.#onTouchStartEnd.bind(this));
        this.axis.addEventListener('touchend', this.#onTouchStartEnd.bind(this));
        this.axis.addEventListener('touchmove', this.#onTouchMove.bind(this));
    }

    #resize(e) {
        this.orientation = window.innerHeight > window.innerWidth ? 'portraint' : 'landscape';
        if (this.orientation == 'portraint') {
            this.circle.style.width = '80vw';
            this.circle.style.height = '80vw';
            this.circle.style.marginBottom = 'auto';
            this.circle.style.marginRight = '20px';
        } else {
            this.circle.style.width = '80vh';
            this.circle.style.height = '80vh';
            this.circle.style.marginBottom = '20px';
            this.circle.style.marginRight = 'auto';
        }
    }

    #onTouchStartEnd(e) {
        this.moving = e.type == 'touchstart'; 
        if (this.moving) {
            this.move.startX = e.touches[0].clientX;
            this.move.startY = e.touches[0].clientY;
            this.angle = NaN;
        } else {
            this.axis.style.left = '0px';
            this.axis.style.top = '0px';
        }
    }

    #onTouchMove(e) {
        if (this.moving) {
            let coef = 2;
            const maxMoveDistance = 30+(this.circle.radius - this.axis.radius);
            let x = (this.move.startX - e.touches[0].clientX);
            let y = (this.move.startY - e.touches[0].clientY);
            coef *= (x**2 + y**2)**0.5 / maxMoveDistance;
            x = coef * x;
            y = coef * y;
            let hyp = (x**2 + y**2)**0.5;

            if (hyp <= maxMoveDistance) {
                let angle = standarizeAngle2M(Math.atan2(y, x));
                //angle = this.discretsAnglesMoves.sort( (a,b) => Math.abs(angle-a) - Math.abs(angle-b) )[0];
                this.move.x = hyp * Math.cos(angle);
                this.move.y = hyp * Math.sin(angle);
                this.angle = standarizeAngle2M(Math.PI - angle);
            } else {
                let angle = standarizeAngle2M(Math.atan2(y, x));
                //angle = this.discretsAnglesMoves.sort( (a,b) => Math.abs(angle-a) - Math.abs(angle-b) )[0];
                hyp = maxMoveDistance;
                x = hyp * Math.cos(angle);
                y = hyp * Math.sin(angle);
                this.move.x = x;
                this.move.y = y;
                this.angle = standarizeAngle2M(Math.PI - angle);
            }
            this.axis.style.left = -(this.move.x) + 'px';
            this.axis.style.top = -(this.move.y) + 'px';
            this.x = -(this.move.x) / maxMoveDistance;
            this.y = (this.move.y) / maxMoveDistance;
        }        
    }
}

//////////// tools ////////////

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

function hasTouchSupport() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function standarizeAngle2M(a) {
    if (a >= -Math.PI && a <= Math.PI) return a;    
    if (a > Math.PI) {
        return standarizeAngle2M(a - 2*Math.PI);
    } else if (a < -Math.PI) {
        return standarizeAngle2M(2*Math.PI + a);
    }
}

function standarizeAngle1E(a) {
    a = standarizeAngle2M(a);
    if (a >= 0) return a;    
    return 2*Math.PI + a;
}
