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
