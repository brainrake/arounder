Splash = (game) ->
  this.logo = null;

module.exports = Splash;

Splash.prototype =

  create: () ->
    this.game.state.start('Preloader')
