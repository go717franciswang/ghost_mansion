/// <reference path="./phaser.d.ts"/>
/// <reference path="./input_controller.ts"/>
/// <reference path="./controllable_sprite.ts"/>

module GhostMansion {
    export class Map1 extends Phaser.State {
        players: Phaser.Group;
        ghost: Phaser.Sprite;

        create() {
            this.stage.backgroundColor = '#787878';

            //  The 'mario' key here is the Loader key given in game.load.tilemap
            var map = this.add.tilemap('mario');
            var box = this.make.graphics(0,0);
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

            var player = new ControllableSprite(this.game, this.world.centerX, this.world.centerY, box.generateTexture());
            player.anchor.set(0.5);
            this.game.add.existing(player);
            this.players = this.add.group();
            this.players.add(player);

            player.controller = new InputController(player, this, {
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN,
                action: Phaser.KeyCode.ENTER
            }, () => { console.log('action'); } );

            this.ghost = this.add.sprite(this.world.centerX, this.world.centerY, box.generateTexture());
        }

        update() {
            this.players.forEachAlive((controllable) => {
                controllable.controller.update();
            }, this);
        }
    }
}
