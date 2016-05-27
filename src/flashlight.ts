/// <reference path="./phaser.d.ts"/>
/// <reference path="./visibility_polygon.d.ts"/>

module GhostMansion {
    export class FlashLight {
        constructor(private playerSprite, private game) {
            // TODO: http://www.emanueleferonato.com/2015/02/03/play-with-light-and-dark-using-ray-casting-and-visibility-polygons/
        }
    }
}
