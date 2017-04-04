/**
 * 说明：
 * 坐标系为计算机中常用的左手系，
 * 使用方形坐标，以宽度为基准1，
 * 在整个游戏区域内，左上角是(0, 0)，右下角是(1, h / w)，
 * Game.game对象中有相对坐标和绝对坐标的转换方法
 */

var Game = Game || {};

Game.const = {
    host: '/sports_meeting_h5_game-2017-04/public/',
    // host: '/',
    imgBlockPath: 'images/block.png',
    imgPlanePath: 'images/plane.png',
    planeWidth: .1,
    planeHeight: .1
};

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

Game.game = {};
Game.game.init = function () {
    Game.game.getElements();
    Game.game.blocks = [];
    Game.game.planes = [];
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
    Game.game.elements.backgroundImage = document.getElementsByClassName('game-background-image')[0];
    Game.game.elements.blockContainer = document.getElementsByClassName('game-block-container')[0];
    Game.game.elements.planeContainer = document.getElementsByClassName('game-plane-container')[0];
    Game.game.elements.wrapper = document.getElementsByClassName('game-wrapper')[0];
    Game.game.elements.turnLeftButton = document.getElementsByClassName('game-turn-left-button')[0];
    Game.game.elements.turnRightButton = document.getElementsByClassName('game-turn-right-button')[0];
};
Game.game.resize = function () {
    Game.game.elements.base.style.width = window.innerWidth + 'px';
    Game.game.elements.base.style.height = window.innerHeight + 'px';
    Game.game.elements.backgroundImage.style.width = window.innerWidth + 'px';
    /**
     * 单位长度
     * @type {number}
     */
    Game.game.xi = Game.game.elements.backgroundImage.clientWidth;
    /**
     * 纵向最大高度
     * @type {number}
     */
    Game.game.ym = Game.game.elements.backgroundImage.clientHeight / Game.game.elements.backgroundImage.clientWidth;
    Game.game.resizeBlocks();
    Game.game.resizePlanes();
};
Game.game.resizeBlocks = function () {
    for (var i = 0; i < Game.game.blocks.length; ++i) {
        Game.game.blocks[i].resize();
    }
};
Game.game.resizePlanes = function () {
    for (var i = 0; i < Game.game.planes.length; ++i) {
        Game.game.planes[i].resize();
    }
};

Game.game.paint = function () {
    var i;
    for (i = 0; i < this.planes.length; ++i) {
        var plane = this.planes[i];
        plane.paint();
    }
};
Game.game.paintBackground = function () {
    Game.util.setTransform(Game.game.elements.container, Game.game.buildTranslate(0, -this.y));
};

Game.game.addBlock = function (block) {
    Game.game.blocks.push(block);
    Game.game.elements.blockContainer.appendChild(block.img);
};
Game.game.addPlane = function (plane) {
    Game.game.planes.push(plane);
    Game.game.elements.planeContainer.appendChild(plane.img);
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
    this.img = document.createElement('img');
    this.img.src = Game.const.host + Game.const.imgBlockPath;
    this.resize();
};
Game.Block.prototype.resize = function () {
    this.img.style.left = Game.game.getLength(this.left) + 'px';
    this.img.style.top = Game.game.getLength(this.top) + 'px';
    this.img.style.width = Game.game.getLength(this.right - this.left) + 'px';
    this.img.style.height = Game.game.getLength(this.bottom - this.top) + 'px';
};
Game.Block.prototype.isInner = function (x, y) {
    return this.left < x && x < this.right && this.top < y && y < this.bottom;
};

Game.Plane = function () {
    this.width = Game.const.planeWidth;
    this.height = Game.const.planeHeight;
    this.x = .5;
    this.y = 0;
    this.theta = 0;
    this.img = document.createElement('img');
    this.img.src = Game.const.host + Game.const.imgPlanePath;
    this.resize();
};
Game.Plane.prototype.move = function (d) {
    this.x -= d * Math.sin(this.theta);
    this.y += d * Math.cos(this.theta);
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
Game.Plane.prototype.test = function (game) {
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
        if (point.x < 0 || point.x > 1 || point.y < 0 || point.y > game.ym) {
            return false;
        }
        for (var j = 0; j < game.blocks.length; ++j) {
            var block = game.blocks[j];
            if (block.isInner(point.x, point.y)) {
                return false;
            }
        }
    }
    return true;
};