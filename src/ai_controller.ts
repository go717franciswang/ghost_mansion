/// <reference path="./phaser.d.ts"/>

module GhostMansion {
    export class AiController {
        private path: any[];
        private step: number;
        private debugLine: any;

        constructor(private sprite, private game) {
            this.debugLine = this.game.add.graphics(0, 0);
            this.step = 0;
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
            this.sprite.move(Math.cos(angle)*50, Math.sin(angle)*50);
        }

        tileMapPos2WordPos(tilePos) {
            if (tilePos === undefined) return null;
            return { 
                x: (tilePos.x+0.5)*this.game.map.tileWidth, 
                y: (tilePos.y+0.5)*this.game.map.tileHeight 
            };
        }

        updatePath() {
            var targetTileIds;
            if (this.sprite.entityState != EntityState.Normal) {
                targetTileIds = this.genTargetTileIdsEscape();
            } else {
                targetTileIds = this.genTargetTileIdsChaseLowFlashlight();
                if (Object.keys(targetTileIds).length == 0) {
                    targetTileIds = this.genTargetTileIdsLurk();
                }
            }

            var newPath = this.bfs(targetTileIds).path;
            if (this.path && this.path[this.step] != newPath[0]) this.step = 1;
            this.path = newPath;
            if (this.path.length == 1) this.step = 0; // in case target is in the same tile
            this.game.time.events.add(Phaser.Timer.SECOND*1, this.updatePath, this);

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

        genTargetTileIdsEscape() {
            var targetTileIds = {};
            var humans = [];
            this.game.controllables.forEachAlive((controllable) =>{
                if (controllable != this.sprite) {
                    humans.push(this.getTile(controllable));
                }
            });

            this.game.map.forEach((tile) => {
                if (tile.index == -1) {
                    if (this.furtherThan(tile, humans, 10) == humans.length) {
                        targetTileIds[this.tile2id(tile)] = true;
                    }
                }
            }, this, 0, 0, this.game.map.width, this.game.map.height, this.game.walls);

            return targetTileIds;
        }

        furtherThan(tile, compareTiles, distance) {
            var count = 0;
            compareTiles.forEach((t) => {
                var dx = tile.x - t.x;
                var dy = tile.y - t.y;
                if (dx*dx + dy*dy < distance*distance) count++;
            });
            return count;
        }

        closerThan(tile, compareTiles, distance) {
            return compareTiles.length - this.furtherThan(tile, compareTiles, distance);
        }

        genTargetTileIdsChaseLowFlashlight() {
            var targetTileIds = {};
            this.game.controllables.forEachAlive((controllable) =>{
                if (controllable != this.sprite && controllable.getBehavior('flashlight').health < 20) {
                    targetTileIds[this.tile2id(this.getTile(controllable))] = true;
                }
            });
            return targetTileIds;
        }

        genTargetTileIdsLurk() {
            var targetTileIds = {};
            var humans = [];
            this.game.controllables.forEachAlive((controllable) =>{
                if (controllable != this.sprite) {
                    humans.push(this.getTile(controllable));
                }
            });

            this.game.map.forEach((tile) => {
                if (tile.index == -1) {
                    if (this.furtherThan(tile, humans, 4) == humans.length
                       && this.closerThan(tile, humans, 7) > 0) {
                        targetTileIds[this.tile2id(tile)] = true;
                    }
                }
            }, this, 0, 0, this.game.map.width, this.game.map.height, this.game.walls);

            return targetTileIds;
        }

        bfs(targetTileIds) {
            var myTile = this.getTile(this.sprite);
            var edges = [myTile];
            var prevTile = {};
            prevTile[this.tile2id(myTile)] = -1;
            while(true) {
                var newEdges = [];

                for (var i = 0; i < edges.length; i++){
                    var e = edges[i];
                    var id = this.tile2id(e);
                    if (targetTileIds[id]) {
                        return { reached: e, path: this.computePath(e, prevTile) };
                    }

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
                    }
                }

                edges = newEdges;
            }
        }

        computePath(reached, prevTile) {
            var path = [];
            var id = this.tile2id(reached);
            while (id != -1) {
                if (id === undefined) {
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
            return m.getTileWorldXY(sprite.x, sprite.y, m.tileWidth, m.tileHeight, this.game.walls, true);
        }
    }
}
