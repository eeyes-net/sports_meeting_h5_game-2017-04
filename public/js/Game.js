/**
 * 说明：
 * 坐标系为计算机中常用的左手系，
 * 使用方形坐标，以宽度为基准1，
 * 在整个游戏区域内，左上角是(0, 0)，右下角是(1, h / w)，
 * Game.game对象中有相对坐标和绝对坐标的转换方法。
 * 游戏中的时间以毫秒为单位
 * 故速度单位为“宽度基准每毫秒”
 */

var Game = Game || {};

Game.util = {};
Game.util.setTransform = function (element, transform) {
    element.style.msTransform = transform; //IE
    element.style.webkitTransform = transform; //Chrome and Safari
    element.style.MozTransform = transform; //Firefox
    element.style.OTransform = transform; //Opera
    element.style.transform = transform;
};
Game.util.buildTranslate = function (x, y) {
    return 'translate(' + x + 'px, ' + y + 'px)';
};
Game.util.buildRotate = function (theta) {
    return 'rotate(' + theta + 'rad)';
};
/**
 * 线性插值
 * (x1, y1)与(x2, y2)确定一条直线上
 * (x, y)在这条直线上，已知x求y。
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @returns {number}
 */
Game.util.lerp = function (x1, y1, x2, y2, x) {
    return (y2 - y1) / (x2 - x1) * (x - x1) + y1;
};

Game.game = {};
Game.game.init = function () {
    Game.game.getElements();
    Game.game.blocks = [];
    Game.game.myPlanes = [];
    Game.game.otherPlanes = [];
    window.addEventListener('resize', Game.game.resize);
    Game.game.resize();
    Game.game.y = 0;
    Game.game.height = Game.game.height / Game.game.width;
};
Game.game.getElements = function () {
    Game.game.elements = {};
    Game.game.elements.base = document.getElementsByClassName('game')[0];
    Game.game.elements.container = document.getElementsByClassName('game-container')[0];
    Game.game.elements.background = document.getElementsByClassName('game-background')[0];
    Game.game.elements.backgroundImages = document.getElementsByClassName('game-background-image');
    Game.game.elements.backgroundWrapper = document.getElementsByClassName('game-background-wrapper')[0];
    Game.game.elements.blockContainer = document.getElementsByClassName('game-block-container')[0];
    Game.game.elements.otherPlaneContainer = document.getElementsByClassName('game-other-plane-container')[0];
    Game.game.elements.myPlaneContainer = document.getElementsByClassName('game-my-plane-container')[0];
    Game.game.elements.wrapper = document.getElementsByClassName('game-wrapper')[0];
    Game.game.elements.turnLeftButton = document.getElementsByClassName('game-turn-left-button')[0];
    Game.game.elements.turnRightButton = document.getElementsByClassName('game-turn-right-button')[0];
};
Game.game.resize = function () {
    Game.game.elements.base.style.width = window.innerWidth + 'px';
    Game.game.elements.base.style.height = window.innerHeight + 'px';
    /**
     * 单位长度
     * @type {number}
     */
    Game.game.xi = window.innerWidth;
    Game.game.elements.background.style.width = Game.game.xi + 'px';
    /**
     * 纵向最大高度
     * @type {number}
     */
    Game.game.ym = Game.game.elements.background.clientHeight / Game.game.elements.background.clientWidth;
    Game.game.resizeBlocks();
    Game.game.resizePlanes();
    Game.game.resizeBackground();
};
Game.game.resizeBlocks = function () {
    for (var i = 0; i < Game.game.blocks.length; ++i) {
        Game.game.blocks[i].resize();
    }
};
Game.game.resizePlanes = function () {
    for (var i = 0; i < Game.game.myPlanes.length; ++i) {
        Game.game.myPlanes[i].resize();
    }
    for (var i = 0; i < Game.game.otherPlanes.length; ++i) {
        Game.game.otherPlanes[i].resize();
    }
};
Game.game.resizeBackground = function () {
    Game.game.elements.backgroundWrapper.style.height = Game.game.getLength(Game.game.ym) + 'px';
};

Game.game.paint = function () {
    var i;
    for (i = 0; i < this.myPlanes.length; ++i) {
        var plane = this.myPlanes[i];
        plane.paint();
    }
};
Game.game.paintBackground = function () {
    Game.util.setTransform(Game.game.elements.container, Game.game.buildTranslate(0, -this.y));
};

Game.game.addBlock = function (block) {
    Game.game.blocks.push(block);
    Game.game.elements.blockContainer.appendChild(block.element);
};
Game.game.addMyPlane = function (plane) {
    Game.game.myPlanes.push(plane);
    Game.game.elements.myPlaneContainer.appendChild(plane.img);
};
Game.game.addOtherPlane = function (plane) {
    Game.game.otherPlanes.push(plane);
    Game.game.elements.otherPlaneContainer.appendChild(plane.img);
};

Game.game.getLength = function (d) {
    return Game.game.xi * d;
};
Game.game.buildTranslate = function (x, y) {
    return Game.util.buildTranslate(Game.game.getLength(x), Game.game.getLength(y));
};

Game.Block = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.element = document.createElement('div');
    this.resize();
};
Game.Block.prototype.resize = function () {
    this.element.style.left = Game.game.getLength(this.left) + 'px';
    this.element.style.top = Game.game.getLength(this.top) + 'px';
    this.element.style.width = Game.game.getLength(this.right - this.left) + 'px';
    this.element.style.height = Game.game.getLength(this.bottom - this.top) + 'px';
};
Game.Block.prototype.isInner = function (x, y) {
    return this.left < x && x < this.right && this.top < y && y < this.bottom;
};

Game.Plane = function (src, width, height) {
    this.width = width;
    this.height = height;
    this.x = .5;
    this.y = 0;
    this.theta = 0;
    this.v = 0;
    this.img = document.createElement('img');
    this.img.src = src;
    this.resize();
};
Game.Plane.prototype.move = function (d) {
    this.x -= d * Math.sin(this.theta);
    this.y += d * Math.cos(this.theta);
};
Game.Plane.prototype.timePast = function (t) {
    this.move(this.v * t);
};
Game.Plane.prototype.resize = function () {
    this.img.style.left = (Game.game.getLength(-this.width / 2)) + 'px';
    this.img.style.top = (Game.game.getLength(-this.height / 2)) + 'px';
    this.img.style.width = Game.game.getLength(this.width) + 'px';
    this.img.style.height = Game.game.getLength(this.height) + 'px';
};
Game.Plane.prototype.paint = function () {
    Game.util.setTransform(this.img, Game.game.buildTranslate(this.x, this.y) + ' ' + Game.util.buildRotate(this.theta));
};
/**
 * 测试飞机是否与障碍物相撞
 * @return {number}  0 - 正常状态
 *                  -1 - 撞墙
 *                   1 - 全部完成。
 */
Game.Plane.prototype.test = function () {
    var h2 = this.height / 2, w2 = this.width / 2, c = Math.cos(this.theta), s = Math.sin(this.theta);
    var h2c = h2 * c, h2s = h2 * s, w2c = w2 * c, w2s = w2 * s;
    var points = [
        {
            x: this.x - h2s,
            y: this.y + h2c
        },
        {
            x: this.x + h2s + w2c,
            y: this.y - h2c + w2s
        },
        {
            x: this.x + h2s - w2c,
            y: this.y - h2c - w2s
        }
    ];
    for (var i = 0; i < 3; ++i) {
        var point = points[i];
        if (point.x < 0 || point.x > 1 || point.y < 0) {
            return -1;
        }
        for (var j = 0; j < Game.game.blocks.length; ++j) {
            var block = Game.game.blocks[j];
            if (block.isInner(point.x, point.y)) {
                return -1;
            }
        }
        if (point.y > Game.game.ym) {
            return 1;
        }
    }
    return 0;
};

Game.PlaneRecord = function (plane) {
    this.plane = plane;
    this.status = [];
};
Game.PlaneRecord.prototype.record = function (t) {
    this.status.push({
        t: t,
        x: this.plane.x,
        y: this.plane.y,
        theta: this.plane.theta
    });
};
Game.PlaneRecord.prototype.replay = function (t) {
    var record, record1;
    if (this.status.length === 1) {
        record = this.status[0];
        this.plane.x = record.x;
        this.plane.y = record.y;
        this.plane.theta = record.theta;
        this.plane.v = record.v;
    } else if (t >= this.status[this.status.length - 1].t) {
        record = this.status[this.status.length - 1];
        this.plane.x = record.x;
        this.plane.y = record.y;
        this.plane.theta = record.theta;
        this.plane.v = record.v;
    } else {
        for (var i = 1; i < this.status.length; ++i) {
            record1 = this.status[i];
            if (t < record1.t) {
                record = this.status[i - 1];
                break;
            }
        }
        this.plane.x = Game.util.lerp(record.t, record.x, record1.t, record1.x, t);
        this.plane.y = Game.util.lerp(record.t, record.y, record1.t, record1.y, t);
        this.plane.theta = Game.util.lerp(record.t, record.theta, record1.t, record1.theta, t);
        this.plane.v = record.v;
    }
};
/**
 * 转换为ArrayBuffer，可以用于保存
 * @return {ArrayBuffer}
 */
Game.PlaneRecord.prototype.toArrayBuffer = function () {
    var arrayBuffer = new ArrayBuffer(this.status.length * 16);
    var dv = new DataView(arrayBuffer);
    var byteOffset = 0;
    for (var i = 0; i < this.status.length; ++i) {
        var state = this.status[i];
        dv.setUint32(byteOffset, state.t);
        byteOffset += 4;
        dv.setFloat32(byteOffset, state.x);
        byteOffset += 4;
        dv.setFloat32(byteOffset, state.y);
        byteOffset += 4;
        dv.setFloat32(byteOffset, state.theta);
        byteOffset += 4;
    }
    return arrayBuffer;
};
Game.PlaneRecord.prototype.fromArrayBuffer = function (arrayBuffer) {
    var dv = new DataView(arrayBuffer);
    var byteOffset = 0;
    while (byteOffset < arrayBuffer.byteLength) {
        var state = {};
        state.t = dv.getUint32(byteOffset);
        byteOffset += 4;
        state.x = dv.getFloat32(byteOffset);
        byteOffset += 4;
        state.y = dv.getFloat32(byteOffset);
        byteOffset += 4;
        state.theta = dv.getFloat32(byteOffset);
        byteOffset += 4;
        this.status.push(state)
    }
};

Game.PlaneRecordSet = function (src, width, height) {
    this.src = src;
    this.width = width;
    this.height = height;
    this.records = [];
};
Game.PlaneRecordSet.prototype.push = function (record) {
    this.records.push(record);
    Game.game.addOtherPlane(record.plane);
};
Game.PlaneRecordSet.prototype.replay = function (t) {
    for (var i = 0; i < this.records.length; ++i) {
        var planeRecord = this.records[i];
        planeRecord.replay(t);
        planeRecord.plane.paint();
    }
};
Game.PlaneRecordSet.prototype.fromArrayBuffer = function (arrayBuffer) {
    var dv = new DataView(arrayBuffer);
    var byteOffset = 0;
    while (byteOffset < arrayBuffer.byteLength) {
        var byteCount = dv.getUint32(byteOffset);
        byteOffset += 4;
        var plane = new Game.Plane(this.src, this.width, this.height);
        var record = new Game.PlaneRecord(plane);
        record.fromArrayBuffer(arrayBuffer.slice(byteOffset, byteOffset + byteCount));
        byteOffset += byteCount;
        this.push(record);
    }
};
