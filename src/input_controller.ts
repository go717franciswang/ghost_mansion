module GhostMansion {
    export interface KeyMap {
        left: number;
        right: number;
        up: number;
        down: number;
        action: number;
    }

    export class InputController {
        velocity: number;
        direction;

        constructor(private sprite, private game, private keyMap: KeyMap, private action: ()=>void) {
            this.velocity = 100;
            this.direction = Math.PI/2;
        }

        update() {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;

            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                this.sprite.body.velocity.x = -this.velocity;
            } else if (this.game.input.keyboard.isDown(this.keyMap.right)) {
                this.sprite.body.velocity.x = this.velocity;
            }

            if (this.game.input.keyboard.isDown(this.keyMap.up)) {
                this.sprite.body.velocity.y = -this.velocity;
            } else if (this.game.input.keyboard.isDown(this.keyMap.down)) {
                this.sprite.body.velocity.y = this.velocity;
            }

            if (this.game.input.keyboard.isDown(this.keyMap.action)) {
                this.action();
            }

            var v = this.sprite.body.velocity;
            if (v.x != 0 || v.y != 0) {
                if (v.x == 0) {
                    if (v.y > 0) this.direction = Math.PI/2;
                    else this.direction = -Math.PI/2;
                } else {
                    if (v.y == 0 && v.x < 0) this.direction = Math.PI;
                    else this.direction = Math.atan(v.y/v.x);
                }
            }
        }
    }
}
