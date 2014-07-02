(function (Ω) {

	"use strict";

	var BlockMap = Ω.Class.extend({

		x: 0, // Position required for camera rendering check
		y: 0,

		walkable: 0,

		repeat: false,
		parallax: 0,

		frame: 0,

		init: function (sheet, cells, walkable) {

			this.sheet = sheet;
			this.walkable = walkable || 0;

			this.populate(cells || [[]]);

		},

		tick: function () {
			var self = this,
				frame = ++this.frame,
				p = this.player,
				oldP = this.cells[p.yc][p.xc];
			this.cells[p.yc][p.xc] = blocks.PLAYER;
			this.cells.forEach(function (row) {
				row.forEach(function (cell) {
					cell.tick(self, frame);
				});
			});
			this.cells[p.yc][p.xc] = oldP;
			return true;
		},

		populate: function (cells) {

			this.cells = cells;
			this.cellH = this.cells.length;
			this.cellW = this.cells[0].length;
			this.h = this.cellH * this.sheet.h;
			this.w = this.cellW * this.sheet.w;

		},

		isWalkable: function (col, row) {

			if (row < 0 || row > this.cellH - 1 || col < 0 || col > this.cellW - 1) {
				return false;
			}

			return this.cells[row][col] <= walkable;
		},

		render: function (gfx, camera) {

			if (!camera) {
				camera = {
					x: 0,
					y: 0,
					w: gfx.w,
					h: gfx.h,
					zoom: 1
				};
			}

			var tw = this.sheet.w,
				th = this.sheet.h,
				cellW = this.sheet.cellW,
				cellH = this.sheet.cellH,
				stx = (camera.x - (camera.x * this.parallax)) / tw | 0,
				sty = (camera.y - (camera.y * this.parallax)) / th | 0,
				endx = stx + (camera.w / camera.zoom / tw | 0) + 1,
				endy = sty + (camera.h / camera.zoom / th | 0) + 1,
				j,
				i,
				cell;

			if (this.parallax) {
				gfx.ctx.save();
				gfx.ctx.translate(camera.x * this.parallax | 0, camera.y * this.parallax | 0);
			}

			for (j = sty; j <= endy; j++) {
				if (j < 0 || !this.repeat && j > this.cellH - 1) {
					continue;
				}
				for (i = stx; i <= endx; i++) {
					if (i < 0 || !this.repeat && i > this.cellW - 1) {
						continue;
					}

					cell = this.cells[j % this.cellH][i % this.cellW];
					if (cell === 0) {
						continue;
					}
					cell.render(gfx);
					/*this.sheet.render(
						gfx,
						(cell - 1) % cellW  | 0,
						(cell - 1) / cellW | 0,
						i * tw,
						j * th);*/
				}
			}

			if (this.parallax) {
				gfx.ctx.restore();
			}

		},

		getBlockCell: function (block) {
			var row = block[1] / this.sheet.h | 0,
				col = block[0] / this.sheet.w | 0;

			if (row < 0 || row > this.cellH - 1) {
				row = -1;
			}
			if (col < 0 || col > this.cellW - 1) {
				col = -1;
			}

			return [col, row];
		},

		getCellPixels: function (block) {
			var row = block[1] * this.sheet.h,
				col = block[0] * this.sheet.w;

			return [col, row];
		},

		getBlock: function (block) {

			var row = block[1] / this.sheet.h | 0,
				col = block[0] / this.sheet.w | 0;

			if (row < 0 || row > this.cellH - 1) {
				return;
			}

			return this.cells[row][col];

		},

		getBlocks: function (blocks) {

			return blocks.map(this.getBlock, this);

		},

		getBlockEdge: function(pos, vertical) {

			var snapTo = vertical ? this.sheet.h : this.sheet.w;

		    return Ω.math.snap(pos, snapTo);

		},

		setBlock: function (pos, block) {

			var row = pos[1] / this.sheet.h | 0,
				col = pos[0] / this.sheet.w | 0;

			if (row < 0 || row > this.cellH - 1 || col < 0 || col > this.cellW - 1) {
				return;
			}

			this.cells[row][col] = block;

		},

		setBlockCell: function (pos, block) {

			var row = pos[1],
				col = pos[0];

			if (row < 0 || row > this.cellH - 1 || col < 0 || col > this.cellW - 1) {
				return;
			}

			this.cells[row][col] = block;

		}

	});

	Ω.BlockMap = BlockMap;

}(window.Ω));
