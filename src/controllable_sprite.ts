/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};
        public health: number = 100;
        public tag: string = 'human';
        private stunned: boolean = false;
        private panicked: boolean = false;

        setBehavior(key, behavior) {
            this.behaviors[key] = behavior;
        }

        getBehavior(key) {
            return this.behaviors[key];
        }

        deductHealth(amount) {
            this.health -= amount;
            if (this.health < 0) this.health = 0;
        }

        stun(seconds) {
            if (this.stunned || this.panicked) return;
            this.stunned = true;
            this.setTexture(this.game.state.current.boxStunned); // TODO: get reference to this texture
            this.game.time.events.add(Phaser.Timer.SECOND*seconds, () => {
                this.stunned = false;
                this.panicked = true;
                this.setTexture(this.game.state.current.boxPanicked);
                this.game.time.events.add(Phaser.Timer.SECOND*3, () => { this.panicked = false; });
            }, this);
        }

        move(vx, vy) {
            if (this.stunned) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            } else {
                this.body.velocity.x = vx;
                this.body.velocity.y = vy;
            }
        }
    }
}

