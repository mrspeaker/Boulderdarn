(function () {
	"use strict";

	var blocks = {
		init: function (blocks, map, player) {
			this.blocks = blocks;
			this.map = map;
			this.player = player;
		},
		tick: function () {
			var map = this.map,
				player = this.player;
			var old = map.cells[player.yc][player.xc];
			map.cells[player.yc][player.xc] = 2;
			this.blocks.forEach(function (b) {
				b.tick(map);
			});
			map.cells[player.yc][player.xc] = old;
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
