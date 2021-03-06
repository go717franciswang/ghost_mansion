/// <reference path="./phaser.d.ts"/>
/// <reference path="./value_bar.ts"/>

module GhostMansion {
    export enum EntityState {
        Normal,
        Stunned,
        Panicked
    }

    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};
        public health: number = 100;
        public healthBar;
        public tag: string = 'human';
        public entityState = EntityState.Normal;
        public onStun;
        public onPanic;
        public onNormal;
        public onDeath;

        constructor(g, x, y, k) {
            super(g, x, y, k);
            this.healthBar = new ValueBar(g, 0xff0000, 0, -this.height*1.1, () => { 
                return this.health 
            }, this);
            this.addChild(this.healthBar);
        }

        setBehavior(key, behavior) {
            this.behaviors[key] = behavior;
        }

        getBehavior(key) {
            return this.behaviors[key];
        }

        purgeBehaviors() {
            this.behaviors = {};
        }

        deductHealth(amount) {
            if (this.entityState == EntityState.Panicked) return;
            this.health -= amount;
            if (this.health < 0) this.health = 0;
            if (this.health == 0 && this.onDeath) this.onDeath();
        }

        stun(seconds) {
            if (this.entityState != EntityState.Normal) return;
            this.entityState = EntityState.Stunned;
            if (this.onStun) this.onStun();
            this.loadTexture(this.game.state.states['Map1'].boxStunned);
            this.game.time.events.add(Phaser.Timer.SECOND*seconds, () => {
                this.entityState = EntityState.Panicked;
                if (this.onPanic) this.onPanic();
                this.loadTexture(this.game.state.states['Map1'].boxPanicked);
                this.game.time.events.add(Phaser.Timer.SECOND*3, () => { 
                    this.entityState = EntityState.Normal;
                    if (this.onNormal) this.onNormal();
                    this.loadTexture(this.game.state.states['Map1'].box);
                });
            }, this);
        }

        fadeIn() {
            var tween = this.game.add.tween(this);
            tween.to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
        }

        fadeOut() {
            var tween = this.game.add.tween(this);
            tween.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        }

        move(vx, vy) {
            if (this.entityState == EntityState.Stunned) {
                this.body.static = true;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            } else {
                this.body.static = false;
                this.body.velocity.x = vx;
                this.body.velocity.y = vy;
            }
        }
    }
}

