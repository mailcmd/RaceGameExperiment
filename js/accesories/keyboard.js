/*
 arrows:
    - 🡹 : up
    - 🡻 : down
    - 🡸 : left
    - 🡺 : right
    - button 1 : g
    - button 2 : f

 wasd:
    - 🡹 : w
    - 🡻 : s
    - 🡸 : a
    - 🡺 : d
    - button 1 : o
    - button 2 : p

*/
class Keyboard {
    constructor($type = 'arrows', handler) {
        this.#addKeyboardListeners($type, handler);
    }

    #addKeyboardListeners($type, handler) {
        document.onkeydown = (e) => {
            if ($type == 'arrows') {
                if (e.key == 'ArrowLeft') { 
                    handler({event: 'press', action: 'left'});
                }
                if (e.key == 'ArrowRight') {
                    handler({event: 'press', action: 'right'});
                }
                if (e.key == 'ArrowUp') {
                    handler({event: 'press', action: 'up'});
                }
                if (e.key == 'ArrowDown') {
                    handler({event: 'press', action: 'down'});
                }
                if (e.key == 'g') {
                    handler({event: 'press', action: 'button1'});
                }
                if (e.key == 'f') {
                    handler({event: 'press', action: 'button2'});
                }
            } else if ($type == 'wasd') {
                if (e.key == 'a') { 
                    handler({event: 'press', action: 'left'});
                }
                if (e.key == 'd') {
                    handler({event: 'press', action: 'right'});
                }
                if (e.key == 'w') {
                    handler({event: 'press', action: 'up'});
                }
                if (e.key == 's') {
                    handler({event: 'press', action: 'down'});
                }
                if (e.key == 'o') {
                    handler({event: 'press', action: 'button1'});
                }
                if (e.key == 'p') {
                    handler({event: 'press', action: 'button2'});
                }
            }
        };
        document.onkeyup = (e) => {
            if ($type == 'arrows') {
                if (e.key == 'ArrowLeft') { 
                    handler({event: 'release', action: 'left'});
                }
                if (e.key == 'ArrowRight') {
                    handler({event: 'release', action: 'right'});
                }
                if (e.key == 'ArrowUp') {
                    handler({event: 'release', action: 'up'});
                }
                if (e.key == 'ArrowDown') {
                    handler({event: 'release', action: 'down'});
                }
                if (e.key == 'g') {
                    handler({event: 'release', action: 'button1'});
                }
                if (e.key == 'f') {
                    handler({event: 'release', action: 'button2'});
                }
            } else if ($type == 'wasd') {
                if (e.key == 'a') { 
                    handler({event: 'release', action: 'left'});
                }
                if (e.key == 'd') {
                    handler({event: 'release', action: 'right'});
                }
                if (e.key == 'w') {
                    handler({event: 'release', action: 'up'});
                }
                if (e.key == 's') {
                    handler({event: 'release', action: 'down'});
                }
                if (e.key == 'o') {
                    handler({event: 'release', action: 'button1'});
                }
                if (e.key == 'p') {
                    handler({event: 'release', action: 'button2'});
                }
            }
        }
    }

}