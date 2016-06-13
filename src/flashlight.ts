/// <reference path="./phaser.d.ts"/>
/// <reference path="./visibility_polygon.d.ts"/>
/// <reference path="./value_bar.ts"/>

module GhostMansion {
    export class FlashLight {
        private polygons;
        private segments;
        private lightCanvas;
        private lightMask;
        private inputController;
        private activated:boolean = false;
        private health:number = 100;
        private rayWidth = 1.4;
        private rayLength = 60;

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
            this.segments = VisibilityPolygon.convertToSegments(this.polygons);

            this.lightCanvas = this.game.add.graphics(0, 0);
            this.lightMask = this.game.add.graphics(0, 0);
            this.inputController = this.sprite.getBehavior('inputController');

            var lightBar = new ValueBar(this.game, 0xffff00, 0, -this.sprite.height*0.8, () => {
                return this.health;
            }, this);
            this.sprite.addChild(lightBar);
        }

        update() {
            var position = [this.sprite.x, this.sprite.y];
            var a = this.inputController.direction;

            this.lightCanvas.clear();
            if (this.activated && this.health > 0) {
                var visibility = VisibilityPolygon.compute(position, this.segments);
                this.lightCanvas.lineStyle(2, 0xff8800, 0);
                var lightIntensity = 0.5*(1-Math.exp(-this.health/10));
                this.lightCanvas.beginFill(0xffff00, lightIntensity);
                this.lightCanvas.moveTo(visibility[0][0], visibility[0][1]);
                for (var i = 1; i < visibility.length; i++) {
                    this.lightCanvas.lineTo(visibility[i][0], visibility[i][1]);
                }
                this.lightCanvas.endFill();

                this.lightMask.clear();
                this.lightMask.beginFill(0xffffff);
                this.lightMask.arc(this.sprite.x, this.sprite.y, this.rayLength, a+this.rayWidth/2, a-this.rayWidth/2, true);
                this.lightCanvas.mask = this.lightMask;

                this.health -= this.game.time.physicsElapsed * 10;

                var g = this.game.ghost;
                if (VisibilityPolygon.inPolygon([g.x, g.y], visibility) && this.inMask(g.x, g.y)) {
                    g.stun(3);
                    g.deductHealth(this.game.time.physicsElapsed * 30);
                }
            }
        }

        inMask(x, y) {
            var dx = x - this.sprite.x;
            var dy = y - this.sprite.y;
            var dsq = dx*dx+dy*dy
            var a = Math.atan2(dy, dx);
            // sometimes a (angle from human to ghost) and direction (angle that human is facing)
            // need to be modded by 2 pi for cases like
            // a = -1.46 and direction = 4.82
            var angleDist = (a - this.inputController.direction) % (Math.PI * 2);
            while (angleDist < 0) angleDist += Math.PI * 2;
            angleDist = Math.min(angleDist, Math.PI * 2 - angleDist);
            console.log(angleDist);
            return angleDist >= -this.rayWidth/2 &&
                angleDist <= this.rayWidth/2 &&
                dsq <= this.rayLength*this.rayLength;
        }

        turnOn() {
            this.activated = true;
        }

        turnOff() {
            this.activated = false;
        }
    }
}
