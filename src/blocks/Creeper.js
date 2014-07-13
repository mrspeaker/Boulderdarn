(function (blocks) {

	"use strict";

	var Creeper = Block.extend({
		type: "creeper",

		col: 5,
		row: 0,
		spread: 130,

		explodable: true,
		
		dir: null,

		startFrame: -1,

		tick: function (map, frame) {

			var count = frame - this.startFrame,
				xc = this.xc,
				yc = this.yc;

			if (this.startFrame < 0) {
				this.startFrame = frame;
			}

			if (this.frame >= frame) {
				// Already processed
				return true;
			}
			this.frame = frame;

			if (count % 20 !== 0) {
				return;
			}

			if (!this.dir) {
				var dirs = [[0, -1], [-1, 0], [1, 0], [0, 1]]
					.map(function (p) {
						return [p, map.cells[yc + p[1]][xc + p[0]]];
					})
					.filter(function (b) {
						return b[1].type === "empty";
					});

				if (dirs.length) {
					var num = (Math.random() * dirs.length) | 0;
					this.dir = dirs[num][0];
				}
			}

			if (this.dir) {
				var block = map.cells[yc + this.dir[1]][xc + this.dir[0]];
				if (block.type === "empty") {
					blocks.moveTo(map, this, xc, yc, this.dir[0], this.dir[1], frame);
					
					this.xc += this.dir[0]; // this.x / 32 | 0;
					this.yc += this.dir[1]; // this.y / 32 | 0;

					this.x = xc * 32;
					this.y = yc * 32;
				} else {
					this.dir = null;
				}
			}

		}

	});

	blocks.Creeper = Creeper;

}(blocks));
