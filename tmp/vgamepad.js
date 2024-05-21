/*
      ___                                                                                     
    /     \                          (O)
   |       |
   |  (x)  |                     (O)     (O)
   |       |
    \ ___ /                          (O)           
                                            
*/

const 
    VGP_TYPE_GENERIC = 0,
    VGP_TYPE_XBOX = 1,
    VGP_TYPE_NINTENDO = 2,
    VGP_TYPE_PLAYSTATION = 3;
    
const 
    VGP_MODE_FULLSCREEN = 0,
    VGP_MODE_EMBEDDED = 1;


/// VGamepad

class VGamepad {
    constructor({
        vendor = 'Just for Fun VGamepad Device',
        index = 0,
        type = VGP_TYPE_GENERIC,
        mode = VGP_MODE_FULLSCREEN,
        axisCenterHandler = function(){},
        axisHoldHandler = function(){},
        axisChangeHandler = function(){},
        buttonPressHandler = function(){},
        buttonReleaseHandler = function(){}
    } = {}) {
        this.mode = mode;
        this.type = type;
        this.axisCenterHandler = axisCenterHandler;
        this.axisHoldHandler = axisHoldHandler;
        this.axisChangeHandler = axisChangeHandler;
        this.buttonPressHandler = buttonPressHandler;
        this.buttonReleaseHandler = buttonReleaseHandler;
    
        this.buttons = [];
        this.sticks = [];
        
        if (mode == VGP_MODE_FULLSCREEN) {
            this.orientation = window.innerHeight > window.innerWidth ? 'portraint' : 'landscape';
            
            this.container = document.body;
            
            this.container.style.padding = '0';
            this.container.style.margin = '0';
            this.container.style.overflow = 'hidden';
            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            this.container.style.backgroundColor = 'black';
            this.container.style.display = 'flex';
            this.container.style.justifyContent = 'center';
            this.container.style.alignItems = 'center';
                        
            const button = document.createElement('button');
            button.style.fontSize = '20'+(this.orientation == 'landscape' ? 'vh' : 'vw');
            button.style.fontFamily = 'Arial';
            button.style.backgroundColor = 'salmon';
            button.style.border = '2px solid #c80000';
            button.style.padding = '10px';
            button.innerHTML = 'Init VGamepad';
            button.onclick = this.#init.bind(this);
            
            this.container.appendChild(button);
            
        } else {
            this.#init();
        }
    }
    
    async #init() {
        if (this.mode == VGP_MODE_FULLSCREEN) await this.container.requestFullscreen();
        this.container.querySelector('button').remove();
        
        const sticks = [];
        const buttons = [];
        
        if (this.type == VGP_TYPE_GENERIC) {
            sticks.push({
                id: 'left',
                size: 60,
                axisSize: 55,                
                color: '#b80000',
                position: {
                    bottom: '15px',
                    left: '0px'
                }
            });
            
            buttons.push({
                id: 1,
                position: { right: '0vw', top: '60vh' },
                color: '#980000',
                label: 'B'
            
            });
            buttons.push({
                id: 2,
                position: { right: '10vw', top: '80vh' },
                color: '#980000',
                label: 'A'
            
            });
            buttons.push({
                id: 0,
                position: { right: '10vw', top: '40vh' },
                color: '#980000',
                label: 'Y'
            
            });
            buttons.push({
                id: 3,
                position: { right: '20vw', top: '60vh' },
                color: '#980000',
                label: 'X'
            
            });
        }
        
        if (this.type == VGP_TYPE_GENERIC) {
            sticks.push({
                id: 'left',
                size: 60,
                axisSize: 55,                
                color: '#b80000',
                position: {
                    bottom: '15px',
                    left: '0px'
                }
            });                    
        } else if (this.type == VGP_TYPE_NINTENDO || this.type == VGP_TYPE_XBOX) {
            sticks.push({
                id: 'left',
                size: 45,                
                axisSize: 65,
                color: '#b80000',
                position: {
                    top: '10px',
                    left: '10px'
                }
            });
        } else if (this.type == VGP_TYPE_PLAYSTATION) { 
            sticks.push({
                id: 'left',
                size: 45,                
                axisSize: 65,
                color: '#b80000',
                position: {
                    bottom: '10px',
                    left: '10px'
                }
            });
        }                
        
        if (this.type == VGP_TYPE_NINTENDO || this.type == VGP_TYPE_XBOX || this.type == VGP_TYPE_PLAYSTATION) {        
            sticks.push({
                id: 'right',
                size: 45,                
                axisSize: 65,
                color: '#b80000',
                position: {
                    bottom: '10px',
                    right: '20%'
                }
            });
        }

        let labels = [ '1', '2', '3', '4' ];
        if (this.type == VGP_TYPE_NINTENDO) {
            labels = [ 'X', 'A', 'B', 'Y' ];
        } else if (this.type == VGP_TYPE_XBOX) {
            labels = [ 'Y', 'B', 'A', 'X' ];
        } else if (this.type == VGP_TYPE_PLAYSTATION) {
            labels = [ '△', '○', '×', '□' ];
        }
        
        buttons.push({
            id: 0,
            size: 15,
            position: { right: '10vw', top: '15vh' },
            color: '#980000',
            label: labels.pop()
        });        
        buttons.push({
            id: 1,
            size: 15,
            position: { right: '2vw', top: '30vh' },
            color: '#980000',
            label: labels.pop()

        });
        buttons.push({
            id: 2,
            size: 15,
            position: { right: '10vw', top: '45vh' },
            color: '#980000',
            label: labels.pop()

        });
        buttons.push({
            id: 3,
            size: 15,
            position: { right: '18vw', top: '30vh' },
            color: '#980000',
            label: labels.pop()
        });
                
        for (let stk of sticks) {
            this.sticks.push( new GamepadStick({
                container: this.container,
                ...stk
            }));
            this.sticks[this.sticks.length-1].addEventListener('vgpaxiscenter', this.#axisCenterHandlerWraper.bind(this));
            this.sticks[this.sticks.length-1].addEventListener('vgpaxishold', this.#axisHoldHandlerWraper.bind(this));
            this.sticks[this.sticks.length-1].addEventListener('vgpaxischange', this.#axisChangeHandlerWraper.bind(this));
        }
        for (let btn of buttons) {
            this.buttons.push( new GamepadButton({
                container: this.container,
                ...btn
            }));
            this.buttons[this.buttons.length-1].addEventListener('vgpbuttonpress', this.#buttonPressHandlerWraper.bind(this));
            this.buttons[this.buttons.length-1].addEventListener('vgpbuttonrelease', this.#buttonReleaseHandlerWraper.bind(this));
        }                        
    }
    
    #axisCenterHandlerWraper(e) {
        this.axisCenterHandler({ event: 'center', ...e.detail }); 
    }
    #axisChangeHandlerWraper(e) {
        this.axisChangeHandler({ event: 'change', ...e.detail }); 
    }
    #axisHoldHandlerWraper(e) {
        this.axisHoldHandler({ event: 'hold', ...e.detail }); 
    }

    #buttonPressHandlerWraper(e) {
        this.buttonPressHandler({ event: 'press', index: e.detail.id, ...e.detail }); 
    }
    #buttonReleaseHandlerWraper(e) {
        this.buttonReleaseHandler({ event: 'release', index: e.detail.id, ...e.detail }); 
    }

}


/// Stick

class GamepadStick extends EventTarget {
    constructor({
        id = 'left',
        color = '#a0a0a0',        
        container = document.body,
        size = 80,
        axisSize,
        angleSlots = 64, // NOT USED
        position = null
    } = {}) {

        super();

        this.id = id;
        
        this.discretsAnglesMoves = [];
        /*
        for (let i = 0; i <= angleSlots; i++) {
            this.discretsAnglesMoves.push( -Math.PI + i*(2*Math.PI/angleSlots) );
        }
        */

        this.move = {x: 0, y: 0, startX: 0, startY: 0};
        this.container = container;
        this.container.style.userSelect = 'none';
        this.size = size;
        
        this.circle = document.createElement('div');
        this.circle.style.margin = '20px';
        this.#resize();

        if (!position) {        
            this.circle.style.position = 'relative';        
        } else {
            this.circle.style.position = 'absolute';
            for (let k in position) {
                this.circle.style[k] = position[k];
            }
        }
        
        this.circle.style.borderRadius = '50%';
        this.circle.style.backgroundColor = color;
        this.circle.style.background = `radial-gradient(#eee 35%, #bbb 60%, #fff 80%)`;
        this.circle.style.border = '1px solid rgba(0,0,0,0.05)';
        this.circle.style.display = 'flex';
        this.circle.style.alignItems = 'center';
        this.circle.style.justifyContent = 'center';

        this.axis = document.createElement('div'); 

        this.axis.style.position = 'relative';
        this.axis.style.boxSizing = 'border-box';
        this.axis.style.boxShadow = 'black 0px 0px 3px';
        this.axis.style.backgroundColor = color;
        this.axis.style.background = `radial-gradient(${shadeColor(color, -100)} 40%, ${shadeColor(color, 100)})`;
        this.axis.style.width = (axisSize ?? '50') + '%';
        this.axis.style.height = (axisSize ?? '50') + '%';
        this.axis.style.borderRadius = '50%';
        this.axis.style.border = '1px solid '+shadeColor(color, 20);
        this.axis.style.filter = 'brightness(0.7)';

        this.fixAxis = this.axis.cloneNode();
        this.fixAxis.style.border = '1px dashed white';
        this.fixAxis.style.opacity = '0.9';
        this.fixAxis.style.filter = 'brightness(1)';
        this.fixAxis.style.backgroundColor = '#666';
        this.fixAxis.style.background = `radial-gradient(#111 20%, #111 30%, ${shadeColor(color, 50)} 45%)`;
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
            this.circle.style.width = this.size+'vw';
            this.circle.style.height = this.size+'vw';
        } else {
            this.circle.style.width = this.size+'vh';
            this.circle.style.height = this.size+'vh';
        }
    }

    #onTouchStartEnd(e) {
        this.touchRunning = e.type == 'touchstart'; 
        if (this.touchRunning) {
            pressFeedback();            
            this.touchIndex = e.touches.length - 1;
            this.move.startX = e.touches[this.touchIndex].clientX;
            this.move.startY = e.touches[this.touchIndex].clientY;
            this.angle = NaN;
        } else {
            if (this.holdTimeout != undefined) clearTimeout(this.holdTimeout);
            this.axis.style.left = '0px';
            this.axis.style.top = '0px';
            this.axis.style.boxShadow = `black 0px 0px 3px`;
            this.axis.style.transform =  `rotateX(0deg) rotateY(0deg)`;
            this.dispatchEvent(new CustomEvent('vgpaxiscenter', {
                detail: {
                    id: this.id,
                    rad: NaN,
                    deg: NaN,
                    horizontal: 0,
                    vertical: 0,
                    hypn: 0
                }
            }));
        }
    }

    #onTouchMove(e) {
        if (this.touchRunning) {
            this.lastMoveEvent = e;
            this.circle.radius = this.circle.clientWidth / 2;
            this.axis.radius = this.axis.clientWidth / 2;
            
            const [ prevX, prevY ] = [ this.x, this.y ];
            let coef = 1;
            const maxMoveDistance = 1.6*(this.circle.radius - this.axis.radius);

            let x = (this.move.startX - e.touches[this.touchIndex].clientX);
            let y = (this.move.startY - e.touches[this.touchIndex].clientY);
            coef *= (x**2 + y**2)**0.5 / maxMoveDistance;
            x = coef * x;
            y = coef * y;
            let hyp = (x**2 + y**2)**0.5;

            if (hyp <= maxMoveDistance) {
                let angle = standarizeAngle2M(Math.atan2(y, x));
                this.move.x = hyp * Math.cos(angle);
                this.move.y = hyp * Math.sin(angle);
                this.angle = standarizeAngle2M(Math.PI - angle);
            } else {
                let angle = standarizeAngle2M(Math.atan2(y, x));
                hyp = maxMoveDistance;
                x = hyp * Math.cos(angle);
                y = hyp * Math.sin(angle);
                this.move.x = x;
                this.move.y = y;
                this.angle = standarizeAngle2M(Math.PI - angle);
            }
            this.x = -(this.move.x) / maxMoveDistance;
            this.y = (this.move.y) / maxMoveDistance;

            this.axis.style.left = -(this.move.x) + 'px';
            this.axis.style.top = -(this.move.y) + 'px';
            this.axis.style.boxShadow = `black 0px 0px 3px, ${this.move.x/2}px ${this.move.y/2}px 6px -25px #333`;
            this.axis.style.transform =  `rotateX(${30*this.move.y/maxMoveDistance}deg) rotateY(${-30*this.move.x/maxMoveDistance}deg)`;
            
            let event;
            if (this.x != prevX || this.y != prevY) {
                event = 'vgpaxischange';
                if (this.holdTimeout != undefined) clearTimeout(this.holdTimeout);
            } else {
                event = 'vgpaxishold';
            }
            this.dispatchEvent(new CustomEvent(event, {
                detail: {
                    id: this.id,
                    rad: this.angle,
                    deg: 180*this.angle/Math.PI,
                    horizontal: this.x,
                    vertical: this.y,
                    hypn: (this.x**2 + this.y**2)**0.5
                }
            }));
            if (this.holdTimeout != undefined) clearTimeout(this.holdTimeout);
            this.holdTimeout = setTimeout( ()=>this.#onTouchMove.bind(this)(e), 30)
        }
    }
}

/// Button

class GamepadButton extends EventTarget {
    constructor({
        id = 0,
        color = '#a0a0a0',
        container = document.body,
        size = 20,
        position = {},
        label = '#'
    } = {}) {        

        super();

        this.id = id;
        this.label = label;
        
        this.container = container;
        this.container.style.userSelect = 'none';
        this.size = size;
        this.background = color;
        this.button = document.createElement('div'); 
        this.#resize();

        this.button.style.position = 'relative';
        this.button.style.boxSizing = 'border-box';
        this.button.style.backgroundColor = color;
        this.button.style.background = `radial-gradient(${shadeColor(this.background, 100)} 0%, ${shadeColor(this.background, 100)} 50%, ${this.background} 70%)`;
        this.button.style.borderRadius = '50%';
        this.button.style.translate = '-50% -50%';
        this.button.style.position = 'absolute';
        for (let k in position) {
            this.button.style[k] = position[k];
        }
        this.button.style.fontFamily = 'arial';
        this.button.style.fontWeight = 'bolder';
        this.button.style.lineHeight = '150%';
        this.button.style.textAlign = 'center'; 
        this.button.style.textShadow = '0 0 3px #000';
        this.button.style.color = '#ccc';
        
        this.button.innerHTML = label;
        
        this.#addEventListeners();

        this.container.appendChild(this.button);
    }

    #addEventListeners() {
        screen.orientation.addEventListener("change", this.#resize.bind(this));
        this.button.addEventListener('touchstart', this.#onTouchStartEnd.bind(this));
        this.button.addEventListener('touchend', this.#onTouchStartEnd.bind(this));
    }

    #resize(e) {
        this.orientation = window.innerHeight > window.innerWidth ? 'portraint' : 'landscape';
        if (this.orientation == 'portraint') {
            this.button.style.width = this.size+'vw';
            this.button.style.height = this.size+'vw';
            this.button.style.fontSize = (0.66*this.size)+'vw';
        } else {
            this.button.style.width = this.size+'vh';
            this.button.style.height = this.size+'vh';
            this.button.style.fontSize = (0.66*this.size)+'vh';
        }
    }

    #onTouchStartEnd(e) {
        if (e.type == 'touchstart') {
            this.button.style.background = `radial-gradient(${shadeColor(this.background, 0)} 0%, ${shadeColor(this.background, -100)} 60%, ${this.background} 80%)`;
            this.button.style.color = '#666';
            this.dispatchEvent(new CustomEvent('vgpbuttonpress', {
                detail: {
                    id: this.id,
                    label: this.label,
                    value: 1
                }
            }));
        } else {
            this.button.style.background = `radial-gradient(${shadeColor(this.background, 100)} 0%, ${shadeColor(this.background, 100)} 50%, ${this.background} 70%)`;
            this.button.style.color = '#ccc';
            this.dispatchEvent(new CustomEvent('vgpbuttonrelease', {
                detail: {
                    id: this.id,
                    label: this.label,
                    value: 0
                }
            }));
            this.dispatchEvent(new CustomEvent('vgpbuttonhit', {
                detail: {
                    id: this.id,
                    label: this.label
                }
            }));
            pressFeedback();
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

function shadeColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

const context = new (window.webkitAudioContext || window.AudioContext)();

function pressFeedback() {
    navigator.vibrate([10]);
    /*
    const oscillatorNode =  context.createOscillator();

    oscillatorNode.type = 'sine';      
    oscillatorNode.frequency.setValueAtTime(50, context.currentTime);
    oscillatorNode.frequency.exponentialRampToValueAtTime(10, context.currentTime + 0.03);
      
    const gainNode = context.createGain();
    gainNode.gain.value = 0.5;
    oscillatorNode.connect(gainNode);
    gainNode.connect(context.destination);
    oscillatorNode.start();
    oscillatorNode.stop(context.currentTime + 0.06);
    */
}