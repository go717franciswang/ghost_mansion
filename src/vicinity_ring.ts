/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class VicinityRing {
        private circle;

        constructor(private sprite, private game) {
            var graphics = game.make.graphics(0, 0);
            graphics.lineStyle(2, 0x0000ff, 1);
            graphics.drawCircle(0, 0, 100);
            this.circle = new Phaser.Sprite(game, 0, 0, graphics.generateTexture());
            this.circle.anchor.setTo(0.5);
            this.sprite.addChild(this.circle);
            this.circle.alpha = 0;
        }

        update() {
            var d = this.distanceToGhost();
            this.circle.alpha = (d < 150);
            this.circle.width = d;
            this.circle.height = d;
        }

        distanceToGhost() {
            var d = Phaser.Point.distance(this.game.ghost.position, this.sprite.position)*2;
            d = Math.max(30, d);
            return d;
        }
    }
}
