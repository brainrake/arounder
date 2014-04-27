(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Boot;

  Boot = function(game) {};

  module.exports = Boot;

  Boot.prototype = {
    preload: function() {
      return this.load.image('menusharp', 'assets/img/menusharp.png');
    },
    create: function() {
      this.game.input.maxPointers = 1;
      if (this.game.device.desktop) {
        this.game.stage.scale.pageAlignHorizontally = true;
      } else {
        this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
        this.game.stage.scale.minWidth = 888;
        this.game.stage.scale.minHeight = 552;
        this.game.stage.scale.maxWidth = 888;
        this.game.stage.scale.maxHeight = 552;
        this.game.stage.scale.forceLandscape = true;
        this.game.stage.scale.pageAlignHorizontally = true;
        this.game.stage.scale.setScreenSize(true);
      }
      return this.game.state.start('Splash');
    }
  };

}).call(this);

},{}],2:[function(require,module,exports){
(function() {
  var DIRS, F_PENTOMINO, Game, MAP_CENTER_X, MAP_CENTER_Y, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, _angle, _dirs_to_tile, _dxdy, _reverse;

  Game = function(game) {
    '/*\nthis.game;      // a reference to the currently running game\nthis.add;       // used to add sprites, text, groups, etc\nthis.camera;    // a reference to the game camera\nthis.cache;     // the game cache\nthis.input;     // the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)\nthis.load;      // for preloading assets\nthis.math;      // lots of useful common math operations\nthis.sound;     // the sound manager - add a sound, play one, set-up markers, etc\nthis.stage;     // the game stage\nthis.time;      // the clock\nthis.tweens;    // the tween manager\nthis.world;     // the game world\nthis.particles; // the particle manager\nthis.physics;   // the physics manager\nthis.rnd;       // the repeatable random number generator\n*/';
    return true;
  };

  module.exports = Game;

  TILE_SIZE = 24;

  MAP_HEIGHT = 23;

  MAP_WIDTH = 37;

  MAP_CENTER_X = (MAP_WIDTH - 1) / 2;

  MAP_CENTER_Y = (MAP_HEIGHT - 1) / 2;

  DIRS = ['up', 'right', 'down', 'left'];

  _dirs_to_tile = function(dirs) {
    return {
      up: 0,
      right: 1,
      down: 2,
      left: 3,
      updown: 4,
      rightleft: 5,
      upright: 8,
      rightdown: 9,
      downleft: 10,
      upleft: 11,
      uprightleft: 12,
      uprightdown: 13,
      rightdownleft: 14,
      updownleft: 15,
      uprightdownleft: 16,
      '': 19
    }[dirs.join('')];
  };

  _dxdy = function(dir) {
    return {
      up: [0, -1],
      right: [1, 0],
      down: [0, 1],
      left: [-1, 0]
    }[dir];
  };

  _angle = function(dir) {
    return {
      up: 0,
      right: 90,
      down: 180,
      left: 270
    }[dir];
  };

  _reverse = function(dir) {
    return {
      up: 'down',
      right: 'left',
      down: 'up',
      left: 'right'
    }[dir];
  };

  F_PENTOMINO = [[18, 10], [19, 10], [17, 11], [18, 11], [18, 12]];

  (function() {
    function _Class() {}

    return _Class;

  })();

  Game.prototype = {
    create: function() {
      var tween, x, y, _i, _len, _ref, _ref1;
      this.s = {
        moving: false,
        player: {
          x: 18,
          y: 11
        },
        dest: {
          x: 18,
          y: 11
        },
        expanding: false,
        over: false
      };
      this["in"] = {
        cursors: this.input.keyboard.createCursorKeys(),
        space: this.input.keyboard.addKey('32')
      };
      this.bg_rot = this.add.image(580, 550, 'back');
      this.bg_rot.anchor.setTo(.5, .5);
      this.bg_rot.alpha = 0.8;
      tween = this.add.tween(this.bg_rot);
      tween.to({
        angle: 360
      }, 199999);
      tween.onComplete.add((function(_this) {
        return function() {
          _this.bg_rot.angle = 0;
          return tween.start();
        };
      })(this));
      tween.start();
      this.bg_rot2 = this.add.image(580, 550, 'back2clouds');
      this.bg_rot2.anchor.setTo(.5, .5);
      this.bg_rot2.alpha = 1;
      tween = this.add.tween(this.bg_rot2);
      tween.to({
        angle: 360
      }, 99999);
      tween.onComplete.add((function(_this) {
        return function() {
          _this.bg_rot2.angle = 0;
          return tween.start();
        };
      })(this));
      tween.start();
      this.bg_rot3 = this.add.image(580, 550, 'back2surface');
      this.bg_rot3.anchor.setTo(.5, .5);
      this.bg_rot3.alpha = 1;
      tween = this.add.tween(this.bg_rot3);
      tween.to({
        angle: -360
      }, 99999);
      tween.onComplete.add((function(_this) {
        return function() {
          _this.bg_rot3.angle = 0;
          return tween.start();
        };
      })(this));
      tween.start();
      this.tilemap = this.add.tilemap(null, TILE_SIZE, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT);
      this.baselayer = this.tilemap.createBlankLayer('layer1', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
      this.tilemap.addTilesetImage('tileset');
      for (_i = 0, _len = F_PENTOMINO.length; _i < _len; _i++) {
        _ref = F_PENTOMINO[_i], x = _ref[0], y = _ref[1];
        this.putTile(x, y);
      }
      this.growseeds = this.add.group();
      this.growseed_timer = this.game.time.create(false);
      this.growseed_timer.loop(2500, (function(_this) {
        return function() {
          return _this.expand();
        };
      })(this));
      this.growseed_timer.start();
      this.destroyseeds = this.add.group();
      this.destroyseed_timer = this.game.time.create(false);
      this.destroyseed_timer.loop(3200, (function(_this) {
        return function() {
          return _this.contract();
        };
      })(this));
      this.destroyseed_timer.start();
      _ref1 = this.s.player, x = _ref1.x, y = _ref1.y;
      this.player = this.add.image((x + .5) * TILE_SIZE, (y + .5) * TILE_SIZE, 'player');
      return this.player.anchor.setTo(.5, .5);
    },
    mk_growseed: function(x, y, dir) {
      var s;
      s = new Phaser.Sprite(this.game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'growseed');
      s.anchor.setTo(.5, 0.6);
      s.angle = _angle(dir);
      s.animations.add('play');
      s.animations.play('play', 10, true);
      return s;
    },
    mk_destroyseed: function(x, y, dir) {
      var s;
      s = new Phaser.Sprite(this.game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'destroyseed');
      s.anchor.setTo(.5, 0.6);
      s.angle = _angle(dir);
      s.animations.add('play');
      s.animations.play('play', 10, true);
      return s;
    },
    putTile: function(x, y) {
      var dir, dx, dy, _i, _len, _ref, _results;
      this.tilemap.putTile(0, x, y);
      this.updateTile(x, y);
      _results = [];
      for (_i = 0, _len = DIRS.length; _i < _len; _i++) {
        dir = DIRS[_i];
        _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
        _results.push(this.updateTile(x + dx, y + dy));
      }
      return _results;
    },
    clearTile: function(x, y) {
      var dir, dx, dy, _i, _len, _ref, _results;
      this.tilemap.putTile(null, x, y);
      _results = [];
      for (_i = 0, _len = DIRS.length; _i < _len; _i++) {
        dir = DIRS[_i];
        _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
        _results.push(this.updateTile(x + dx, y + dy));
      }
      return _results;
    },
    updateTile: function(x, y) {
      var dir, dirs, dx, dy, _i, _len, _ref;
      if (!this.tilemap.getTile(x, y)) {
        return;
      }
      dirs = [];
      for (_i = 0, _len = DIRS.length; _i < _len; _i++) {
        dir = DIRS[_i];
        _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
        if (this.tilemap.getTile(x + dx, y + dy)) {
          dirs[dirs.length] = dir;
        }
      }
      return this.tilemap.putTile(_dirs_to_tile(dirs), x, y);
    },
    move_player: function(dir) {
      var dx, dy, tween, _ref;
      tween = this.add.tween(this.player);
      _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
      tween.to({
        x: this.player.x + dx * TILE_SIZE,
        y: this.player.y + dy * TILE_SIZE
      }, 99);
      this.s.dest.x = this.s.player.x + dx;
      this.s.dest.y = this.s.player.y + dy;
      tween.onComplete.add((function(_this) {
        return function() {
          _this.s.moving = false;
          _this.s.player.x = _this.s.dest.x;
          return _this.s.player.y = _this.s.dest.y;
        };
      })(this));
      return tween.start();
    },
    expand: function() {
      var dir, dx, dy, gs, i, x, y, _i, _ref, _ref1, _results;
      _results = [];
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        _ref = [this.rnd.integerInRange(1, MAP_WIDTH - 2), this.rnd.integerInRange(1, MAP_HEIGHT - 2)], x = _ref[0], y = _ref[1];
        if ((this.tilemap.getTile(x, y)) && (this.tilemap.getTile(x, y)).index !== 16) {
          while (1) {
            dir = DIRS[this.rnd.integerInRange(0, 3)];
            _ref1 = _dxdy(dir), dx = _ref1[0], dy = _ref1[1];
            if (!this.tilemap.getTile(x + dx, y + dy)) {
              gs = this.growseeds.add(this.mk_growseed(x, y, dir));
              setTimeout(((function(_this) {
                return function() {
                  if ((_this.growseeds.getIndex(gs)) > -1) {
                    _this.growseeds.remove(gs);
                    return _this.putTile(x + dx, y + dy);
                  }
                };
              })(this)), 3000);
              break;
            }
          }
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    contract: function() {
      var dir, dx, dy, gs, i, x, y, _i, _ref, _ref1, _results;
      _results = [];
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        _ref = [this.rnd.integerInRange(1, MAP_WIDTH - 2), this.rnd.integerInRange(1, MAP_HEIGHT - 2)], x = _ref[0], y = _ref[1];
        if ((this.tilemap.getTile(x, y)) && (this.tilemap.getTile(x, y)).index !== 16) {
          while (1) {
            dir = DIRS[this.rnd.integerInRange(0, 3)];
            _ref1 = _dxdy(dir), dx = _ref1[0], dy = _ref1[1];
            if (!this.tilemap.getTile(x + dx, y + dy)) {
              gs = this.destroyseeds.add(this.mk_destroyseed(x, y, dir));
              setTimeout(((function(_this) {
                return function() {
                  if ((_this.destroyseeds.getIndex(gs)) > -1) {
                    _this.destroyseeds.remove(gs);
                    return _this.clearTile(x, y);
                  }
                };
              })(this)), 3000);
              break;
            }
          }
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    update: function() {
      var dir, dx, dy, _i, _len, _ref;
      if (!this.s.over) {
        if (this["in"].space.isDown && !this.moving) {
          this.growseeds.forEach((function(_this) {
            return function(s) {
              var t;
              if (s) {
                t = _this.tilemap.getTileWorldXY(s.x, s.y);
                if (t && t === _this.tilemap.getTile(_this.s.player.x, _this.s.player.y)) {
                  return _this.growseeds.remove(s);
                }
              }
            };
          })(this));
        }
        if (this["in"].space.isDown && !this.moving) {
          this.destroyseeds.forEach((function(_this) {
            return function(s) {
              var t;
              if (s) {
                t = _this.tilemap.getTileWorldXY(s.x, s.y);
                if (t && t === _this.tilemap.getTile(_this.s.player.x, _this.s.player.y)) {
                  return _this.destroyseeds.remove(s);
                }
              }
            };
          })(this));
        }
        for (_i = 0, _len = DIRS.length; _i < _len; _i++) {
          dir = DIRS[_i];
          if (this["in"].cursors[dir].isDown && !this.s.moving) {
            this.player.angle = _angle(dir);
            _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
            if (this.tilemap.getTile(this.s.player.x + dx, this.s.player.y + dy)) {
              this.s.moving = true;
              this.move_player(dir);
            }
          }
        }
        if (!this.tilemap.getTile(this.s.player.x, this.s.player.y)) {
          this.s.over = true;
          this.add.text(200, 200, 'game over', {
            color: '#ffffff'
          });
          return setTimeout(((function(_this) {
            return function() {
              return _this.quitGame();
            };
          })(this)), 2000);
        }
      }
    },
    quitGame: function(pointer) {
      return this.game.state.start('MainMenu');
    }
  };

}).call(this);

},{}],3:[function(require,module,exports){
(function() {
  var game;

  game = new Phaser.Game(888, 552, Phaser.AUTO, 'game-container');

  game.state.add('Boot', require('./boot'));

  game.state.add('Splash', require('./splash'));

  game.state.add('Preloader', require('./preloader'));

  game.state.add('MainMenu', require('./main-menu'));

  game.state.add('Game', require('./game'));

  game.state.start('Boot');

}).call(this);

},{"./boot":1,"./game":2,"./main-menu":4,"./preloader":5,"./splash":6}],4:[function(require,module,exports){
(function() {
  var MainMenu;

  MainMenu = function(game) {
    this.music = null;
    return this.playButton = null;
  };

  module.exports = MainMenu;

  MainMenu.prototype = {
    create: function() {
      this.bg = this.add.sprite(0, 0, 'menusharp');
      return setTimeout(((function(_this) {
        return function() {
          return _this.startGame();
        };
      })(this)), 500);
    },
    update: function() {},
    startGame: function(pointer) {
      return this.game.state.start('Game');
    }
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function() {
  var Preloader, __;

  __ = console.log.apply(console, arguments);

  arguments[0];

  Preloader = function(game) {
    this.background = null;
    this.preloadBar = null;
    return this.ready = false;
  };

  module.exports = Preloader;

  Preloader.prototype = {
    preload: function() {
      this.load.image('back', 'assets/img/back.png');
      this.load.image('back2surface', 'assets/img/back2surface.png');
      this.load.image('back2clouds', 'assets/img/back2clouds.png');
      this.load.image('backpixel', 'assets/img/backpixel.png');
      this.load.image('tileset', 'assets/img/tileset.png');
      this.load.image('player', 'assets/img/player.png');
      this.load.spritesheet('growseed', 'assets/img/growseed.png', 24, 48, 4, 0, 0);
      this.load.spritesheet('destroyseed', 'assets/img/destroyseed.png', 24, 48, 4, 0, 0);
      this.load.image('playButton', 'assets/img/button_sprite_sheet.png', 193, 71);
      return this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    },
    create: function() {},
    update: function() {
      if (true) {
        this.ready = true;
        return this.game.state.start('MainMenu');
      }
    }
  };

}).call(this);

},{}],6:[function(require,module,exports){
(function() {
  var Splash;

  Splash = function(game) {
    return this.logo = null;
  };

  module.exports = Splash;

  Splash.prototype = {
    create: function() {
      var logo, tween;
      this.game.state.start('Preloader');
      logo = this.logo = this.add.sprite(0, 0, 'menusharp');
      logo.alpha = 0;
      tween = this.add.tween(logo);
      tween.onComplete.add((function() {
        return this.game.state.start('Preloader');
      }), this);
      return tween.to({
        alpha: 1
      }, 200, Phaser.Easing.Linear.None).start();
    }
  };

}).call(this);

},{}]},{},[3])