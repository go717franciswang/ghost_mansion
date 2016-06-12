/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./ai_controller.ts"/>
/// <reference path="./flashlight.ts"/>
/// <reference path="./vicinity_ring.ts"/>
/// <reference path="./controllable_sprite.ts"/>

module GhostMansion {
    export class Map1 extends Phaser.State {
        controllables: Phaser.Group;
        map: Phaser.Tilemap;
        walls: Phaser.TilemapLayer;
        ghost: any;
        box: any;
        boxStunned: any;
        boxPanicked: any;
        private lives = 3;
        private setting;

        init(setting) {
            this.setting = setting;
        }

        create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '#787878';

            this.box = this.makeBox(0xff700b);
            this.boxStunned = this.makeBox(0x666699);
            this.boxPanicked = this.makeBox(0xffff00);

            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('biomechamorphs_001', 'tiles');
            // TODO: need to handle alpha for the background
            var background = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');
            this.collideWalls();

            background.resizeWorld();
            background.alpha = 0.3;
            // this.walls.resizeWorld();

            this.controllables = this.add.group();
            this.addPlayer({
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                flashlight: Phaser.KeyCode.ENTER
            });
            if (this.setting.playerCount == 2) {
                this.addPlayer({
                    left: Phaser.KeyCode.A,
                    right: Phaser.KeyCode.D,
                    up: Phaser.KeyCode.W,
                    down: Phaser.KeyCode.S,
                    flashlight: Phaser.KeyCode.SPACEBAR
                });
            }

            var ghost = new ControllableSprite(this.game, 0, 0, this.box);
            ghost.anchor.setTo(0.5);
            ghost.fadeOut();
            this.game.add.existing(ghost);
            this.physics.enable(ghost);
            ghost.body.collideWorldBounds = true;
            this.controllables.add(ghost);

            ghost.setBehavior('AI', new AiController(ghost, this));
            ghost.tag = 'ghost';
            ghost.onStun = ghost.fadeIn;
            ghost.onNormal = ghost.fadeOut;
            ghost.onDeath = () => {
                this.displayMessage('You win');
                this.gameOver();
            };
            this.ghost = ghost;
        }

        collideWalls() {
            var distinctTileIndexsObj = {};
            this.map.forEach((tile) => {
                if (tile.index != -1 && tile.index != undefined) distinctTileIndexsObj[tile.index] = true;
            }, this, 0, 0, this.map.width, this.map.height, this.walls);
            var distinctTileIndexs = Object.keys(distinctTileIndexsObj);
            distinctTileIndexs.forEach((index) => {
                this.map.setCollision(parseInt(index), true, 'walls');
            });
        }

        addPlayer(keyMap) {
            var player = new ControllableSprite(this.game, this.world.centerX, this.world.centerY, this.box);
            player.anchor.setTo(0.5);
            this.game.add.existing(player);
            this.physics.enable(player);
            player.body.collideWorldBounds = true;
            this.controllables.add(player);

            player.setBehavior('inputController', new InputController(player, this, keyMap));
            player.setBehavior('flashlight', new FlashLight(player, this));
            player.setBehavior('vicinityRing', new VicinityRing(player, this));
            player.onDeath = () => {
                this.lives--;
                if (this.lives <= 0) {
                    this.displayMessage('You lose');
                    this.gameOver();
                } else {
                    var text = this.displayMessage('You have ' + this.lives + ' lives left');
                    var tween = this.add.tween(text).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(() => { text.destroy(); });
                    player.health = 100;
                    player.getBehavior('flashlight').health = 100;
                }
            }
            return player;
        }

        gameOver() {
            this.controllables.forEachAlive((c) => {
                c.purgeBehaviors();
            }, this);
        }

        displayMessage(msg) {
            var style = { font: '32px Arial' };
            var text = this.add.text(this.world.centerX, this.world.centerY, msg, style);
            text.anchor.set(0.5);
            text.align = 'center';
            return text;
        }

        update() {
            this.controllables.forEachAlive((controllable) => {
                for (var key in controllable.behaviors) {
                    try {
                        controllable.behaviors[key].update();
                    } catch(e) {
                        console.error(e);
                    }
                }
            }, this);

            this.physics.arcade.collide(this.controllables, this.walls);
            this.physics.arcade.collide(this.controllables, this.controllables, 
                                        this.collideCallback, this.processCallback, this);
        }

        makeBox(color) {
            var box = this.make.graphics(0,0);
            box.lineStyle(8, color, 0.8);
            box.beginFill(color, 1);
            box.drawRect(-5, -5, 5, 5);
            box.endFill();
            return box.generateTexture();
        }

        collideCallback(a, b) {
            var human = null;
            var ghost = null;
            if (a.tag == 'ghost') { 
                human = b; 
                ghost = a;
            } else if (b.tag == 'ghost') { 
                human = a; 
                ghost = b;
            }

            if (human) {
                human.deductHealth(this.time.physicsElapsed*100);
                human.stun(3);
                ghost.fadeIn();
                this.time.events.add(Phaser.Timer.SECOND*3, () => {
                    ghost.fadeOut();
                });
            }
        }

        processCallback(a, b) {
            if ((a.tag == 'ghost' || a.tag == 'human') && a.entityState == EntityState.Panicked) {
                return false;
            }
            if ((b.tag == 'ghost' || b.tag == 'human') && b.entityState == EntityState.Panicked) {
                return false;
            }
            return true;
        }

        render() {
            // this.game.debug.spriteInfo(this.ghost, 32, 32);
        }
    }
}
