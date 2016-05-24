/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./controllable_sprite.ts"/>

module GhostMansion {
    export class Map1 extends Phaser.State {
        players: Phaser.Group;
        ghost: Phaser.Sprite;
        walls: Phaser.TilemapLayer;
        p: any;

        create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.stage.backgroundColor = '#787878';

            var box = this.make.graphics(0,0);
            box.lineStyle(8, 0xFF0000, 0.8);
            box.beginFill(0xFF700B, 1);
            box.drawRect(-5, -5, 5, 5);
            box.endFill();

            var map = this.add.tilemap('map');
            map.addTilesetImage('biomechamorphs_001', 'tiles');
            map.setCollision(404, true, 'walls');
            var background = map.createLayer('background');
            this.walls = map.createLayer('walls');

            background.resizeWorld();
            this.walls.resizeWorld();
            console.log(map);
            console.log(this.walls);

            var player = new ControllableSprite(this.game, this.world.centerX, this.world.centerY, box.generateTexture());
            this.game.add.existing(player);
            this.physics.enable(player);
            this.physics.arcade.gravity.y = 0;
            player.body.collideWorldBounds = true;
            this.players = this.add.group();
            this.players.add(player);
            this.p = player;

            player.controller = new InputController(player, this, {
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                action: Phaser.KeyCode.ENTER
            }, () => { console.log('action'); } );

            this.ghost = this.add.sprite(this.world.centerX, this.world.centerY, box.generateTexture());
            this.physics.enable(this.ghost);
        }

        update() {
            this.physics.arcade.collide(this.players, this.walls);
            this.physics.arcade.collide(this.players, this.ghost);
            this.physics.arcade.collide(this.ghost, this.walls);

            this.players.forEachAlive((controllable) => {
                controllable.controller.update();
            }, this);
        }
    }
}
