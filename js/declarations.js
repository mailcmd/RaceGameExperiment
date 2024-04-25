
// Synaptic
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

// DATA CONSTANTS
const USER_KEYBOARD = 1, USER_JOYSTICK = 2, CPU = 3, DUMMY = 4;
const STATIC = 1, ROTATE = 2;
//const TOP_LEFT = 1, TOP_RIGHT = 2, BOTTOM_RIGHT = 3, BOTTOM_LEFT = 4;
 
const DEFAULT_GAMEMODE = STATIC;

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

// admin actions control
let paused = false, showMinimap = false;

var world, viewport, minimap, roadPoints, car, road;

