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
      var rot, tween;
      if (!this.game.music) {
        this.game.music = this.add.audio('main');
        this.game.music.play('', 0, 1, true);
      }
      rot = (function(_this) {
        return function(res, angle, period) {
          var img, tween;
          img = _this.add.image(450, 285, res);
          img.fixedToCamera = true;
          img.anchor.setTo(.5, .5);
          img.scale = {
            x: .7,
            y: .7
          };
          img.alpha = 1;
          tween = _this.add.tween(img);
          tween.to({
            angle: angle
          }, period);
          tween.onComplete.add(function() {
            img.angle = 0;
            return tween.start();
          });
          tween.start();
          return img;
        };
      })(this);
      this.game.c1 = rot('cloud', 360, 87999);
      this.game.c2 = rot('cloud2', 360, 154999);
      this.game.c3 = rot('cloud3', -360, 129999);
      this.menu2 = this.add.sprite(0, 0, 'menu2');
      this.menu1 = this.add.sprite(0, 0, 'menu1');
      tween = this.add.tween(this.menu1);
      tween.to({
        alpha: .4
      }, 2000);
      tween.onComplete.add((function(_this) {
        return function() {
          var tween2;
          tween2 = _this.add.tween(_this.menu1);
          tween2.to({
            alpha: 1
          }, 2000);
          tween2.onComplete.add(function() {
            return tween.start();
          });
          return tween2.start();
        };
      })(this));
      tween.start();
      return this["in"] = {
        space: this.input.keyboard.addKey('32')
      };
    },
    update: function() {
      if (this["in"].space.isDown) {
        return this.startGame();
      }
    },
    startGame: function(pointer) {
      return this.game.state.start('Game');
    }
  };

}).call(this);
