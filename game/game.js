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
        this.game.stage.scale.minWidth = 900;
        this.game.stage.scale.minHeight = 570;
        this.game.stage.scale.maxWidth = 900;
        this.game.stage.scale.maxHeight = 570;
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
  var BORDER_BOTTOM, BORDER_LEFT, BORDER_RIGHT, BORDER_TOP, DIRS, F_PENTOMINO, Game, MAP_CENTER_X, MAP_CENTER_Y, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, __, _angle, _angle_to_dir, _dirs_to_tile, _dxdy, _reverse;

  __ = function() {
    console.log.apply(console, arguments);
    return arguments[0];
  };

  Game = function(game) {
    '/*\nthis.game;      // a reference to the currently running game\nthis.add;       // used to add sprites, text, groups, etc\nthis.camera;    // a reference to the game camera\nthis.cache;     // the game cache\nthis.input;     // the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)\nthis.load;      // for preloading assets\nthis.math;      // lots of useful common math operations\nthis.sound;     // the sound manager - add a sound, play one, set-up markers, etc\nthis.stage;     // the game stage\nthis.time;      // the clock\nthis.tweens;    // the tween manager\nthis.world;     // the game world\nthis.particles; // the particle manager\nthis.physics;   // the physics manager\nthis.rnd;       // the repeatable random number generator\n*/';
    return true;
  };

  module.exports = Game;

  TILE_SIZE = 30;

  MAP_HEIGHT = 21;

  MAP_WIDTH = 30;

  MAP_CENTER_X = (MAP_WIDTH - 2) / 2;

  MAP_CENTER_Y = (MAP_HEIGHT - 3) / 2;

  BORDER_TOP = 5;

  BORDER_RIGHT = 20;

  BORDER_BOTTOM = 20;

  BORDER_LEFT = 5;

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
      '': 17
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

  _angle_to_dir = function(angle) {
    return {
      '0': 'up',
      '90': 'right',
      '180': 'down',
      '-180': 'down',
      '270': 'left',
      '-90': 'left'
    }[angle];
  };

  F_PENTOMINO = [[0, -1], [1, -1], [-1, 0], [0, 0], [0, 1]];

  (function() {
    function _Class() {}

    return _Class;

  })();

  Game.prototype = {
    create: function() {
      var rot, x, y, _i, _len, _ref, _ref1;
      this.s = {
        moving: false,
        player: {
          x: MAP_CENTER_X,
          y: MAP_CENTER_Y
        },
        dest: {
          x: MAP_CENTER_X,
          y: MAP_CENTER_Y
        },
        expanding: false,
        over: false,
        putdown: false,
        inv: [],
        max_inv: 3
      };
      this["in"] = {
        cursors: this.input.keyboard.createCursorKeys(),
        space: this.input.keyboard.addKey('32')
      };
      rot = (function(_this) {
        return function(res, angle, period) {
          var img, tween;
          img = _this.add.image(450, 285, res);
          img.fixedToCamera = true;
          img.anchor.setTo(.5, .5);
          img.alpha = 1;
          tween = _this.add.tween(img);
          tween.to({
            angle: angle
          }, period);
          tween.onComplete.add(function() {
            img.angle = 0;
            return tween.start();
          });
          return tween.start();
        };
      })(this);
      rot('cloud', 360, 99999);
      rot('cloud3', -360, 99999);
      this.bg = this.add.image(0, 0, 'border');
      this.bg.fixedToCamera = true;
      this.tilemap = this.add.tilemap(null, TILE_SIZE, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT);
      this.baselayer = this.tilemap.createBlankLayer('layer1', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE);
      this.baselayer.fixedToCamera = false;
      this.tilemap.addTilesetImage('tileset');
      this.surf = this.add.group();
      this.st = this.add.group();
      for (_i = 0, _len = F_PENTOMINO.length; _i < _len; _i++) {
        _ref = F_PENTOMINO[_i], x = _ref[0], y = _ref[1];
        this.putTile(MAP_CENTER_X + x, MAP_CENTER_Y + y);
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
      this.player.anchor.setTo(.5, .5);
      this.inv = this.add.group();
      rot('cloud2', 360, 199999);
      return this.upd_surf();
    },
    upd_inv: function() {
      var i, n, _i, _len, _ref, _results;
      this.inv.removeAll();
      _ref = this.s.inv;
      _results = [];
      for (n = _i = 0, _len = _ref.length; _i < _len; n = ++_i) {
        i = _ref[n];
        if (i === 1) {
          this.inv.add(this.mk_growseed(n, 0, 'up'));
        }
        if (i === -1) {
          _results.push(this.inv.add(this.mk_destroyseed(n, 0, 'up')));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    mk_growseed: function(x, y, dir) {
      var s;
      s = new Phaser.Sprite(this.game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'growseed');
      s.anchor.setTo(.5, .5);
      s.angle = _angle(dir);
      s.animations.add('play');
      s.animations.play('play', 10, true);
      return s;
    },
    mk_destroyseed: function(x, y, dir) {
      var s;
      s = new Phaser.Sprite(this.game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'destroyseed');
      s.anchor.setTo(.5, .5);
      s.angle = _angle(dir);
      s.animations.add('play');
      s.animations.play('play', 10, true);
      return s;
    },
    putTile: function(x, y) {
      var dir, dx, dy, _i, _len, _ref, _results;
      this.tilemap.putTile(0, x, y);
      this.upd_surf();
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
      this.upd_surf();
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
          _this.s.putdown = false;
          _this.s.player.x = _this.s.dest.x;
          return _this.s.player.y = _this.s.dest.y;
        };
      })(this));
      return tween.start();
    },
    expand: function() {
      var dir, dx, dy, gs, i, tween, x, y, _i, _ref, _ref1, _results;
      _results = [];
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        _ref = [this.rnd.integerInRange(BORDER_LEFT, BORDER_RIGHT), this.rnd.integerInRange(BORDER_TOP, BORDER_BOTTOM)], x = _ref[0], y = _ref[1];
        if ((this.tilemap.getTile(x, y)) && (this.tilemap.getTile(x, y)).index !== 16) {
          while (1) {
            dir = DIRS[this.rnd.integerInRange(0, 3)];
            _ref1 = _dxdy(dir), dx = _ref1[0], dy = _ref1[1];
            if (!this.tilemap.getTile(x + dx, y + dy)) {
              gs = this.growseeds.add(this.mk_growseed(x, y, dir));
              gs.alpha = 0;
              tween = this.add.tween(gs);
              tween.to({
                alpha: 1
              }, 500);
              tween.start();
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
      var dir, dx, dy, gs, i, tween, x, y, _i, _ref, _ref1, _results;
      _results = [];
      for (i = _i = 1; _i <= 1000; i = ++_i) {
        _ref = [this.rnd.integerInRange(BORDER_LEFT, BORDER_RIGHT), this.rnd.integerInRange(BORDER_TOP, BORDER_BOTTOM)], x = _ref[0], y = _ref[1];
        if ((this.tilemap.getTile(x, y)) && (this.tilemap.getTile(x, y)).index !== 16) {
          while (1) {
            dir = DIRS[this.rnd.integerInRange(0, 3)];
            _ref1 = _dxdy(dir), dx = _ref1[0], dy = _ref1[1];
            if (!this.tilemap.getTile(x + dx, y + dy)) {
              gs = this.destroyseeds.add(this.mk_destroyseed(x, y, dir));
              gs.alpha = 0;
              tween = this.add.tween(gs);
              tween.to({
                alpha: 1
              }, 500);
              tween.start();
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
    upd_surf: function() {
      var at, b, dir, dx, dy, found, lc, ls, n, negtiles, outerborder, s, t, tiles, tt, _i, _in, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
      tiles = [[this.s.player.x, this.s.player.y]];
      negtiles = [[0, 0]];
      _in = function(ts, x, y) {
        var t, _i, _len;
        for (_i = 0, _len = ts.length; _i < _len; _i++) {
          t = ts[_i];
          if (t[0] === x && t[1] === y) {
            return true;
          }
        }
        return false;
      };
      at = 0;
      while (1) {
        if (at > 100) {
          console.log('tl', tiles.length);
          return [];
        }
        if (at >= tiles.length) {
          break;
        }
        t = tiles[at];
        for (_i = 0, _len = DIRS.length; _i < _len; _i++) {
          dir = DIRS[_i];
          _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
          if (this.tilemap.getTile(t[0] + dx, t[1] + dy)) {
            found = false;
            for (_j = 0, _len1 = tiles.length; _j < _len1; _j++) {
              tt = tiles[_j];
              if (t[0] + dx === tt[0] && t[1] + dy === tt[1]) {
                found = true;
                break;
              }
            }
            if (!found) {
              tiles.push([t[0] + dx, t[1] + dy]);
            }
          }
        }
        at += 1;
      }
      this.surf.removeAll();
      'outerborder = []\nat = -1\nwhile 1\n  at += 1\n  if at > 1000 \n    __ \'ntl\', negtiles.length\n    return []\n  if at >= negtiles.length then break\n  t = negtiles[at]\n\n  for dir in DIRS\n    [dx, dy] = _dxdy dir\n    #__ \'dir\', dir\n    if _in tiles, t[0]+dx, t[1]+dx\n      #__ \'intiles\'\n      outerborder.push [t[0], t[1], dir]\n\n    else\n      console.log \'nointiles\'\n      if (t[0] + dx >= 0) and (t[1] + dy >= 0) and (t[0] + dx < MAP_WIDTH) and (t[1] + dy < MAP_WIDTH)\n        #__ \'inmap\'\n        if not _in negtiles, t[0] + dx, t[1] + dy\n\n          negtiles.push [t[0] + dx, t[1] + dy]';
      outerborder = [];
      for (_k = 0, _len2 = tiles.length; _k < _len2; _k++) {
        t = tiles[_k];
        for (_l = 0, _len3 = DIRS.length; _l < _len3; _l++) {
          dir = DIRS[_l];
          _ref1 = _dxdy(dir), dx = _ref1[0], dy = _ref1[1];
          if (!this.tilemap.getTile(t[0] + dx, t[1] + dy)) {
            b = [t[0] + dx, t[1] + dy, _reverse(dir)];
            outerborder.push(b);
            s = this.surf.add(new Phaser.Sprite(this.game, (b[0] + 0.5) * TILE_SIZE, (b[1] + 0.5) * TILE_SIZE, 'surface'));
            s.anchor.setTo(0.5, 0.5);
            s.angle = _angle(b[2]);
          }
        }
      }
      this.st.removeAll();
      ls = '' + outerborder.length;
      for (n = _m = 0, _len4 = ls.length; _m < _len4; n = ++_m) {
        lc = ls[n];
        console.log(lc, n);
        s = this.st.add(new Phaser.Sprite(this.game, 27 * TILE_SIZE, (3 * n + 2) * TILE_SIZE, 'numbers'));
        s.frame = lc * 1;
      }
      __(outerborder.length);
      return outerborder;
    },
    update: function() {
      var dir, dx, dy, found, player, ss, tween, _i, _len, _ref, _ref1;
      if (!this.s.over) {
        found = false;
        if (!this.moving && !this.s.putdown) {
          this.growseeds.forEach((function(_this) {
            return function(s) {
              var dx, dy, ss, t, tween, _ref, _ref1;
              if (s) {
                t = _this.tilemap.getTileWorldXY(s.x, s.y);
                if (t && t === _this.tilemap.getTile(_this.s.player.x, _this.s.player.y)) {
                  found = true;
                  if (_this.s.inv.length <= _this.s.max_inv) {
                    _this.s.putdown = true;
                    _this.s.inv.push(1);
                    _this.upd_inv();
                    ss = _this.world.add(_this.mk_growseed(t.x, t.y, 'up'));
                    ss.angle = s.angle;
                    tween = _this.add.tween(ss.scale);
                    tween.to({
                      x: 0.5,
                      y: 0.5
                    }, 1000);
                    tween.onComplete.add(function() {
                      return _this.world.remove(ss);
                    });
                    tween.start();
                    tween = _this.add.tween(ss);
                    _ref = _dxdy(_reverse(_angle_to_dir(s.angle))), dx = _ref[0], dy = _ref[1];
                    tween.to({
                      alpha: 0,
                      x: ss.x + 0.2 * dx * TILE_SIZE,
                      y: ss.y + 0.2 * dy * TILE_SIZE
                    }, 500);
                    tween.start();
                    return _this.growseeds.remove(s);
                  } else {
                    _this.s.putdown = true;
                    _this.s.inv.push(1);
                    _this.upd_inv();
                    ss = _this.world.add(_this.mk_growseed(t.x, t.y, 'up'));
                    ss.angle = s.angle;
                    tween = _this.add.tween(ss.scale);
                    tween.to({
                      x: 0.5,
                      y: 0.5
                    }, 1000);
                    tween.onComplete.add(function() {
                      return _this.world.remove(ss);
                    });
                    tween.start();
                    tween = _this.add.tween(ss);
                    _ref1 = _dxdy(_reverse(_angle_to_dir(s.angle))), dx = _ref1[0], dy = _ref1[1];
                    tween.to({
                      alpha: 0,
                      x: ss.x + 2 * dx * TILE_SIZE,
                      y: ss.y + 2 * dy * TILE_SIZE
                    }, 500);
                    tween.start();
                    return _this.growseeds.remove(s);
                  }
                }
              }
            };
          })(this));
        }
        if (this["in"].space.isDown && !this.moving) {
          this.destroyseeds.forEach((function(_this) {
            return function(s) {
              var dx, dy, ss, t, tween, _ref;
              if (s) {
                t = _this.tilemap.getTileWorldXY(s.x, s.y);
                if (t && t === _this.tilemap.getTile(_this.s.player.x, _this.s.player.y)) {
                  found = true;
                  _this.s.putdown = true;
                  ss = _this.world.add(_this.mk_destroyseed(t.x, t.y, _angle_to_dir(s.angle)));
                  tween = _this.add.tween(ss);
                  _ref = _dxdy(_angle_to_dir(s.angle)), dx = _ref[0], dy = _ref[1];
                  tween.to({
                    alpha: 0,
                    x: ss.x + 2 * dx * TILE_SIZE,
                    y: ss.y + 2 * dy * TILE_SIZE
                  }, 500);
                  tween.onComplete.add(function() {
                    return _this.world.remove(ss);
                  });
                  tween.start();
                  return _this.destroyseeds.remove(s);
                }
              }
            };
          })(this));
          if (!found && !this.s.putdown && this.s.inv.length > 0) {
            this.s.putdown = true;
            dir = _angle_to_dir(this.player.angle);
            _ref = _dxdy(dir), dx = _ref[0], dy = _ref[1];
            if (!this.tilemap.getTile(this.s.player.x + dx, this.s.player.y + dy)) {
              this.putTile(this.s.player.x + dx, this.s.player.y + dy);
              ss = this.world.add(this.mk_growseed(this.s.player.x, this.s.player.y, dir));
              tween = this.add.tween(ss);
              tween.to({
                alpha: 0,
                x: ss.x + 2 * dx * TILE_SIZE,
                y: ss.y + 2 * dy * TILE_SIZE
              }, 500);
              tween.onComplete.add((function(_this) {
                return function() {
                  return _this.world.remove(ss);
                };
              })(this));
              tween.start();
              this.s.inv.pop();
              this.upd_inv();
            }
          }
        }
        if (!this["in"].space.isDown && this.s.putdown) {
          this.s.putdown = false;
        }
        for (_i = 0, _len = DIRS.length; _i < _len; _i++) {
          dir = DIRS[_i];
          if (this["in"].cursors[dir].isDown && !this.s.moving) {
            this.player.angle = _angle(dir);
            _ref1 = _dxdy(dir), dx = _ref1[0], dy = _ref1[1];
            if (this.tilemap.getTile(this.s.player.x + dx, this.s.player.y + dy)) {
              this.s.moving = true;
              this.move_player(dir);
            }
          }
        }
        if (!this.tilemap.getTile(this.s.player.x, this.s.player.y)) {
          this.s.over = true;
          player = this.add.image(this.player.x, this.player.y, 'player');
          player.anchor.setTo(.5, .5);
          tween = this.add.tween(player);
          tween.to({
            angle: 720,
            alpha: 0
          }, 500);
          tween.start();
          tween = this.add.tween(player.scale);
          tween.to({
            x: 0.2,
            y: 0.2
          }, 500);
          tween.start();
          this.world.remove(this.player);
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

  game = new Phaser.Game(900, 570, Phaser.AUTO, 'game-container');

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
    this.game = game;
    this.music = null;
    return this.playButton = null;
  };

  module.exports = MainMenu;

  MainMenu.prototype = {
    create: function() {
      if (!this.game.music) {
        this.game.music = this.add.audio('main');
        this.game.music.play();
      }
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
      this.load.image('border', 'assets/img/border.png');
      this.load.image('cloud', 'assets/img/cloud.png');
      this.load.image('cloud2', 'assets/img/cloud2.png');
      this.load.image('cloud3', 'assets/img/cloud3.png');
      this.load.image('backpixel', 'assets/img/backpixel.png');
      this.load.image('tileset', 'assets/img/tileset.png');
      this.load.image('player', 'assets/img/player.png');
      this.load.image('surface', 'assets/img/surface.png');
      this.load.spritesheet('growseed', 'assets/img/growseed.png', 30, 60, 4, 0, 0);
      this.load.spritesheet('destroyseed', 'assets/img/destroyseed.png', 30, 30, 4, 0, 0);
      this.load.spritesheet('numbers', 'assets/img/numbers.png', 60, 90, 10, 0, 0);
      this.load.audio('main', ['assets/audio/main.mp3']);
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