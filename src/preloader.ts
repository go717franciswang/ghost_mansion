/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class Preloader extends Phaser.State {
        preload() {
            this.load.path = '/resources/ghost_mansion/';
            this.load.tilemap('mario', 'test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'biomechamorphs_001.png');
        }

        create() {
            this.game.state.start('Map1');
        }
    }
}

