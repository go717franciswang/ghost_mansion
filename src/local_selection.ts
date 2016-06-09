/// <reference path="./phaser.d.ts"/>
/// <reference path="./common.ts"/>
/// <reference path="./map_selection.ts"/>

module GhostMansion {
    export class LocalSelection extends Phaser.State {
        create() {
            Common.addButton(this, this.world.centerX, this.world.centerY-20, '1 Player', 'MapSelection', 
                             {playerCount: 1});
            Common.addButton(this, this.world.centerX, this.world.centerY+20, '2 Players', 'MapSelection', 
                             {playerCount: 2});
        }
    }
}

