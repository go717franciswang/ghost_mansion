/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};
        public health: number = 100;

        setBehavior(key, behavior) {
            this.behaviors[key] = behavior;
        }

        getBehavior(key) {
            return this.behaviors[key];
        }

        deductHealth(amount) {
            this.health -= amount;
            if (this.health < 0) this.health = 0;
        }
    }
}

