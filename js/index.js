
document.addEventListener('keydown', e => {
    //console.log(e.keyCode)
    if (e.keyCode == 27) {
        //(paused = !paused) || animate(frameTime) ;
        //document.getElementById('paused').style.display = paused ? 'flex' : 'none';
        togglePause();
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
}, true);

const listeners = new ListenersManager();
const gamepadController = new GamepadsController();
const editor = new TrackEditor(document.createElement('canvas'), { hidden: true });

// main functions
function animate(time) {
    deltaTime = Math.min(time - frameTime, 300);
    frameTime = time;

    // main tasks
    world.update();
    
    const carMaxScore = Math.max(...cars.map( c => c.score ));
    bestCar = cars.find( car => car.score ==  carMaxScore) ?? bestCar;    
    
//    viewport.setCenter(car.x, car.y, car.angle - PI/2);
    viewport.display();

    if (showMinimap) minimap.update();

    if (cars && cars.filter( c => !c.damaged ).length == 0) {
        createNextGeneration();
    } else if (resetGameNow) {
        resetGame();
    }
    
    if (!paused) {
        requestAnimationFrame(animate);
    }
    frameCount++;
}

//editor.loadFromFile(function(editor){
(async function(){    
    
    editor.load(await fetchdata('data/rally.json'), true);
    roadPoints = editor.getScalated(window.innerWidth, window.innerHeight);    

    //create world
    world = new World({ 
        roadPoints: roadPoints,
        width: window.innerWidth,
        height: window.innerHeight
    });

    road = new Road({ roadPoints, roadWidth });
    world.addStaticEntity(road);
    
    world.renderizeStatic();
    /*
    car = new Car({
        x: roadPoints[0].x,
        y: roadPoints[0].y,    
        width: 25,
        height: 40,
        road: road,
        controlType: CPU, //USER_KEYBOARD1,
        controlMode: DEFAULT_GAMEMODE,
        sensorsCount: 31,
        model: (await fetch('models/good_31_4.json').then(response => response.json()))
    });
    world.addDynamicEntity(car);
    */
    cars = generateCars(50, (await fetch('models/good_31_4.json').then(response => response.json())));

    viewport = new Viewport({
        world: world,
        width: window.innerWidth,
        height: window.innerHeight,
        centerX: window.innerWidth / 2,
        centerY: window.innerHeight / 2,
        mode: DEFAULT_GAMEMODE
    });

    minimap = new Minimap({
        world: world,
        visible: showMinimap
    });

    menu = new Menu(menuData, { 
        open: false, 
        width: '25%',
        onShow: function() {
            listeners.save();
            Menu.addKeyboardListeners();
        },
        onHide: function() {
            listeners.restore();
        }
    });

    // init main loop
    animate(1);

    setTimeout( togglePause, 500 );
//});
})();



////////////////////////////////////////////////////////////////////////////////////////////

/*
[
    new Point(100, 200),
    new Point(2305, 150),
    new Point(2240, 550),
    new Point(120, 640),
    new Point(200, 440)
];
*/
