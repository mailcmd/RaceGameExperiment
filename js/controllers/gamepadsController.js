class GamepadsController {
    constructor(statusHandler = function(){}) {
        this.gamepads = [];
        this.gamepadsHandlers = [];
        this.statusHandler = statusHandler;

        this.#addControllerListeners();        
        this.search();
    }

    update() {
        for (let i = 0; i < this.gamepads.length; i ++) {
            const gp = this.gamepads[i];
            if (gp.isRemote) continue;
            for (let j = 0; j < gp.buttons.length; j++) {
                if (gp.buttons[j].pressed == gp.status.buttons[j].pressed) continue;
                gp.status.buttons[j].pressed = gp.buttons[j].pressed;                
                if (gp.buttons[j].pressed) {
                    if (!this.gamepadsHandlers[i]?.pressButton) continue;
                    this.gamepadsHandlers[i].pressButton({
                        event: 'press',
                        index: j,
                        value: gp.buttons[j].value
                    });
                } else {
                    if (!this.gamepadsHandlers[i]?.releaseButton) continue;
                    this.gamepadsHandlers[i].releaseButton({
                        event: 'release',
                        index: j,
                        value: gp.buttons[j].value
                    });
                }
            }

            // left Stick
            const leftStick = this.decodeAxis(gp.axes[0], gp.axes[1]);
            if (isNaN(leftStick.rad) && !isNaN(gp.status.leftStick.rad)) {
                if (!this.gamepadsHandlers[i]?.centerAxis) continue;
                this.gamepadsHandlers[i].centerAxis({ event: 'center', id: 'left', ...leftStick });
            } else if (!isNaN(leftStick.rad) && leftStick.rad != gp.status.leftStick.rad) {
                if (!this.gamepadsHandlers[i]?.changeAxis) continue;
                this.gamepadsHandlers[i].changeAxis({ event: 'change', id: 'left', ...leftStick });
            } else if (!isNaN(leftStick.rad)) {
                if (!this.gamepadsHandlers[i]?.holdAxis) continue;
                this.gamepadsHandlers[i].holdAxis({ event: 'hold', id: 'left', ...leftStick });
            }
            gp.status.leftStick.rad = leftStick.rad;

            // right Stick
            const rightStick = this.decodeAxis(
                ...(gp.axes.length == 4 ? [ gp.axes[2], gp.axes[3] ] : [ gp.axes[2], gp.axes[5] ])
            );
            if (isNaN(rightStick.rad) && !isNaN(gp.status.rightStick.rad)) {
                if (!this.gamepadsHandlers[i]?.centerAxis) continue;
                this.gamepadsHandlers[i].centerAxis({ event: 'center', id: 'right', ...rightStick });
            } else if (!isNaN(rightStick.rad) && rightStick.rad != gp.status.rightStick.rad) {
                if (!this.gamepadsHandlers[i]?.changeAxis) continue;
                this.gamepadsHandlers[i].changeAxis({ event: 'change', id: 'right', ...rightStick });
            } else if (!isNaN(rightStick.rad)) {
                if (!this.gamepadsHandlers[i]?.holdAxis) continue;
                this.gamepadsHandlers[i].holdAxis({ event: 'hold', id: 'right', ...rightStick });
            }
            gp.status.rightStick.rad = rightStick.rad;            
        }

        if (this.getGamepads().length > 0) {
            requestAnimationFrame(this.update.bind(this));
        }
        //setTimeout(this.update.bind(this), 1000);
    }

    decodeAxis(horizontal, vertical) {
        const h = parseFloat(horizontal.toFixed(2));
        const v = -parseFloat(vertical.toFixed(2));
        const hypmax = (1 + (min(h,v)/max(h,v))**2)**0.5; 
        const hyp = (h**2 + v**2)**0.5; 
        const angle = h == 0 && v == 0 ? NaN : Math.atan2(v, h);
        return {
            rad: angle, 
            deg: angle ? angle.deg() : angle,
            horizontal: h,
            vertical: v,
            hyprel: hyp / hypmax,
            hypn: hyp / hypmax
        };
    }

    getGamepads() {
        return this.gamepads.filter( g => g );
    }

    addGamepadHandler(index, {
        pressButton, 
        releaseButton,
        changeAxis,
        holdAxis,
        centerAxis
    }) {
        this.gamepadsHandlers[index] = {
            pressButton: pressButton ?? function(){},
            releaseButton: releaseButton ?? function(){},
            changeAxis: changeAxis ?? function(){},
            holdAxis: holdAxis ?? function(){},
            centerAxis: centerAxis ?? function(){},
        }
    }

    search() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            this.#newGamepad({ gamepad: gamepads[i] });
        }
    }
    
    setStatusHandler(fn) {
        this.statusHandler = fn;
    }

    #addControllerListeners() {
        window.addEventListener('rgamepadconnected', this.#newGamepad.bind(this), false);
        window.addEventListener('gamepadconnected', this.#newGamepad.bind(this), false);
        window.addEventListener('gamepaddisconnected', this.#lostGamepad.bind(this), false);        
        window.addEventListener('rgamepadmessage', this.#rgamepadEvent.bind(this), false);        
    }

    #rgamepadEvent(e) {
        const mess = e.detail;
        const i = mess.gpIndex;
        if (mess.event == 'press') {
            this.gamepadsHandlers[i].pressButton(mess);
        } else if (mess.event == 'release') {
            this.gamepadsHandlers[i].pressButton(mess);
        } else if (mess.event == 'change') {
            this.gamepadsHandlers[i].changeAxis(mess);
        } else if (mess.event == 'center') {
            this.gamepadsHandlers[i].centerAxis(mess);
        } else if (mess.event == 'hold') {
            this.gamepadsHandlers[i].holdAxis(mess);
        }
    }

    #newGamepad(e) {
        if (e.detail) e.gamepad = e.detail;
        if (e.gamepad.isRemote) {
            this.gamepads[e.gamepad.index] = e.gamepad;
        } else {
            this.gamepads[e.gamepad.index] = e.gamepad;
            this.gamepads[e.gamepad.index].status = { 
                buttons: [], 
                leftStick: { rad: NaN, horizontal: 0, vertical: 0 }, 
                rightStick: { rad: NaN, horizontal: 0, vertical: 0 }
            };
            for (let i = 0; i < e.gamepad.buttons.length; i++) {
                this.gamepads[e.gamepad.index].status.buttons[i] = {};
                for (let k in e.gamepad.buttons[i]) {
                    this.gamepads[e.gamepad.index].status.buttons[i][k] = e.gamepad.buttons[i][k];
                }
            }
            this.statusHandler({ self: this, type: 'add', gamepad: e.gamepad });
            if (this.getGamepads().length == 1) this.update();
        }
        log('Controller found at index ' + e.gamepad.index + '.');
        log(this.gamepads[e.gamepad.index].id + ' is ready!');
}

    #lostGamepad(e) {
        log('The controller at index ' + e.gamepad.index + ' has been disconnected.');
        this.gamepads[e.gamepad.index] = null;
        this.statusHandler({ self: this, type: 'remove', gamepad: e.gamepad });
    }

}