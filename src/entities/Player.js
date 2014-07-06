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
        },

        tick: function () {

            var xo = 0,
                yo = 0,
                move = [],
                speed = 3.5;

            if (this.path.length > 0) {
                move = this.tick_follow(xo, yo);
                xo = move[0];
                yo = move[1];
            }

            this.move(xo, yo, this.map);

            var xc = this.x / this.cellW | 0,
                yc = this.y / this.cellH | 0,
                oldXc = this.xc,
                oldYc = this.yc;

            // Check if new cell...
            if (xc !== this.xc || yc !== this.yc) {
                
                // If last cell was already in target, don't eat more
                if (this.xc === this.tx && this.yc === this.ty) {

                } else {
                    var block = this.map.cells[yc][xc].type;
                    this.map.cells[oldYc][oldXc] = new blocks.Empty(oldXc, oldYc);
                    
                    if (block === "dirt") {
                        this.map.setBlockCell([xc, yc], new blocks.Empty(xc, yc));
                    } else if (block === "diamond") {
                        this.map.setBlockCell([xc, yc], new blocks.Empty(xc, yc));
                        this.level.diamondGet();
                    } else if (block === "door") {
                        var target = this.map.cells[yc][xc].target;
                        target = target.split("_");
                        console.log(target)
                        game.reset(parseInt(target[0], 10) - 1, parseInt(target[1], 10) - 1);
                    }
                    this.map.setBlockCell([xc, yc], blocks.PLAYER);
                }
            }

            this.xc = xc;
            this.yc = yc;

            if (this.exploded) {
                game.reset();                
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
                c.moveTo(this.x + 15, this.y + 15);
                this.path.forEach(function (b) {
                    c.lineTo(b[0] * w + 15, b[1] * h + 15);
                });
                c.stroke();
                c.lineWidth = 1;
            }


            c.fillStyle = "#333";
            c.fillRect(this.x, this.y, this.w, this.h);

            c.strokeStyle = "#eee";
            c.strokeRect(this.x, this.y, this.w, this.h);
        }

    });

    window.Player = Player;

}(window.Ω));
