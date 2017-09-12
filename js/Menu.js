/*
 * Menu.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

 /* global game, gameWidth, gameHeight, music, playMusic, playSound, sfxMenuForward, sfxMenuBack */

var Menu = function () {}
Menu.prototype = {
  create: function () {
    if (music.name !== 'advanced-simulacra' && playMusic) {
      music.stop()
      music = game.add.audio('advanced-simulacra')
      music.loop = true
      music.play()
    }
    sfxMenuForward = game.add.audio('sfx-menu-forward')
    sfxMenuBack = game.add.audio('sfx-menu-back')
    this.stage.disableVisibilityChange = true
    game.add.sprite(0, 0, 'menu-bg')
    var gameTitle = game.add.text(gameWidth * 0.5, gameHeight * 0.2, 'HiTech Lowlife', {
      font: 'bold 64px Audiowide',
      fill: 'rgb(174,64,153)',
      align: 'center'
    })
    gameTitle.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    gameTitle.anchor.set(0.5)
    this.createMenu()
  },
  createMenu: function () {
    this.addMenuOption('Start', '36px', gameWidth * 0.5, gameHeight * 0.45, function () {
      if (playSound) {
        sfxMenuForward.play()
      }
      this.game.state.start('Intro')
    })
    this.addMenuOption('Options', '36px', gameWidth * 0.5, gameHeight * 0.65, function () {
      if (playSound) {
        sfxMenuForward.play()
      }
      this.game.state.start('Options')
    })
    this.addMenuOption('Credits', '36px', gameWidth * 0.5, gameHeight * 0.85, function () {
      if (playSound) {
        sfxMenuForward.play()
      }
      this.game.state.start('Credits')
    })
    this.addMenuOption('Home', '24px', gameWidth * 0.10, gameHeight * 0.90, function () {
      if (playSound) {
        sfxMenuBack.play()
      }
      window.location.href = 'http://www.darzyx.com/'
    })
    this.addMenuOption('GitHub', '24px', gameWidth * 0.90, gameHeight * 0.90, function () {
      if (playSound) {
        sfxMenuBack.play()
      }
      window.location.href = 'https://github.com/josedarioxyz/HiTechLowlife'
    })
  },
  addMenuOption: function (text, fontSize, x, y, callback) {
    var optionStyle = {
      font: fontSize + ' Orbitron',
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
  }
}
