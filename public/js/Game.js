/**
 * 说明：
 * 坐标系为计算机中常用的左手系，
 * 在整个游戏区域内，左上角是(0, 0)右下角是(1, 1)
 * Game.Game类中有相对坐标和绝对坐标的转换方法
 */


var Game = Game || {};

Game.const = {
    host: '/sports_meeting_h5_game-2017-04/public/',
    // host: '/',
    imgBlockPath: 'images/block.png',
    imgPlanePath: 'images/plane.png',
    planeWidth: .1,
    planeHeight: .01
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
    Game.game.y = 0;
    Game.game.blocks = [];
    Game.game.planes = [];
    window.addEventListener('resize', Game.game.resize);
    Game.game.resize();
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
    Game.game.width = Game.game.elements.backgroundImage.clientWidth;
    Game.game.height = Game.game.elements.backgroundImage.clientHeight;
    Game.game.paintBlocks();
};

Game.game.paint = function () {
    var i;
    for (i = 0; i < this.planes.length; ++i) {
        var plane = this.planes[i];
        plane.paint();
    }
};
Game.game.paintBlocks = function () {
    for (var i = 0; i < Game.game.blocks.length; ++i) {
        Game.game.blocks[i].paint();
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

Game.game.test = function () {
    for (var i = 0; i < this.blocks.length; ++i) {
        var block = this.blocks[i];
        if (block.isInner(0, 0)) {
            return false;
        }
    }
    return true;
};

Game.game.getAbsoluteX = function (x) {
    return Game.game.width * x;
};
Game.game.getAbsoluteY = function (y) {
    return Game.game.height * y;
};
Game.game.buildTranslate = function (x, y) {
    return Game.util.buildTranslate(Game.game.getAbsoluteX(x), Game.game.getAbsoluteY(y));
};

Game.Block = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.img = document.createElement('img');
    this.img.src = Game.const.host + Game.const.imgBlockPath;
    this.paint();
};
Game.Block.prototype.paint = function () {
    this.img.style.left = Game.game.getAbsoluteX(this.left) + 'px';
    this.img.style.top = Game.game.getAbsoluteY(this.top) + 'px';
    this.img.style.width = (Game.game.getAbsoluteX(this.right) - Game.game.getAbsoluteX(this.left)) + 'px';
    this.img.style.height = (Game.game.getAbsoluteY(this.bottom) - Game.game.getAbsoluteY(this.top)) + 'px';
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
    this.img.style.left = (Game.game.getAbsoluteX(-this.width / 2)) + 'px';
    this.img.style.top = '0';
    this.img.style.width = (Game.game.getAbsoluteX(this.width / 2) - Game.game.getAbsoluteX(-this.width / 2)) + 'px';
    this.img.style.height = (Game.game.getAbsoluteY(this.height / 2) - Game.game.getAbsoluteY(-this.height / 2)) + 'px';
};
Game.Plane.prototype.paint = function () {
    Game.util.setTransform(this.img, Game.game.buildTranslate(this.x, this.y) + ' ' + Game.util.buildRotate(this.theta));
};
