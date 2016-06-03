/// <reference path="./phaser.d.ts"/>
/// <reference path="./value_bar.ts"/>

module GhostMansion {
    enum EntityState {
        Normal,
        Stunned,
        Panicked
    }

    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};
        public health: number = 100;
        public healthBar;
        public tag: string = 'human';
        private entityState = EntityState.Normal;
        public onStun;
        public onPanic;
        public onNormal;

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

        deductHealth(amount) {
            if (this.entityState == EntityState.Panicked) return;
            this.health -= amount;
            if (this.health < 0) this.health = 0;
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

