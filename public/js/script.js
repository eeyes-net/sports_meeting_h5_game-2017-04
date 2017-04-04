Game.game.init();
var game = Game.game;
game.addBlock(new Game.Block(.5, .05, 1, .1));
game.addBlock(new Game.Block(0, .15, .5, .2));
game.addBlock(new Game.Block(.5, .25, 1, .3));
game.addBlock(new Game.Block(0, .35, .5, .4));

var t0 = Date.now();
var plane = new Game.Plane();
game.addPlane(plane);
var paint = function () {
    plane.y = .05 + (Date.now() - t0) / 50000;
    plane.x = .5 - .3 * Math.sin(plane.y * 30);
    plane.theta = Math.cos(plane.y * 30);
    plane.paint();
    game.y = plane.y - .02;
    game.paintBackground();
    requestAnimationFrame(paint);
};
paint();

(function () {
    var turnLeftTimer, turnRightTimer;
    Game.game.elements.turnLeftButton.addEventListener('touchstart', function (e) {
        turnLeftTimer = setInterval(function () {
            plane.theta += .01;
        }, 10);
        plane.theta += .01;
        console.log('turn left start');
    });
    Game.game.elements.turnRightButton.addEventListener('touchstart', function (e) {
        turnRightTimer = setInterval(function () {
            plane.theta -= .01;
        }, 10);
        plane.theta -= .01;
    });
    Game.game.elements.turnLeftButton.addEventListener('touchend', function (e) {
        clearInterval(turnLeftTimer);
    });
    Game.game.elements.turnRightButton.addEventListener('touchend', function (e) {
        clearInterval(turnRightTimer);
    });
})();
