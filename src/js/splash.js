(function() {
  var Splash;

  Splash = function(game) {
    return this.logo = null;
  };

  module.exports = Splash;

  Splash.prototype = {
    create: function() {
      return this.game.state.start('Preloader');
    }
  };

}).call(this);
