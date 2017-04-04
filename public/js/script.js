Game.game.init();
var game = Game.game;
for (var i = 0; i < Game.data.blocks.length; ++i) {
    var block = Game.data.blocks[i];
    game.addBlock(new Game.Block(block[0], block[1], block[2], block[3]));
}

var life = 3;
var t000 = Date.now();
var t00 = t000;
var t0 = t00;
var v = 1;
var plane = new Game.Plane();
plane.x = .3;
plane.y = .5;
plane.theta = 0;
v = 1;
game.addPlane(plane);
var infoDiv = document.getElementsByClassName('game-info')[0];
var paint = function () {
    var t = Date.now();
    var dt = t - t0;
    if (v < 3) {
        v += (dt / 5000);
    } else {
        v = 3;
    }
    t0 = t;
    plane.move(dt / 5000 * v);
    plane.paint();
    game.y = plane.y - .2;
    game.paintBackground();
    if (!plane.test(game)) {
        plane.x = .3;
        plane.y = .5;
        plane.theta = 0;
        v = 1;
        t0 = t00 = Date.now();
        --life;
    }
    infoDiv.innerHTML = 'life = ' + life
        + 's,<br> time = ' + ((t - t00) / 1000).toString().substr(0, 5)
        + 's,<br> time sum = ' + ((t - t000) / 1000).toString().substr(0, 5)
        + ',<br> x = ' + plane.x.toString().substr(0, 4)
        + '/ 1.00,<br> y = ' + plane.y.toString().substr(0, 4)
        + '/' + game.ym.toString().substr(0, 4)
        + ',<br> theta = ' + (plane.theta * 180 / Math.PI) .toString().substr(0, 3)
        + 'deg,<br> v = ' + v.toString().substr(0, 4);
    requestAnimationFrame(paint);
};
paint();

(function () {
    var direction = 0;
    var timer = setInterval(function () {
        plane.theta += .01 * direction * v;
    });
    var turnLeftStart = function (e) {
        e.preventDefault();
        direction = 1;
    };
    var turnRightStart = function (e) {
        e.preventDefault();
        direction = -1;
    };
    var turnEnd = function (e) {
        e.preventDefault();
        direction = 0;
    };
    Game.game.elements.turnLeftButton.addEventListener('touchstart', turnLeftStart);
    Game.game.elements.turnRightButton.addEventListener('touchstart', turnRightStart);
    Game.game.elements.turnLeftButton.addEventListener('touchend', turnEnd);
    Game.game.elements.turnRightButton.addEventListener('touchend', turnEnd);
    Game.game.elements.turnLeftButton.addEventListener('touchcancel', turnEnd);
    Game.game.elements.turnRightButton.addEventListener('touchcancel', turnEnd);
    Game.game.elements.turnLeftButton.addEventListener('mousedown', turnLeftStart);
    Game.game.elements.turnRightButton.addEventListener('mousedown', turnRightStart);
    Game.game.elements.turnLeftButton.addEventListener('mouseup', turnEnd);
    Game.game.elements.turnRightButton.addEventListener('mouseup', turnEnd);
})();
