/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./ai_controller.ts"/>
/// <reference path="./controllable_sprite.ts"/>

module GhostMansion {
    export class Map1 extends Phaser.State {
        controllables: Phaser.Group;
        map: Phaser.Tilemap;
        walls: Phaser.TilemapLayer;
        ghost: any;

        create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '#787878';

            var box = this.make.graphics(0,0);
            box.lineStyle(8, 0xFF0000, 0.8);
            box.beginFill(0xFF700B, 1);
            box.drawRect(-5, -5, 5, 5);
            box.endFill();

            this.map = this.add.tilemap('map');
            this.map.addTilesetImage('biomechamorphs_001', 'tiles');
            this.map.setCollision(404, true, 'walls');
            var background = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');

            background.resizeWorld();
            this.walls.resizeWorld();

            var player = new ControllableSprite(this.game, this.world.centerX, this.world.centerY, box.generateTexture());
            player.anchor.setTo(0.5);
            this.game.add.existing(player);
            this.physics.enable(player);
            player.body.collideWorldBounds = true;
            this.controllables = this.add.group();
            this.controllables.add(player);

            player.controller = new InputController(player, this, {
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                action: Phaser.KeyCode.ENTER
            }, () => { console.log('action'); } );

            var ghost = new ControllableSprite(this.game, 0, 0, box.generateTexture());
            ghost.anchor.setTo(0.5);
            this.game.add.existing(ghost);
            this.physics.enable(ghost);
            ghost.body.collideWorldBounds = true;
            this.controllables.add(ghost);

            ghost.controller = new AiController(ghost, this);
            this.ghost = ghost;
        }

        update() {
            this.controllables.forEachAlive((controllable) => {
                controllable.controller.update();
            }, this);

            this.physics.arcade.collide(this.controllables, this.walls);
            this.physics.arcade.collide(this.controllables, this.controllables);
        }

        render() {
            // this.game.debug.spriteInfo(this.ghost, 32, 32);
        }
    }
}
