const menuData = 
{
    "0": [
        {
            title: "Continuar",
            type: "action", 
            action: function() {
                togglePause();                
            }
        },
        {
            title: "Opciones",
            type: "submenu",
            path: "0.1"
        },
        {
            title: "Editor",
            type: "action",
            action: "window.open('editor.html')"
        }
    ],
    "0.1": [
        
        {
            title: "Controles",
            type: "submenu",
            path: "0.2"
        },
        {
            title: "Modo",
            type: "select",
            options: [ { value: STATIC, text: "Direccional"}, { value: ROTATE, text: "Rotativo"}, { value: FULLSCREEN, text: "Full Screen"} ],
            default: DEFAULT_GAMEMODE,
            variable: "gamemode",
            onchange: function(v){ 
                gamemode = v.value;
                viewport.setMode(v.value);
                car.setMode(v.value);
                animate(frameTime);
            }
        },
        {
            title: "Veloc.",
            type: "meter",
            min: "300",
            max: "700",
            default: 500,
            variable: "car.maxSpeed"
        },
        {
            title: "Mostrar FPS",
            type: "onoff",
            variable: "viewport.showFPS",
            onchange: "animate(frameTime)"
        },
        {
            title: "Minimap",
            type: "onoff",
            variable: "showMinimap",
            onchange: "showMinimap ? minimap.show() : minimap.hide();animate(frameTime)"
        }
    ],
    "0.2": [        
        {
            title: "Control",
            type: "select",
            options: [ 
                { value: USER_KEYBOARD1, text: "Teclado 1"},  
                { value: USER_KEYBOARD2, text: "Teclado 2"},  
                { value: USER_JOYSTICK1, text: "Gamepad 1"},  
                { value: USER_JOYSTICK2, text: "Gamepad 2"},  
                { value: USER_JOYSTICK3, text: "Gamepad 3"},  
                { value: USER_JOYSTICK3, text: "Gamepad 3"},  
                { value: USER_RJOYSTICK, text: "RGamepad"}  
            ],
            default: USER_KEYBOARD1,
            variable: "car.control.type",
            onchange: function(v){ 
                car.control.change(v.value);
            }
        },
        {
            title: "Joystick 1",
            type: "submenu",
            path: "0.3"
        },
        {
            title: "Joystick 2",
            type: "submenu",
            path: "0.4"
        },
        {
            title: "Joystick 3",
            type: "submenu",
            path: "0.5"
        },
        {
            title: "Joystick 4",
            type: "submenu",
            path: "0.6"
        }
    ],
    "0.3": [
        {
            title: "Acelerar",
            type: "action", 
            action: "gamepad()"
        },      
    ]
};