(function (blocks) {

	"use strict";

	var Ameoba = Block.extend({
		type: "ameoba",

		col: 3,
		row: 1,
		spread: 130,

		startFrame: -1,

		tick: function (map, frame) {

			if (this.startFrame < 0) {
				this.startFrame = frame;
			}

			if (this.frame >= frame) {
				// Already processed
				return true;
			}

			if ((frame - this.startFrame) % this.spread === this.spread - 1) {
				this.expand(map, frame);
			}

		},

		expand: function (map, frame) {

			var xc = this.xc,
				yc = this.yc;

			[[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (cell) {

				var x = xc + cell[0],
					y = yc + cell[1];

				if (map.cells[y][x].type === "empty") {
					map.setBlockCell([x, y], new blocks.Ameoba(x, y));		
				}

			});

		}
	});

	blocks.Ameoba = Ameoba;

}(blocks));
