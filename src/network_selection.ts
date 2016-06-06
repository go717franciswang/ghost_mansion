/// <reference path="./phaser.d.ts"/>
/// <reference path="./common.ts"/>

module GhostMansion {
    export class NetworkSelection extends Phaser.State {
        create() {
            Common.addButton(this, this.world.centerX, this.world.centerY-20, 'Local', 'LocalSelection');
            Common.addButton(this, this.world.centerX, this.world.centerY+20, 'Networked', null);
        }
    }
}
