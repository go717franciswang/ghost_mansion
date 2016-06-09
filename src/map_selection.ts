/// <reference path="./phaser.d.ts"/>
/// <reference path="./common.ts"/>

module GhostMansion {
    export class MapSelection extends Phaser.State {
        private setting;

        init(setting) {
            this.setting = setting;
        }

        create() {
            Common.addButton(this, this.world.centerX, this.world.centerY-20, 'Main Floor', 'Preloader', 
                             this.selectMap('main-floor.json'));
            Common.addButton(this, this.world.centerX, this.world.centerY+20, 'Research Lab', 'Preloader', 
                             this.selectMap('research-lab.json'));
        }

        selectMap(map) {
            this.setting.map = map;
            return this.setting;
        }
    }
}

