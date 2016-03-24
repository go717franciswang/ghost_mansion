var GhostMansion = {};

GhostMansion.Preloader = function(game) {
};

GhostMansion.Preloader.prototype = {
    preload: function() {

        //  Tilemaps are split into two parts: The actual map data (usually stored in a CSV or JSON file) 
        //  and the tileset/s used to render the map.

        //  Here we'll load the tilemap data. The first parameter is a unique key for the map data.

        //  The second is a URL to the JSON file the map data is stored in. This is actually optional, you can pass the JSON object as the 3rd
        //  parameter if you already have it loaded (maybe via a 3rd party source or pre-generated). In which case pass 'null' as the URL and
        //  the JSON object as the 3rd parameter.

        //  The final one tells Phaser the foramt of the map data, in this case it's a JSON file exported from the Tiled map editor.
        //  This could be Phaser.Tilemap.CSV too.

        this.load.tilemap('mario', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);

        //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:

        this.load.image('tiles', 'assets/biomechamorphs_001.png');

    },

    create: function() {
        this.state.start('Map1');
    }
};
