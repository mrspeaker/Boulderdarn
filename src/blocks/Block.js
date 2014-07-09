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
		explode = function (xc, yc, map, block) {
			// Erase neighbouring cells around target
			[
				[-1, -1], [0, -1], [1, -1],
				[-1,  0], [0,  0], [1,  0],
				[-1,  1], [0,  1], [1,  1]
			].forEach(function (p) {
				var x = xc + p[0],
					y = yc + p[1];
				map.cells[y][x] = new blocks.Empty(x, y);
			});

			// FIXME: shouldn't be here, yo.
			if (block.type === "player") {
				map.player.exploded = true;
			};
		},
		moveTo = function (map, obj, xc, yc, xo, yo, frame) {
			var ob = map.cells[yc + yo][xc + xo];
			if (ob.frame === frame) {
				console.error("overwriting already processed", ob.type);
			}
			map.cells[yc + yo][xc + xo] = obj;
			map.cells[yc][xc] = new blocks.Empty(xc, yc);
		};

	blocks = {
		belowIsEmptyOrFalling: belowIsEmptyOrFalling,
		explode: explode,
		moveTo: moveTo
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
		col: 1
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

	blocks.Door = Block.extend({
		type: "door",
		walkable: true,
		row: 1,
		col: 3,
		init: function (x, y, target) {
			this._super(x, y);
			this.target = target;
		},
		render: function (gfx) {
			if (this.walkable && this.frame % 40 < 20) {
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

	window.Block = Block;
	window.blocks = blocks;

}());
