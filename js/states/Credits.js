/*
 * Credits.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

var Credits = function () {};

Credits.prototype = {

    preload: function () {
        this.optionCount = 1;
        this.creditCount = 0;

    },

    addCredit: function (task, author) {
        var authorStyle = {
            font: "32px",
            fill: "white",
            align: "center"
        };
        var taskStyle = {
            font: "28px",
            fill: "white",
            align: "center"
        };
        var authorText = game.add.text(game.world.centerX, 500, author, authorStyle);
        var taskText = game.add.text(game.world.centerX, 550, task, taskStyle);
        authorText.font = "Orbitron";
        authorText.anchor.setTo(0.5);
        taskText.font = "Coda";
        taskText.anchor.setTo(0.5);
        game.add.tween(authorText).to({
            y: -300
        }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 3000);
        game.add.tween(taskText).to({
            y: -200
        }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 3000);
        this.creditCount++;
    },

    addMenuOption: function (text, callback) {
        var optionStyle = {
            font: "28px",
            fill: "rgba(0,184,255,1)",
            align: "left"
        };
        var txt = game.add.text(10, (this.optionCount * 80) + 300, text, optionStyle);
        txt.font = "Coda";
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
        this.stage.disableVisibilityChange = true;
        if (playMusic) {
            music.stop();
            music = game.add.audio("by-product");
            music.play();
        }
        var bg = game.add.sprite(0, 0, "gameover-bg");
        this.addCredit("Developer", "Jose Dario Sanchez");
        this.addCredit("the following artists:", "A big thanks to all of");
        this.addCredit("Music", "Maxstack");
        this.addCredit("Player Spritesheet", "irmirx");
        this.addCredit("Visual Effects", "Skorpio");
        this.addCredit("Walker Spritesheet", "NICKtendo DS");
        this.addCredit("Drone Spritesheet", "MillionthVector");
        this.addCredit("Nanobot Spritesheet", "GrafxKid");
        this.addCredit("Sound Effects", "Little Robot Sound Factory");
        this.addCredit("Sound Effects", "Michel Baradari");
        this.addCredit("Drone Sound Effect", "Bart Kelsey");
        this.addCredit("Coin Sound Effect", "Brandon Morris");
        this.addCredit("Item Sprites", "Mutantleg");
        this.addCredit("Phaser.io", "Powered By");
        this.addCredit(" ", "Thanks for playing!");
        this.addMenuOption("Back", function () {
            if (playSound) {sfxMenuBack.play();}
            game.state.start("Menu");
        });
        game.add.tween(bg).to({
            alpha: 0
        }, 25000, Phaser.Easing.Cubic.Out, true, 25000);
    }

};
