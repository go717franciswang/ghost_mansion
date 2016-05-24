var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.load.path = '/resources/ghost_mansion/';
            this.load.tilemap('mario', 'test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'biomechamorphs_001.png');
        };
        Preloader.prototype.create = function () {
            this.game.state.start('Map1');
        };
        return Preloader;
    }(Phaser.State));
    GhostMansion.Preloader = Preloader;
})(GhostMansion || (GhostMansion = {}));
var GhostMansion;
(function (GhostMansion) {
    var InputController = (function () {
        function InputController(sprite, game, keyMap, action) {
            this.sprite = sprite;
            this.game = game;
            this.keyMap = keyMap;
            this.action = action;
            this.velocity = 1;
        }
        InputController.prototype.update = function () {
            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                this.sprite.x -= this.velocity;
            }
            else if (this.game.input.keyboard.isDown(this.keyMap.right)) {
                this.sprite.x += this.velocity;
            }
            if (this.game.input.keyboard.isDown(this.keyMap.up)) {
                this.sprite.y -= this.velocity;
            }
            else if (this.game.input.keyboard.isDown(this.keyMap.down)) {
                this.sprite.y += this.velocity;
            }
            if (this.game.input.keyboard.isDown(this.keyMap.action)) {
                this.action();
            }
        };
        return InputController;
    }());
    GhostMansion.InputController = InputController;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var ControllableSprite = (function (_super) {
        __extends(ControllableSprite, _super);
        function ControllableSprite() {
            _super.apply(this, arguments);
        }
        return ControllableSprite;
    }(Phaser.Sprite));
    GhostMansion.ControllableSprite = ControllableSprite;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./controllable_sprite.ts"/>
var GhostMansion;
(function (GhostMansion) {
    var Map1 = (function (_super) {
        __extends(Map1, _super);
        function Map1() {
            _super.apply(this, arguments);
        }
        Map1.prototype.create = function () {
            this.stage.backgroundColor = '#787878';
            //  The 'mario' key here is the Loader key given in game.load.tilemap
            var map = this.add.tilemap('mario');
            var box = this.make.graphics(0, 0);
            box.lineStyle(8, 0xFF0000, 0.8);
            box.beginFill(0xFF700B, 1);
            box.drawRect(-7, -7, 7, 7);
            box.endFill();
            //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
            //  The second parameter maps this name to the Phaser.Cache key 'tiles'
            map.addTilesetImage('biomechamorphs_001', 'tiles');
            //  Creates a layer from the World1 layer in the map data.
            //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
            var layer = map.createLayer('Tile Layer 1');
            //  This resizes the game world to match the layer dimensions
            layer.resizeWorld();
            var player = new GhostMansion.ControllableSprite(this.game, this.world.centerX, this.world.centerY, box.generateTexture());
            player.anchor.set(0.5);
            this.game.add.existing(player);
            this.players = this.add.group();
            this.players.add(player);
            player.controller = new GhostMansion.InputController(player, this, {
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                action: Phaser.KeyCode.ENTER
            }, function () { console.log('action'); });
            this.ghost = this.add.sprite(this.world.centerX, this.world.centerY, box.generateTexture());
        };
        Map1.prototype.update = function () {
            this.players.forEachAlive(function (controllable) {
                controllable.controller.update();
            }, this);
        };
        return Map1;
    }(Phaser.State));
    GhostMansion.Map1 = Map1;
})(GhostMansion || (GhostMansion = {}));
/// <reference path="./phaser.d.ts"/>
/// <reference path="./preloader.ts"/>
/// <reference path="./map1.ts"/>
var GhostMansion;
(function (GhostMansion) {
    function startGame() {
        var game = new Phaser.Game(320, 240, Phaser.AUTO, 'container');
        game.state.add('Preloader', GhostMansion.Preloader);
        game.state.add('Map1', GhostMansion.Map1);
        game.state.start('Preloader');
    }
    GhostMansion.startGame = startGame;
})(GhostMansion || (GhostMansion = {}));
