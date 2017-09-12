/*
 * Load.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

/* global Phaser, game, gameWidth, gameHeight, sound, playSound, Menu, Credits, Options, Intro, Play, GameOver */

var music
var sound
var playMusic = true
var playSound = true
var scaleGame = true

var Load = function () {}

Load.prototype = {

  loadJS: function () {
    // Game states
    game.load.script('Menu', 'js/Menu.js')
    game.load.script('Options', 'js/Options.js')
    game.load.script('Credits', 'js/Credits.js')
    game.load.script('Intro', 'js/Intro.js')
    game.load.script('Play', 'js/Play.js')
    game.load.script('GameOver', 'js/GameOver.js')
  },

  loadAudio: function () {
    // Music
    game.load.audio('advanced-simulacra', [
      'audio/music/advanced-simulacra.ogg',
      'audio/music/advanced-simulacra.mp3'
    ])
    game.load.audio('by-product', ['audio/music/by-product.ogg',
      'audio/music/by-product.mp3'
    ])
    game.load.audio('intro', ['audio/music/intro.ogg',
      'audio/music/intro.mp3'
    ])
    game.load.audio('win', ['audio/music/win.ogg', 'audio/music/win.mp3'])

    // Sound effects
    game.load.audio('sfx-menu-forward', ['audio/sfx/itempick.ogg',
      'audio/sfx/itempick.mp3'
    ])
    game.load.audio('sfx-menu-back', ['audio/sfx/itemback.ogg',
      'audio/sfx/itemback.mp3'
    ])
    game.load.audio('sfx-walker-voice', ['audio/sfx/walkervoice.ogg',
      'audio/sfx/walkervoice.mp3'
    ])
    game.load.audio('sfx-nanobot-jump', ['audio/sfx/nanobot.ogg',
      'audio/sfx/nanobot.mp3'
    ])
    game.load.audio('sfx-spiderbot', ['audio/sfx/spiderbot.ogg',
      'audio/sfx/spiderbot.mp3'
    ])
    game.load.audio('sfx-mutant-shocker-voice', [
      'audio/sfx/mutantshockervoice.ogg',
      'audio/sfx/mutantshockervoice.mp3'
    ])
    game.load.audio('sfx-mutant-shocker-shock', [
      'audio/sfx/mutantshockershock.ogg',
      'audio/sfx/mutantshockershock.mp3'
    ])
    game.load.audio('sfx-money', ['audio/sfx/coin.ogg',
      'audio/sfx/coin.mp3'
    ])
    game.load.audio('sfx-pistol', ['audio/sfx/weapon-pistol.ogg',
      'audio/sfx/weapon-pistol.mp3'
    ])
    game.load.audio('sfx-rifle', ['audio/sfx/weapon-rifle.ogg',
      'audio/sfx/weapon-rifle.mp3'
    ])
    game.load.audio('sfx-laser', ['audio/sfx/weapon-laser.ogg',
      'audio/sfx/weapon-laser.mp3'
    ])
    game.load.audio('sfx-flamethrower', [
      'audio/sfx/weapon-flamethrower.ogg',
      'audio/sfx/weapon-flamethrower.mp3'
    ])
    game.load.audio('sfx-rocket', ['audio/sfx/weapon-rocket.ogg',
      'audio/sfx/weapon-rocket.mp3'
    ])
    game.load.audio('sfx-out-of-ammo', ['audio/sfx/weapon-outofammo.ogg',
      'audio/sfx/weapon-outofammo.mp3'
    ])
    game.load.audio('sfx-power-up', ['audio/sfx/powerup.ogg',
      'audio/sfx/powerup.mp3'
    ])
    game.load.audio('sfx-power-down', ['audio/sfx/powerdown.ogg',
      'audio/sfx/powerdown.mp3'
    ])
  },

  loadImg: function () {
    // General and interface (ui)
    game.load.image('menu-bg', 'img/ui/menu-bg.png')
    game.load.image('intro-bg', 'img/ui/intro-bg.png')

    // Levels
    game.load.image('tileset1', 'img/levels/tileset1.png')

    // Objects (objs)
    game.load.image('ladder-m', 'img/objs/ladder-m.png')
    game.load.image('platform', 'img/objs/platform.png')

    // Items
    game.load.spritesheet('money-item', 'img/items/money.png', 32, 32, 7)
    game.load.image('shield-item', 'img/items/shield.png')

    // Projectiles
    for (var i = 1; i <= 5; i += 1) {
      game.load.image('projectile' + i, 'img/projectiles/projectile' + i +
        '.png')
    }

    // Powerups
    game.load.spritesheet('shield-powerup', 'img/powerups/shield.png', 85,
      85, 11)

    // Characters (chars)
    game.load.spritesheet('zed', 'img/chars/small-zed.png', 48, 48, 48)
    game.load.spritesheet('walker', 'img/chars/walker.png', 192, 226, 32)
    game.load.spritesheet('nanobot', 'img/chars/nanobot.png', 32, 32, 36)
    game.load.spritesheet('spiderbot', 'img/chars/spiderbot.png', 64, 64,
      10)
    game.load.spritesheet('turret', 'img/chars/turret.png', 62, 46, 5)
    game.load.spritesheet('mutantshocker', 'img/chars/mutantshocker.png',
      256, 256, 12)
  },

  loadJSON: function () {
    // Levels
    game.load.tilemap('map-lvl-1', 'json/map-lvl-1.json', null, Phaser.Tilemap
      .TILED_JSON)
  },

  init: function () {
    game.add.sprite(0, 0, 'load-bg')

    this.status = game.make.text(gameWidth * 0.5, gameHeight * 0.4,
      'Loading game assets...', {
        fill: 'rgb(165, 187, 255)',
        font: '36px Orbitron'
      })
    this.status.anchor.setTo(0.5)
    this.status.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)

    // Loads bar from right to left
    this.loadingBar = game.make.sprite((gameWidth * 0.5) - (387 / 2),
      gameHeight * 0.6, 'loading')
  },

  preload: function () {
    game.add.existing(this.status)
    game.add.existing(this.loadingBar)

    this.load.setPreloadSprite(this.loadingBar)

    this.loadJS()
    this.loadImg()
    this.loadAudio()
    this.loadJSON()
  },

  addStates: function () {
    game.state.add('Menu', Menu)
    game.state.add('Credits', Credits)
    game.state.add('Options', Options)
    game.state.add('Intro', Intro)
    game.state.add('Play', Play)
    game.state.add('GameOver', GameOver)
  },

  addAudio: function () {
    music = game.add.audio('advanced-simulacra')
    music.loop = true
    if (playMusic) {
      music.play()
    }

    sound = game.add.audio('sfx-menu-forward')
  },

  addSettings: function () {
    // Scale game to browser viewport
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

    // No blur upon scaling
    game.renderer.renderSession.roundPixels = true
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    // Game physics (Phaser ARCADE)
    game.physics.startSystem(Phaser.Physics.ARCADE)

    // Game continues running off screen
    game.stage.disableVisibilityChange = false

    game.stage.backgroundColor = '#000000'
  },

  create: function () {
    this.addStates()
    this.addAudio()
    this.addSettings()

    this.status.setText('Ready')

    setTimeout(function () {
      game.state.start('Menu')
    }, 1000)
  }

}
