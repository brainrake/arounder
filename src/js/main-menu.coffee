MainMenu = (game) ->
  this.music = null;
  this.playButton = null;


module.exports = MainMenu;

MainMenu.prototype =
  create: () ->
    #this.music = this.add.audio('titleMusic');
    #this.music.play();

    @bg = this.add.sprite(0, 0, 'menusharp');

    #this.playButton = this.add.button(400, 300, 'playButton', this.startGame, this, 2, 1, 0);

    setTimeout (=> @startGame()), 500


  update: () ->
    # @startGame()
    #  Do some nice funky main menu effect here
  

  startGame:  (pointer) ->
    #this.music.stop();
    this.game.state.start('Game');
  


