/// <reference path="./phaser.d.ts"/>
/// <reference path="./visibility_polygon.d.ts"/>

module GhostMansion {
    export class FlashLight {
        private polygons;
        private segments;
        private lightCanvas;
        private inputController;
        private activated:boolean = false;
        private health:number = 100;

        constructor(private sprite, private game) {
            // Reference: http://www.emanueleferonato.com/2015/02/03/play-with-light-and-dark-using-ray-casting-and-visibility-polygons/
            this.polygons = [];
            this.polygons.push([
                [-1,-1], 
                [game.world.width+1,-1], 
                [game.world.width+1,game.world.height+1], 
                [-1,game.world.height+1]
            ]);
            var m = this.game.map;
            m.forEach((t) => {
                if (t.index != -1 && t.worldX !== undefined) {
                    this.polygons.push([
                        [t.worldX,t.worldY], 
                        [t.worldX+t.width,t.worldY], 
                        [t.worldX+t.width,t.worldY+t.height], 
                        [t.worldX,t.worldY+t.height]
                    ]);
                }
            }, this, 0, 0, m.width, m.height, this.game.walls);

            this.lightCanvas = this.game.add.graphics(0, 0);
            this.inputController = this.sprite.getBehavior('inputController');
        }

        update() {
            var position = [this.sprite.x, this.sprite.y];
            var a = this.inputController.direction;
            var rayWidth = 0.7;
            var rayLength = 70;

            this.lightCanvas.clear();
            if (this.activated && this.health > 0) {
                this.polygons[0] = [
                    // make sure ray begins behind origin
                    [this.sprite.x-Math.cos(a)*5, this.sprite.y-Math.sin(a)*5], 
                    [this.sprite.x+Math.cos(a+rayWidth)*rayLength, this.sprite.y+Math.sin(a+rayWidth)*rayLength],
                    [this.sprite.x+Math.cos(a-rayWidth)*rayLength, this.sprite.y+Math.sin(a-rayWidth)*rayLength]
                ];
                this.segments = VisibilityPolygon.convertToSegments(this.polygons);
                // this.segments = VisibilityPolygon.breakIntersections(this.segments); // very slow
                var visibility = VisibilityPolygon.compute(position, this.segments);
                this.lightCanvas.lineStyle(2, 0xff8800, 0);
                var lightIntensity = 0.5*(1-Math.exp(-this.health/10));
                this.lightCanvas.beginFill(0xffff00, lightIntensity);
                this.lightCanvas.moveTo(visibility[0][0], visibility[0][1]);
                for (var i = 1; i < visibility.length; i++) {
                    this.lightCanvas.lineTo(visibility[i][0], visibility[i][1]);
                }
                this.lightCanvas.endFill();

                this.health -= this.game.time.physicsElapsed * 10;

                var g = this.game.ghost;
                if (VisibilityPolygon.inPolygon([g.x, g.y], visibility)) {
                    g.deductHealth(this.game.time.physicsElapsed * 30);
                }
            }
        }

        turnOn() {
            this.activated = true;
        }

        turnOff() {
            this.activated = false;
        }
    }
}
