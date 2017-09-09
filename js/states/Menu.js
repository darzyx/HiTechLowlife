/*
 * Menu.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

var Menu = function() {};
Menu.prototype = {
    create: function() {
        if (music.name !== "advanced-simulacra" && playMusic) {
            music.stop();
            music = game.add.audio("advanced-simulacra");
            music.loop = true;
            music.play();
        }
        sfxMenuForward = game.add.audio("sfx-menu-forward");
        sfxMenuBack = game.add.audio("sfx-menu-back");
        this.stage.disableVisibilityChange = true;
        game.add.sprite(0, 0, "menu-bg");
        var gameTitle = game.add.text(gameWidth * 0.5, gameHeight * 0.2, "HiTech Lowlife", {
            font: "bold 64px Audiowide",
            fill: "rgb(174,64,153)",
            align: "center"
        });
        gameTitle.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);
        gameTitle.anchor.set(0.5);
        this.createMenu();
    },
    createMenu: function() {
        this.addMenuOption("Start", gameWidth * 0.5, gameHeight * 0.45, function() {
            if (playSound) {
                sfxMenuForward.play();
            }
            this.game.state.start("Intro");
        });
        this.addMenuOption("Options", gameWidth * 0.5, gameHeight * 0.65, function() {
            if (playSound) {
                sfxMenuForward.play();
            }
            this.game.state.start("Options");
        });
        this.addMenuOption("Credits", gameWidth * 0.5, gameHeight * 0.85, function() {
            if (playSound) {
                sfxMenuForward.play();
            }
            this.game.state.start("Credits");
        });
    },
    addMenuOption: function(text, x, y, callback) {
        var optionStyle = {
            font: "36px Orbitron",
            fill: "rgb(165, 187, 255)",
        };
        var txt = game.add.text(x, y, text, optionStyle);
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
