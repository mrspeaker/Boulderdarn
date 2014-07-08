(function (Ω) {

    "use strict";

    var OmegaGame = Ω.Game.extend({

        fps: false,
        canvas: "canvas",

        init: function (w, h, canvas) {

            if (canvas) {
                this.canvas = canvas;
            }

            this._super(w, h);

            Ω.evt.progress.push(function (remaining, max) {
                console.log((((max - remaining) / max) * 100 | 0) + "%");
            });

            Ω.input.bind({
                "space": "space",
                "touch": "touch",
                "escape": "escape",
                "left": "left",
                "right": "right",
                "up": "up",
                "down": "down",
                "moused": "mouse1"
            });

        },

        reset: function (x, y, spawnTarget) {

            this.setScreen(new MainScreen(x, y, spawnTarget));

        },

        load: function () {

            this.reset();

        }

    });

    window.OmegaGame = OmegaGame;

}(Ω));
