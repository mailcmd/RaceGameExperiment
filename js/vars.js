
// Synaptic
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

// DATA CONSTANTS
const   
    USER_KEYBOARD1 = 0, 
    USER_KEYBOARD2 = 1, 
    USER_JOYSTICK1 = 2, 
    USER_JOYSTICK2 = 3, 
    USER_JOYSTICK3 = 4, 
    USER_JOYSTICK4 = 5, 
    CPU = 98, DUMMY = 99;
    
const STATIC = 1, ROTATE = 2, FULLSCREEN = 3;
//const TOP_LEFT = 1, TOP_RIGHT = 2, BOTTOM_RIGHT = 3, BOTTOM_LEFT = 4;
 
const DEFAULT_GAMEMODE = FULLSCREEN;

// config constants
const carsCount = 100; 
const maxSpeedCars = 500;
const terrainColor = '#60AF60';
const roadColor = '#707070';
const roadSignals = 'white';
const roadWidth = 150;

// global variables
let frameCount = 0;
let frameTime = 0;
let deltaTime = 0;
let gamemode = DEFAULT_GAMEMODE;
let mutateRatio = 0.05;

// admin actions control
let paused = false, showMinimap = false, resetGameNow = false;

var generation = 0;
var world, viewport, minimap, roadPoints, car, cars, bestCar, road, traffic = [];

