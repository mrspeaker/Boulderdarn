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
		col: 3,
		row: 1
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

			if (this.frame >= frame) {
				// Already processed
				return true;
			}
			this.frame = frame;

			var is = function (type, xo, yo) {
					return map.cells[yc + yo][xc + xo].type === type;
				},
				isnt = function (type, xo, yo) {
					return !is(type, xo, yo);
				},
				block = function (xo, yo) {
					return map.cells[yc + yo][xc + xo];
				},
				moveTo = function (obj, xo, yo) {
					var ob = map.cells[yc + yo][xc + xo];
					if (ob.frame === frame && ob.type !== "empty") {
						console.error("overwriting already processed", ob.type);
					}
					map.cells[yc + yo][xc + xo] = obj;
					map.cells[yc][xc] = new blocks.Empty(xc, yc, frame);
				};

			if (!this.falling) {
				if (belowIsEmptyOrFalling(xc, yc, map)) {
					this.falling = true;
				} else if (isnt("boulder", 0, -1) && block(0, 1).rounded) {
					// Maybe this can be simpler - check for "empty || falling"?
					if (is("empty", +1, 0) && is("empty", +1, +1) && !block(+1, -1).falling) {
						//console.log(block(+1, -1).type);
						moveTo(this, +1, 0);
						this.x += 32;
						this.falling = false;
					} else if (is("empty", -1, 0) && is("empty", -1, 1) && !block(-1, -1).falling) {
						//console.log(block(-1, -1).type);
						moveTo(this, -1, 0);
						this.x -= 32;
						this.falling = false;
					}
				}
			}

			if (this.falling) {
				this.y += this.speed;
				var newY = (this.y / 32 | 0),
					movedToNewBlock = newY !== yc;
				if (movedToNewBlock) {
					moveTo(this, 0, newY - yc);
					if (!belowIsEmptyOrFalling(xc, newY, map)) {
						this.y = newY * 32;
						this.falling = false;
						var block = map.cells[newY + 1][xc];
						if (block.explodable) {
							game.reset();
						}
						
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
