function togglePause() {
    (paused = !paused) ? menu.show() : (menu.hide(), animate(frameTime)) ;
    document.getElementById('paused').style.display = paused ? 'flex' : 'none';
}

function generateCars(N, model) {
    const cars = [];    
    for (let i = 0; i < N; i++) {
        cars.push( 
            new Car({
                x: roadPoints[0].x,
                y: roadPoints[0].y,
                width: 25,
                height: 40,
                road: road,
                controlType: CPU,
                controlMode: DEFAULT_GAMEMODE,
                sensorsCount: 31,
                model: model
            })
        );
        // Muto todos menos el primero
        if (i > 0) cars[cars.length-1].brain.mutate(mutateRatio); 
        world.addDynamicEntity(cars[cars.length-1]);
    }
    return cars;
}

function generateTraffic(N) {
    const traffic = [];
    for (let i = 0; i < N; i++) {
        traffic.push( 
            new Car({            
                x: road.getLaneCenter( parseInt(Math.random()*3) ),// + (Math.random()*40-20), 
                y: -parseInt(Math.random() * 2200),
                width: 30, 
                height: 50, 
                controlType: 'DUMMY',
                maxSpeed: maxSpeedCars * 0.6 + Math.random() * maxSpeedCars * 0.2, 
                color: getRandomColor()
            }) 
        );
    }
    return traffic;
}

function resetTraffic(traffic) {
    for (let i = 0; i < traffic.length; i++) {
        [ traffic[i].x, traffic[i].y, traffic[i].maxSpeed ] = 
            [ trafficOriginalCoords[i].x, trafficOriginalCoords[i].y, trafficOriginalCoords[i].maxSpeed ];
    }
    return traffic;
}

function saveModel(name = 'model') {
    localStorage.setItem(name+'-bkp', JSON.stringify(restoreModel()));
    localStorage.setItem(name, JSON.stringify(bestCar.brain.getModel()));
    //localStorage.setItem(name+'-cp', JSON.stringify(bestCar.brain.getModel()));
}
function removeModel(name = 'model') {
    localStorage.removeItem(name);
}
function restoreModel(name = 'model') {
    return JSON.parse(localStorage.getItem(name));
}


//////////////////////////////////////////////////////////////////////////////////////////////////

function addTrainingData(car) {
    const inputs = car.getInputs();
    trainData.push({
        input: inputs,
        output: [
            car.controls.left,
            car.controls.forward,
            car.controls.right,
            car.controls.reverse
        ]
    });
}

function saveTrainingDataBatch() {
    const currentTrainData = JSON.parse(localStorage.getItem('trainData') || '[]');
    const newTrainData = [ ...currentTrainData, ...trainData ];
    localStorage.setItem('trainData', JSON.stringify(newTrainData));
    trainData = [];
    console.log('Train data saved! Data count: ' + newTrainData.length);
}

function restoreTrainingData() {
    return JSON.parse(localStorage.getItem('trainData') || '[]');
}

function discardTrainingData() {
    localStorage.removeItem('trainData');
}

function getTrainingData() {
    let data = restoreTrainingData(), inputs = data.map( d => d.input), outputs = data.map( d => d.output);
    return { inputs, outputs };
}

function train(opts = {}) {
    paused = true;
    bestCar.brain.train( { ...getTrainingData(), ...opts } );
}

// function discardLocalStorageModels() {
//     Object.keys(localStorage).forEach( k => k.slice(0, ('tensorflowjs_models/'+tfModelName).length) == 'tensorflowjs_models/'+tfModelName && (localStorage.removeItem(k)));
// }

