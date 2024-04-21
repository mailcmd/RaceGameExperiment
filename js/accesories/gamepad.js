class GamepadsController {
    constructor() {
        this.gamepads = [];
        this.gamepadsHandlers = [];

        this.#addControllerListeners();        
        this.search();
    }

    update() {
        for (let i = 0; i < this.gamepads.length; i ++) {
            const gp = this.gamepads[i];

            for (let j = 0; j < gp.buttons.length; j++) {
                if (gp.buttons[j].pressed == gp.status.buttons[j].pressed) continue;
                gp.status.buttons[j].pressed = gp.buttons[j].pressed;
                if (gp.buttons[j].pressed) {
                    this.gamepadsHandlers[i].pressButton({
                        event: 'press',
                        index: j,
                        value: gp.buttons[j].value
                    });
                } else {
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
                this.gamepadsHandlers[i].centerAxis({ event: 'center', id: 'left', ...leftStick });
            } else if (!isNaN(leftStick.rad) && leftStick.rad != gp.status.leftStick.rad) {
                this.gamepadsHandlers[i].changeAxis({ event: 'change', id: 'left', ...leftStick });
            } else if (!isNaN(leftStick.rad)) {
                this.gamepadsHandlers[i].holdAxis({ event: 'hold', id: 'left', ...leftStick });
            }
            gp.status.leftStick.rad = leftStick.rad;

            // right Stick
            const rightStick = this.decodeAxis(gp.axes[2], gp.axes[5]);
            if (isNaN(rightStick.rad) && !isNaN(gp.status.rightStick.rad)) {
                this.gamepadsHandlers[i].centerAxis({ event: 'center', id: 'right', ...rightStick });
            } else if (!isNaN(rightStick.rad) && rightStick.rad != gp.status.rightStick.rad) {
                this.gamepadsHandlers[i].changeAxis({ event: 'change', id: 'right', ...rightStick });
            } else if (!isNaN(rightStick.rad)) {
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
        const angle = h == 0 && v == 0 ? NaN : Math.atan2(v, h);
        return {
            rad: angle, 
            deg: angle ? angle.deg() : angle,
            horizontal: h,
            vertical: v,
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
            this.#newGamepad({ gamepad: Gamepads[i] });
        }
    }

    #addControllerListeners() {
        window.addEventListener('gamepadconnected', this.#newGamepad.bind(this), false);
        window.addEventListener('gamepaddisconnected', this.#lostGamepad.bind(this), false);        
    }

    #newGamepad(e) {
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
        log('Controller found at index ' + e.gamepad.index + '.');
        log(this.gamepads[e.gamepad.index].id + ' is ready!');
        this.update();
    }

    #lostGamepad(e) {
        log('The controller at index ' + e.gamepad.index + ' has been disconnected.');
        this.gamepads[e.gamepad.index] = null;
    }

}