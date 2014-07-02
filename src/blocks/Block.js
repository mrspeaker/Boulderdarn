(function () {

	"use strict";

	var blocks = {};

	var Block = Ω.Class.extend({
		x: 0,
		y: 0,
		w: 32,
		h: 32,
		row: 0,
		col: 0,
		frame: 0,
		falling: false,
		walkable: false,
		sheet: new Ω.SpriteSheet("res/tiles.png", 32, 32),
		init: function (x, y, frame) {
			this.x = x * 32;
			this.y = y * 32;
			this.xc = x;
			this.yc = y;
			this.frame = frame || 0;
		},
		tick: function (map, frame) {
			if (this.frame === frame) {
				// Already processed
				return true;
			}
			this.frame = frame;
			return true;
		},
		render: function (gfx) {
			var c = gfx.ctx;
			//c.fillStyle = this.col;
			//c.fillRect(this.x, this.y, this.w, this.h);
			if (this.row === -1) {
				return;
			}
			this.sheet.render(
				gfx,
				this.col,
				this.row,
				this.x,
				this.y
			);
		}
	});

	var belowIsEmpty = function (x, y, map) {
		var block = map.cells[y + 1][x];
		return block.type === "empty" || block.falling;
	};


	blocks.Empty = Block.extend({
		type: "empty",
		walkable: true,
		row: -1
	});

	blocks.Player = Block.extend({
		type: "player",
		row: -1
	});

	blocks.Dirt = Block.extend({
		type: "dirt",
		walkable: true,
		row: 0,
		col: 0
	});

	blocks.Stone = Block.extend({
		type: "stone",
		col: 2
	});

	blocks.Boulder = Block.extend({
		type: "boulder",
		col: 4,
		speed: 1.5,
		xb: 0,
		yb: 0,
		falling: false,
		tick: function (map, frame) {
			var xc = this.xc,
				yc = this.yc,
				yo = this.y,
				xo = this.x;

			if (this.frame === frame) {
				// Already processed
				return true;
			}
			this.frame = frame;

			if (!this.falling) {
				if (belowIsEmpty(xc, yc, map)) {
					this.falling = true;
					this.y += this.speed;
				}
			} else {
				this.y += this.speed;
				var newY = (this.y / 32 | 0),
					movedToNewBlock = newY !== yc;
				if (movedToNewBlock) {
					if (!belowIsEmpty(xc, newY, map)) {
						this.y = newY * 32;
						this.falling = false;
						map.cells[newY][this.xc] = this;
					}
				}
			}
			this.xc = this.x / 32 | 0;
			this.yc = this.y / 32 | 0;
		}
	});

	window.Block = Block;
	window.blocks = blocks;

}());
