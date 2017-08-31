/*
 * Load.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var music;
var sound;
var playMusic = false;
var playSound = true;
var fullScreen = true;

var Load = function () {}

Load.prototype = {

    loadScripts: function () {

        // Game states
        game.load.script("Menu", "js/states/Menu.js");
        game.load.script("Options", "js/states/Options.js");
        game.load.script("Credits", "js/states/Credits.js");
        game.load.script("Intro", "js/states/Intro.js");
        game.load.script("Play", "js/states/Play.js");
        game.load.script("GameOver", "js/states/GameOver.js");

    },

    loadAudio: function () {

        // Music
        game.load.audio("advanced-simulacra", ["audio/music/advanced-simulacra.ogg", "audio/music/advanced-simulacra.wav"]);
        game.load.audio("by-product", ["audio/music/by-product.ogg", "audio/music/by-product.wav"]);

        // Sound effects
        game.load.audio("sfx-menu-forward", ["audio/sfx/itempick.ogg", "audio/sfx/itempick.wav"]);
        game.load.audio("sfx-menu-back", ["audio/sfx/itemback.ogg", "audio/sfx/itemback.wav"]);
        game.load.audio("sfx-nanobot-jump", ["audio/sfx/nanobot.ogg", "audio/sfx/nanobot.wav"]);
        game.load.audio("sfx-drone", ["audio/sfx/drone.ogg", "audio/sfx/drone.wav"]);
        game.load.audio("sfx-credit", ["audio/sfx/coin.ogg", "audio/sfx/coin.wav"]);

    },

    loadImages: function () {

        // General and interface (ui)
        game.load.image("menu-bg", "img/ui/menu-bg.png");
        game.load.image("gameover-bg", "img/ui/gameover-bg.png");

        // Levels
        game.load.image("tileset-lvl-1", "img/levels/tileset-lvl-1.png");

        // Objects (objs)
        game.load.image("ladder-m", "img/objs/ladder-m.png");
        game.load.image("platform", "img/objs/platform.png");

        // Items
        game.load.spritesheet("credit", "img/items/credits.png", 32, 32, 7);

        // Characters (chars)
        game.load.spritesheet("zed", "img/chars/zed/spritesheet.png", 52, 65, 26);
        game.load.spritesheet("walker", "img/chars/walker/spritesheet.png", 192, 226, 32);
        game.load.spritesheet("nanobot", "img/chars/nanobot/spritesheet.png", 32, 32, 36);
        game.load.spritesheet("drone", "img/chars/drone/drone4.png", 55, 26, 4);
        game.load.spritesheet("turret", "img/chars/turret/turret.png", 62, 46, 5);
        game.load.image("turretBullet", "img/chars/turret/bullet.png");

    },

    loadTileMaps: function () {

        // Levels
        game.load.tilemap("map-lvl-1", "json/map-lvl-1.json", null, Phaser.Tilemap.TILED_JSON);

    },

    init: function () {

        game.add.sprite(0, 0, "load-bg");

        this.logo = game.make.sprite(game.world.centerX, 150, "brand");

        // Loads bar from right to left
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 300, "loading");

        this.status = game.make.text(game.world.centerX, 280, "Loading game assets...", {
            fill: "white"
        });
        this.status.font = "Coda";

        utils.centerGameObjects([this.logo, this.status]);

    },

    preload: function () {

        game.add.existing(this.status);
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);

        this.load.setPreloadSprite(this.loadingBar);

        this.loadScripts();
        this.loadImages();
        this.loadAudio();
        this.loadTileMaps();

    },

    addStates: function () {

        game.state.add("Menu", Menu);
        game.state.add("Credits", Credits);
        game.state.add("Options", Options);
        game.state.add("Intro", Intro);
        game.state.add("Play", Play);
        game.state.add("GameOver", GameOver);

    },

    addAudio: function () {

        music = game.add.audio("advanced-simulacra");
        music.loop = true;
        if (playMusic) {music.play();}

        sound = game.add.audio("sfx-menu-forward");

    },

    addSettings: function () {

        // Scale game to browser viewport
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // No blur upon scaling
        game.renderer.renderSession.roundPixels = true;

        // Game physics (Phaser ARCADE)
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Game continues running off screen
        game.stage.disableVisibilityChange = false;

        game.stage.backgroundColor = "#000000";

    },

    create: function () {

        this.addStates();
        this.addAudio();
        this.addSettings();

        this.status.setText("Ready");

        setTimeout(function () {

            game.state.start("Menu");

        }, 1000);

    }

};
