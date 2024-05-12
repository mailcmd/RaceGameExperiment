/*
 arrows:
    - 🡹 : up
    - 🡻 : down
    - 🡸 : left
    - 🡺 : right

 wasd:
    - 🡹 : w
    - 🡻 : s
    - 🡸 : a
    - 🡺 : d

*/
class Keyboard {
    constructor({ 
            type = 'arrows', 
            handler = function(){}, 
            userActions = [ 'Control', ' ' ]
        }) {
        this.handler = handler;
        this.userActions = userActions;
        this.type = type;
        this.#addKeyboardListeners();
    }

    destroy() {
        document.removeEventListener('keydown', this.type == 'arrows' ? this.#arrowsListener : this.#wasdListener );
        document.removeEventListener('keyup', this.type == 'arrows' ? this.#arrowsListener : this.#wasdListener );
    }
    
    #addKeyboardListeners() {
        document.addEventListener('keydown', this.type == 'arrows' ? this.#arrowsListener.bind(this) : this.#wasdListener.bind(this) );
        document.addEventListener('keyup', this.type == 'arrows' ? this.#arrowsListener.bind(this) : this.#wasdListener.bind(this) );
    }
    #arrowsListener(e) {
        if (e.key == 'ArrowLeft') { 
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'left'});
        } else if (e.key == 'ArrowRight') {
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'right'});
        } else if (e.key == 'ArrowUp') {
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'up'});
        } else if (e.key == 'ArrowDown') {
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'down'});
        } else {
            this.#checkUserActions(e);
        }
    }
    #wasdListener(e) {
        if (e.key == 'a') { 
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'left'});
        } else if (e.key == 'd') {
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'right'});
        } else if (e.key == 'w') {
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'up'});
        } else if (e.key == 's') {
            this.handler({event: e.type == 'keydown' ? 'press' : 'release', action: 'down'});
        } else {
            this.#checkUserActions(e);
        }
    }
    
    #checkUserActions(e) {
        for (let i = 0; i < this.userActions.length; i++) {
            if (e.key == this.userActions[i]) { 
                this.handler({ event: e.type == 'keydown' ? 'press' : 'release', action: 'userAction'+i });
                break;
            }
        }    
    }
}

