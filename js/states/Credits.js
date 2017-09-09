/*
 * Credits.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

var Credits = function() {};
Credits.prototype = {
    preload: function() {
        this.creditCount = 0;
    },
    addCredit: function(task, author) {
        var authorStyle = {
            font: "36px Orbitron",
            fill: "white",
        };
        var taskStyle = {
            font: "32px Orbitron",
            fill: "white",
        };
        var authorText = game.add.text(game.world.centerX, gameHeight + 100, author, authorStyle);
        var taskText = game.add.text(game.world.centerX, gameHeight + 150, task, taskStyle);

        authorText.anchor.setTo(0.5, 0.5);
        authorText.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);

        taskText.anchor.setTo(0.5, 0.5);
        taskText.setShadow(3, 3, "rgba(0,0,0,0.75)", 5);

        game.add.tween(authorText).to({
            y: -300
        }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 3000);
        game.add.tween(taskText).to({
            y: -200
        }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 3000);
        this.creditCount++;
    },
    create: function() {
        this.stage.disableVisibilityChange = true;
        if (music.name !== "win" && playMusic) {
            music.stop();
            music = game.add.audio("win");
            music.loop = true;
            music.play();
        }
        var bg = game.add.sprite(0, 0, "menu-bg");
        this.addCredit("Developer", "Jose Dario Sanchez");
        this.addCredit("the following artists:", "A big thanks to all of");
        this.addCredit("Music", "Maxstack");
        this.addCredit("Zed Sprite", "irmirx");
        this.addCredit("Walker Sprite", "NICKtendo DS");
        this.addCredit("Spiderbot Sprite", "Stephen \"Redshrike\"");
        this.addCredit("Nanobot Sprite", "GrafxKid");
        this.addCredit("Inventory Items Sprites", "OceansDream");
        this.addCredit("Sound Effects", "Little Robot Sound Factory");
        this.addCredit("Sound Effects", "Michel Baradari");
        this.addCredit("Spiderbot Sound Effect", "Bart Kelsey");
        this.addCredit("Coin Sound Effect", "Brandon Morris");
        this.addCredit("Weapon Sprites", "Mutantleg");
        this.addCredit("Phaser.io", "Powered By");
        this.addCredit(" ", "Thanks for playing!");
        this.addMenuOption("Back", gameWidth * 0.10, gameHeight * 0.90, function() {
            if (playSound) {
                sfxMenuBack.play();
            }
            game.state.start("Menu");
        });
        game.add.tween(bg).to({
            alpha: 0
        }, 35000, Phaser.Easing.Cubic.Out, true, 35000);
    },
    addMenuOption: function(text, x, y, callback) {
        var txt = game.add.text(x, y, text, {
            font: "36px Orbitron",
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
