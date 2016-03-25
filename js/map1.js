GhostMansion.Map1 = function(game) {
};

var p;

GhostMansion.Map1.prototype = {
    create: function() {
        this.stage.backgroundColor = '#787878';

        //  The 'mario' key here is the Loader key given in game.load.tilemap
        var map = game.add.tilemap('mario');
        var box = this.make.graphics(0,0);
        box.lineStyle(8, 0xFF0000, 0.8);
        box.beginFill(0xFF700B, 1);
        box.drawRect(-50, -50, 100, 100);
        box.endFill();

        //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //  The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('biomechamorphs_001', 'tiles');
        
        //  Creates a layer from the World1 layer in the map data.
        //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        var layer = map.createLayer('Tile Layer 1');

        //  This resizes the game world to match the layer dimensions
        layer.resizeWorld();
        layer.scale.setTo(scale, scale);

        this.player = this.add.sprite(
            this.world.centerX,
            this.world.centerY,
            box.generateTexture()
        );
        this.player.anchor.set(0.5);
        p = this.player;
    }
};
