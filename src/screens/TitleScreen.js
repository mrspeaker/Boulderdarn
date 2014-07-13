(function (Ω) {

    "use strict";

    var TitleScreen = Ω.Screen.extend({

        sheet: new Ω.SpriteSheet("res/tiles.png", 32, 32),

        init: function (x, y, spawnTarget) {

        	this.spawn = {
        		x: x,
        		y: y,
        		spawnTarget: spawnTarget
        	};
        },

        tick: function () {

        	if (Ω.input.pressed("space")) {
        		var s = this.spawn;
        		game.setScreen(new MainScreen(s.x, s.y, s.spawnTarget));
        	}

        },

        render: function (gfx) {

        	this.sheet.render(gfx, Ω.utils.rand(5), Ω.utils.rand(2), Ω.utils.rand(Ω.env.w), Ω.utils.rand(Ω.env.h));

        }

    });

	window.TitleScreen = TitleScreen;

}(Ω));