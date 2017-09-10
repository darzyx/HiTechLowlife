/*
 * Start.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
*/

/* global Phaser, game, gameWidth, gameHeight, Start, WebFont, Load */

var gameWidth = 640
var gameHeight = 360
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'HiTech Lowlife')

var Start = function (game) {}

Start.prototype = {

  preload: function () {
        // Loading screen elements
    game.load.image('load-bg', 'img/ui/intro-bg.png')
    game.load.image('loading', 'img/ui/loading.png')

    game.load.script('Load', 'js/states/Load.js')

        // Google WebFont
    game.load.script('WebFont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')
  },

  create: function () {
        // Google WebFont
    WebFont.load({
      google: {
        families: ['Aldrich', 'Audiowide', 'Share Tech Mono', 'Orbitron', 'VT323']
      }
    })

    game.state.add('Load', Load)
    game.state.start('Load')
  }

}

game.state.add('Start', Start)
game.state.start('Start')
