module GhostMansion {
    export interface KeyMap {
        left: number;
        right: number;
        up: number;
        down: number;
        flashlight: number;
    }

    export class InputController {
        velocity: number;
        direction;

        constructor(private sprite, private game, private keyMap: KeyMap) {
            this.velocity = 100;
            this.direction = Math.PI/2;
        }

        update() {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;

            var vx = 0;
            var vy = 0;
            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                vx = -this.velocity;
            } else if (this.game.input.keyboard.isDown(this.keyMap.right)) {
                vx = this.velocity;
            }

            if (this.game.input.keyboard.isDown(this.keyMap.up)) {
                vy = -this.velocity;
            } else if (this.game.input.keyboard.isDown(this.keyMap.down)) {
                vy = this.velocity;
            }

            if (this.game.input.keyboard.isDown(this.keyMap.flashlight)
               && this.sprite.entityState == EntityState.Normal) {
                this.sprite.getBehavior('flashlight').turnOn();
            } else {
                this.sprite.getBehavior('flashlight').turnOff();
            }

            this.sprite.move(vx, vy);

            var v = this.sprite.body.velocity;
            if (v.x != 0 || v.y != 0) {
                var newDir = Math.atan2(v.y, v.x);
                var d = Math.abs(newDir - this.direction);
                if (d < Math.PI) {
                    var mag = Math.min(d, Math.PI/2);
                    var dir = (newDir - this.direction) / d;
                    this.direction += mag*dir*this.game.time.physicsElapsed*10;
                } else {
                    var mag = Math.min(2*Math.PI - d, Math.PI/2);
                    var dir = -(newDir - this.direction) / d;
                    this.direction += mag*dir*this.game.time.physicsElapsed*10;
                }
            }
        }
    }
}
