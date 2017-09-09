/*
 * GameOver.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var GameOver = function () {};

GameOver.prototype = {
    init: function() {
        if (score >= window.localStorage.getItem("hitechlowlifescore")) {
            window.localStorage.setItem("hitechlowlifescore", score);
        }
    },
    preload: function () {
        this.optionCount = 1;
    },
    create: function () {
        game.add.sprite(0, 0, "menu-bg");

        var gameOverTitle = game.add.text(gameWidth * 0.5, gameHeight*0.2, "Game Over", {
            font: "bold 48px Orbitron",
            fill: "rgb(174,64,153)",
            align: "center"
        });
        gameOverTitle.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);
        gameOverTitle.anchor.set(0.5, 0.5);

        var scoreText = game.add.text(gameWidth * 0.5, gameHeight*0.4, "Score: " + score + "\nHiScore: " + window.localStorage.getItem("hitechlowlifescore"), {
            font: "bold 28px Orbitron",
            fill: "rgb(210,91,105)",
            align: "center"
        });
        scoreText.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);
        scoreText.anchor.set(0.5, 0.5);

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
            font: "48px Orbitron",
            fill: "rgb(165, 187, 255)"
        });
        txt.anchor.setTo(0.5, 0.5);
        txt.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);

        var onOver = function(target) {
            target.fill = "rgb(99,93,140)";
            txt.useHandCursor = true;
        };
        var onOut = function(target) {
            target.fill = "rgb(165, 187, 255)";
            txt.useHandCursor = false;
        };
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);
    }
};
