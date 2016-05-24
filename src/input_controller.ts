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
            this.velocity = 1;
        }

        update() {
            if (this.game.input.keyboard.isDown(this.keyMap.left)) {
                this.sprite.x -= this.velocity;
            } else if (this.game.input.keyboard.isDown(this.keyMap.right)) {
                this.sprite.x += this.velocity;
            }

            if (this.game.input.keyboard.isDown(this.keyMap.up)) {
                this.sprite.y -= this.velocity;
            } else if (this.game.input.keyboard.isDown(this.keyMap.down)) {
                this.sprite.y += this.velocity;
            }

            if (this.game.input.keyboard.isDown(this.keyMap.action)) {
                this.action();
            }
        }
    }
}
