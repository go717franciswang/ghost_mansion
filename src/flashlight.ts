/// <reference path="./phaser.d.ts"/>
/// <reference path="./visibility_polygon.d.ts"/>

module GhostMansion {
    export class FlashLight {
        private polygons;
        private segments;
        private lightCanvas;

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
            console.log(this.polygons);
            this.segments = VisibilityPolygon.convertToSegments(this.polygons);

            this.lightCanvas = this.game.add.graphics(0, 0);
        }

        update() {
            var position = [this.sprite.x, this.sprite.y];
            var visibility = VisibilityPolygon.compute(position, this.segments);
            this.lightCanvas.clear();
            this.lightCanvas.lineStyle(2, 0xff8800, 0.5);
            this.lightCanvas.beginFill(0xffff00, 0.5);
            this.lightCanvas.moveTo(visibility[0][0], visibility[0][1]);
            for (var i = 1; i < visibility.length; i++) {
                this.lightCanvas.lineTo(visibility[i][0], visibility[i][1]);
            }
            this.lightCanvas.endFill();
        }
    }
}
