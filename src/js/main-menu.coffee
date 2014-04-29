MainMenu = (game) ->
  this.game = game
  this.music = null;
  this.playButton = null;


module.exports = MainMenu;

MainMenu.prototype =
  create: () ->
    if not this.game.music
      @game.music = this.add.audio('main');
      @game.music.play '', 0, 1, true

    rot = (res, angle, period) =>
      img = @add.image 450, 285, res
      img.fixedToCamera = yes
      img.anchor.setTo .5, .5
      img.scale = {x: .7, y: .7}
      img.alpha = 1 #0.8
      tween = @add.tween img
      tween.to (angle: angle), period
      tween.onComplete.add => img.angle = 0; tween.start()
      tween.start()
      img


    @game.c1 = rot 'cloud',360, 87999
    @game.c2 = rot 'cloud2', 360, 154999
    @game.c3 = rot 'cloud3',-360, 129999

    @menu2 = this.add.sprite(0, 0, 'menu2');
    @menu1 = this.add.sprite(0, 0, 'menu1');


    tween = @add.tween @menu1
    tween.to (alpha: .4), 2000
    tween.onComplete.add => 
      tween2 = @add.tween @menu1
      tween2.to (alpha: 1), 2000
      tween2.onComplete.add => tween.start()
      tween2.start()
    tween.start()
    #this.playButton = this.add.button(400, 300, 'playButton', this.startGame, this, 2, 1, 0);

    #setTimeout (=> @startGame()), 500
    @in = 
      space: @input.keyboard.addKey '32'


  update: () ->
    # @startGame()
    #  Do some nice funky main menu effect here
    if @in.space.isDown
      @startGame()
  

  startGame:  (pointer) ->
    #this.music.stop();
    this.game.state.start('Game');


