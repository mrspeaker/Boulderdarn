(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        init: function () {

            this.map = this.add(new Ω.DebugMap(32, 32, 8, 3, [
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 2, 3, 1, 3, 1, 1, 1, 2],
                [2, 1, 1, 3, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 2, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 2, 2, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            ], 1));

            var bs = [];
            this.map.cells = this.map.cells.map(function (r, j) {
                return r.map(function (c, i) {
                    var block,
                        newC = c;
                    switch (c) {
                    /*case 1:
                        block = new blocks.Dirt(i * 32, j * 32);
                        break;
                    */
                    case 3:
                        block = new blocks.Rock(i * 32, j * 32);
                    /*default:
                        block = new blocks.Empty(i * 32, j * 32);
                        */
                    }
                    if (block) {
                        bs.push(block);
                    }
                    return newC;
                });
            });

            this.player = this.add(new Player(32, 32, 24, 24, this));
            this.player.setMap(this.map);

            blocks.init(bs, this.map, this.player);
            this.add(blocks);


        },

        eat: function (x, y) {
            
            if (this.map.cells[y][x] === 1) {
                this.map.setBlockCell([x, y], 0);

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
