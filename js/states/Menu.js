/*
 * Menu.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var Menu = function () {};

Menu.prototype = {

    preload: function () {

        this.optionCount = 1;

    },

    addMenuOption: function (text, callback) {

        var optionStyle = {

            font: "28px",
            fill: "rgba(0,184,255,1)",
            align: "left"

        };

        var txt = game.add.text(30, (this.optionCount * 80) + 100, text, optionStyle);

        txt.font = "Coda";

        var onOver = function (target) {

            target.fill = "rgba(100,100,220,1)";
            txt.useHandCursor = true;

        };

        var onOut = function (target) {

            target.fill = "rgba(0,184,255,1)";
            txt.useHandCursor = false;

        };

        // txt.useHandCursor = true;

        txt.inputEnabled = true;

        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount++;

    },

    create: function () {

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

        var titleStyle = {

            font: "bold 48px",
            fill: "rgba(214,0,255,1)",
            align: "center"

        };

        var gameTitle = game.add.text(game.world.centerX, 100, "HiTech Lowlife", titleStyle);

        gameTitle.font = "Orbitron";
        gameTitle.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        gameTitle.anchor.set(0.5);

        this.addMenuOption("Start",
            function () {

                if (playSound) {sfxMenuForward.play();}
                this.game.state.start("Intro");

        });

        this.addMenuOption("Options",
            function () {

                if (playSound) {sfxMenuForward.play();}
                this.game.state.start("Options");

        });

        this.addMenuOption("Credits",
            function () {

                if (playSound) {sfxMenuForward.play();}
                this.game.state.start("Credits");

        });

    }
};
