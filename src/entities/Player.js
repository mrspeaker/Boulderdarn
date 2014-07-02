(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        
        xc: 0,
        yc: 0,

        dir: "",

        init: function (x, y, w, h, level) {
            this._super(x, y, w, h);
            this.level = level;
        },

        tick: function () {

            var xo = 0,
                yo = 0,
                speed = 3.5;

            if (this.dir) {

                var cx = this.tx * this.cellW - (this.cellW / 2),
                    cy = this.ty * this.cellH - (this.cellH / 2),
                    x = this.x - (this.w / 2),
                    y = this.y - (this.h / 2);

                if (this.dir === "vertical") {
                    var yoff = cy - y;
                    if (yoff > speed) {
                        yo += speed;
                    } else if (yoff < -speed) {
                        yo -= speed;
                    } else {
                        this.dir = "";
                        this.y = this.ty * this.cellH + ((this.cellH - this.h) / 2);
                    }
                }
                if (this.dir === "horizontal") {
                    var xoff = cx - x;
                    if (xoff > speed) {
                        xo += speed;
                    } else if (xoff < -speed) {
                        xo -= speed;
                    } else {
                        this.dir = "";
                        this.x = this.tx * this.cellW + ((this.cellW - this.w) / 2);
                    }
                }
            }

            this.move(xo, yo, this.map);

            var xc = this.x / this.cellW | 0,
                yc = this.y / this.cellH | 0;

            // Check if new cell...
            if (xc !== this.xc || yc !== this.yc) {
                // If last cell was already in target, don't eat more
                if (this.xc === this.tx && this.yc === this.ty) {

                } else {
                    this.level.eat(xc, yc);
                }
            }

            this.xc = xc;
            this.yc = yc;

            return true;

        },

        target: function (x, y) {

            // Don't target same block
            if (x === this.tx && y === this.ty) {
                return;
            }

            this.tx = x;
            this.ty = y;

            if (x === this.xc) {
                this.dir = "vertical";
            }

            if (y === this.yc) {
                this.dir = "horizontal";
            }

        },

        setMap: function (map) {
            this.map = map;
            this.cellW = map.sheet.w;
            this.cellH = map.sheet.h;
        },

        render: function (gfx) {

            var c = gfx.ctx;
            c.fillStyle = "#333";
            c.fillRect(this.x, this.y, this.w, this.h);

            c.strokeStyle = "#eee";
            c.strokeRect(this.x, this.y, this.w, this.h);
        }

    });

    window.Player = Player;

}(window.Ω));