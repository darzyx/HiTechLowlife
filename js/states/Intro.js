/*
 * Intro.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

Intro = function() {};
Intro.prototype = {
    preload: function() {
        this.introTextContent = [
            "December 1st, 2068",
            " ",
            "You're awake! Can you read this? Good. My name is Dr. Janet Roko. My team and I",
            "here at the HiTech National Laboratory are in the final stages of developing a",
            "working artificial general superintelligence (AGSI).",
            "We predict that the final version of our project will catalyze runaway technological",
            "growth in the world, so we want to be sure that our software works exactly as.",
            "intended.",
            "You are our latest prototype, and we want to see what you can do. Your first mission",
            "is simply to demonstrate your abilities. There's no time to waste, so let's hit the",
            "ground running. Are you ready?"];
        this.line = [];
        this.wordIndex = 0;
        this.lineIndex = 0;
        this.wordDelay = 100;
        this.lineDelay = 200;
    },
    create: function() {
        if (music.name !== "intro" && playMusic) {
            music.stop();
            music = game.add.audio("intro");
            music.loop = true;
            music.play();
        }
        game.add.sprite(0, 0, "intro-bg");
        this.createMenuOptions();

        introText = game.add.text(64, 32, " ", {
            font: "18px Coda",
            fill: "rgba(0,184,255,1)",
        });
        introText.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        this.nextLine();
    },
    createMenuOptions: function() {
        this.addMenuOption("Back", gameWidth * 0.10, gameHeight * 0.90, function() {
            if (playSound) {
                sfxMenuBack.play();
            }
            this.game.state.start("Menu");
        });
        this.addMenuOption("Play", gameWidth * 0.90, gameHeight * 0.90, function() {
            if (playSound) {
                sfxMenuForward.play();
            }
            this.game.state.start("Play");
        });
    },
    addMenuOption: function(text, x, y, callback) {
        var optionStyle = {
            font: "48px Coda",
            fill: "rgba(0,184,255,1)"
        };
        var txt = game.add.text(x, y, text, optionStyle);
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
    },
    nextLine: function() {
        if (this.lineIndex === this.introTextContent.length) {
            //  Finished
            return;
        }
        //  Split current line on spaces, so one word per array element
        this.line = this.introTextContent[this.lineIndex].split(' ');
        //  Reset word index to zero (first word in the line)
        this.wordIndex = 0;
        //  Call 'nextWord' function once for each word in the line (line.length)
        game.time.events.repeat(this.wordDelay, this.line.length, this.nextWord, this);
        //  Advance to next line
        this.lineIndex++;
    },
    nextWord: function() {
        //  Add next word onto the text string, followed by a space
        introText.text = introText.text.concat(this.line[this.wordIndex] + " ");
        //  Advance word index to next word in line
        this.wordIndex++;
        //  Check if current word is last word
        if (this.wordIndex === this.line.length) {
            //  Add a carriage return
            introText.text = introText.text.concat("\n");
            //  Get next line after lineDelay has elapsed
            game.time.events.add(this.lineDelay, this.nextLine, this);
        }
    }
};
