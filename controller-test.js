// window.addEventListener('gc.controller.found', function(event) {
//     var controller = event.detail.controller;
//     console.log("Controller found at index " + controller.index + ".");
//     console.log("'" + controller.name + "' is ready!");
// }, false);

// window.addEventListener('gc.button.press', function(event) {
//     var button = event.detail;
//     console.log(button);
// }, false);

// window.addEventListener('gc.analog.hold', function(event) {
// 	console.log(event.detail);
// }, false);

// Controller.search();

/*
const g = new GamepadsController();

g.addGamepadHandler(0, {
    pressButton: console.log,
    releaseButton: console.log,
    changeAxis: function(g) { console.log(g) },
    holdAxis: function(g) { console.log(g) },
    centerAxis: function(g) { console.log(g) }
});
*/

const lm = new ListenersManager();

document.addEventListener('keydown', ev => console.log('Tecla '+ev.key, Math.random(), ev) );
document.addEventListener('keyup', ev => console.log('Tecla '+ev.key, Math.random(), ev) );

function a() {
    lm.save();
    document.addEventListener('click', ev => console.log('Click pressed: '+ev.key, Math.random()) );
} 
function b() {
    lm.restore();
}
