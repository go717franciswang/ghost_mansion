/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class Common {
        static addButton(game, x, y, text, newState, a1=null) {
            var style = { font: '32px Arial', fill: '#ffffff' };
            if (newState == null) style.fill = '#333333';
            var button = game.add.text(x, y, text, style);
            button.anchor.set(0.5);
            button.inputEnabled = true;
            button.events.onInputUp.add(() => {
                game.state.start(newState, true, false, a1);
            }, this);
            return button;
        }
    }
}
