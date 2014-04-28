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
        this.game.music.play('', 0, 1, true);
      }
      this.menu2 = this.add.sprite(0, 0, 'menu2');
      this.menu1 = this.add.sprite(0, 0, 'menu1');
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
