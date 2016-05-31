/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ValueBar extends Phaser.Sprite {
        private maxWidth = 20;

        constructor(game, color, x, y, private valueFunc, private valueFuncContext) {
            super(game, x, y, null);

            var rect = game.make.graphics(0, 0);
            rect.beginFill(color);
            rect.drawRect(-10, -2, this.maxWidth, 4);
            rect.endFill();
            var texture = rect.generateTexture();
            this.loadTexture(texture);
            this.anchor.setTo(0.5);
        }

        postUpdate() {
            this.width = this.maxWidth * this.getValue() / 100;
        }

        getValue() {
            return this.valueFunc.call(this.valueFuncContext);
        }
    }
}

