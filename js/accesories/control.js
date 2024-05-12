class Control {
    constructor({
            entity = null,
            type = USER_KEYBOARD1            
        }) {
        this.entity = entity;
        this.type = type;
        
        this.gamepads = [];

        this.left = 0; 
        this.right = 0; 
        this.up = 0; 
        this.down = 0; 
        
        this.userAction = Array(8).fill(0);

        this.angle = undefined;

        this.#configure();                
    }
    
    change(type) {
        if (this.keyboard) {
            this.keyboard.destroy(); 
        } 
        
        gamepadController.addGamepadHandler(this.type - 2, {
            pressButton: function(){},
            releaseButton: function(){},
            changeAxis: function(){},
            holdAxis: function(){},
            centerAxis: function(){}
        });

        this.type = type;
        this.#configure();        
    }

    #configure() {
        if (this.type == USER_KEYBOARD1) {
            this.keyboard = new Keyboard({
                type: 'arrows', 
                handler: this.#keyboardHandler.bind(this),
                userActions: [ 'Control', ' ' ]
            });
        } else if (this.type == USER_KEYBOARD2) {
            this.keyboard = new Keyboard({
                type: 'wasd', 
                handler: this.#keyboardHandler.bind(this),
                userActions: [ 'Control', ' ' ]
            });
        } else if (this.type >= USER_JOYSTICK1 && this.type <= USER_JOYSTICK4) {
            gamepadController.addGamepadHandler(this.type - 2, {
                pressButton: this.#gamepaddButtonsHandler.bind(this),
                releaseButton: this.#gamepaddButtonsHandler.bind(this),
                changeAxis: this.#gamepaddAxisHandler.bind(this),
                holdAxis: this.#gamepaddAxisHandler.bind(this),
                centerAxis: this.#gamepaddAxisHandler.bind(this)
            });            
        }         
    }
    
    #keyboardHandler(e) {
        if (this[e.action] !== undefined) {
            this[e.action] = e.event == 'press' ? 1 : 0;
        } else if (this.userAction[e.action.replace('userAction','')] != undefined) {
            this.userAction[e.action.replace('userAction','')] = e.event == 'press' ? 1 : 0;
        }
    }

    #gamepaddAxisHandler(gp) {        
        if (gp.id == 'left') {// && !isNaN(gp.hyprel) && gp.hyprel > 0.5) {
            this.angle = gp.rad;
        } 
        
    }
    #gamepaddButtonsHandler(gp) {
        this.userAction[gp.index] = gp.event == 'press' ? 1 : 0;
    }    
}