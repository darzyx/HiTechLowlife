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

    addMenuOption: function (text, callback) {
        var optionStyle = {
            font: "28px",
            fill: "rgba(0,184,255,1)",
            align: "left"
        };
        var txt = game.add.text(gameWidth * 0.5, (this.optionCount * 80) + 150, text, optionStyle);
        txt.font = "Coda";
        txt.anchor.setTo(0.5);
        var onOver = function (target) {
            target.fill = "rgba(100,100,220,1)";
            txt.useHandCursor = true;
        };
        var onOut = function (target) {
            target.fill = "rgba(0,184,255,1)";
            txt.useHandCursor = false;
        };
        //txt.useHandCursor = true;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount++;


    },

    create: function () {
        game.add.sprite(0, 0, "gameover-bg");
        var titleStyle = {
            font: "bold 32px",
            fill: "rgba(214,0,255,1)",
            align: "center"
        };
        var gameOverTitle = game.add.text(gameWidth * 0.5, 100, "Game Over", titleStyle);
        gameOverTitle.font = "Orbitron";
        gameOverTitle.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        gameOverTitle.anchor.set(0.5);

        var gameOverScore = game.add.text(gameWidth * 0.5, 150, "Score: " + score, titleStyle);
        gameOverScore.font = "Orbitron";
        gameOverScore.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        gameOverScore.anchor.set(0.5);

        this.addMenuOption("Play Again", function () {
            if (playSound) {sfxMenuForward.play();}
            this.game.state.start("Play");
        });
        this.addMenuOption("Main Menu", function () {
            if (playSound) {sfxMenuForward.play();}
            this.game.state.start("Menu");
        });
    }
};
