/// <reference path="./phaser.d.ts"/>
/// <reference path="./visibility_polygon.d.ts"/>

module GhostMansion {
    export class FlashLight {
        private polygons;

        constructor(private playerSprite, private game) {
            // TODO: http://www.emanueleferonato.com/2015/02/03/play-with-light-and-dark-using-ray-casting-and-visibility-polygons/
            this.polygons = [];
            this.polygons.push([[0,0], [this.game.width,0], [this.game.width,this.game.height], [0, this.game.height]]);
            var m = this.game.map;
            m.forEach((tile) => {
                console.log(tile);
            }, 0, 0, m.width, m.height, this.game.walls);
        }
    }
}
