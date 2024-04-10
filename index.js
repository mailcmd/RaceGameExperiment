
// Synaptic
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

// config constants
const carsCount = 100; 
const maxSpeedCars = 500;
const roadColor = '#c0c0c0';
const roadSignals = 'white';


// global variables
let frameTime = 0;
let deltaTime = 0;
let resetTimeOut = -1;

// admin actions control
let paused = false, refreshCanvas = true, resetGameNow = false;

document.onkeypress = e => {
    console.log(e.keyCode)
    if (e.keyCode == 32) {
        (paused = !paused) || animate(frameTime) ;
        document.getElementById('paused').style.display = paused ? 'flex' : 'none';
    } else if (e.keyCode == 13) {
        refreshCanvas = !refreshCanvas;
    } else if (e.keyCode == 82 || e.keyCode == 114) {
        resetGameNow = true;
    } else if (e.keyCode == 83 || e.keyCode == 115) {
        saveModel();
    }
};

// main settings
raceCanvas.width = window.innerWidth * 5;
raceCanvas.height = window.innerHeight * 5 ;
const raceCtx = raceCanvas.getContext('2d');

const roadPoints = [
    new Point(50, 50),
    new Point(250, 70),
    new Point(240, 250),
    new Point(120, 340),
    new Point(30, 240)
];


// road declaration
const world = new World(raceCtx, roadPoints);

world.draw();

//for (let p of roadPoints) p.draw();

// cars declaration and init
// let you, cars;
// try {
//     const model = restoreModel();
//     cars = generateCars(carsCount, model,  controlType);
//     animate(1);
// } catch(e) {
//     cars = generateCars(carsCount, null, controlType);
//     animate(1);
// };
