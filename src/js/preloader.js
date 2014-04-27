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
