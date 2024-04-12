class Controls {
    constructor(type, car) {
        this.forward = 0;
        this.reverse = 0; 
        this.left = 0; 
        this.right = 0; 
        this.car = car;
        this.userAction = false;

        switch (type) {
            case USER:
                this.#addKeyboardListeners();
                break;
            case DUMMY:
                this.forward = 1;
                break;
        }
    }

    #addKeyboardListeners() {
        document.onkeydown = (e) => {
            if (e.key == 'ArrowLeft') this.left = 1;
            if (e.key == 'ArrowRight') this.right = 1;
            if (e.key == 'ArrowUp') this.up = 1;
            if (e.key == 'ArrowDown') this.down = 1;
            this.userAction = this.left || this.right || this.down || this.up;
        };
        document.onkeyup = (e) => {
            if (e.key == 'ArrowLeft') this.left = 0;
            if (e.key == 'ArrowRight') this.right = 0;
            if (e.key == 'ArrowUp') this.up = 0;
            if (e.key == 'ArrowDown') this.down = 0;
            this.userAction = this.left || this.right || this.down || this.up;
        }
    }

}