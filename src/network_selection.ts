/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class NetworkSelection extends Phaser.State {
        create() {
            this.addButton(this.world.centerX, this.world.centerY-20, 'Local', 'Preloader');
            this.addButton(this.world.centerX, this.world.centerY+20, 'Networked', null);
        }

        addButton(x, y, text, newState) {
            var style = { font: '32px Arial', fill: '#ffffff' };
            if (newState == null) style.fill = '#333333';
            var button = this.add.text(x, y, text, style);
            button.anchor.set(0.5);
            button.inputEnabled = true;
            button.events.onInputUp.add(() => {
                this.game.state.start(newState);
            }, this);
            return button;
        }
    }
}
