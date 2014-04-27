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
