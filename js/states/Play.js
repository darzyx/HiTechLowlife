/*
 * Play.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */
var player;
var cursors;
var scoreText;
var score = 0;
//==============================================================================
// Core Play class
//==============================================================================
var Play = function(game) {
    this.bg;
    this.map;
    this.backgroundLayer;
    this.collisionLayer;
    this.decorationLayer;
    this.ladders;
    this.platforms;
    this.locked;
    this.lockedTo;
    this.wasLocked;
    this.willJump;
    this.items;
    this.enemies;
    this.weapons;
    this.currentWeapon;
};
Play.prototype = {
    init: function() {
        if (music.name !== "advanced-simulacra" && playMusic) {
            music.stop();
            music = game.add.audio("advanced-simulacra");
            music.loop = true;
            music.play();
        }
        score = 0;
        this.bg = null;
        this.map = null;
        this.backgroundLayer = null;
        this.collisionLayer = null;
        this.decorationLayer = null;
        this.ladders = null;
        this.platforms = null;
        this.locked = false;
        this.lockedTo = null;
        this.wasLocked = false;
        this.willJump = false;
        this.items = null;
        this.enemies = null;
        this.weapons = [];
        this.currentWeapon = 0;
        game.time.reset();
    },
    create: function() {
        // Order determines relative z-position (back to front)
        this.createMap();
        this.createItemsAndObjects();
        this.createWeapons();
        this.createEnemies();
        this.createPlayer();
        this.createHUD();
    },
    createMap: function() {
        this.bg = game.add.sprite(0, 0, "menu-bg");
        this.bg.fixedToCamera = true;
        this.map = game.add.tilemap("map-lvl-1");
        this.map.addTilesetImage("tileset1", "tileset1");
        // Layers
        this.backgroundLayer = this.map.createLayer("backgroundLayer");
        this.collisionLayer = this.map.createLayer("collisionLayer");
        this.decorationLayer = this.map.createLayer("decorationLayer");
        // Tell phaser which is the collision layer
        this.map.setCollisionBetween(0, 300, true, this.collisionLayer, true);
        // Resize world to level size:
        this.backgroundLayer.resizeWorld();
        // Level gravity strength
        game.physics.arcade.gravity.y = 0;
    },
    createItemsAndObjects: function() {
        // Game objects
        this.ladders = game.add.group();
        this.addObjectLadder(15, 23);
        this.platforms = this.add.physicsGroup();
        var platform1 = new MovingPlatform(game, 1350, 700, "platform", this.platforms);
        platform1.addMotionPath([{
            x: "+150",
            xSpeed: 2000,
            xEase: "Linear",
            y: "-150",
            ySpeed: 2000,
            yEase: "Sine.easeIn"
        }, {
            x: "-150",
            xSpeed: 2000,
            xEase: "Linear",
            y: "-150",
            ySpeed: 2000,
            yEase: "Sine.easeOut"
        }, {
            x: "-150",
            xSpeed: 2000,
            xEase: "Linear",
            y: "+150",
            ySpeed: 2000,
            yEase: "Sine.easeIn"
        }, {
            x: "+150",
            xSpeed: 2000,
            xEase: "Linear",
            y: "+150",
            ySpeed: 2000,
            yEase: "Sine.easeOut"
        }]);
        this.platforms.callAll("start");
        // Game items
        this.items = game.add.group();
        this.addItemMoney(21, 12);
        this.addItemMoney(22, 12);
        this.addItemMoney(23, 12);
        this.addItemMoney(24, 12);
    },
    createWeapons: function() {
        this.weapons.push(new Weapon.Pistol(this.game));
        this.weapons.push(new Weapon.Rifle(this.game));
        this.weapons.push(new Weapon.Laser(this.game));
        this.weapons.push(new Weapon.Flamethrower(this.game));
        this.weapons.push(new Weapon.Rockets(this.game));
        this.currentWeapon = 0;
        for (var i = 1; i < this.weapons.length; i++) {
            this.weapons[i].visible = false;
        }
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(this.nextWeapon, this);
    },
    createEnemies: function() {
        this.enemies = game.add.physicsGroup();
        this.addEnemyWalker(5, 10);
        this.addEnemyWalker(15, 10);
        this.addEnemyNanobot(10, 5);
        this.addEnemySpiderbot(35, 7);
        this.addEnemyTurret(10, 5);
    },
    createPlayer: function() {
        player = game.add.sprite(64, 64, "zed");
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.setSize(48, 48, 0, 0);
        player.anchor.setTo(0.5, 1);
        player.body.collideWorldBounds = true;
        player.body.maxVelocity.y = 700;
        player.body.gravity.y = 1000;
        player.health = 3;
        player.healthGracePeriod = 100;
        player.isAttacked = false;
        player.walkSpeed = 250;
        player.jumpSpeed = 500;
        player.facing = "right";
        player.isStanding = true;
        player.isFiring = false;
        player.isClimbing = false;
        player.climbSpeed = 100;
        player.animations.add("walkLeft", [0, 1, 2, 3, 4, 5], 10, true);
        player.animations.add("walkRight", [6, 7, 8, 9, 10, 11], 10, true);
        player.animations.add("climb", [12, 13, 22, 23], 4, true);
        player.animations.add("idleLeft", [14, 15], 4, true);
        player.jumpDownLeft = 16;
        player.jumpUpLeft = 17;
        player.jumpUpRight = 18;
        player.jumpDownRight = 19;
        player.animations.add("idleRight", [20, 21], 4, true);
        player.crouchLeft = 24;
        player.shootCrouchLeft = 25;
        player.animations.add("shootIdleLeft", [26, 27], 4, true);
        player.shootJumpDownLeft = 28;
        player.shootJumpUpLeft = 29;
        player.shootJumpUpRight = 30;
        player.shootJumpDownRight = 31;
        player.animations.add("shootIdleRight", [32, 33], 4, true);
        player.shootCrouchRight = 34;
        player.crouchRight = 35;
        player.animations.add("shootWalkLeft", [36, 37, 38, 39, 40, 41], 10, true);
        player.animations.add("shootWalkRight", [42, 43, 44, 45, 46, 47], 10, true);
        cursors = game.input.keyboard.createCursorKeys();
        player.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
        player.rifleAmmo = 75;
        player.laserAmmo = 50;
        player.flamethrowerAmmo = 30;
        player.rocketAmmo = 8;
    },
    createHUD: function() {
        this.addMenuOption("Quit", gameWidth * 0.98, gameHeight * 0.05, function() {
            if (playSound) {
                sfxMenuForward.play();
            }
            game.world.setBounds(0, 0, gameWidth, gameHeight);
            this.game.state.start("GameOver");
        });
        scoreText = game.add.text(gameWidth * 0.5, gameHeight * 0.05, "Score: " + score, {
            font: "18px Coda",
            fill: "rgba(0,184,255,1)"
        });
        scoreText.anchor.setTo(0.5, 0.5);
        scoreText.fixedToCamera = true;
        healthText = game.add.text(gameWidth * 0.5, gameHeight * 0.10, "Health: " + player.health, {
            font: "18px Coda",
            fill: "rgba(0,184,255,1)"
        });
        healthText.anchor.setTo(0.5, 0.5);
        healthText.fixedToCamera = true;
        pistolAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.05, "Pistol: ∞", {
            font: "14px Coda",
            fill: "rgba(0,184,255,1)"
        });
        pistolAmmoText.anchor.setTo(0, 0.5);
        pistolAmmoText.fixedToCamera = true;
        rifleAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.10, "Rifle: " + player.rifleAmmo, {
            font: "14px Coda",
            fill: "rgba(0,184,255,1)"
        });
        rifleAmmoText.anchor.setTo(0, 0.5);
        rifleAmmoText.fixedToCamera = true;
        laserAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.15, "Laser: " + player.laserAmmo, {
            font: "14px Coda",
            fill: "rgba(0,184,255,1)"
        });
        laserAmmoText.anchor.setTo(0, 0.5);
        laserAmmoText.fixedToCamera = true;
        flameThrowerAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.20, "Flamethrower: " + player.flamethrowerAmmo, {
            font: "14px Coda",
            fill: "rgba(0,184,255,1)"
        });
        flameThrowerAmmoText.anchor.setTo(0, 0.5);
        flameThrowerAmmoText.fixedToCamera = true;
        rocketAmmoText = game.add.text(gameWidth * 0.02, gameHeight * 0.25, "Rockets: " + player.rocketAmmo, {
            font: "14px Coda",
            fill: "rgba(0,184,255,1)"
        });
        rocketAmmoText.anchor.setTo(0, 0.5);
        rocketAmmoText.fixedToCamera = true;
    },
    addMenuOption: function(text, x, y, callback) {
        var optionStyle = {
            font: "18px Coda",
            fill: "rgba(0,184,255,1)"
        };
        var txt = game.add.text(x, y, text, optionStyle);
        txt.anchor.setTo(1, 0.5);
        txt.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
        txt.fixedToCamera = true;
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
    addEnemyWalker: function(x, y) {
        var temp = new EnemyWalker(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    addEnemyNanobot: function(x, y) {
        var temp = new EnemyNanobot(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    addEnemySpiderbot: function(x, y) {
        var temp = new EnemySpiderbot(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    addEnemyTurret: function(x, y) {
        var temp = new EnemyTurret(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    addItemMoney: function(x, y) {
        var temp = new ItemMoney(game, x, y);
        game.add.existing(temp);
        this.items.add(temp);
    },
    addObjectLadder: function(x, y) {
        var temp = new ObjectLadder(game, x, y);
        game.add.existing(temp);
        this.ladders.add(temp);
    },
    update: function() {
        this.updatePlayer();
        this.updateEnemies();
        game.physics.arcade.collide(this.weapons[this.currentWeapon], this.collisionLayer, this.killSprite, null, this);

    },
    updatePlayer: function() {
        game.physics.arcade.collide(player, this.collisionLayer);
        this.physics.arcade.collide(player, this.platforms, this.customSep, null, this);
        player.body.velocity.x = 0;
        this.playerControls();


        if (player.healthGracePeriod <= 99) {
            player.healthGracePeriod += 1;
            return;
        } else {
            game.physics.arcade.overlap(player, this.enemies, this.hurtPlayer, null, this);
        }

    },
    updateEnemies: function() {
        game.physics.arcade.collide(this.enemies, this.collisionLayer);
        game.physics.arcade.collide(this.enemies, this.enemies);
        game.physics.arcade.overlap(this.enemies, this.weapons[this.currentWeapon], this.hurtEnemy, null, this);
    },
    playerControls: function() {
        player.isStanding = player.body.blocked.down || player.body.touching.down || this.locked;
        player.isFiring = this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
        if (player.isStanding) {
            if (cursors.up.isDown) {
                if (this.locked) {
                    this.cancelLock();
                }
                this.willJump = true;
                player.body.velocity.y = -1 * player.jumpSpeed;
                if (cursors.left.isDown || player.facing === "left") {
                    player.facing = "left";
                } else {
                    player.facing = "right";
                }
            } else {
                if (cursors.left.isDown) {
                    player.body.velocity.x = -1 * player.walkSpeed;
                    if (player.isFiring) {
                        player.animations.play("shootWalkLeft");
                    } else {
                        player.animations.play("walkLeft");
                    }
                    player.facing = "left";
                } else if (cursors.right.isDown) {
                    player.body.velocity.x = player.walkSpeed;
                    if (player.isFiring) {
                        player.animations.play("shootWalkRight");
                    } else {
                        player.animations.play("walkRight");
                    }
                    player.facing = "right";
                } else if (player.facing === "left") {
                    if (player.isFiring) {
                        player.animations.play("shootIdleLeft");
                    } else {
                        player.animations.play("idleLeft");
                    }
                } else {
                    if (player.isFiring) {
                        player.animations.play("shootIdleRight");
                    } else {
                        player.animations.play("idleRight");
                    }
                }
            }
        } else {
            if (player.body.velocity.y > 0) {
                if (cursors.left.isDown || player.facing == "left") {
                    if (player.isFiring) {
                        player.frame = player.shootJumpUpLeft;
                    } else {
                        player.frame = player.jumpUpLeft;
                    }
                } else {
                    if (player.isFiring) {
                        player.frame = player.shootJumpUpRight;
                    } else {
                        player.frame = player.jumpUpRight;
                    }
                }
            } else {
                if (cursors.left.isDown || player.facing == "left") {
                    if (player.isFiring) {
                        player.frame = player.shootJumpDownLeft;
                    } else {
                        player.frame = player.jumpDownLeft;
                    }
                } else {
                    if (player.isFiring) {
                        player.frame = player.shootJumpDownRight;
                    } else {
                        player.frame = player.jumpDownRight;
                    }
                }
            }
            if (cursors.left.isDown) {
                player.body.velocity.x = -1 * player.walkSpeed;
                player.facing = "left";
            } else if (cursors.right.isDown) {
                player.body.velocity.x = player.walkSpeed;
                player.facing = "right";
            }
        }
        if (player.isFiring) {
            this.weapons[this.currentWeapon].fire(player);
        }
        if (this.locked) {
            this.checkLock();
        }
    },
    hurtPlayer: function() {
        player.health -= 1;
        player.healthGracePeriod = 0;
        healthText.text = "Health: " + player.health;
        if (player.health >= 0) {
            return;
        }
        player.kill();
        setTimeout(function() {
            game.world.setBounds(0, 0, gameWidth, gameHeight);
            game.state.start("GameOver");
        }, 2000);
    },
    hurtEnemy: function(enemy, weapon) {
        enemy.health--;
        weapon.kill();
    },
    debugGame: function() {
        game.debug.body(player);
        this.enemies.forEachAlive(this.renderGroup, this);
        this.ladders.forEachAlive(this.renderGroup, this);
        this.platforms.forEachAlive(this.renderGroup, this);
        this.items.forEachAlive(this.renderGroup, this);
        this.collisionLayer.debug = true;
    },
    render: function() {
        // Uncomment to enter debug mode
        // this.debugGame();
    },
    preRender: function() {
        if (game.paused) {
            //  Because preRender still runs even if the game pauses!
            return;
        }
        if (this.locked || this.wasLocked) {
            player.x += this.lockedTo.deltaX;
            player.y = this.lockedTo.y;
            if (player.body.velocity.x !== 0) {
                player.body.velocity.y = 0;
            }
        }
        if (this.willJump) {
            this.willJump = false;
            if (this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked) {
                //  If the platform is moving up we add its velocity to the players jump
                player.body.velocity.y = -500 + (this.lockedTo.deltaY * 10);
            } else {
                player.body.velocity.y = -500;
            }
        }
        if (this.wasLocked) {
            this.wasLocked = false;
            this.lockedTo.playerLocked = false;
            this.lockedTo = null;
        }
    },
    renderGroup: function(member) {
        game.debug.body(member);
    },
    customSep: function(player, platform) {
        if (!this.locked && player.body.velocity.y > 0) {
            this.locked = true;
            this.lockedTo = platform;
            platform.playerLocked = true;
            player.body.velocity.y = 0;
        }
    },
    checkLock: function() {
        player.body.velocity.y = 0;
        //  If player walks off sides of platform then no longer locked to it
        if (player.body.right < this.lockedTo.body.x || player.body.x > this.lockedTo.body.right) {
            this.cancelLock();
        }
    },
    cancelLock: function() {
        this.wasLocked = true;
        this.locked = false;
    },
    nextWeapon: function() {
        //  Tidy-up the current weapon
        if (this.currentWeapon > 9) {
            this.weapons[this.currentWeapon].reset();
        } else {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll("reset", null, 0, 0);
            this.weapons[this.currentWeapon].setAll("exists", false);
        }
        //  Activate the new one
        this.currentWeapon++;
        if (this.currentWeapon === this.weapons.length) {
            this.currentWeapon = 0;
        }
        this.weapons[this.currentWeapon].visible = true;
    },
    killSprite: function(sprite, other) {
        sprite.kill();
    }
};
//==============================================================================
// Enemy classes
//==============================================================================
// Enemy Walkers
EnemyWalker = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.health = 25;
    this.scoreValue = 2500;
    Phaser.Sprite.call(this, game, x, y, "walker");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.gravity.y = 1000;
    this.body.setSize(140, 180, 26, 46);
    this.anchor.set(0.5, 1);
    this.animations.add("walk-left", [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    this.animations.add("walk-right", [15, 14, 13, 12, 11, 10, 9, 8], 8, true);
    this.animations.add("shoot-left", [16, 17, 18], 1, true);
    this.animations.add("shoot-right", [21, 20, 19], 1, true);
    this.body.bounce.y = 0;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 60;
};
EnemyWalker.prototype = Object.create(Phaser.Sprite.prototype);
EnemyWalker.prototype.constructor = EnemyWalker;
EnemyWalker.prototype.update = function() {
    if (this.body.velocity.x < 60 && this.body.velocity.x > 0) {
        this.body.velocity.x = -60;
    } else if (this.body.velocity.x < 0 && this.body.velocity.x > -60) {
        this.body.velocity.x = 60;
    }
    if (this.body.velocity.x < 0) {
        this.animations.play("walk-left");
    } else if (this.body.velocity.x > 0) {
        this.animations.play("walk-right");
    }
    if (this.health <= 0) {
        this.destroy();
        score += this.scoreValue;
        scoreText.text = "Score: " + score;
    }
};
// Enemy Nanobots
EnemyNanobot = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.health = 3;
    this.scoreValue = 300;
    this.nanobotJumpTimer = 0;
    Phaser.Sprite.call(this, game, x, y, "nanobot");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.gravity.y = 1000;
    this.body.setSize(20, 20, 6, 12);
    this.anchor.set(0.5, 1);
    this.animations.add("walk-left", [17, 16, 15, 14, 13, 12], 30, true);
    this.animations.add("walk-right", [18, 19, 20, 21, 22, 23], 30, true);
    this.sfxNanobotJump = game.add.audio("sfx-nanobot-jump");
    this.body.bounce.y = 0.5;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 120;
};
EnemyNanobot.prototype = Object.create(Phaser.Sprite.prototype);
EnemyNanobot.prototype.constructor = EnemyNanobot;
EnemyNanobot.prototype.update = function() {
    if (this.body.velocity.x < 100 && this.body.velocity.x > 0) {
        this.body.velocity.x = -100;
    } else if (this.body.velocity.x < 0 && this.body.velocity.x > -100) {
        this.body.velocity.x = 100;
    }
    if (this.body.velocity.x < 0) {
        this.animations.play("walk-left");
    } else if (this.body.velocity.x > 0) {
        this.animations.play("walk-right");
    }
    this.nanobotJumpTimer += 1;
    if (Math.abs(player.body.position.x - this.body.position.x) < 100 && Math.abs(player.body.position.y - this.body.position.y) < 100 && this.nanobotJumpTimer >= 100) {
        if (playSound) {
            this.sfxNanobotJump.play();
        }
        this.body.velocity.y = -350;
        this.nanobotJumpTimer = 0;
    }
    if (this.health <= 0) {
        this.destroy();
        score += this.scoreValue;
        scoreText.text = "Score: " + score;
    }
};
// Enemy Spiderbot
EnemySpiderbot = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.health = 5;
    this.scoreValue = 500;
    Phaser.Sprite.call(this, game, x, y, "spiderbot");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5, 0.5);
    this.enableBody = true;
    this.animations.add("attack", [0, 1, 2, 3], 4, true);
    this.animations.add("walk", [4, 5, 6, 7, 8, 9], 24, true);
    this.sfxSpiderbot = game.add.audio("sfx-spiderbot");
    this.body.setSize(32, 32, 16, 16);
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
};
EnemySpiderbot.prototype = Object.create(Phaser.Sprite.prototype);
EnemySpiderbot.prototype.constructor = EnemySpiderbot;
EnemySpiderbot.prototype.update = function() {
    this.chaseTimer -= 1;
    if (Math.abs(player.body.position.x - this.body.position.x) < 250 && Math.abs(player.body.position.y - this.body.position.y) < 250) {
        this.rotation = game.physics.arcade.angleToXY(this, player.body.position.x, player.body.position.y);
        if (playSound) {
            this.sfxSpiderbot.play();
        }
        game.physics.arcade.moveToXY(this, player.body.position.x, player.body.position.y, 100);
        this.animations.play("walk");
        this.chaseTimer = 50;
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.frame = 0;
    }
    if (this.health <= 0) {
        this.destroy();
        score += this.scoreValue;
        scoreText.text = "Score: " + score;
    }
};
// Enemy Turrets
EnemyTurret = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.health = 3;
    this.scoreValue = 300;
    this.isOn = true;
    this.fireRate = 2000;
    this.NextFire = 0;
    Phaser.Sprite.call(this, game, x, y, "turret");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5, 0.5);
    this.enableBody = true;
    this.animations.add("pulsate", [0, 1, 2, 3], 2, true);
    this.body.setSize(32, 32, 15, 7);
    this.body.immovable = true;
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
};
EnemyTurret.prototype = Object.create(Phaser.Sprite.prototype);
EnemyTurret.prototype.constructor = EnemyNanobot;
EnemyTurret.prototype.update = function() {
    if (Math.abs(player.body.position.x - this.body.position.x) < 150) {
        this.rotation = game.physics.arcade.angleToXY(this, player.body.position.x, player.body.position.y);
        if (this.isOn) {
            this.frame = 4;
        }
    } else {
        this.animations.play("pulsate");
    }
    if (this.health <= 0) {
        this.destroy();
        score += this.scoreValue;
        scoreText.text = "Score: " + score;
    }
};
//==============================================================================
// Item classes
//==============================================================================
// Item Money
ItemMoney = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.scoreValue = 150;
    Phaser.Sprite.call(this, game, x, y, "money");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.setSize(16, 16, 8, 8);
    this.animations.add("hover", [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
    this.sfxMoney = game.add.audio("sfx-money");
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.animations.play("hover");
};
ItemMoney.prototype = Object.create(Phaser.Sprite.prototype);
ItemMoney.prototype.constructor = ItemMoney;
ItemMoney.prototype.update = function() {
    var pickedUp = game.physics.arcade.overlap(player, this, null, null, this);
    if (pickedUp) {
        this.kill();
        if (playSound) {
            this.sfxMoney.play();
        }
        score += this.scoreValue;
        scoreText.text = "Score: " + score;
    }
};
//==============================================================================
// Object classes
//==============================================================================
// Object Ladders
ObjectLadder = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.climbMode = false;
    Phaser.Sprite.call(this, game, x, y, "ladder-m");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5, 1);
    this.enableBody = true;
    this.body.setSize(32, 320, 0, 0);
    this.body.immovable = true;
    this.body.allowGravity = false;
};
ObjectLadder.prototype = Object.create(Phaser.Sprite.prototype);
ObjectLadder.prototype.constructor = ObjectLadder;
ObjectLadder.prototype.update = function() {
    var ladderInRange = game.physics.arcade.overlap(player, this, null, null, this);
    if (ladderInRange && cursors.up.isDown) {
        this.climbMode = true;
    } else if (!ladderInRange) {
        this.climbMode = false;
    }
    if (this.climbMode) {
        player.body.velocity.y = 0;
        player.body.allowGravity = false;
        if (cursors.up.isDown) {
            player.body.velocity.y = -100;
        } else if (cursors.down.isDown) {
            player.body.velocity.y = 100;
        }
        if (cursors.left.isDown) {
            player.body.velocity.x = -100;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 100;
        }
    } else {
        player.body.allowGravity = true;
    }
};
// Moving Platforms — thanks to Richard Davey from Phaser.io for this code!
MovingPlatform = function(game, x, y, key, group) {
    if (typeof group === "undefined") {
        group = game.world;
    }
    Phaser.Sprite.call(this, game, x, y, key);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.setSize(150, 25, 0, 0);
    this.anchor.set(0.5, 0);
    this.body.customSeparateX = true;
    this.body.customSeparateY = true;
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.playerLocked = false;
    group.add(this);
};
MovingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;
MovingPlatform.prototype.addMotionPath = function(motionPath) {
    this.tweenX = game.add.tween(this.body);
    this.tweenY = game.add.tween(this.body);
    //  motionPath is an array containing objects with this structure
    //  [
    //   { x: "+200", xSpeed: 2000, xEase: "Linear", y: "-200", ySpeed: 2000, yEase: "Sine.easeIn" }
    //  ]
    for (var i = 0; i < motionPath.length; i++) {
        this.tweenX.to({
            x: motionPath[i].x
        }, motionPath[i].xSpeed, motionPath[i].xEase);
        this.tweenY.to({
            y: motionPath[i].y
        }, motionPath[i].ySpeed, motionPath[i].yEase);
    }
    this.tweenX.loop();
    this.tweenY.loop();
};
MovingPlatform.prototype.start = function() {
    this.tweenX.start();
    this.tweenY.start();
};
MovingPlatform.prototype.stop = function() {
    this.tweenX.stop();
    this.tweenY.stop();
};
//==============================================================================
// Weapon classes
//==============================================================================
var Bullet = function(game, key) {
    Phaser.Sprite.call(this, game, 0, 0, key);
    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.anchor.set(0.5, 0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.tracking = false;
    this.scaleSpeed = 0;
};
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;
Bullet.prototype.fire = function(x, y, angle, speed, gx, gy) {
    gx = gx || 0;
    gy = gy || 0;
    this.reset(x, y);
    this.scale.set(1);
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
    this.angle = angle;
    this.body.gravity.set(gx, gy);
};
Bullet.prototype.update = function() {

    if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }
    if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }
};
var Weapon = {};
Weapon.fireAmmo = function(context, x, y, angle, speed, gx, gy, resetFire) {
    gx = gx || 0;
    gy = gy || 0;
    var ammo = context.getFirstExists(false);
    if (ammo) {
        ammo.fire(x, y, angle, speed, gx, gy);
    }
    if (resetFire) {
        context.nextFire = context.game.time.time + context.fireRate;
    }
};
Weapon.Pistol = function(game) {
    Phaser.Group.call(this, game, game.world, "Pistol", false, true, Phaser.Physics.ARCADE);
    this.sfxPistol = game.add.audio("sfx-pistol");
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 500;
    this.dir = 1;
    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, "bullet1"), true);
    }
    return this;
};
Weapon.Pistol.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pistol.prototype.constructor = Weapon.Pistol;
Weapon.Pistol.prototype.fire = function(source) {
    if (this.game.time.time < this.nextFire) {
        return;
    }
    if (source.facing == "left") {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    var x = source.x + (this.dir * source.width / 2);
    var y = source.y - (source.height / 2);
    Weapon.fireAmmo(this, x, y, 0, this.dir * this.bulletSpeed, 0, 0, true);
    if (playSound) {
        this.sfxPistol.play();
    }
};
Weapon.Rifle = function(game) {
    Phaser.Group.call(this, game, game.world, "Rifle", false, true, Phaser.Physics.ARCADE);
    this.sfxRifle = game.add.audio("sfx-rifle");
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;
    this.dir = 1;
    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, "bullet2"), true);
    }
    return this;
};
Weapon.Rifle.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rifle.prototype.constructor = Weapon.Rifle;
Weapon.Rifle.prototype.fire = function(source) {
    if (this.game.time.time < this.nextFire || player.rifleAmmo <= 0) {
        return;
    }

    if (source.facing == "left") {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    var x = source.x + (this.dir * source.width / 2);
    var y = source.y - (source.height / 2) + this.game.rnd.between(-7, 7);
    Weapon.fireAmmo(this, x, y, 0, this.dir * this.bulletSpeed, 0, 0, true);
    player.rifleAmmo -= 1;
    rifleAmmoText.text = "Rifle: " + player.rifleAmmo;
    if (playSound) {
        this.sfxRifle.play();
    }
};
Weapon.Laser = function(game) {
    Phaser.Group.call(this, game, game.world, "Laser", false, true, Phaser.Physics.ARCADE);
    this.sfxLaser = game.add.audio("sfx-laser");
    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 45;
    this.dir = 1;
    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, "bullet3"), true);
    }
    return this;
};
Weapon.Laser.prototype = Object.create(Phaser.Group.prototype);
Weapon.Laser.prototype.constructor = Weapon.Laser;
Weapon.Laser.prototype.fire = function(source) {
    if (this.game.time.time < this.nextFire || player.laserAmmo <= 0) {
        return;
    }
    if (source.facing == "left") {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    var x = source.x + (this.dir * source.width / 2);
    var y = source.y - (source.height / 2);
    Weapon.fireAmmo(this, x, y, 0, this.dir * this.bulletSpeed, 0, 0, true);
    player.laserAmmo -= 1;
    laserAmmoText.text = "Laser: " + player.laserAmmo;
    if (playSound) {
        this.sfxLaser.play();
    }
};
Weapon.Flamethrower = function(game) {
    Phaser.Group.call(this, game, game.world, "Flamethrower", false, true, Phaser.Physics.ARCADE);
    this.sfxFlamethrower = game.add.audio("sfx-flamethrower");
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;
    this.dir = 1;
    this.Flamethrower = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.Flamethrower = this.Flamethrower.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));
    this.flamethrowerIndex = 0;
    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, "bullet4"), true);
    }
    return this;
};
Weapon.Flamethrower.prototype = Object.create(Phaser.Group.prototype);
Weapon.Flamethrower.prototype.constructor = Weapon.Flamethrower;
Weapon.Flamethrower.prototype.fire = function(source) {
    if (this.game.time.time < this.nextFire || player.flamethrowerAmmo <= 0) {
        return;
    }
    if (source.facing == "left") {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    var x = source.x + (this.dir * source.width / 2);
    var y = source.y - (source.height / 2);
    var index = this.Flamethrower[this.flamethrowerIndex];
    Weapon.fireAmmo(this, x, y, 0, this.dir * this.bulletSpeed, 0, index, true);
    player.flamethrowerAmmo -= 1;
    flameThrowerAmmoText.text = "Flamethrower: " + player.flamethrowerAmmo;
    this.flamethrowerIndex++;
    if (this.flamethrowerIndex === this.Flamethrower.length) {
        this.flamethrowerIndex = 0;
    }
    if (playSound) {
        this.sfxFlamethrower.play();
    }
};
Weapon.Rockets = function(game) {
    Phaser.Group.call(this, game, game.world, "Rockets", false, true, Phaser.Physics.ARCADE);
    this.sfxRocket = game.add.audio("sfx-rocket");
    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 800;
    this.dir = 1;
    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, "bullet5"), true);
    }
    this.setAll("tracking", true);
    return this;
};
Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;
Weapon.Rockets.prototype.fire = function(source) {
    if (this.game.time.time < this.nextFire || player.rocketAmmo <= 0) {
        return;
    }
    if (source.facing == "left") {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    var x = source.x + (this.dir * source.width / 2);
    var y = source.y - (source.height / 2);
    Weapon.fireAmmo(this, x, y, 0, this.dir * this.bulletSpeed, 0, -700, true);
    Weapon.fireAmmo(this, x, y, 0, this.dir * this.bulletSpeed, 0, 700);
    player.rocketAmmo -= 2;
    rocketAmmoText.text = "Rockets: " + player.rocketAmmo;
    if (playSound) {
        this.sfxRocket.play();
    }
};
