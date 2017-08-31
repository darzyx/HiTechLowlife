/*
 * Play.js
 * HiTech Lowlife Demo Code
 * Copyright © 2017 Jose Dario Sanchez
 */

var player;
var cursors;
var scoreText;
var score = 0;

var Play = function(game) {
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
};
Play.prototype = {
    create: function() {
        // Order determines relative z-position (back to front)
        this.createMap();
        this.populate();
        this.createPlayer();
        this.createHUD();
    },
    createMap: function() {
        this.map = game.add.tilemap("map-lvl-1");
        this.map.addTilesetImage("tileset-lvl-1", "tileset-lvl-1");
        // Layers
        this.backgroundLayer = this.map.createLayer("backgroundLayer");
        this.collisionLayer = this.map.createLayer("collisionLayer");
        this.decorationLayer = this.map.createLayer("decorationLayer");
        // Tell phaser which is the collision layer
        this.map.setCollisionBetween(0, 300, true, this.collisionLayer, true);
        // Resize world to level size:
        this.backgroundLayer.resizeWorld();
        // Level gravity strength
        game.physics.arcade.gravity.y = 1000;
    },
    createPlayer: function() {
        player = game.add.sprite(64, 320, "zed");
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.setSize(36, 64, 8, 1);
        player.body.collideWorldBounds = true;
        player.body.maxVelocity.y = 700;
        player.animations.add("idle-left", [0, 1, 2], 2, true);
        player.animations.add("idle-right", [3, 4, 5], 2, true);
        player.animations.add("walk-left", [10, 11, 12, 13, 14, 15], 12, true);
        player.animations.add("walk-right", [16, 17, 18, 19, 20, 21], 12, true);
        player.animations.add("climb", [24, 25], 10, true);
        actions = {
            "jumpUpLeft": 6,
            "jumpDownLeft": 7,
            "jumpUpRight": 8,
            "jumpDownRight": 9
        };
        traits = {
            "walkSpeed": 250,
            "jumpSpeed": 500,
            "facing": "right",
            "isClimbing": false,
            "climbSpeed": 100
        };
        jumpTimer = 0;
        cursors = game.input.keyboard.createCursorKeys();
        shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    },
    createHUD: function() {
        var quitButton = game.add.text(gameWidth * 0.95, gameHeight * 0.05, "Quit", {
            fontSize: "18px",
            fill: "rgba(0, 184, 255, 1)"
        });
        quitButton.font = "Coda";
        quitButton.anchor.setTo(1, 0);
        quitButton.fixedToCamera = true;
        quitButton.useHandCursor = true;
        quitButton.inputEnabled = true;
        score = 0;
        scoreText = game.add.text(gameWidth * 0.05, gameHeight * 0.05, "Score: " + score, {
            fontSize: "18px",
            fill: "rgba(0, 184, 255, 1)"
        });
        scoreText.font = "Coda";
        scoreText.anchor.setTo(0, 0);
        scoreText.fixedToCamera = true;
        var healthText = game.add.text(gameWidth * 0.5, gameHeight * 0.05, "Health", {
            fontSize: "18px",
            fill: "rgba(0, 184, 255, 1)"
        });
        healthText.font = "Coda";
        healthText.anchor.setTo(0.5, 0);
        healthText.fixedToCamera = true;
        var inventoryText = game.add.text(gameWidth * 0.05, gameHeight * 0.95, "Inventory", {
            fontSize: "18px",
            fill: "rgba(0, 184, 255, 1)"
        });
        inventoryText.font = "Coda";
        inventoryText.anchor.setTo(0, 1);
        inventoryText.fixedToCamera = true;
        var powerUpText = game.add.text(gameWidth * 0.95, gameHeight * 0.95, "Power Ups", {
            fontSize: "18px",
            fill: "rgba(0, 184, 255, 1)"
        });
        powerUpText.font = "Coda";
        powerUpText.anchor.setTo(1, 1);
        powerUpText.fixedToCamera = true;
    },
    populate: function() {
        // Game objects
        this.ladders = game.add.group();
        this.createLadder(15, 23);
        this.platforms = this.add.physicsGroup();
        var platform1 = new MovingPlatform(this.game, 1350, 700, "platform", this.platforms);
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
        this.createCredit(21, 12);
        this.createCredit(22, 12);
        this.createCredit(23, 12);
        this.createCredit(24, 12);
        // Game enemies
        this.enemies = game.add.physicsGroup();
        this.createWalker(5, 20);
        this.createWalker(15, 20);
        this.createNanobot(10, 5);
        this.createDrone(35, 7);
        this.createTurret(10, 5);
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
        //  If the player has walked off either side of the platform then they're no longer locked to it
        if (player.body.right < this.lockedTo.body.x || player.body.x > this.lockedTo.body.right) {
            this.cancelLock();
        }
    },
    cancelLock: function() {
        this.wasLocked = true;
        this.locked = false;
    },
    createWalker: function(x, y) {
        var temp = new EnemyWalker(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    createNanobot: function(x, y) {
        var temp = new EnemyNanobot(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    createDrone: function(x, y) {
        var temp = new EnemyDrone(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    createTurret: function(x, y) {
        var temp = new EnemyTurret(game, x, y);
        game.add.existing(temp);
        this.enemies.add(temp);
    },
    createCredit: function(x, y) {
        var temp = new CreditItem(game, x, y);
        game.add.existing(temp);
        this.items.add(temp);
    },
    createLadder: function(x, y) {
        var temp = new ClimbingLadder(game, x, y);
        game.add.existing(temp);
        this.ladders.add(temp);
    },
    preRender: function() {
        if (this.game.paused) {
            //  Because preRender still runs even if your game pauses!
            return;
        }
        if (this.locked || this.wasLocked) {
            player.x += this.lockedTo.deltaX;
            player.y = this.lockedTo.y - 89;
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
            this.jumpTimer = this.time.time + 750;
        }
        if (this.wasLocked) {
            this.wasLocked = false;
            this.lockedTo.playerLocked = false;
            this.lockedTo = null;
        }
    },
    update: function() {
        this.updatePlayer();
        this.updateEnemies();
    },
    updatePlayer: function() {
        game.physics.arcade.collide(player, this.collisionLayer);
        this.physics.arcade.collide(player, this.platforms, this.customSep, null, this);
        player.body.velocity.x = 0;
        this.playerControls();
        game.physics.arcade.overlap(player, this.enemies, this.killPlayer, null, this);
    },
    updateEnemies: function() {
        game.physics.arcade.collide(this.enemies, this.collisionLayer);
        game.physics.arcade.collide(this.enemies, this.enemies);
    },
    playerControls: function() {
        var standing = player.body.blocked.down || player.body.touching.down || this.locked;
        if (standing) {
            if (cursors.up.isDown && game.time.now > jumpTimer) {
                if (this.locked) {
                    this.cancelLock();
                }
                this.willJump = true;
                player.body.velocity.y = -1 * traits.jumpSpeed;
                jumpTimer = game.time.now + 750;
                if (cursors.left.isDown || traits.facing === "left") {
                    traits.facing = "left";
                } else {
                    traits.facing = "right";
                }
            } else {
                if (cursors.left.isDown) {
                    player.body.velocity.x = -1 * traits.walkSpeed;
                    player.animations.play("walk-left");
                    traits.facing = "left";
                } else if (cursors.right.isDown) {
                    player.body.velocity.x = traits.walkSpeed;
                    player.animations.play("walk-right");
                    traits.facing = "right";
                } else if (traits.facing === "left") {
                    player.animations.play("idle-left");
                } else {
                    player.animations.play("idle-right");
                }
            }
        } else {
            if (player.body.velocity.y > 0) {
                if (cursors.left.isDown || traits.facing == "left") {
                    player.frame = actions.jumpUpLeft;
                } else {
                    player.frame = actions.jumpUpRight;
                }
            } else {
                if (cursors.left.isDown || traits.facing == "left") {
                    player.frame = actions.jumpDownLeft;
                } else {
                    player.frame = actions.jumpDownRight;
                }
            }
            if (cursors.left.isDown) {
                player.body.velocity.x = -1 * traits.walkSpeed;
                traits.facing = "left";
            } else if (cursors.right.isDown) {
                player.body.velocity.x = traits.walkSpeed;
                traits.facing = "right";
            }
        }
        if (this.locked) {
            this.checkLock();
        }
    },
    killPlayer: function() {
        player.kill();
        setTimeout(function() {
            game.world.setBounds(0, 0, gameWidth, gameHeight);
            game.state.start("GameOver");
        }, 2000);
    },
    debugGame: function() {
        game.debug.body(player);
        this.enemies.forEachAlive(this.renderGroup, this);
        this.ladders.forEachAlive(this.renderGroup, this);
        this.items.forEachAlive(this.renderGroup, this);
        this.collisionLayer.debug = true;
    },
    renderGroup: function(member) {
        game.debug.body(member);
    },
    render: function() {
        // Uncomment to enter game debug mode
        // this.debugGame();
    }
};

// Enemy Walkers
EnemyWalker = function(game, x, y) {
    x *= 32;
    y *= 32;
    Phaser.Sprite.call(this, game, x, y, "walker");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.setSize(140, 180, 26, 46);
    this.anchor.set(0, 1);
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
};

// Enemy Nanobots
EnemyNanobot = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.nanobotJumpTimer = 0;
    Phaser.Sprite.call(this, game, x, y, "nanobot");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.setSize(20, 20, 6, 12);
    this.anchor.set(0, 1);
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
    if (Math.abs(player.body.position.x - this.body.position.x) < 100 &&
    Math.abs(player.body.position.y - this.body.position.y) < 100 &&
    this.nanobotJumpTimer >= 100) {
        if (playSound) {
            this.sfxNanobotJump.play();
        }
        this.body.velocity.y = -350;
        this.nanobotJumpTimer = 0;
    }
};

// Enemy Drone
EnemyDrone = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.droneFlyTimer = 0;
    Phaser.Sprite.call(this, game, x, y, "drone");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5);
    this.enableBody = true;
    this.animations.add("glitter", [0, 1, 2, 3], 4, true);
    this.sfxDrone = game.add.audio("sfx-drone");
    this.body.setSize(32, 32, 10, 0);
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
    this.animations.play("glitter");
};
EnemyDrone.prototype = Object.create(Phaser.Sprite.prototype);
EnemyDrone.prototype.constructor = EnemyDrone;
EnemyDrone.prototype.update = function() {
    this.droneFlyTimer += 1;
    if (Math.abs(player.body.position.x - this.body.position.x) < 250 && Math.abs(player.body.position.y - this.body.position.y) < 250) {
        this.rotation = game.physics.arcade.angleToXY(this, player.body.position.x, player.body.position.y);
        if (this.droneFlyTimer >= 100) {
            if (playSound) {
                this.sfxDrone.play();
            }
            game.physics.arcade.moveToXY(this, player.body.position.x, player.body.position.y, 100);
            this.droneFlyTimer = 0;
        }
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
};

// Enemy Turrets
EnemyTurret = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.isOn = true;
    this.fireRate = 2000;
    this.NextFire = 0;
    Phaser.Sprite.call(this, game, x, y, "turret");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0.5, 0.5);
    this.enableBody = true;
    this.animations.add("pulsate", [0, 1, 2, 3], 2, true);
    this.body.setSize(32, 32, 16, 8);
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
};

// Credit Items
CreditItem = function(game, x, y) {
    x *= 32;
    y *= 32;
    scoreValue = 10;
    Phaser.Sprite.call(this, game, x, y, "credit");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.setSize(16, 16, 8, 8);
    this.animations.add("hover", [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
    this.sfxCredit = game.add.audio("sfx-credit");
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.animations.play("hover");
};
CreditItem.prototype = Object.create(Phaser.Sprite.prototype);
CreditItem.prototype.constructor = CreditItem;
CreditItem.prototype.update = function() {
    var pickedUp = game.physics.arcade.overlap(player, this, null, null, this);
    if (pickedUp) {
        this.kill();
        if (playSound) {
            this.sfxCredit.play();
        }
        score += scoreValue;
        scoreText.text = "Score: " + score;
    }
};

// Climbing Ladders
ClimbingLadder = function(game, x, y) {
    x *= 32;
    y *= 32;
    this.climbMode = false;
    Phaser.Sprite.call(this, game, x, y, "ladder-m");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.set(0, 1);
    this.enableBody = true;
    this.body.setSize(32, 320, 0, 0);
    this.body.immovable = true;
    this.body.allowGravity = false;
};
ClimbingLadder.prototype = Object.create(Phaser.Sprite.prototype);
ClimbingLadder.prototype.constructor = ClimbingLadder;
ClimbingLadder.prototype.update = function() {
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
    this.anchor.set(0, 1);
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
    this.tweenX = this.game.add.tween(this.body);
    this.tweenY = this.game.add.tween(this.body);
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
