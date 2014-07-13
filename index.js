canvas.width = 320;
canvas.height = 568;

ejecta.include("lib/Ω500.js");
ejecta.include("lib/aStar.js");
ejecta.include("lib/BlockMap.js");
ejecta.include("src/blocks/Block.js");
ejecta.include("src/blocks/Amoeba.js");
ejecta.include("src/blocks/Creeper.js");
ejecta.include("src/blocks/Boulder.js");
ejecta.include("src/game.js");
ejecta.include("src/entities/Player.js");
ejecta.include("src/screens/TitleScreen.js");
ejecta.include("src/screens/MainScreen.js");

var game = new OmegaGame(320, 568, canvas);

Ω.pageLoad();

