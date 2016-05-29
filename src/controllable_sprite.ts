/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};
        public health: number = 100;
        public tag: string = 'human';
        private stunned: boolean = false;

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
            if (this.stunned) return;
            console.log('stunned');
            this.stunned = true;
            this.game.time.events.add(Phaser.Timer.SECOND*seconds, () => {
                this.stunned = false;
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

