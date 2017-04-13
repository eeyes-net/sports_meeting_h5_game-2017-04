window.addEventListener('load', function () {
    (function () {
        /**
         * 调整字体大小
         */
        var blockFontSize = function () {
            document.getElementsByClassName('game-block-container')[0].style.fontSize = window.innerWidth / 22 + 'px';
        };
        window.addEventListener('resize', blockFontSize);
        blockFontSize();
    })();

    // 游戏初始化
    var game = Game.game;
    game.init();

    // 游戏数据
    var life = 3; // 可尝试次数（无下限）
    var t1 = Date.now(), // 第一次游戏的开始时间
        t2, // 本次游戏开始时间
        t0, // dt时间的开始时间
        t, // dt时间的结束时间
        dt, // dt时间
        rate; // 速度倍率
    var plane; // 主飞机
    // 游戏过程记录
    var planeRecordSet = new Game.PlaneRecordSet(Game.data.server.base + Game.data.server.imgPlanePath, Game.data.plane.width, Game.data.plane.height);
    var planeRecord, planeRecordTimer;
    var planeTurnDirection = 0, planeTurnTimer;
    /**
     * 放置障碍物
     */
    var initBlocks = function () {
        for (var i = 0; i < Game.data.blocks.length; ++i) {
            var blockData = Game.data.blocks[i];
            var blockPos = blockData.pos;
            var block = new Game.Block(blockPos[0], blockPos[1], blockPos[2], blockPos[3]);
            var p = document.createElement('p');
            p.textContent = blockData.text;
            block.element.appendChild(p);
            game.addBlock(block);
        }
    };
    /**
     * 获取其他飞机的轨迹
     */
    var getGameRecord = function () {
        var oReq = new XMLHttpRequest;
        oReq.open('GET', Game.data.server.base + Game.data.server.getGameRecordURL);
        oReq.responseType = 'arraybuffer';
        oReq.onload = function () {
            var arrayBuffer = oReq.response;
            if (arrayBuffer) {
                planeRecordSet.fromArrayBuffer(arrayBuffer);
            }
        };
        oReq.send(null);
    };
    /**
     * 初始化Game.game对象
     */
    var initGame = function () {
        initBlocks();
        getGameRecord();
    };
    initGame();

    /**
     * 初始化飞机参数
     */
    var initPlane = function () {
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
    /**
     * 开始游戏
     */
    var startGame = function () {
        initPlane();
        startEventListener();
        paint();
    };
    /**
     * 设置飞行速度
     */
    var setPlaneVelocity = function () {
        var dt = Date.now() - t2;
        if (dt < Game.data.plane.accelerateTime) {
            plane.v = dt / Game.data.plane.accelerateTime * (Game.data.plane.maxSpeed - Game.data.plane.minSpeed) + Game.data.plane.minSpeed;
        } else {
            plane.v = Game.data.plane.maxSpeed;
        }
    };
    /**
     * 开始响应事件
     */
    var startEventListener = function () {
        clearInterval(planeTurnTimer);
        (function () {
            var t0 = Date.now();
            planeTurnTimer = setInterval(function () {
                var t = Date.now();
                var dt = t - t0;
                plane.theta += plane.v * Game.data.plane.turnSpeed * planeTurnDirection * dt;
                t0 = t;
            }, 16);
        })();
    };
    /**
     * 强制结束游戏
     */
    var finishGame = function () {
        clearInterval(planeTurnTimer);
        postGameRecord(planeRecord);
        planeRecordSet.push(planeRecord);
    };
    /**
     * 发送飞机轨迹
     * @param {Game.PlaneRecord} planeRecord
     */
    var postGameRecord = function (planeRecord) {
        var xhr = new XMLHttpRequest;
        xhr.open('POST', Game.data.server.base + Game.data.server.postGameRecordURL);
        xhr.send(planeRecord.toArrayBuffer());
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('send ok');
                }
            }
        }
    };
    /**
     * 根据距离计算分数
     * @param {number} distance
     */
    var calcScore = function (distance) {
        var score = 1;
        for (var i = 0; i < Game.data.score.length; ++i) {
            if (distance >= Game.data.score[i]) {
                ++score;
            }
        }
        return score;
    };
    // 调试信息输出的div
    var infoDiv = document.getElementsByClassName('game-info')[0];
    /**
     * 重绘
     * 如果未撞墙则继续requestAnimationFrame
     * 撞墙则停止
     */
    var paint = function () {
        t = Date.now();
        dt = t - t0;
        // 设置飞机参数，并绘制
        setPlaneVelocity();
        plane.timePast(dt);
        plane.paint();
        planeRecordSet.replay(t - t2);
        t0 = t;

        // 设置背景位置，并绘制
        game.y = plane.y - .3;
        game.paintBackground();

        // 输出调试信息
        infoDiv.innerHTML = 'life = ' + (life >= 0 ? life : ('+' + (-life) + 's'))
            + '<br> time = ' + ((t - t2) / 1000).toString().substr(0, 5)
            + 's<br> time sum = ' + ((t - t1) / 1000).toString().substr(0, 5)
            + 's<br> x = ' + plane.x.toString().substr(0, 4)
            + ' / 1.00<br> y = ' + plane.y.toString().substr(0, 4)
            + ' / ' + game.ym.toString().substr(0, 4)
            + '<br> theta = ' + (plane.theta * 180 / Math.PI).toString().substr(0, 3)
            + 'deg<br> v = ' + (plane.v * 10000).toString().substr(0, 4);
        // 撞墙检测
        var test = plane.test();
        switch (test) {
            case -1:
            case 1:
                finishGame();
                var time = parseInt((t - t2) / 10) / 100;
                var title = '';
                var distance = parseInt(plane.y / game.ym * 100);
                if (test === -1) {
                    --life;
                    title = '你坠毁了！！';
                } else {
                    distance = 100;
                    title = '恭喜你成功完成';
                }
                var score = calcScore(distance);
                setFinishText(title, time, distance, score);
                showFinish();
                break;
            case 0:
                requestAnimationFrame(paint);
                break;
            default:
                finishGame();
                break;
        }
    };

    // 屏幕点击事件
    var turnLeftStart = function (e) {
        e.preventDefault();
        planeTurnDirection = 1;
    };
    var turnRightStart = function (e) {
        e.preventDefault();
        planeTurnDirection = -1;
    };
    var turnEnd = function (e) {
        e.preventDefault();
        planeTurnDirection = 0;
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
    (function () {
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

    // 提示框
    var tipsDiv = document.getElementsByClassName('tips-wrapper')[0];
    var startDiv = document.getElementsByClassName('start')[0];
    var finishDiv = document.getElementsByClassName('finish')[0];
    var voteDiv = document.getElementsByClassName('vote')[0];
    var showStart = function () {
        tipsDiv.style.display = 'block';
        startDiv.style.display = 'block';
    };
    var hideStart = function () {
        tipsDiv.style.display = '';
        startDiv.style.display = '';
    };
    var showFinish = function () {
        tipsDiv.style.display = 'block';
        finishDiv.style.display = 'block';
    };
    var hideFinish = function () {
        tipsDiv.style.display = '';
        finishDiv.style.display = '';
    };
    var showVote = function () {
        setVoteAlert('');
        tipsDiv.style.display = 'block';
        voteDiv.style.display = 'block';
    };
    var hideVote = function () {
        tipsDiv.style.display = '';
        voteDiv.style.display = '';
    };
    /**
     * 设置结束页面的文本
     * @param {string} title
     * @param {string} time
     * @param {string} distance
     * @param {string} score
     */
    var setFinishText = function (title, time, distance, score) {
        document.getElementsByClassName('finish-title')[0].textContent = title;
        document.getElementsByClassName('finish-time')[0].textContent = time;
        document.getElementsByClassName('finish-distance')[0].textContent = distance;
        document.getElementsByClassName('finish-score')[0].textContent = score;
    };
    var setVoteAlert = function (text) {
        document.getElementsByClassName('vote-alert')[0].textContent = text;
    };
    var getVote = function () {
        // TODO
    };
    var startButtonListener = function () {
        hideStart();
        hideFinish();
        hideVote();
        startGame();
    };
    var voteButtonListener = function () {
        hideStart();
        hideFinish();
        showVote();
    };
    document.getElementsByClassName('start-button')[0].addEventListener('click', startButtonListener);
    document.getElementsByClassName('start-button')[1].addEventListener('click', startButtonListener);
    document.getElementsByClassName('start-button')[2].addEventListener('click', startButtonListener);
    document.getElementsByClassName('vote-button')[0].addEventListener('click', voteButtonListener);
    document.getElementsByClassName('vote-button')[1].addEventListener('click', voteButtonListener);

    // 投票
    var sendVote = function (i) {
        // TODO
        setVoteAlert(i);
    };
    var collegeSectionListener = function () {
        sendVote(this.dataset.id);
    };
    var collegeSections = document.getElementsByClassName('college-section');
    for (var i = 0; i < collegeSections.length; ++i) {
        collegeSections[i].addEventListener('click', collegeSectionListener);
    }
    showStart();
});
