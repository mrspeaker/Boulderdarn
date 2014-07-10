(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        sheet: new Ω.SpriteSheet("res/tiles.png", 32, 32),

        diamonds: 0,
        clicks: 0,

        roomW: 11,
        roomH: 17,

        roomX: 0,
        roomY: 0,

        offsetX: 16,
        offsetY: 16,

        loaded: false,

        flash: null,

        init: function (x, y, spawnTarget) {

            var self = this;

            this.roomX = x | 0;
            this.roomY = y | 0;
            this.spawnTarget = spawnTarget;

            this.loadLevel("res/data/level01.json?" + Math.random(), function (data) {
                self.levelData = data;
                self.parseLevel(data, function () {
                    self.loaded = true;
                });
            });

        },

        tick: function () {
            if (Ω.input.pressed("moused")) {
                this.handleClick(Ω.input.mouse.x, Ω.input.mouse.y);
            }

            if (Ω.input.pressed("touch")) {
                this.handleClick(Ω.input.touch.x, Ω.input.touch.y);
            }

            if (this.flash) {
                if (!this.flash.tick()) {
                    this.flash = null;
                }
            }
        },

        reset: function () {
            game.reset(this.roomX, this.roomY, this.spawnTarget);
        },

        generateAStar: function (cells) {
            
            var walkCells = cells.map(function (r) {
                return r.map(function (c) {
                    return c.walkable ? 0 : 1;
                });
            });

            return new Ω.Math.aStar.Graph(walkCells);

        },

        searchAStar: function (graph, from, to) {
            var nodes = graph.nodes,
                fromNode = nodes[from[1]][from[0]],
                toNode = nodes[to[1]][to[0]];

            // Recompute A*
            return Ω.Math.aStar.search(nodes, fromNode, toNode);
        },

        diamondGet: function () {

            if (--this.diamonds === 0) {
                //game.reset();
                this.flash = new Ω.Flash();
                this.doors.forEach(function (d) {
                    d.walkable = true;
                });
            }

        },

        loadLevel: function (name, cb) {

            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if( request.readyState == request.DONE && request.status == 200 ) {
                    cb(JSON.parse(request.responseText));
                }
            };

            request.open('GET', name);
            request.send();


        },

        randRoom: function () {
            var cells = [];
            for (var j = 0; j < this.roomH; j++) {
                cells.push([]);
                for (var i = 0; i < this.roomW; i++) {
                    var spread = [
                        1, 1, 1, 1, 1, 1,
                        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
                        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
                        3, 3, 
                        4, 4, 4, 4, 4, 4, 4, 4,
                        6, 
                        8, 8, 8,
                        9, 
                        11, 11, 11, 11];
                    var cell = spread[Math.random() * spread.length | 0];
                    if (j === 0 || i === 0 || j === this.roomH - 1 || i === this.roomW - 1) {
                        cell = 3;
                    }
                    if (i === 1 && j === 1) {
                        cell = 0;
                    }
                    cells[cells.length - 1].push(cell);
                }
            }
            return cells;
        },

        parseLevel: function (data, cb) {
            var tiles = data.layers[0],
                objects = data.layers[1].objects,
                self = this,
                h = data.height,
                w = data.width;

            var cells = [],
                rx = this.roomX * this.roomW,
                ry = this.roomY * this.roomH;

            if (this.roomX === 3 && this.roomY === 0) {
                cells = this.randRoom();
            } else {
                for (var j = ry; j < ry + this.roomH; j++) {
                    cells.push([]);
                    for (var i = rx; i < rx + this.roomW; i++) {
                        cells[cells.length - 1].push(tiles.data[j * w + i]);
                    }
                }
            }
            
            this.map = this.add(new Ω.BlockMap(this.sheet, cells, 2));
            this.map.cells = this.map.cells.map(function (r, j) {
                return r.map(function (c, i) {
                    var block,
                        newC = c;

                    switch (c) {
                    case 2:
                        block = new blocks.Dirt(i, j);
                        break;
                    case 3:
                        block = new blocks.Stone(i, j);
                        break;
                    case 4:
                    case 5:
                        block = new blocks.Boulder(i, j);
                        break;
                    case 6:
                        block = new blocks.Creeper(i, j);
                        break;
                    case 7:
                    case 8:
                        block = new blocks.Explosive(i, j);
                        break;
                    case 9:
                        block = new blocks.Ameoba(i, j);
                        break;
                    case 11:
                        self.diamonds++;
                        block = new blocks.Diamond(i, j);
                        break;
                    default:
                        block = new blocks.Empty(i, j);
                    }
                    return block;
                });
            });
            this.map.x -= this.offsetX;
            this.map.y -= this.offsetY;

            var spawnDoor = null;
            this.doors = objects.reduce(function (ac, o) {
                var x = (o.x / 32 | 0) - rx,
                    y = ((o.y - 32) / 32 | 0) - ry,
                    target = o.properties.target,
                    name = o.name,
                    obj = null;

                if (x > -1 && x < self.roomW && y > -1 && y< self.roomH) {
                    obj = new blocks.Door(x, y, target);
                    
                    self.map.cells[y][x] = obj;
                    if (self.spawnTarget && name === self.spawnTarget) {
                        spawnDoor = obj;
                    } else {
                        obj.walkable = false;    
                    }
                    ac.push(obj);
                }

                return ac;
            }, []);

            this.nodes = this.generateAStar(this.map.cells);

            // Add player at spawn location
            var px = 32,
                py = 32;
            if (spawnDoor) {
                var dir = this.spawnTarget.split("_")[1],
                    offs = {
                        "n": [0, 1],
                        "e": [-1, 0],
                        "s": [0, -1],
                        "w": [1, 0]
                    };
                px = (spawnDoor.xc + offs[dir][0]) * 32;
                py = (spawnDoor.yc + offs[dir][1]) * 32;
            }
            this.player = this.add(new Player(px, py, 24, 24, this));
            this.player.setMap(this.map);
            this.map.player = this.player;
            cb();
        },

        handleClick: function (x, y) {
            
            if (y >= Ω.env.h - 32) {
                this.reset();
                return;
            }

            x += this.offsetX;
            y += this.offsetY;

            // NOTE! BUG! Doesn't allow for scrolling browser
            var cell = this.map.getBlockCell([x, y]);
            if (!cell || cell[0] === -1 || cell[1] === -1) {
                return;
            }
            this.clicks++;

            this.player.target(cell[0], cell[1]);

            // Make target cell walkable for A* purposes (so you can click on non-walkable)
            var isWalkable = this.map.cells[cell[1]][cell[0]].walkable;
            this.map.cells[cell[1]][cell[0]].walkable = true;
            
            // Update aStar
            var graph = this.generateAStar(this.map.cells);

            // Reset walkable cell.
            this.map.cells[cell[1]][cell[0]].walkable = isWalkable;

            var path = this.searchAStar(
                graph, 
                [this.player.xc, this.player.yc], 
                [cell[0], cell[1]]);
            this.player.path = path.map(function (n) {
                // aStar lib switches x & y
                return [n.y, n.x];
            });

        },

        render: function (gfx) {

            this.clear(gfx, "hsl(1, 1%, 1%)");
            var c = gfx.ctx;
            this.flash && this.flash.render(gfx);

            c.font = "18pt Helvetica";
            c.fillStyle = "#844";
            c.fillRect(60, Ω.env.h - 38, 200, 32);
            c.fillStyle = "#333";
            c.fillText("[[Restart Room]]", 70, Ω.env.h - 15);

            c.fillStyle = "#FFF";

            blocks.PLAYER.sheet.render(gfx, 4, 1, 10, Ω.env.h - 37);
            c.fillText(this.diamonds, 20, Ω.env.h - 15);
            c.fillText(this.clicks, Ω.env.w - 20, Ω.env.h - 12);

            //c.fillText(this.player.xc + ":" + this.player.yc, Ω.env.w - 24, Ω.env.h - 10);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
