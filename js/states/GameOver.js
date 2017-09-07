/*
 * GameOver.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var GameOver = function () {};

GameOver.prototype = {

    preload: function () {
        this.optionCount = 1;
    },
    create: function () {
        game.add.sprite(0, 0, "menu-bg");

        var gameOverTitle = game.add.text(gameWidth * 0.5, gameHeight*0.2, "Game Over\nScore: " + score, {
            font: "bold 48px Orbitron",
            fill: "rgba(214,0,255,1)",
            align: "center"
        });
        gameOverTitle.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        gameOverTitle.anchor.set(0.5, 0.5);

        this.createMenu();

    },
    createMenu: function() {
        this.addMenuOption("Play Again", gameWidth*0.5, gameHeight*0.6, function () {
            if (playSound) {sfxMenuForward.play();}
            this.game.state.start("Play");
        });
        this.addMenuOption("Main Menu", gameWidth*0.5, gameHeight*0.8, function () {
            if (playSound) {sfxMenuForward.play();}
            this.game.state.start("Menu");
        });
    },
    addMenuOption: function(text, x, y, callback) {
        var txt = game.add.text(x, y, text, {
            font: "48px Coda",
            fill: "rgba(0,184,255,1)"
        });
        txt.anchor.setTo(0.5, 0.5);
        txt.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);

        var onOver = function(target) {
            target.fill = "rgba(100,100,220,1)";
            txt.useHandCursor = true;
        };
        var onOut = function(target) {
            target.fill = "rgba(0,184,255,1)";
            txt.useHandCursor = false;
        };
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);
    }
};
