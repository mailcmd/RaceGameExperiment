
// Synaptic
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

// DATA CONSTANTS
const USER_KEYBOARD = 1, USER_JOYSTICK = 2, CPU = 3, DUMMY = 4;
const STATIC = 1, ROTATE = 2;
 
const GAMEMODE = ROTATE;

// config constants
const carsCount = 100; 
const maxSpeedCars = 600;
const terrainColor = '#60AF60';
const roadColor = '#707070';
const roadSignals = 'white';
const roadWidth = 100;

// global variables
let frameCount = 0;
let frameTime = 0;
let deltaTime = 0;

// admin actions control
let paused = false, refreshCanvas = true, resetGameNow = false;

document.onkeypress = e => {
    console.log(e.keyCode)
    if (e.keyCode == 32) {
        (paused = !paused) || animate(frameTime) ;
        document.getElementById('paused').style.display = paused ? 'flex' : 'none';
    } else if (e.keyCode == 13) {
    } else if (e.keyCode == 82 || e.keyCode == 114) {
        resetGameNow = true;
    } else if (e.keyCode == 100) {
        viewport.moveCenter(-20, 0);
    } else if (e.keyCode == 97) {
        viewport.moveCenter(20, 0);
    } else if (e.keyCode == 115) {
        viewport.moveCenter(0, -20);
    } else if (e.keyCode == 119) {
        viewport.moveCenter(0, 20);
    }
};

// main settings
//document.body.style.backgroundColor = terrainColor;

const editor = new TrackEditor(document.createElement('canvas'), { hidden: true });

var world, viewport, roadPoints, car;

editor.loadFromFile(function(editor){

    roadPoints = [
        new Point(100, 200),
        new Point(2305, 150),
        new Point(2240, 550),
        new Point(120, 640),
        new Point(200, 440)
    ];
    
    roadPoints = editor.getScalated(window.innerWidth * 3);
    
    //create world
    world = new World({ 
        roadPoints: roadPoints,
        width: window.innerWidth * 3
    });

    car = new Car({
        x: roadPoints[0].x,
        y: roadPoints[0].y,    
        width: 30,
        height: 50,
        road: world.road,
        controlType: USER_KEYBOARD,
        controlMode: GAMEMODE,
        sensorsCount: 31,
        // model: model
    });
    world.addEntity(car);

    viewport = new Viewport({
        world: world,
        width: window.innerWidth,
        height: window.innerHeight,
        mode: GAMEMODE
    });

    // init main loop
    animate(1);
});

/*
[
    new Point(100, 200),
    new Point(2305, 150),
    new Point(2240, 550),
    new Point(120, 640),
    new Point(200, 440)
];
*/
