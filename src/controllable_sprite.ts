/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ControllableSprite extends Phaser.Sprite {
        public components = {};

        setComponent(key, component) {
            this.components[key] = component;
        }

        getComponent(key) {
            return this.components[key];
        }
    }
}

