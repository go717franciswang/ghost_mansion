/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class AiController {
        private path: any[];
        private step: number;
        private debugLine: any;

        constructor(private sprite, private game) {
            this.debugLine = this.game.add.graphics(0, 0);
            this.updatePath();
        }

        update() {
            var p0 = this.tileMapPos2WordPos(this.path[this.step]);
            var p1 = this.tileMapPos2WordPos(this.path[this.step+1]);
            var p = p0;
            if (p1 && Phaser.Math.distanceSq(this.sprite.x, this.sprite.y, p0.x, p0.y) < 5) {
                this.step++;
                p = p1;
            }

            var angle = Phaser.Math.angleBetween(this.sprite.x, this.sprite.y, p.x, p.y);
            this.sprite.body.velocity.x = Math.cos(angle)*50;
            this.sprite.body.velocity.y = Math.sin(angle)*50;
        }

        tileMapPos2WordPos(tilePos) {
            if (tilePos === undefined) return null;
            return { 
                x: (tilePos.x+0.5)*this.game.map.tileWidth, 
                y: (tilePos.y+0.5)*this.game.map.tileHeight 
            };
        }

        updatePath() {
            this.path = this.bfs(() => {
                this.game.time.events.add(Phaser.Timer.SECOND*4, this.updatePath, this);
            }).path;
            this.step = 0;

            if (this.debugLine) {
                var worldPath = this.path.map((p) => { return this.tileMapPos2WordPos(p); });
                this.debugLine.clear();
                this.debugLine.lineStyle(3, 0xffd900, 0.5);
                this.debugLine.moveTo(worldPath[0].x, worldPath[1]);
                for (var i = 1; i < worldPath.length; i++) {
                    this.debugLine.lineTo(worldPath[i].x, worldPath[i].y);
                }
            }
        }

        bfs(callback) {
            console.log('bfs');
            var myTile = this.getTile(this.sprite);
            var targetTiles = [];
            this.game.controllables.forEachAlive((controllable) =>{
                if (controllable != this.sprite) {
                    targetTiles.push(this.getTile(controllable));
                }
            });

            var edges = [myTile];
            var prevTile = {};
            prevTile[this.tile2id(myTile)] = -1;
            while(true) {
                var newEdges = [];

                for (var i = 0; i < edges.length; i++){
                    var e = edges[i];
                    var id = this.tile2id(e);
                    var tiles = [
                        this.game.map.getTileAbove(this.game.walls.index, e.x, e.y),
                        this.game.map.getTileBelow(this.game.walls.index, e.x, e.y),
                        this.game.map.getTileLeft(this.game.walls.index, e.x, e.y),
                        this.game.map.getTileRight(this.game.walls.index, e.x, e.y)
                    ];

                    for (var j = 0; j < tiles.length; j++){
                        var tile = tiles[j];
                        if (tile == null) continue;
                        var tileId = this.tile2id(tile);

                        if (prevTile[tileId] === undefined && tile.index != 404) {
                            prevTile[tileId] = id;
                            newEdges.push(tile);
                        }

                        for (var k = 0; k < targetTiles.length; k++){
                            if (targetTiles[k].x == tile.x && targetTiles[k].y == tile.y) {
                                if (callback) callback();
                                return { reached: tile, path: this.computePath(tile, prevTile) };
                            }
                        }
                    }
                }

                edges = newEdges;
            }
        }

        computePath(reached, prevTile) {
            var path = [];
            var id = prevTile[this.tile2id(reached)];
            while (id != -1) {
                if (id === undefined) {
                    console.log(prevTile);
                    throw 'No path';
                }

                path.push(this.id2pos(id));
                id = prevTile[id];
            }

            return path.reverse();
        }

        tile2id(tile) {
            return tile.x + tile.y*this.game.map.width;
        }

        id2pos(id) {
            var y = Math.floor(id / this.game.map.width);
            var x = id - y * this.game.map.width;
            return { x: x, y: y };
        }

        getTile(sprite) {
            var m = this.game.map;
            return m.getTileWorldXY(sprite.x, sprite.y, m.width, m.height, this.game.walls, true);
        }
    }
}
