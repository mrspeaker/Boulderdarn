(function (blocks) {

	"use strict";

	var Boulder = Block.extend({
		type: "boulder",
		rounded: true,
		col: 4,
		speed: 2.5,
		xb: 0,
		yb: 0,
		falling: false,

		tick: function (map, frame) {
			var xc = this.xc,
				yc = this.yc;

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
					if (ob.frame === frame) {
						console.error("overwriting already processed", ob.type);
					}
					map.cells[yc + yo][xc + xo] = obj;
					map.cells[yc][xc] = new blocks.Empty(xc, yc);
				};

			if (!this.falling) {
				if (blocks.belowIsEmptyOrFalling(xc, yc, map)) {
					this.falling = true;
				} else if (block(0, 1).rounded) {
					if (is("empty", +1, 0) && is("empty", +1, +1) && !block(+1, -1).falling) {
						moveTo(this, +1, 0);
						this.x += 32;
						this.falling = true;
					} else if (is("empty", -1, 0) && is("empty", -1, 1) && !block(-1, -1).falling) {
						moveTo(this, -1, 0);
						this.x -= 32;
						this.falling = true;
					}
				}
			}

			if (this.falling) {
				var newY;
				this.y += this.speed;
				newY = (this.y / 32 | 0);
				if (newY !== yc) {
					moveTo(this, 0, newY - yc);
					if (!blocks.belowIsEmptyOrFalling(xc, newY, map)) {
						this.y = newY * 32;
						this.falling = false;
						var block = map.cells[newY + 1][xc];
						if (block.explodable) {
							blocks.explode(xc, newY + 1, map, block);
						}
					}
				}
			}

			this.xc = this.x / 32 | 0;
			this.yc = this.y / 32 | 0;
		}
	});

	blocks.Boulder = Boulder;

}(blocks));
