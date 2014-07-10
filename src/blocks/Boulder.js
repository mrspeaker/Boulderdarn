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
			blocks.fallTick.call(this, map, frame);
		}
	});

	blocks.Boulder = Boulder;

}(blocks));
