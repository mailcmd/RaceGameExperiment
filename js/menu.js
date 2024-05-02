const menuData = 
{
    "0": [
        {
            title: "Continuar",
            type: "action", 
            action: "togglePause()"
        },
        {
            title: "Editor",
            type: "action",
            action: "window.open('editor.html')"
        },
        {
            title: "Opciones",
            type: "submenu",
            path: "0.1"
        }
    ],
    "0.1": [
        {
            title: "Modo",
            type: "select",
            options: [ { value: STATIC, text: "Direccional"}, { value: ROTATE, text: "Rotativo"} ],
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

    ]
};