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

    addMenuOption: function (text, callback) {
        var optionStyle = {
            font: "28px",
            fill: "rgba(0,184,255,1)",
            align: "left"
        };
        var txt = game.add.text(game.world.centerX, (this.optionCount * 70) + 100, text, optionStyle);
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
        game.add.sprite(0, 0, "menu-bg");
        var titleStyle = {
            font: "bold 32px",
            fill: "rgba(214,0,255,1)",
            align: "center"
        };
        var text = game.add.text(game.world.centerX, 100, "Options", titleStyle);
        text.font = "Orbitron";
        text.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        text.anchor.set(0.5);
        this.addMenuOption(fullScreen ? "No Scale" : "Scale", function (target) {
            sfxMenuForward.play();
            fullScreen = !fullScreen;
            target.text = fullScreen ? "No Scale" : "Scale";

            if (fullScreen) {
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            else {
                game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
            }

        });

        this.addMenuOption(playMusic ? "Mute Music" : "Play Music", function (target) {

            if (playSound) {sfxMenuForward.play();}
            playMusic = !playMusic;
            if (playMusic) {music.play();}
            target.text = playMusic ? "Mute Music" : "Play Music";
            music.volume = playMusic ? 1 : 0;

        });
        this.addMenuOption(playSound ? "Mute Sound" : "Play Sound", function (target) {

            playSound = !playSound;
            if (playSound) {sfxMenuForward.play();}
            target.text = playSound ? "Mute Sound" : "Play Sound";
            sound.volume = playSound ? 1 : 0;
        });
        this.addMenuOption("Back", function () {

            if (playSound) {sfxMenuBack.play();}
            this.game.state.start("Menu");

        });

    }
};
