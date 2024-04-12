
// Synaptic
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

// DATA CONSTANTS
const USER = 1, CPU = 2, DUMMY = 3;
 

// config constants
const carsCount = 100; 
const maxSpeedCars = 500;
const terrainColor = '#60AF60';
const roadColor = '#707070';
const roadSignals = 'white';
const roadWidth = 100;

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
viewportCanvas.style.backgroundColor = terrainColor;
viewportCanvas.style.position = 'fixed';
viewportCanvas.style.border = '1px solid black';
viewportCanvas.width = window.innerWidth*1;
viewportCanvas.height = window.innerHeight*1;
viewportCanvas.style.left = ((window.innerWidth - viewportCanvas.width) / 2) + 'px';
viewportCanvas.style.top = ((window.innerHeight - viewportCanvas.height) / 2) + 'px';
const viewportCtx = viewportCanvas.getContext('2d');

/*
viewportDiv.style.backgroundColor = terrainColor;
viewportDiv.style.position = 'fixed';
viewportDiv.style.border = '1px solid black';
viewportDiv.style.width = (window.innerWidth*0.6) + 'px';
viewportDiv.style.height = (window.innerHeight*0.8) + 'px';
viewportDiv.style.left = ((window.innerWidth - viewportDiv.clientWidth) / 2) + 'px';
viewportDiv.style.top = ((window.innerHeight - viewportDiv.clientHeight) / 2) + 'px';
viewportDiv.style.overflow = 'hidden';
*/

// road declaration
const roadPoints = [
    new Point(100, 200),
    new Point(2305, 150),
    new Point(2240, 550),
    new Point(120, 640),
    new Point(200, 440)
];

//create world
const world = new World({ roadPoints, viewportCtx });

const car = new Car({
    x: roadPoints[0].x,
    y: roadPoints[0].y,    
    width: 30,
    height: 50,
    road: world.road,
    controlType: USER,
    sensorsCount: 31,
//    model: model
});

world.addEntity(car);

const viewport = new Viewport({
    ctx: viewportCtx,
    world: world
});

//viewport.setCenter(car.x, car.y);

// init main loop
animate(1);


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
