/*
 * Intro.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

Intro = function () {};

Intro.prototype = {

    preload: function () {
        this.optionCount = 0;

        this.content = [
            "This is the introductory text for HiTech Lowlife...",
            "This is the second line of the aforementioned introductory text.",
            "This is the third.",
            "The fourth.",
            "Finally, this is the fifth such line."
        ];

        this.line = [];
        this.wordIndex = 0;
        this.lineIndex = 0;
        this.wordDelay = 120;
        this.lineDelay = 400;
    },

    addMenuOption: function (text, callback) {
        var optionStyle = {
            font: "28px",
            fill: "rgba(0,184,255,1)",
            align: "left"
        };
        var txt = game.add.text((this.optionCount * 568) + 100, 400, text, optionStyle);
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

        this.addMenuOption("Back", function () {
            if (playSound) {sfxMenuBack.play();}
            this.game.state.start("Menu");
        });

        this.addMenuOption("Play", function () {
            if (playSound) {sfxMenuForward.play();}
            this.game.state.start("Play");
        });

        introText = game.add.text(64, 64, '', { font: "18px Arial", fill: "rgba(214,0,255,1)" });
        this.nextLine();

    },

    nextLine: function () {

        if (this.lineIndex === this.content.length) {
            //  We're finished
            return;
        }

        //  Split the current line on spaces, so one word per array element
        this.line = this.content[this.lineIndex].split(' ');

        //  Reset the word index to zero (the first word in the line)
        this.wordIndex = 0;

        //  Call the 'nextWord' function once for each word in the line (line.length)
        game.time.events.repeat(this.wordDelay, this.line.length, this.nextWord, this);

        //  Advance to the next line
        this.lineIndex++;
    },

    nextWord: function () {

        //  Add the next word onto the text string, followed by a space
        introText.text = introText.text.concat(this.line[this.wordIndex] + " ");

        //  Advance the word index to the next word in the line
        this.wordIndex++;

        //  Last word?
        if (this.wordIndex === this.line.length)
        {
            //  Add a carriage return
            introText.text = introText.text.concat("\n");

            //  Get the next line after the lineDelay amount of ms has elapsed
            game.time.events.add(this.lineDelay, this.nextLine, this);
        }

    }

};
