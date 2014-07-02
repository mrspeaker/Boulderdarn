canvas.width = 320;
canvas.height = 568;

ejecta.include("./lib/Ω500.js");
ejecta.include("lib/Ω500.js");
ejecta.include("lib/BlockMap.js");
ejecta.include("src/blocks/Block.js");
ejecta.include("src/game.js");
ejecta.include("src/entities/Player.js");
ejecta.include("src/screens/MainScreen.js");

var game = new OmegaGame(320, 568, canvas);

Ω.pageLoad();

