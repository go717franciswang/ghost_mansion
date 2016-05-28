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

        constructor(private sprite, private game, private keyMap: KeyMap, private action: ()=>void) {
            this.velocity = 100;
        }

        update() {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;

            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                console.log('left');
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
        }
    }
}
