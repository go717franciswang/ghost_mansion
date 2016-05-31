/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class ControllableSprite extends Phaser.Sprite {
        public behaviors = {};
        public health: number = 100;
        public healthBar;
        private healthBarRect;
        public tag: string = 'human';
        private stunned: boolean = false;
        private panicked: boolean = false;

        constructor(g, x, y, k) {
            super(g, x, y, k);
            this.addHealthBar();
        }

        addHealthBar() {
            var rect = this.game.make.graphics(0, 0);
            rect.beginFill(0xff0000);
            rect.drawRect(-10, -2, 20, 4);
            rect.endFill();
            this.healthBar = this.game.make.sprite(0, -this.height*1.1, rect.generateTexture());
            this.healthBar.anchor.setTo(0.5);

            this.healthBarRect = new Phaser.Rectangle(0, 0, this.healthBar.width, this.healthBar.height);
            this.healthBar.crop(this.healthBarRect);
            this.addChild(this.healthBar);
        }

        setBehavior(key, behavior) {
            this.behaviors[key] = behavior;
        }

        getBehavior(key) {
            return this.behaviors[key];
        }

        deductHealth(amount) {
            if (this.panicked) return;
            this.health -= amount;
            if (this.health < 0) this.health = 0;
            this.healthBarRect.width = this.healthBar.width * this.health / 100;
            this.healthBar.updateCrop();
        }

        stun(seconds) {
            if (this.stunned || this.panicked) return;
            this.stunned = true;
            this.loadTexture(this.game.state.states['Map1'].boxStunned);
            this.game.time.events.add(Phaser.Timer.SECOND*seconds, () => {
                this.stunned = false;
                this.panicked = true;
                this.loadTexture(this.game.state.states['Map1'].boxPanicked);
                this.game.time.events.add(Phaser.Timer.SECOND*3, () => { 
                    this.panicked = false; 
                    this.loadTexture(this.game.state.states['Map1'].box);
                });
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

