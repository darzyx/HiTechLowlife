/*
 * Load.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var music;
var sound;
var playMusic = false;
var playSound = false;
var fullScreen = true;

var Load = function () {}

Load.prototype = {

    loadJS: function () {

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
        game.load.audio("intro", ["audio/music/intro.ogg", "audio/music/intro.wav"]);

        // Sound effects
        game.load.audio("sfx-menu-forward", ["audio/sfx/itempick.ogg", "audio/sfx/itempick.wav"]);
        game.load.audio("sfx-menu-back", ["audio/sfx/itemback.ogg", "audio/sfx/itemback.wav"]);
        game.load.audio("sfx-nanobot-jump", ["audio/sfx/nanobot.ogg", "audio/sfx/nanobot.wav"]);
        game.load.audio("sfx-spiderbot", ["audio/sfx/spiderbot.ogg", "audio/sfx/spiderbot.wav"]);
        game.load.audio("sfx-money", ["audio/sfx/coin.ogg", "audio/sfx/coin.wav"]);
        game.load.audio("sfx-pistol", ["audio/sfx/weapon-pistol.ogg", "audio/sfx/weapon-pistol.wav"]);
        game.load.audio("sfx-rifle", ["audio/sfx/weapon-rifle.ogg", "audio/sfx/weapon-rifle.wav"]);
        game.load.audio("sfx-laser", ["audio/sfx/weapon-laser.ogg", "audio/sfx/weapon-laser.wav"]);
        game.load.audio("sfx-flamethrower", ["audio/sfx/weapon-flamethrower.ogg", "audio/sfx/weapon-flamethrower.wav"]);
        game.load.audio("sfx-rocket", ["audio/sfx/weapon-rocket.ogg", "audio/sfx/weapon-rocket.wav"]);
        game.load.audio("sfx-out-of-ammo", ["audio/sfx/weapon-outofammo.ogg", "audio/sfx/weapon-outofammo.wav"]);


    },

    loadImg: function () {

        // General and interface (ui)
        game.load.image("menu-bg", "img/ui/menu-bg.png");
        game.load.image("intro-bg", "img/ui/intro-bg.png");
        game.load.image("gameover-bg", "img/ui/gameover-bg.png");

        // Levels
        game.load.image("tileset1", "img/levels/tileset1.png");

        // Objects (objs)
        game.load.image("ladder-m", "img/objs/ladder-m.png");
        game.load.image("platform", "img/objs/platform.png");

        // Items
        game.load.spritesheet("money", "img/items/money.png", 32, 32, 7);

        // Bullets
        for (var i = 1; i <= 5; i++)
        {
            this.load.image('bullet' + i, 'img/bullets/bullet' + i + '.png');
        }

        // Characters (chars)
        game.load.spritesheet("zed", "img/chars/small-zed.png", 48, 48, 48);
        game.load.spritesheet("walker", "img/chars/walker.png", 192, 226, 32);
        game.load.spritesheet("nanobot", "img/chars/nanobot.png", 32, 32, 36);
        game.load.spritesheet("spiderbot", "img/chars/spiderbot.png", 64, 64, 10);
        game.load.spritesheet("turret", "img/chars/turret.png", 62, 46, 5);

    },

    loadJSON: function () {

        // Levels
        game.load.tilemap("map-lvl-1", "json/map-lvl-1.json", null, Phaser.Tilemap.TILED_JSON);

    },

    init: function () {

        game.add.sprite(0, 0, "load-bg");

        this.logo = game.make.sprite(gameWidth * 0.5, gameHeight * 0.3, "brand");
        this.logo.anchor.setTo(0.5);

        this.status = game.make.text(gameWidth * 0.5, gameHeight * 0.5, "Loading game assets...", {
            fill: "white",
            font: "48px Coda"
        });
        this.status.anchor.setTo(0.5);

        // Loads bar from right to left
        this.loadingBar = game.make.sprite((gameWidth * 0.5) - (387 / 2), gameHeight*0.6, "loading");

    },

    preload: function () {

        game.add.existing(this.status);
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);

        this.load.setPreloadSprite(this.loadingBar);

        this.loadJS();
        this.loadImg();
        this.loadAudio();
        this.loadJSON();

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
