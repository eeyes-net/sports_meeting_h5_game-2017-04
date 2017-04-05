window.addEventListener('load', function () {
    // 游戏初始化
    Game.game.init();

    // 放置障碍物
    var game = Game.game;
    for (var i = 0; i < Game.data.blocks.length; ++i) {
        var blockData = Game.data.blocks[i];
        var blockPos = blockData.pos;
        var block = new Game.Block(blockPos[0], blockPos[1], blockPos[2], blockPos[3]);
        var p = document.createElement('p');
        p.textContent = blockData.text;
        block.element.appendChild(p);
        game.addBlock(block);
    }

    // 游戏逻辑
    var life = 3;
    var t000 = Date.now();
    var t00 = t000;
    var t0 = t00;
    var v = 1;

    var plane = new Game.Plane(Game.data.server.base + Game.data.server.imgPlanePath, Game.data.plane.width, Game.data.plane.height);
    plane.x = .3;
    plane.y = .5;
    plane.theta = 0;
    v = 1;
    game.addMyPlane(plane);
    var infoDiv = document.getElementsByClassName('game-info')[0];
    var paint = function () {
        var t = Date.now();
        var dt = t - t0;
        if (v < 2) {
            v += (dt / 5000);
        } else {
            v = 2;
        }
        t0 = t;
        plane.move(dt / 5000 * v);
        plane.paint();
        game.y = plane.y - .2;
        game.paintBackground();
        // 调试信息
        infoDiv.innerHTML = 'life = ' + (life >= 0 ? life : ('+' + (-life) + 's'))
            + '<br> time = ' + ((t - t00) / 1000).toString().substr(0, 5)
            + 's<br> time sum = ' + ((t - t000) / 1000).toString().substr(0, 5)
            + 's<br> x = ' + plane.x.toString().substr(0, 4)
            + ' / 1.00<br> y = ' + plane.y.toString().substr(0, 4)
            + ' / ' + game.ym.toString().substr(0, 4)
            + '<br> theta = ' + (plane.theta * 180 / Math.PI).toString().substr(0, 3)
            + 'deg<br> v = ' + v.toString().substr(0, 4);
        // 撞墙检测
        if (!plane.test(game)) {
            plane.x = .3;
            plane.y = .5;
            plane.theta = 0;
            v = 1;
            t0 = t00 = Date.now();
            --life;
        }
        requestAnimationFrame(paint);
    };
    paint();

    // 屏幕点击事件
    (function () {
        var direction = 0;
        var t0 = Date.now();
        var timer = setInterval(function () {
            var t = Date.now();
            var dt = t - t0;
            plane.theta += .002 * direction * v * dt;
            t0 = t;
        }, 16);
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
        document.addEventListener('keydown', function (e) {
            var keyCode = e.keyCode;
            if (keyCode === 37) {
                turnLeftStart(e);
            } else if (keyCode === 39) {
                turnRightStart(e);
            }
        });
        document.addEventListener('keyup', function (e) {
            var keyCode = e.keyCode;
            if (keyCode === 37 || keyCode === 39) {
                turnEnd(e);
            }
        });
    })();
});
