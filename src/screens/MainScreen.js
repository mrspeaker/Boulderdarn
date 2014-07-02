(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        sheet: new Ω.SpriteSheet("res/tiles.png", 32, 32),

        init: function () {

            var self = this;

            this.map = this.add(new Ω.BlockMap(this.sheet, [
                [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
                [7, 2, 2, 2, 2, 2, 4, 2, 2, 7],
                [7, 2, 7, 4, 2, 4, 4, 4, 2, 7],
                [7, 2, 2, 4, 2, 2, 4, 4, 2, 7],
                [7, 2, 2, 2, 2, 2, 4, 4, 2, 7],
                [7, 2, 7, 2, 2, 4, 2, 4, 2, 7],
                [7, 2, 7, 7, 2, 4, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 4, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 2, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 2, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 2, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 2, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 2, 2, 2, 2, 7],
                [7, 2, 2, 2, 2, 2, 2, 2, 2, 7],
                [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            ], 2));

            this.map.cells = this.map.cells.map(function (r, j) {
                return r.map(function (c, i) {
                    var block,
                        newC = c;
                    switch (c) {
                    case 2:
                        block = new blocks.Dirt(i, j);
                        break;
                    case 4:
                        block = new blocks.Boulder(i, j);
                        break;
                    case 7:
                        block = new blocks.Stone(i, j);
                        break;
                    default:
                        block = new blocks.Empty(i, j);
                    }
                    return block;
                });
            });

            this.player = this.add(new Player(32, 32, 24, 24, this));
            this.player.setMap(this.map);

        },

        eat: function (x, y) {
            if (this.map.cells[y][x].type === "dirt") {
                this.map.setBlockCell([x, y], new blocks.Empty(x, y));
            }
        },

        tick: function () {

            if (Ω.input.pressed("moused")) {
                var cell = this.map.getBlockCell([Ω.input.mouse.x, Ω.input.mouse.y]);

                this.player.target(cell[0], cell[1]);
            }

        },

        render: function (gfx) {

            this.clear(gfx, "hsl(1, 1%, 1%)");

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
