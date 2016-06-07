/// <reference path="./phaser.d.ts"/>
/// <reference path="./common.ts"/>

module GhostMansion {
    export class LocalSelection extends Phaser.State {
        create() {
            Common.addButton(this, this.world.centerX, this.world.centerY-20, '1 Player', 'Preloader', 
                             {playerCount: 1});
            Common.addButton(this, this.world.centerX, this.world.centerY+20, '2 Players', 'Preloader', 
                             {playerCount: 2});
        }
    }
}

