(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        
        xc: 1,
        yc: 1,

        path: null,
        exploded: false,

        dir: "",

        init: function (x, y, w, h, level) {
            this._super(x, y, w, h);
            this.level = level;
            this.path = [];
            this.xc = x / 32 | 0;
            this.yc = y / 32 | 0;
        },

        tick: function () {

            var xo = 0,
                yo = 0,
                move = [],
                speed = 3.5,
                following = this.path.length > 0;

            if (following) {
                move = this.tick_follow(xo, yo);
                xo = move[0];
                yo = move[1];
            }

            // Do the move)
            var moved = this.move(xo, yo, this.map),
                stopped = moved[0] === 0 && moved[1] === 0;

            if (following && stopped && (xo !== 0 || yo !== 0)) {
                // Hit a road block. Kill the path.
                this.path = [];
            }
            
            var xc = this.x / this.cellW | 0,
                yc = this.y / this.cellH | 0,
                oldXc = this.xc,
                oldYc = this.yc,
                five = this.map.getNeighbours(xc, yc),
                block = five[2].type; // Get the middle block of the 5 neighbours

            // Check if new cell...
            if (xc !== this.xc || yc !== this.yc) {
                
                // If last cell was already in target, don't eat more
                if (this.xc === this.tx && this.yc === this.ty) {

                } else {
                    this.map.cells[oldYc][oldXc] = new blocks.Empty(oldXc, oldYc);
                    
                    if (block === "dirt") {
                        this.map.setBlockCell([xc, yc], new blocks.Empty(xc, yc));
                    } else if (block === "diamond") {
                        this.map.setBlockCell([xc, yc], new blocks.Empty(xc, yc));
                        this.level.diamondGet();
                    } else if (block === "door") {
                        var target = this.map.cells[yc][xc].target,
                            lvl = target.split("_");
                        game.reset(parseInt(lvl[0], 10) - 1, parseInt(lvl[2], 10) - 1, target);
                    }
                    this.map.setBlockCell([xc, yc], blocks.PLAYER);
                }
            }

            // Todo: better collision eh... and not every frame?
            if (five.some(function (b) { return b && b.type === "creeper" })) {
                this.level.reset();
            }

            this.xc = xc;
            this.yc = yc;

            if (this.exploded) {
                this.level.reset();                
            }

            return true;

        },

        tick_follow: function (xo, yo) {
            var speed = 3.5,
                target = this.path[0],
                tx = target[0] * this.cellW + 4,
                ty = target[1] * this.cellH + 4,
                dx = Math.abs(tx - this.x),
                dy = Math.abs(ty - this.y);

            if (dx <= speed && dy <= speed) {
                this.path = this.path.slice(1);
                // Snap
                this.y = target[1] * this.cellH + ((this.cellH - this.h) / 2);
                this.x = target[0] * this.cellW + ((this.cellW - this.w) / 2);
            } else {
                if (dx > speed) {
                    if (tx > this.x) {
                        xo += speed;
                    } else {
                        xo -= speed;
                    }
                } else {
                    if (ty > this.y) {
                        yo += speed;
                    } else {
                        yo -= speed;
                    }
                }
            }

            return [xo, yo];

        },

        target: function (x, y) {

            // Don't target same block
            if (x === this.tx && y === this.ty) {
                return;
            }

            this.nextTx = x;
            this.nextTy = y;

        },

        setMap: function (map) {
            this.map = map;
            this.cellW = map.sheet.w;
            this.cellH = map.sheet.h;
        },

        render: function (gfx) {

            var c = gfx.ctx,
                w = this.cellW,
                h = this.cellH;

            if (this.path.length > 0) {
                c.strokeStyle = "rgba(200, 0, 0, 0.7)";
                c.lineWidth = 10;
                c.beginPath();
                c.moveTo(this.x, this.y);
                this.path.forEach(function (b) {
                    c.lineTo(b[0] * w, b[1] * h);
                });
                c.stroke();
                c.lineWidth = 1;
            }


            c.fillStyle = "#236";
            c.fillRect(this.x - 16, this.y - 16, this.w, this.h);

            c.strokeStyle = "#69e";
            c.strokeRect(this.x - 16, this.y - 16, this.w, this.h);
        }

    });

    window.Player = Player;

}(window.Ω));
