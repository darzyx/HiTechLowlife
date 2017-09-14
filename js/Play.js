/*
* Play.js
* HiTech Lowlife Demo Code
* Copyright © 2017 Jose Dario Sanchez
*/
/* global Phaser, PIXI, game, gameWidth, gameHeight, music, playMusic, playSound, sfxMenuForward */
var player
var cursors
var healthText
var pistolAmmoText
var rifleAmmoText
var laserAmmoText
var flameThrowerAmmoText
var rocketAmmoText
var scoreText
var score = 0
// ==============================================================================
// Core Play class
// ==============================================================================
var Play = function (game) {}
Play.prototype = {
  init: function () {
    if (music.name !== 'by-product' && playMusic) {
      music.stop()
      music = game.add.audio('by-product')
      music.loop = true
      music.play()
    }
    score = 0
    this.bg = null
    this.map = null
    this.backgroundLayer = null
    this.collisionLayer = null
    this.decorationLayer = null
    this.ladders = null
    this.platforms = null
    this.locked = false
    this.lockedTo = null
    this.wasLocked = false
    this.items = null
    this.itemsShield = null
    this.normalEnemies = null
    this.ghostEnemies = null
    this.weapons = []
    this.currentWeapon = 0
    game.time.reset()
  },
  create: function () {
// Order determines relative z-position (back to front)
    this.createMap()
    this.createItemsAndObjects()
    this.createWeapons()
    this.createEnemies()
    this.createPlayer()
    this.createHUD()
  },
  createMap: function () {
    this.bg = game.add.sprite(0, 0, 'menu-bg')
    this.bg.fixedToCamera = true
    this.map = game.add.tilemap('map-lvl-1')
    this.map.addTilesetImage('tileset1', 'tileset1')
// Layers
    this.backgroundLayer = this.map.createLayer('backgroundLayer')
    this.collisionLayer = this.map.createLayer('collisionLayer')
    this.decorationLayer = this.map.createLayer('decorationLayer')
// Tell phaser which is the collision layer
    this.map.setCollisionBetween(0, 974, true, this.collisionLayer, false)
// Resize world to level size:
    this.backgroundLayer.resizeWorld()
// Level gravity strength
    game.physics.arcade.gravity.y = 0
    game.stage.smoothed = false
  },
  createItemsAndObjects: function () {
// Game objects
    this.ladders = game.add.group()
    this.addObjectLadder(86, 46)
    this.platforms = this.add.physicsGroup()
    var platform1 = new ObjectPlatform(game, 67, 30, 'platform', this.platforms)
    platform1.addMotionPath([{
      x: '+150',
      xSpeed: 2000,
      xEase: 'Linear',
      y: '-150',
      ySpeed: 2000,
      yEase: 'Sine.easeIn'
    }, {
      x: '-150',
      xSpeed: 2000,
      xEase: 'Linear',
      y: '-150',
      ySpeed: 2000,
      yEase: 'Sine.easeOut'
    }, {
      x: '-150',
      xSpeed: 2000,
      xEase: 'Linear',
      y: '+150',
      ySpeed: 2000,
      yEase: 'Sine.easeIn'
    }, {
      x: '+150',
      xSpeed: 2000,
      xEase: 'Linear',
      y: '+150',
      ySpeed: 2000,
      yEase: 'Sine.easeOut'
    }])
    this.platforms.callAll('start')
// Game items
    this.items = game.add.group()
    this.addItemMoney(43, 21)
    this.addItemMoney(43, 23)
    this.addItemMoney(43, 25)
    this.addItemMoney(43, 27)
    this.itemsShield = game.add.group()
    this.addItemShield(17, 31)
  },
  createWeapons: function () {
    this.weapons.push(new Weapon.Pistol(this.game))
    this.weapons.push(new Weapon.Rifle(this.game))
    this.weapons.push(new Weapon.Laser(this.game))
    this.weapons.push(new Weapon.Flamethrower(this.game))
    this.weapons.push(new Weapon.Rockets(this.game))
    this.currentWeapon = 0
    for (var i = 1; i < this.weapons.length; i++) {
      this.weapons[i].visible = false
    }
    var switchWeaponKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    switchWeaponKey.onDown.add(this.nextWeapon, this)
  },
  createEnemies: function () {
    this.normalEnemies = game.add.physicsGroup()
    this.ghostEnemies = game.add.physicsGroup()
    this.addEnemyNanobot(18, 15)
    this.addEnemyWalker(67, 10)
    this.addEnemySpiderbot(101, 6)
    this.addEnemySpiderbot(106, 6)
    this.addEnemyTurret(27, 3)
    this.addEnemyMutantShocker(229, 25)
  },
  createPlayer: function () {
    player = game.add.sprite(96, 240, 'zed')
    game.physics.enable(player, Phaser.Physics.ARCADE)
    player.body.setSize(24, 45, 12, 3)
    player.anchor.setTo(0.5, 1)
    player.body.maxVelocity.y = 700
    player.body.gravity.y = 1000
    player.facing = 'right'
    player.health = 3
    player.healthGracePeriod = 100
    player.isAttacked = false
    player.walkSpeed = 175
    player.jumpSpeed = 400
    player.willJump = false
    player.isStanding = true
    player.isFiring = false
    player.isClimbing = false
    player.climbSpeed = 100
    player.animations.add('walkLeft', [0, 1, 2, 3, 4, 5], 10, true)
    player.animations.add('walkRight', [6, 7, 8, 9, 10, 11], 10, true)
    player.animations.add('climb', [12, 13, 22, 23], 4, true)
    player.animations.add('idleLeft', [14, 15], 4, true)
    player.jumpDownLeft = 16
    player.jumpUpLeft = 17
    player.jumpUpRight = 18
    player.jumpDownRight = 19
    player.animations.add('idleRight', [20, 21], 4, true)
    player.crouchLeft = 24
    player.shootCrouchLeft = 25
    player.animations.add('shootIdleLeft', [26, 27], 4, true)
    player.shootJumpDownLeft = 28
    player.shootJumpUpLeft = 29
    player.shootJumpUpRight = 30
    player.shootJumpDownRight = 31
    player.animations.add('shootIdleRight', [32, 33], 4, true)
    player.shootCrouchRight = 34
    player.crouchRight = 35
    player.animations.add('shootWalkLeft', [36, 37, 38, 39, 40, 41], 10, true)
    player.animations.add('shootWalkRight', [42, 43, 44, 45, 46, 47], 10, true)
    cursors = game.input.keyboard.createCursorKeys()
    player.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON)
    player.rifleAmmo = 100
    player.laserAmmo = 100
    player.flamethrowerAmmo = 100
    player.rocketAmmo = 15
    player.shieldTimer = 350
    player.collideWorldBounds = false
    player.checkWorldBounds = true
    player.events.onOutOfBounds.add(function () {
      player.health = 1
      this.hurtPlayer()
    }, this)
  },
  createHUD: function () {
    this.addMenuOption('Quit', gameWidth * 0.98, gameHeight * 0.05, function () {
      if (playSound) {
        sfxMenuForward.play()
      }
      game.world.setBounds(0, 0, gameWidth, gameHeight)
      this.game.state.start('GameOver')
    })
    scoreText = game.add.text(gameWidth * 0.5, gameHeight * 0.05, 'Score: ' + score, {
      font: '16px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    scoreText.stroke = '#000000'
    scoreText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    scoreText.anchor.setTo(0.5, 0.5)
    scoreText.fixedToCamera = true
    healthText = game.add.text(gameWidth * 0.5, gameHeight * 0.10, 'Health: ' + player.health, {
      font: '16px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    healthText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    healthText.anchor.setTo(0.5, 0.5)
    healthText.fixedToCamera = true
    pistolAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.05, 'Pistol: ∞', {
      font: '13px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    pistolAmmoText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    pistolAmmoText.anchor.setTo(0, 0.5)
    pistolAmmoText.fixedToCamera = true
    rifleAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.10, 'Rifle: ' + player.rifleAmmo, {
      font: '13px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    rifleAmmoText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    rifleAmmoText.anchor.setTo(0, 0.5)
    rifleAmmoText.fixedToCamera = true
    laserAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.15, 'Laser: ' + player.laserAmmo, {
      font: '13px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    laserAmmoText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    laserAmmoText.anchor.setTo(0, 0.5)
    laserAmmoText.fixedToCamera = true
    flameThrowerAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.20, 'Flamethrower: ' + player.flamethrowerAmmo, {
      font: '13px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    flameThrowerAmmoText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    flameThrowerAmmoText.anchor.setTo(0, 0.5)
    flameThrowerAmmoText.fixedToCamera = true
    rocketAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.25, 'Rockets: ' + player.rocketAmmo, {
      font: '13px Orbitron',
      fill: 'rgb(165, 187, 255)'
    })
    rocketAmmoText.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    rocketAmmoText.anchor.setTo(0, 0.5)
    rocketAmmoText.fixedToCamera = true
  },
  addMenuOption: function (text, x, y, callback) {
    var optionStyle = {
      font: '16px Orbitron',
      fill: 'rgb(165, 187, 255)'
    }
    var txt = game.add.text(x, y, text, optionStyle)
    txt.anchor.setTo(1, 0.5)
    txt.setShadow(3, 3, 'rgba(0,0,0,0.75)', 5)
    txt.fixedToCamera = true
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
  addEnemyWalker: function (x, y) {
    var temp = new EnemyWalker(game, x, y)
    game.add.existing(temp)
    this.normalEnemies.add(temp)
  },
  addEnemyNanobot: function (x, y) {
    var temp = new EnemyNanobot(game, x, y)
    game.add.existing(temp)
    this.normalEnemies.add(temp)
  },
  addEnemySpiderbot: function (x, y) {
    var temp = new EnemySpiderbot(game, x, y)
    game.add.existing(temp)
    this.normalEnemies.add(temp)
  },
  addEnemyTurret: function (x, y) {
    var temp = new EnemyTurret(game, x, y)
    game.add.existing(temp)
    this.normalEnemies.add(temp)
  },
  addEnemyMutantShocker: function (x, y) {
    var temp = new EnemyMutantShocker(game, x, y)
    game.add.existing(temp)
    this.ghostEnemies.add(temp)
  },
  addItemMoney: function (x, y) {
    var temp = new ItemMoney(game, x, y)
    game.add.existing(temp)
    this.items.add(temp)
  },
  addItemShield: function (x, y) {
    var temp = new ItemShield(game, x, y)
    game.add.existing(temp)
    this.itemsShield.add(temp)
  },
  addObjectLadder: function (x, y) {
    var temp = new ObjectLadder(game, x, y)
    game.add.existing(temp)
    this.ladders.add(temp)
  },
  addPowerupShield: function () {
    var temp = new PowerupShield(game)
    game.add.existing(temp)
  },
  update: function () {
    this.updatePlayer()
    this.updateEnemies()
    game.physics.arcade.collide(this.weapons[this.currentWeapon], this.collisionLayer, this.killSprite, null, this)
  },
  updatePlayer: function () {
    game.physics.arcade.collide(player, this.collisionLayer)
    this.physics.arcade.collide(player, this.platforms, this.customSep, null, this)
    player.body.velocity.x = 0
    this.PlayerMovement()
    game.physics.arcade.overlap(player, this.itemsShield, this.addPowerupShield, null, this)
    if (player.shieldTimer <= 349) {
      player.shieldTimer += 1
      return
    }
    if (player.healthGracePeriod <= 99) {
      player.healthGracePeriod += 1
    } else {
      game.physics.arcade.overlap(player, this.normalEnemies, this.hurtPlayer, null, this)
      game.physics.arcade.overlap(player, this.ghostEnemies, this.hurtPlayer, null, this)
    }
  },
  updateEnemies: function () {
    this.normalEnemies.setAll('tint', 0xFFFFFF)
    this.ghostEnemies.setAll('tint', 0xFFFFFF)
    game.physics.arcade.collide(this.normalEnemies, this.collisionLayer)
    game.physics.arcade.collide(this.normalEnemies, this.normalEnemies)
    game.physics.arcade.collide(this.ghostEnemies, this.ghostEnemies)
    game.physics.arcade.overlap(this.normalEnemies, this.weapons[this.currentWeapon], this.hurtEnemy, null, this)
    game.physics.arcade.overlap(this.ghostEnemies, this.weapons[this.currentWeapon], this.hurtEnemy, null, this)
  },
  PlayerMovement: function () {
    player.isStanding = player.body.blocked.down || player.body.touching.down || this.locked
    player.isFiring = player.fireButton.isDown
    if (player.isStanding) {
      if (cursors.up.isDown) {
        if (this.locked) {
          this.cancelLock()
        }
        player.willJump = true
        player.body.velocity.y = -1 * player.jumpSpeed
        if (cursors.left.isDown || player.facing === 'left') {
          player.facing = 'left'
        } else {
          player.facing = 'right'
        }
      } else {
        if (cursors.left.isDown) {
          player.body.velocity.x = -1 * player.walkSpeed
          if (player.isFiring) {
            player.animations.play('shootWalkLeft')
          } else {
            player.animations.play('walkLeft')
          }
          player.facing = 'left'
        } else if (cursors.right.isDown) {
          player.body.velocity.x = player.walkSpeed
          if (player.isFiring) {
            player.animations.play('shootWalkRight')
          } else {
            player.animations.play('walkRight')
          }
          player.facing = 'right'
        } else if (player.facing === 'left') {
          if (player.isFiring) {
            player.animations.play('shootIdleLeft')
          } else {
            player.animations.play('idleLeft')
          }
        } else {
          if (player.isFiring) {
            player.animations.play('shootIdleRight')
          } else {
            player.animations.play('idleRight')
          }
        }
      }
    } else {
      if (player.body.velocity.y > 0) {
        if (cursors.left.isDown || player.facing === 'left') {
          if (player.isFiring) {
            player.frame = player.shootJumpUpLeft
          } else {
            player.frame = player.jumpUpLeft
          }
        } else {
          if (player.isFiring) {
            player.frame = player.shootJumpUpRight
          } else {
            player.frame = player.jumpUpRight
          }
        }
      } else {
        if (cursors.left.isDown || player.facing === 'left') {
          if (player.isFiring) {
            player.frame = player.shootJumpDownLeft
          } else {
            player.frame = player.jumpDownLeft
          }
        } else {
          if (player.isFiring) {
            player.frame = player.shootJumpDownRight
          } else {
            player.frame = player.jumpDownRight
          }
        }
      }
      if (cursors.left.isDown) {
        player.body.velocity.x = -1 * player.walkSpeed
        player.facing = 'left'
      } else if (cursors.right.isDown) {
        player.body.velocity.x = player.walkSpeed
        player.facing = 'right'
      }
    }
    if (player.isFiring) {
      this.weapons[this.currentWeapon].fire(player)
    }
    if (this.locked) {
      this.checkLock()
    }
    if (this.locked || this.wasLocked) {
      player.x += this.lockedTo.deltaX
      player.y = this.lockedTo.y
      if (player.body.velocity.x !== 0) {
        player.body.velocity.y = 0
      }
    }
    if (player.willJump) {
      player.willJump = false
      if (this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked) {
//  If platform is moving up, add its velocity to the players jump
        player.body.velocity.y = -player.jumpSpeed + (this.lockedTo.deltaY * 10)
      } else {
        player.body.velocity.y = -player.jumpSpeed
      }
    }
    if (this.wasLocked) {
      this.wasLocked = false
      this.lockedTo.playerLocked = false
      this.lockedTo = null
    }
    if (player.isClimbing) {
      player.body.velocity.y = 0
      player.body.allowGravity = false
      if (cursors.up.isDown) {
        player.body.velocity.y = -100
      } else if (cursors.down.isDown) {
        player.body.velocity.y = 100
      }
      if (cursors.left.isDown) {
        player.body.velocity.x = -100
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 100
      }
    } else {
      player.body.allowGravity = true
    }
  },
  hurtPlayer: function () {
    player.health -= 1
    player.healthGracePeriod = 0
    healthText.text = 'Health: ' + player.health
    if (player.health >= 1) {
      return
    }
    healthText.text = 'Health: X'
    player.kill()
    setTimeout(function () {
      game.world.setBounds(0, 0, gameWidth, gameHeight)
      game.state.start('GameOver')
    }, 2000)
  },
  hurtEnemy: function (enemy, weapon) {
    enemy.health--
    weapon.kill()
    enemy.tint = 0xFF0000
  },
  debugGame: function () {
    game.debug.body(player)
    this.normalEnemies.forEachAlive(this.renderGroup, this)
    this.ghostEnemies.forEachAlive(this.renderGroup, this)
    this.ladders.forEachAlive(this.renderGroup, this)
    this.platforms.forEachAlive(this.renderGroup, this)
    this.items.forEachAlive(this.renderGroup, this)
    this.itemsShield.forEachAlive(this.renderGroup, this)
    this.collisionLayer.debug = true
  },
  render: function () {
// ******* UNCOMMENT TO ENTER DEBUG MODE *******
    // this.debugGame()
  },
  renderGroup: function (member) {
    game.debug.body(member)
  },
  customSep: function (player, platform) {
    if (!this.locked && player.body.velocity.y > 0) {
      this.locked = true
      this.lockedTo = platform
      platform.playerLocked = true
      player.body.velocity.y = 0
    }
  },
  checkLock: function () {
    player.body.velocity.y = 0
//  If player walks off sides of platform then no longer locked to it
    if (player.body.right < this.lockedTo.body.x || player.body.x > this.lockedTo.body.right) {
      this.cancelLock()
    }
  },
  cancelLock: function () {
    this.wasLocked = true
    this.locked = false
  },
  nextWeapon: function () {
//  Tidy-up the current weapon
    if (this.currentWeapon > 9) {
      this.weapons[this.currentWeapon].reset()
    } else {
      this.weapons[this.currentWeapon].visible = false
      this.weapons[this.currentWeapon].callAll('reset', null, 0, 0)
      this.weapons[this.currentWeapon].setAll('exists', false)
    }
//  Activate the new one
    this.currentWeapon++
    if (this.currentWeapon === this.weapons.length) {
      this.currentWeapon = 0
    }
    this.weapons[this.currentWeapon].visible = true
  },
  killSprite: function (sprite, other) {
    sprite.kill()
  }
}
// ==============================================================================
// Enemy classes
// ==============================================================================
// Enemy Walkers
var EnemyWalker = function (game, x, y) {
  x *= 16
  y *= 16
  this.health = 100
  this.scoreValue = this.health * 100
  Phaser.Sprite.call(this, game, x, y, 'walker')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.enableBody = true
  this.body.gravity.y = 1000
  this.body.setSize(112, 170, 40, 56)
  this.anchor.set(0.5, 1)
  this.animations.add('walk-left', [0, 1, 2, 3, 4, 5, 6, 7], 8, true)
  this.animations.add('walk-right', [15, 14, 13, 12, 11, 10, 9, 8], 8, true)
  this.animations.add('shoot-left', [16, 17, 18], 1, true)
  this.animations.add('shoot-right', [21, 20, 19], 1, true)
  this.sfxWalkerVoice = game.add.audio('sfx-walker-voice')
  this.playedSFXWalkerVoice = false
  this.body.bounce.y = 0
  this.body.bounce.x = 1
  this.body.collideWorldBounds = true
  this.body.velocity.x = 60
}
EnemyWalker.prototype = Object.create(Phaser.Sprite.prototype)
EnemyWalker.prototype.constructor = EnemyWalker
EnemyWalker.prototype.update = function () {
  if (Math.abs(player.body.position.x - this.body.position.x) < 350 && Math.abs(player.body.position.y - this.body.position.y) < 350) {
    if (!this.playedSFXWalkerVoice) {
      if (playSound) { this.sfxWalkerVoice.play() }
      this.playedSFXWalkerVoice = true
    }
  }
  if (this.body.velocity.x < 60 && this.body.velocity.x > 0) {
    this.body.velocity.x = -60
  } else if (this.body.velocity.x < 0 && this.body.velocity.x > -60) {
    this.body.velocity.x = 60
  }
  if (this.body.velocity.x < 0) {
    this.animations.play('walk-left')
  } else if (this.body.velocity.x > 0) {
    this.animations.play('walk-right')
  }
  if (this.health <= 0) {
    this.destroy()
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// Enemy Nanobots
var EnemyNanobot = function (game, x, y) {
  x *= 16
  y *= 16
  this.health = 3
  this.scoreValue = this.health * 100
  this.nanobotJumpTimer = 0
  Phaser.Sprite.call(this, game, x, y, 'nanobot')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.enableBody = true
  this.body.gravity.y = 1000
  this.body.setSize(14, 18, 9, 14)
  this.anchor.set(0.5, 1)
  this.animations.add('walk-left', [17, 16, 15, 14, 13, 12], 30, true)
  this.animations.add('walk-right', [18, 19, 20, 21, 22, 23], 30, true)
  this.sfxNanobotJump = game.add.audio('sfx-nanobot-jump')
  this.body.bounce.y = 0.5
  this.body.bounce.x = 1
  this.body.collideWorldBounds = true
  this.body.velocity.x = 120
}
EnemyNanobot.prototype = Object.create(Phaser.Sprite.prototype)
EnemyNanobot.prototype.constructor = EnemyNanobot
EnemyNanobot.prototype.update = function () {
  if (this.body.velocity.x < 100 && this.body.velocity.x > 0) {
    this.body.velocity.x = -100
  } else if (this.body.velocity.x < 0 && this.body.velocity.x > -100) {
    this.body.velocity.x = 100
  }
  if (this.body.velocity.x < 0) {
    this.animations.play('walk-left')
  } else if (this.body.velocity.x > 0) {
    this.animations.play('walk-right')
  }
  this.nanobotJumpTimer += 1
  if (Math.abs(player.body.position.x - this.body.position.x) < 100 && Math.abs(player.body.position.y - this.body.position.y) < 100 && this.nanobotJumpTimer >= 100) {
    if (playSound) {
      this.sfxNanobotJump.play()
    }
    this.body.velocity.y = -350
    this.nanobotJumpTimer = 0
  }
  if (this.health <= 0) {
    this.destroy()
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// Enemy Spiderbot
var EnemySpiderbot = function (game, x, y) {
  x *= 16
  y *= 16
  this.health = 5
  this.scoreValue = this.health * 100
  Phaser.Sprite.call(this, game, x, y, 'spiderbot')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.anchor.set(0.5, 0.5)
  this.enableBody = true
  this.animations.add('attack', [0, 1, 2, 3], 4, true)
  this.animations.add('walk', [4, 5, 6, 7, 8, 9], 24, true)
  this.sfxSpiderbot = game.add.audio('sfx-spiderbot')
  this.body.setSize(32, 32, 16, 16)
  this.body.collideWorldBounds = true
  this.body.allowGravity = false
}
EnemySpiderbot.prototype = Object.create(Phaser.Sprite.prototype)
EnemySpiderbot.prototype.constructor = EnemySpiderbot
EnemySpiderbot.prototype.update = function () {
  if (Math.abs(player.body.position.x - this.body.position.x) < 250 && Math.abs(player.body.position.y - this.body.position.y) < 250) {
    this.rotation = game.physics.arcade.angleToXY(this, player.body.position.x, player.body.position.y)
    if (playSound) {
      this.sfxSpiderbot.play()
    }
    game.physics.arcade.moveToXY(this, player.body.position.x, player.body.position.y, 100)
    this.animations.play('walk')
  } else {
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    this.frame = 0
  }
  if (this.health <= 0) {
    this.destroy()
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// Enemy Turrets
var EnemyTurret = function (game, x, y) {
  x *= 16
  y *= 16
  this.health = 3
  this.scoreValue = this.health * 100
  this.isOn = true
  this.fireRate = 2000
  this.NextFire = 0
  Phaser.Sprite.call(this, game, x, y, 'turret')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.anchor.set(0.5, 0.5)
  this.enableBody = true
  this.animations.add('pulsate', [0, 1, 2, 3], 2, true)
  this.body.setSize(32, 32, 15, 7)
  this.body.immovable = true
  this.body.collideWorldBounds = true
  this.body.allowGravity = false
}
EnemyTurret.prototype = Object.create(Phaser.Sprite.prototype)
EnemyTurret.prototype.constructor = EnemyNanobot
EnemyTurret.prototype.update = function () {
  if (Math.abs(player.body.position.x - this.body.position.x) < 150) {
    this.rotation = game.physics.arcade.angleToXY(this, player.body.position.x, player.body.position.y)
    if (this.isOn) {
      this.frame = 4
    }
  } else {
    this.animations.play('pulsate')
  }
  if (this.health <= 0) {
    this.destroy()
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// Enemy Spiderbot
var EnemyMutantShocker = function (game, x, y) {
  x *= 16
  y *= 16
  this.health = 100
  this.scoreValue = this.health * 100
  Phaser.Sprite.call(this, game, x, y, 'mutantshocker')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.anchor.set(0.5, 0.5)
  this.enableBody = true
  this.animations.add('chase', [0, 1, 2, 3, 4, 5, 6, 7], 11, true)
  this.animations.add('idle', [8, 9, 10, 11], 11, true)
  this.sfxMutantShockerVoice = game.add.audio('sfx-mutant-shocker-voice')
  this.sfxMutantShockerShock = game.add.audio('sfx-mutant-shocker-shock')
  this.playedSFXMutantShockerVoice = false
  this.body.setCircle(80, 48, 48)
  this.body.collideWorldBounds = true
  this.body.allowGravity = false
}
EnemyMutantShocker.prototype = Object.create(Phaser.Sprite.prototype)
EnemyMutantShocker.prototype.constructor = EnemyMutantShocker
EnemyMutantShocker.prototype.update = function () {
  if (Math.abs(player.body.position.x - this.body.position.x) < 350 && Math.abs(player.body.position.y - this.body.position.y) < 350) {
    this.rotation = game.physics.arcade.angleToXY(this, player.body.position.x, player.body.position.y)
    if (playSound) {
      if (!this.playedSFXMutantShocker) {
        this.sfxMutantShockerVoice.play()
        this.playedSFXMutantShocker = true
      } else {
        this.sfxMutantShockerShock.play()
      }
    }
    game.physics.arcade.moveToXY(this, player.body.position.x, player.body.position.y, 100)
    this.animations.play('chase')
  } else {
    this.animations.play('idle')
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    this.frame = 0
  }
  if (this.health <= 0) {
    this.destroy()
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// ==============================================================================
// Item classes
// ==============================================================================
// Item Money
var ItemMoney = function (game, x, y) {
  x *= 16
  y *= 16
  this.scoreValue = 50
  Phaser.Sprite.call(this, game, x, y, 'money-item')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.anchor.set(0.5, 0.5)
  this.enableBody = true
  this.body.setSize(16, 16, 8, 8)
  this.animations.add('hover', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true)
  this.sfxMoney = game.add.audio('sfx-money')
  this.body.immovable = true
  this.body.allowGravity = false
  this.animations.play('hover')
}
ItemMoney.prototype = Object.create(Phaser.Sprite.prototype)
ItemMoney.prototype.constructor = ItemMoney
ItemMoney.prototype.update = function () {
  var pickedUp = game.physics.arcade.overlap(player, this, null, null, this)
  if (pickedUp) {
    this.kill()
    this.destroy()
    if (playSound) {
      this.sfxMoney.play()
    }
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// Item Shield
var ItemShield = function (game, x, y) {
  x *= 16
  y *= 16
  this.scoreValue = 100
  Phaser.Sprite.call(this, game, x, y, 'shield-item')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.anchor.set(0.5, 0.5)
  this.enableBody = true
  this.body.setSize(16, 16, 0, 0)
  this.sfxPowerUp = game.add.audio('sfx-power-up')
  this.body.immovable = true
  this.body.allowGravity = false
}
ItemShield.prototype = Object.create(Phaser.Sprite.prototype)
ItemShield.prototype.constructor = ItemShield
ItemShield.prototype.update = function () {
  var pickedUp = game.physics.arcade.overlap(player, this, null, null, this)
  if (pickedUp) {
    this.kill()
    this.destroy()
    if (playSound) {
      this.sfxPowerUp.play()
    }
    score += this.scoreValue
    scoreText.text = 'Score: ' + score
  }
}
// ==============================================================================
// Object classes
// ==============================================================================
// Object Ladders
var ObjectLadder = function (game, x, y) {
  x *= 16
  y *= 16
  Phaser.Sprite.call(this, game, x, y, 'ladder-m')
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.anchor.set(0.5, 1)
  this.enableBody = true
  this.body.immovable = true
  this.body.allowGravity = false
}
ObjectLadder.prototype = Object.create(Phaser.Sprite.prototype)
ObjectLadder.prototype.constructor = ObjectLadder
ObjectLadder.prototype.update = function () {
  var ladderInRange = game.physics.arcade.overlap(player, this, null, null, this)
  if (ladderInRange && cursors.up.isDown) {
    player.isClimbing = true
  } else if (!ladderInRange) {
    player.isClimbing = false
  }
}
// Moving Platforms — thanks to Richard Davey from Phaser.io for this code!
var ObjectPlatform = function (game, x, y, key, group) {
  x *= 16
  y *= 16
  if (typeof group === 'undefined') {
    group = game.world
  }
  Phaser.Sprite.call(this, game, x, y, key)
  game.physics.enable(this, Phaser.Physics.ARCADE)
  this.enableBody = true
  this.body.setSize(150, 25, 0, 0)
  this.anchor.set(0.5, 0)
  this.body.customSeparateX = true
  this.body.customSeparateY = true
  this.body.allowGravity = false
  this.body.immovable = true
  this.playerLocked = false
  group.add(this)
}
ObjectPlatform.prototype = Object.create(Phaser.Sprite.prototype)
ObjectPlatform.prototype.constructor = ObjectPlatform
ObjectPlatform.prototype.addMotionPath = function (motionPath) {
  this.tweenX = game.add.tween(this.body)
  this.tweenY = game.add.tween(this.body)
//  motionPath is an array containing objects with this structure
//  [
//   { x: "+200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeIn" }
//  ]
  for (var i = 0; i < motionPath.length; i++) {
    this.tweenX.to({
      x: motionPath[i].x
    }, motionPath[i].xSpeed, motionPath[i].xEase)
    this.tweenY.to({
      y: motionPath[i].y
    }, motionPath[i].ySpeed, motionPath[i].yEase)
  }
  this.tweenX.loop()
  this.tweenY.loop()
}
ObjectPlatform.prototype.start = function () {
  this.tweenX.start()
  this.tweenY.start()
}
ObjectPlatform.prototype.stop = function () {
  this.tweenX.stop()
  this.tweenY.stop()
}
// ==============================================================================
// Weapon classes
// ==============================================================================
var Projectile = function (game, key) {
  Phaser.Sprite.call(this, game, 0, 0, key)
  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST
  this.anchor.set(0.5, 0.5)
  this.checkWorldBounds = true
  this.outOfBoundsKill = true
  this.exists = false
  this.tracking = false
  this.scaleSpeed = 0
}
Projectile.prototype = Object.create(Phaser.Sprite.prototype)
Projectile.prototype.constructor = Projectile
Projectile.prototype.fire = function (x, y, angle, speed, gx, gy) {
  gx = gx || 0
  gy = gy || 0
  this.reset(x, y)
  this.scale.set(1)
  this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity)
  this.angle = angle
  this.body.gravity.set(gx, gy)
}
Projectile.prototype.update = function () {
  if (this.tracking) {
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x)
  }
  if (this.scaleSpeed > 0) {
    this.scale.x += this.scaleSpeed
    this.scale.y += this.scaleSpeed
  }
}
var Weapon = {}
Weapon.fireAmmo = function (context, x, y, angle, speed, direction, gx, gy, resetFire) {
  gx = gx || 0
  gy = gy || 0
  var ammo = context.getFirstExists(false)
  if (ammo) {
    ammo.fire(x, y, angle, direction * speed, gx, gy)
    ammo.scale.setTo(direction, 1)
  }
  if (resetFire) {
    context.nextFire = context.game.time.time + context.fireRate
  }
}
Weapon.Pistol = function (game) {
  Phaser.Group.call(this, game, game.world, 'Pistol', false, true, Phaser.Physics.ARCADE)
  this.sfxPistol = game.add.audio('sfx-pistol')
  this.nextFire = 0
  this.projectileSpeed = 600
  this.fireRate = 500
  this.dir = 1
  for (var i = 0; i < 64; i++) {
    this.add(new Projectile(game, 'projectile1'), true)
  }
  return this
}
Weapon.Pistol.prototype = Object.create(Phaser.Group.prototype)
Weapon.Pistol.prototype.constructor = Weapon.Pistol
Weapon.Pistol.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire) {
    return
  }
  if (source.facing === 'left') {
    this.dir = -1
  } else {
    this.dir = 1
  }
  var x = source.x + (this.dir * source.width / 2)
  var y = source.y - (source.height / 2)
  Weapon.fireAmmo(this, x, y, 0, this.projectileSpeed, this.dir, 0, 0, true)
  if (playSound) {
    this.sfxPistol.play()
  }
}
Weapon.Rifle = function (game) {
  Phaser.Group.call(this, game, game.world, 'Rifle', false, true, Phaser.Physics.ARCADE)
  this.sfxRifle = game.add.audio('sfx-rifle')
  this.nextFire = 0
  this.projectileSpeed = 600
  this.fireRate = 40
  this.dir = 1
  for (var i = 0; i < 32; i++) {
    this.add(new Projectile(game, 'projectile2'), true)
  }
  return this
}
Weapon.Rifle.prototype = Object.create(Phaser.Group.prototype)
Weapon.Rifle.prototype.constructor = Weapon.Rifle
Weapon.Rifle.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire || player.rifleAmmo <= 0) {
    return
  }
  if (source.facing === 'left') {
    this.dir = -1
  } else {
    this.dir = 1
  }
  var x = source.x + (this.dir * source.width / 2)
  var y = source.y - (source.height / 2) + this.game.rnd.between(-7, 7)
  Weapon.fireAmmo(this, x, y, 0, this.projectileSpeed, this.dir, 0, 0, true)
  player.rifleAmmo -= 1
  rifleAmmoText.text = 'Rifle: ' + player.rifleAmmo
  if (playSound) {
    this.sfxRifle.play()
  }
}
Weapon.Laser = function (game) {
  Phaser.Group.call(this, game, game.world, 'Laser', false, true, Phaser.Physics.ARCADE)
  this.sfxLaser = game.add.audio('sfx-laser')
  this.nextFire = 0
  this.projectileSpeed = 1000
  this.fireRate = 45
  this.dir = 1
  for (var i = 0; i < 64; i++) {
    this.add(new Projectile(game, 'projectile3'), true)
  }
  return this
}
Weapon.Laser.prototype = Object.create(Phaser.Group.prototype)
Weapon.Laser.prototype.constructor = Weapon.Laser
Weapon.Laser.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire || player.laserAmmo <= 0) {
    return
  }
  if (source.facing === 'left') {
    this.dir = -1
  } else {
    this.dir = 1
  }
  var x = source.x + (this.dir * source.width / 2)
  var y = source.y - (source.height / 2)
  Weapon.fireAmmo(this, x, y, 0, this.projectileSpeed, this.dir, 0, 0, true)
  player.laserAmmo -= 1
  laserAmmoText.text = 'Laser: ' + player.laserAmmo
  if (playSound) {
    this.sfxLaser.play()
  }
}
Weapon.Flamethrower = function (game) {
  Phaser.Group.call(this, game, game.world, 'Flamethrower', false, true, Phaser.Physics.ARCADE)
  this.sfxFlamethrower = game.add.audio('sfx-flamethrower')
  this.nextFire = 0
  this.projectileSpeed = 500
  this.fireRate = 40
  this.dir = 1
  this.Flamethrower = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200)
  this.Flamethrower = this.Flamethrower.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200))
  this.flamethrowerIndex = 0
  for (var i = 0; i < 64; i++) {
    this.add(new Projectile(game, 'projectile4'), true)
  }
  return this
}
Weapon.Flamethrower.prototype = Object.create(Phaser.Group.prototype)
Weapon.Flamethrower.prototype.constructor = Weapon.Flamethrower
Weapon.Flamethrower.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire || player.flamethrowerAmmo <= 0) {
    return
  }
  if (source.facing === 'left') {
    this.dir = -1
  } else {
    this.dir = 1
  }
  var x = source.x + (this.dir * source.width / 2)
  var y = source.y - (source.height / 2)
  var index = this.Flamethrower[this.flamethrowerIndex]
  Weapon.fireAmmo(this, x, y, 0, this.projectileSpeed, this.dir, 0, index, true)
  player.flamethrowerAmmo -= 1
  flameThrowerAmmoText.text = 'Flamethrower: ' + player.flamethrowerAmmo
  this.flamethrowerIndex++
  if (this.flamethrowerIndex === this.Flamethrower.length) {
    this.flamethrowerIndex = 0
  }
  if (playSound) {
    this.sfxFlamethrower.play()
  }
}
Weapon.Rockets = function (game) {
  Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE)
  this.sfxRocket = game.add.audio('sfx-rocket')
  this.nextFire = 0
  this.projectileSpeed = 300
  this.fireRate = 800
  this.dir = 1
  for (var i = 0; i < 32; i++) {
    this.add(new Projectile(game, 'projectile5'), true)
  }
  this.setAll('tracking', true)
  return this
}
Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype)
Weapon.Rockets.prototype.constructor = Weapon.Rockets
Weapon.Rockets.prototype.fire = function (source) {
  if (this.game.time.time < this.nextFire || player.rocketAmmo <= 0) {
    return
  }
  if (source.facing === 'left') {
    this.dir = -1
  } else {
    this.dir = 1
  }
  var x = source.x + (this.dir * source.width / 2)
  var y = source.y - (source.height / 2)
// Tween doesn't require this.dir scale flip, simply set to 1
  Weapon.fireAmmo(this, x, y, 0, this.dir * this.projectileSpeed, 1, 0, -800, true)
  player.rocketAmmo -= 1
  rocketAmmoText.text = 'Rockets: ' + player.rocketAmmo
  if (playSound) {
    this.sfxRocket.play()
  }
}
// ==============================================================================
// Powerup classes
// ==============================================================================
// Powerup Shield
var PowerupShield = function (game) {
  Phaser.Sprite.call(this, game, player.body.position.x + (player.body.width / 2), player.body.position.y + (player.body.height / 2), 'shield-powerup')
  this.anchor.setTo(0.5, 0.5)
  this.animations.add('waves', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5, true)
  this.sfxPowerDown = game.add.audio('sfx-power-down')
  player.shieldTimer = 0
  healthText.addColor('rgb(0, 255, 200)', 0)
  this.animations.play('waves')
}
PowerupShield.prototype = Object.create(Phaser.Sprite.prototype)
PowerupShield.prototype.constructor = PowerupShield
PowerupShield.prototype.update = function () {
  var temp = 99 - Math.floor(100 * player.shieldTimer / 350)
  healthText.text = temp.toString() + '%'
  this.position.x = player.body.position.x + (player.body.width / 2)
  this.position.y = player.body.position.y + (player.body.height / 2)
  if (player.shieldTimer >= 350) {
    if (playSound) {
      this.sfxPowerDown.play()
    }
    this.kill()
    this.destroy()
    healthText.text = 'Health: ' + player.health
    healthText.addColor('rgb(165, 187, 255)', 0)
  }
}
