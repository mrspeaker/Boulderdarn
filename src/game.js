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

            var url = Ω.urlParams.r;

            if (!url) {
                this.reset();
            } else {
                var room = url.split("_").map(function (r) {
                        return parseInt(r, 10) - 1;
                    });
                this.reset(room[0], room[2], url);
            }

        }

    });

    window.OmegaGame = OmegaGame;

}(Ω));
