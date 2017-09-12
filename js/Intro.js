/*
 * Intro.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

 /* global game, gameWidth, gameHeight, music, playMusic, playSound, sfxMenuForward, sfxMenuBack */

var introText

var Intro = function () {}
Intro.prototype = {
  preload: function () {
    this.introTextContent = [
      'GAME CONTROLS',
      ' ',
      'MOVEMENT: LEFT/RIGHT ARROW KEYS',
      'JUMP/CLIMB: UP ARROW KEY',
      'SHOOT: SPACEBAR',
      'SWITCH WEAPON: ENTER',
      ' ',
      'Are you ready?'

    ]
    this.line = []
    this.wordIndex = 0
    this.lineIndex = 0
    this.wordDelay = 100
    this.lineDelay = 200
  },
  create: function () {
    if (music.name !== 'intro' && playMusic) {
      music.stop()
      music = game.add.audio('intro')
      music.loop = true
      music.play()
    }
    game.add.sprite(0, 0, 'intro-bg')
    this.createMenuOptions()

    introText = game.add.text(64, 32, ' ', {
      font: '18px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    introText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    this.nextLine()
  },
  createMenuOptions: function () {
    this.addMenuOption('Back', gameWidth * 0.10, gameHeight * 0.90, function () {
      if (playSound) {
        sfxMenuBack.play()
      }
      this.game.state.start('Menu')
    })
    this.addMenuOption('Play', gameWidth * 0.90, gameHeight * 0.90, function () {
      if (playSound) {
        sfxMenuForward.play()
      }
      this.game.state.start('Play')
    })
  },
  addMenuOption: function (text, x, y, callback) {
    var optionStyle = {
      font: '36px Orbitron',
      fill: 'rgb(165, 187, 255)'
    }
    var txt = game.add.text(x, y, text, optionStyle)
    txt.anchor.setTo(0.5, 0.5)
    txt.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)

    var onOver = function (target) {
      target.fill = 'rgb(99,93,140)'
      txt.useHandCursor = true
    }
    var onOut = function (target) {
      target.fill = 'rgb(165, 187, 255)'
      txt.useHandCursor = false
    }
    txt.inputEnabled = true
    txt.events.onInputUp.add(callback, this)
    txt.events.onInputOver.add(onOver, this)
    txt.events.onInputOut.add(onOut, this)
  },
  nextLine: function () {
    if (this.lineIndex === this.introTextContent.length) {
            //  Finished
      return
    }
        //  Split current line on spaces, so one word per array element
    this.line = this.introTextContent[this.lineIndex].split(' ')
        //  Reset word index to zero (first word in the line)
    this.wordIndex = 0
        //  Call 'nextWord' function once for each word in the line (line.length)
    game.time.events.repeat(this.wordDelay, this.line.length, this.nextWord, this)
        //  Advance to next line
    this.lineIndex++
  },
  nextWord: function () {
        //  Add next word onto the text string, followed by a space
    introText.text = introText.text.concat(this.line[this.wordIndex] + ' ')
        //  Advance word index to next word in line
    this.wordIndex++
        //  Check if current word is last word
    if (this.wordIndex === this.line.length) {
            //  Add a carriage return
      introText.text = introText.text.concat('\n')
            //  Get next line after lineDelay has elapsed
      game.time.events.add(this.lineDelay, this.nextLine, this)
    }
  }
}
