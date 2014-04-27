Splash = (game) ->
  this.logo = null;

module.exports = Splash;

Splash.prototype =

  create: () ->
    this.game.state.start('Preloader')


    logo = this.logo = this.add.sprite(0, 0, 'menusharp');
    logo.alpha = 0

    tween = this.add.tween(logo);

    tween.onComplete.add((-> this.game.state.start('Preloader')), this);

    tween
      .to({ alpha: 1 }, 200, Phaser.Easing.Linear.None)
      .start();
