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
