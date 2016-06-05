/// <reference path="./phaser.d.ts"/>
/// <reference path="./preloader.ts"/>
/// <reference path="./map1.ts"/>
/// <reference path="./network_selection.ts"/>

module GhostMansion {
    export function startGame() {
        var game = new Phaser.Game(320, 240, Phaser.AUTO, 'container');
        game.state.add('Preloader', GhostMansion.Preloader);
        game.state.add('Map1', GhostMansion.Map1);
        game.state.add('NetworkSelection', GhostMansion.NetworkSelection);
        game.state.start('NetworkSelection');
    }
}
