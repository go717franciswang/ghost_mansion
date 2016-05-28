/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};

        setBehavior(key, behavior) {
            this.behaviors[key] = behavior;
        }

        getBehavior(key) {
            return this.behaviors[key];
        }
    }
}

