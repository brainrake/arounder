MainMenu = (game) ->
  this.game = game
  this.music = null;
  this.playButton = null;


module.exports = MainMenu;

MainMenu.prototype =
  create: () ->
    if not this.game.music
      this.game.music = this.add.audio('main');
      this.game.music.play();

    @menu2 = this.add.sprite(0, 0, 'menu2');
    @menu1 = this.add.sprite(0, 0, 'menu1');

    #this.playButton = this.add.button(400, 300, 'playButton', this.startGame, this, 2, 1, 0);

    setTimeout (=> @startGame()), 500


  update: () ->
    # @startGame()
    #  Do some nice funky main menu effect here
  

  startGame:  (pointer) ->
    #this.music.stop();
    this.game.state.start('Game');
  


