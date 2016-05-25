module GhostMansion {
    export class AiController {
        constructor(private sprite, private game) {
            console.log(this.bfs());
        }

        update() {
            this.sprite.body.velocity.y = 50;
        }

        bfs() {
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
