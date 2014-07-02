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
		rounded: false,
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
	blocks.PLAYER = new blocks.Player(0, 0);

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
		rounded: true,
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
				} else if (map.cells[yc - 1][xc].type !== "boulder" && map.cells[yc + 1][xc].rounded) {
					if (map.cells[yc][xc + 1].type === "empty" && map.cells[yc + 1][xc + 1].type === "empty" && map.cells[yc - 1][xc + 1].type !== "boulder") {
						map.cells[yc][xc + 1] = this;
						map.cells[yc][xc] = new blocks.Empty(xc, yc, frame);
						this.x += 32;
						this.falling = true;
					} else if (map.cells[yc][xc - 1].type === "empty" && map.cells[yc + 1][xc - 1].type === "empty" && map.cells[yc - 1][xc - 1].type !== "boulder") {
						map.cells[yc][xc - 1] = this;
						map.cells[yc][xc] = new blocks.Empty(xc, yc, frame);
						this.x -= 32;
						this.falling = true;
					}
				}
			}

			if (this.falling) {
				this.y += this.speed;
				var newY = (this.y / 32 | 0),
					movedToNewBlock = newY !== yc;
				if (movedToNewBlock) {
					map.cells[newY][xc] = this;
					map.cells[yc][xc] = new blocks.Empty(xc, yc, frame);
					if (!belowIsEmpty(xc, newY, map)) {
						this.y = newY * 32;
						this.falling = false;
						
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
