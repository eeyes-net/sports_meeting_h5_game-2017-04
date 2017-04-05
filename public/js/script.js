window.addEventListener('load', function () {
    var game = Game.game;

    // 游戏初始化
    game.init();

    // 放置障碍物
    for (var i = 0; i < Game.data.blocks.length; ++i) {
        var blockData = Game.data.blocks[i];
        var blockPos = blockData.pos;
        var block = new Game.Block(blockPos[0], blockPos[1], blockPos[2], blockPos[3]);
        var p = document.createElement('p');
        p.textContent = blockData.text;
        block.element.appendChild(p);
        game.addBlock(block);
    }

    // 游戏数据
    var life = 3; // 可尝试次数（无下限）
    var t1 = Date.now(); // 第一次游戏的开始时间
    var t2, // 本次游戏开始时间
        t0, // dt时间的开始时间
        t, // dt时间的结束时间
        dt, // dt时间
        rate; // 速度倍率
    var plane; // 主飞机

    // 录像
    var planeRecords = [];
    var planeRecord, planeRecordTimer;

    // 录像回放
    var replay = function (t) {
        for (var i = 0; i < planeRecords.length; ++i) {
            var planeRecord = planeRecords[i];
            planeRecord.replay(t);
            planeRecord.plane.paint();
        }
    };

    // 初始化数据
    var planeInit = function () {
        plane = new Game.Plane(Game.data.server.base + Game.data.server.imgPlanePath, Game.data.plane.width, Game.data.plane.height);
        game.addMyPlane(plane);
        plane.x = .5;
        plane.y = .3;
        plane.theta = 0;
        plane.v = .0002;
        rate = 1;
        t = t0 = t2 = Date.now();
        planeRecord = new Game.PlaneRecord(plane);
        planeRecord.record(0);
        planeRecordTimer = setInterval(function () {
            planeRecord.record(t - t2);
        }, 100);
    };

    // 调试信息输出的div
    var infoDiv = document.getElementsByClassName('game-info')[0];

    var paint = function () {
        t = Date.now();
        dt = t - t0;
        if (plane.v < .0004) {
            plane.v += dt * .0000002;
        } else {
            plane.v = .0004;
        }
        plane.timePast(dt);
        plane.paint();
        replay(t - t2);
        t0 = t;

        game.y = plane.y - .3;
        game.paintBackground();
        // 调试信息
        infoDiv.innerHTML = 'life = ' + (life >= 0 ? life : ('+' + (-life) + 's'))
            + '<br> time = ' + ((t - t2) / 1000).toString().substr(0, 5)
            + 's<br> time sum = ' + ((t - t1) / 1000).toString().substr(0, 5)
            + 's<br> x = ' + plane.x.toString().substr(0, 4)
            + ' / 1.00<br> y = ' + plane.y.toString().substr(0, 4)
            + ' / ' + game.ym.toString().substr(0, 4)
            + '<br> theta = ' + (plane.theta * 180 / Math.PI).toString().substr(0, 3)
            + 'deg<br> v = ' + (plane.v * 5000).toString().substr(0, 4);
        // 撞墙检测
        if (!plane.test(game)) {
            --life;
            sendRecord(planeRecord);
            planeRecords.push(planeRecord);
            game.addOtherPlane(planeRecord.plane);
            gameStart();
        } else
            requestAnimationFrame(paint);
    };

    // 开始执行
    window.gameStart = function () {
        planeInit();
        paint();
    };
    window.gameStart();

    // 屏幕点击事件
    (function () {
        var direction = 0;
        var t0 = Date.now();
        var timer = setInterval(function () {
            var t = Date.now();
            var dt = t - t0;
            plane.theta += .002 * direction * dt;
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
