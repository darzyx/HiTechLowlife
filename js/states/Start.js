/*
 * Start.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var gameWidth = 768;
var gameHeight = 432;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, "HiTech Lowlife");

Start = function () {};

Start.prototype = {

    preload: function () {

        game.load.image("load-bg", "img/ui/load-bg.png");
        game.load.image("loading", "img/ui/loading.png");
        game.load.image("brand", "img/ui/logo-darzyx.png");

        game.load.script("utils", "js/utils.js");
        game.load.script("Load", "js/states/Load.js");

        // Google WebFont Loader
        game.load.script("WebFont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");

    },

    create: function () {

        // Google WebFont Loader
        WebFont.load({
          google: {
            families: ["Aldrich", "Audiowide", "Coda", "Orbitron", "VT323"]
          }
        });

        game.state.add("Load", Load);
        game.state.start("Load");

    }

};

game.state.add("Start", Start);
game.state.start("Start");
