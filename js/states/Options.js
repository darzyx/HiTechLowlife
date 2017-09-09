/*
 * Options.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var Options = function () {};

Options.prototype = {

    preload: function () {
        this.optionCount = 1;
    },
    create: function () {
        game.add.sprite(0, 0, "menu-bg");

        var optionsTitle = game.add.text(gameWidth*0.5, gameHeight*0.2, "Options", {
            font: "bold 46px Orbitron",
            fill: "rgb(174,64,153)",
            align: "center"
        });
        optionsTitle.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);
        optionsTitle.anchor.set(0.5, 0.5);

        this.createMenu();
    },
    createMenu: function() {
        this.addMenuOption(scaleGame ? "No Scale" : "Scale", gameWidth*0.5, gameHeight*0.4, function (target) {
            sfxMenuForward.play();
            scaleGame = !scaleGame;
            target.text = scaleGame ? "No Scale" : "Scale";

            if (scaleGame) {
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            else {
                game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            }

        });

        this.addMenuOption(playMusic ? "Mute Music" : "Play Music", gameWidth*0.5, gameHeight*0.6, function (target) {

            if (playSound) {sfxMenuForward.play();}
            playMusic = !playMusic;
            if (playMusic) {music.play();}
            target.text = playMusic ? "Mute Music" : "Play Music";
            music.volume = playMusic ? 1 : 0;

        });

        this.addMenuOption(playSound ? "Mute Sound" : "Play Sound", gameWidth*0.5, gameHeight*0.8, function (target) {

            playSound = !playSound;
            if (playSound) {sfxMenuForward.play();}
            target.text = playSound ? "Mute Sound" : "Play Sound";
            sound.volume = playSound ? 1 : 0;
        });

        this.addMenuOption("Back", gameWidth*0.10, gameHeight*0.9, function () {

            if (playSound) {sfxMenuBack.play();}
            this.game.state.start("Menu");

        });
    },
    addMenuOption: function(text, x, y, callback) {
        var optionStyle = {
            font: "36px Orbitron",
            fill: "rgb(165, 187, 255)"
        };
        var txt = game.add.text(x, y, text, optionStyle);
        txt.anchor.setTo(0.5, 0.5);
        txt.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        txt.fixedToCamera = true;

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
