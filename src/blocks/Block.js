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
		explodable: false,
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

	var belowIsEmptyOrFalling = function (x, y, map) {
			var block = map.cells[y + 1][x];
			return block.type === "empty" || block.falling;
		},
		explode = function (xc, yc, map) {
		
			map.cells[yc - 1][xc] = new blocks.Empty(xc, yc);
			map.cells[yc - 1][xc - 1] = new blocks.Empty(xc, yc);
			map.cells[yc - 1][xc + 1] = new blocks.Empty(xc, yc);
		
			map.cells[yc][xc] = new blocks.Empty(xc, yc);
			map.cells[yc][xc - 1] = new blocks.Empty(xc, yc);
			map.cells[yc][xc + 1] = new blocks.Empty(xc, yc);

			map.cells[yc + 1][xc] = new blocks.Empty(xc, yc);
			map.cells[yc + 1][xc - 1] = new blocks.Empty(xc, yc);
			map.cells[yc + 1][xc + 1] = new blocks.Empty(xc, yc);
		
		};

	blocks = {
		belowIsEmptyOrFalling: belowIsEmptyOrFalling,
		explode: explode
	};

	blocks.Empty = Block.extend({
		type: "empty",
		walkable: true,
		row: -1
	});

	blocks.Player = Block.extend({
		type: "player",
		walkable: true,
		explodable: true,
		row: -1
	});
	blocks.PLAYER = new blocks.Player(0, 0);

	blocks.Diamond = Block.extend({
		type: "diamond",
		walkable: true,
		row: 1,
		col: 4
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

	blocks.Explosive = Block.extend({
		type: "explosive",
		explodable: true,
		col: 1,
		row: 1
	});

	window.Block = Block;
	window.blocks = blocks;

}());
