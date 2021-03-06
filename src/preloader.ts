/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class Preloader extends Phaser.State {
        private setting: any;

        init(setting) {
            this.setting = setting;
        }

        preload() {
            this.load.path = '/resources/ghost_mansion/';
            this.load.tilemap('map', this.setting.map + '?r='+Math.random(), null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'biomechamorphs_001.png');
        }

        create() {
            this.game.state.start('Map1', true, false, this.setting);
        }
    }
}

