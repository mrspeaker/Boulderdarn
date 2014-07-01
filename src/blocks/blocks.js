(function () {
	"use strict";

	var blocks = {
		init: function (blocks, map) {
			this.blocks = blocks;
			this.map = map;
		},
		tick: function () {
			var map = this.map;
			this.blocks.forEach(function (b) {
				b.tick(map);
			});
			return true;
		},
		render: function (gfx) {
			this.blocks.forEach(function (b) {
				b.render(gfx);
			});
		}
	};

	window.blocks = blocks;

}());
