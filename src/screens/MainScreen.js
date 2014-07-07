(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        sheet: new Ω.SpriteSheet("res/tiles.png", 32, 32),

        diamonds: 0,

        roomW: 11,
        roomH: 17,

        roomX: 0,
        roomY: 0,

        loaded: false,

        init: function (x, y) {

            var self = this;

            this.roomX = x | 0;
            this.roomY = y | 0;

            this.loadLevel("res/data/level01.json" + "?" + Math.random(), function (data) {
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
            }

        },

        loadLevel: function (name, cb) {

            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if( request.readyState == request.DONE && request.status == 200 ) {
                    //console.log( 'server', request.getResponseHeader('server') );
                    cb(JSON.parse(request.responseText));
                }
            };

            request.open('GET', name);
            request.send();


        },

        parseLevel: function (data, cb) {
            var tiles = data.layers[0],
                objects = data.layers[1].objects,
                self = this;

            var cells = [],
                rx = this.roomX * this.roomW,
                ry = this.roomY * this.roomH;

            for (var j = ry; j < ry + this.roomH; j++) {
                cells.push([]);
                for (var i = rx; i < rx + this.roomW; i++) {
                    cells[cells.length - 1].push(tiles.data[j * (33) + i]);
                }
            }

            
            this.map = this.add(new Ω.BlockMap(this.sheet, cells, 2));
            this.map.cells = this.map.cells.map(function (r, j) {
                return r.map(function (c, i) {
                    var block,
                        newC = c;

                    switch (c) {
                    case 1:
                        block = new blocks.Dirt(i, j);
                        break;
                    case 2:
                        block = new blocks.Stone(i, j);
                        break;
                    case 4:
                    case 5:
                        block = new blocks.Boulder(i, j);
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
            this.map.x -= 16;
            this.map.y -= 16;

            objects.forEach(function (o) {
                var x = (o.x / 32 | 0) - rx,
                    y = ((o.y - 32) / 32 | 0) - ry,
                    target = o.properties.target;

                if (x > -1 && x < self.roomW && y > -1 && y< self.roomH) {
                    console.log("add!", x, y, target)
                    var door = new blocks.Door(x, y, target);
                    self.map.cells[y][x] = door;
                }
            });


            this.nodes = this.generateAStar(this.map.cells);

            this.player = this.add(new Player(32, 32, 24, 24, this));
            this.player.setMap(this.map);
            this.map.player = this.player;
            cb();
        },

        handleClick: function (x, y) {
            if (y >= Ω.env.h - 32) {
                console.log(
                    "yah");
                game.reset();
                return;
            }
            x += 16;
            y += 16;
            // NOTE! BUG! Doesn't allow for scrolling browser
            var cell = this.map.getBlockCell([x, y]);
            this.player.target(cell[0], cell[1]);
            
            // Update aStar
            var graph = this.generateAStar(this.map.cells);
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

            c.fillStyle = "#999";
            c.fillText(this.diamonds, 10, Ω.env.h - 10);
            c.fillText(this.player.xc + ":" + this.player.yc, Ω.env.w - 24, Ω.env.h - 10);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
