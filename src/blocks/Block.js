(function () {

	"use strict";

	var Block = Ω.Class.extend({
		x: 0,
		y: 0,
		w: 32,
		h: 32,
		col: "#300",
		init: function (x, y) {
			this.x = x;
			this.y = y;
		},
		tick: function (map) {
			return true;
		},
		render: function (gfx) {
			var c = gfx.ctx;
			c.fillStyle = this.col;
			c.fillRect(this.x, this.y, this.w, this.h);
		}
	});

	var belowIsSolid = function (x, y, map) {
		return map.cells[y + 1][x] !== 0;
	};


	blocks.Empty = Block.extend({
		col: "#000"
	});

	blocks.Dirt = Block.extend({
		col: "#713"
	});

	blocks.Rock = Block.extend({
		col: "#025",
		speed: 1.5,
		xb: 0,
		yb: 0,
		falling: false,
		tick: function (map) {
			var xb = this.xb,
				yb = this.yb;	

			if (!this.falling) {
				if (!belowIsSolid(xb, yb, map)) {
					this.falling = true;
					this.y += this.speed;
					map.cells[this.yb][this.xb] = 0;
				}
			} else {
				this.y += this.speed;
				var newY = (this.y / 32 | 0),
					movedToNewBlock = newY !== yb;
				if (movedToNewBlock) {
					if (belowIsSolid(xb, newY, map)) {
						this.y = newY * 32;
						this.falling = false;
						map.cells[newY][this.xb] = 2;
					}
				}
			}
			this.xb = this.x / 32 | 0;
			this.yb = this.y / 32 | 0;
		}
	});

	window.Block = Block;

}());
