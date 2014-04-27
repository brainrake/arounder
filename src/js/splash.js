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
