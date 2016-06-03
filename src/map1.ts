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

        create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '#787878';

            this.box = this.makeBox(0xff700b);
            this.boxStunned = this.makeBox(0x666699);
            this.boxPanicked = this.makeBox(0xffff00);

            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('biomechamorphs_001', 'tiles');
            this.map.setCollision(404, true, 'walls');
            var background = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');

            background.resizeWorld();
            this.walls.resizeWorld();

            var player = new ControllableSprite(this.game, this.world.centerX, this.world.centerY, this.box);
            player.anchor.setTo(0.5);
            this.game.add.existing(player);
            this.physics.enable(player);
            player.body.collideWorldBounds = true;
            this.controllables = this.add.group();
            this.controllables.add(player);

            player.setBehavior('inputController', new InputController(player, this, {
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                flashlight: Phaser.KeyCode.ENTER
            }));

            player.setBehavior('flashlight', new FlashLight(player, this));
            player.setBehavior('vicinityRing', new VicinityRing(player, this));

            var ghost = new ControllableSprite(this.game, 0, 0, this.box);
            ghost.anchor.setTo(0.5);
            ghost.alpha = 0;
            this.game.add.existing(ghost);
            this.physics.enable(ghost);
            ghost.body.collideWorldBounds = true;
            this.controllables.add(ghost);

            ghost.setBehavior('AI', new AiController(ghost, this));
            ghost.tag = 'ghost';
            ghost.onStun = () => { ghost.alpha = 1; };
            ghost.onNormal = () => { ghost.alpha = 0; };
            this.ghost = ghost;
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
            this.physics.arcade.collide(this.controllables, this.controllables, this.collideCallback, null, this);
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
                human.deductHealth(this.time.physicsElapsed*40);
                human.stun(3);
            }
        }

        render() {
            // this.game.debug.spriteInfo(this.ghost, 32, 32);
        }
    }
}
