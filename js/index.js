
document.onkeypress = e => {
    console.log(e.keyCode)
    if (e.keyCode == 32) {
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
};

const editor = new TrackEditor(document.createElement('canvas'), { hidden: true });
const menu = new Menu(menuData, {open: false});

// main functions
function animate(time) {
    deltaTime = Math.min(time - frameTime, 300);
    frameTime = time;

    // main tasks
    world.update();
    viewport.setCenter(car.x, car.y, car.angle - PI/2);
    viewport.display();

    if (showMinimap) minimap.update();

    if (!paused) {
        requestAnimationFrame(animate);
    }
    frameCount++;
}

//editor.loadFromFile(function(editor){
(async function(){    
    
    editor.load(await fetchdata('data/circle.json'), true);
    roadPoints = editor.getScalated(window.innerWidth * 2);    

    //create world
    world = new World({ 
        roadPoints: roadPoints,
        width: window.innerWidth * 2
    });

    road = new Road({ roadPoints, roadWidth });
    world.addStaticEntity(road);
    
    world.renderizeStatic();

    car = new Car({
        x: roadPoints[0].x,
        y: roadPoints[0].y,    
        width: 30,
        height: 50,
        road: road,
        controlType: USER_KEYBOARD,
        controlMode: DEFAULT_GAMEMODE,
        sensorsCount: 31,
        // model: model
    });
    world.addDynamicEntity(car);

    viewport = new Viewport({
        world: world,
        width: window.innerWidth,
        height: window.innerHeight,
        mode: DEFAULT_GAMEMODE
    });

    minimap = new Minimap({
        world: world,
        visible: showMinimap
    });

    // init main loop
    animate(1);

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
