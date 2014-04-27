Game = (game) ->
  #// When a State is added to Phaser it automatically has the following properties set on it, 
  #// even if they already exist:
  '''
  /*
  this.game;      // a reference to the currently running game
  this.add;       // used to add sprites, text, groups, etc
  this.camera;    // a reference to the game camera
  this.cache;     // the game cache
  this.input;     // the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
  this.load;      // for preloading assets
  this.math;      // lots of useful common math operations
  this.sound;     // the sound manager - add a sound, play one, set-up markers, etc
  this.stage;     // the game stage
  this.time;      // the clock
  this.tweens;    // the tween manager
  this.world;     // the game world
  this.particles; // the particle manager
  this.physics;   // the physics manager
  this.rnd;       // the repeatable random number generator
  */
  '''
  #// You can use any of these from any function within this State.
  #// But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
  on

module.exports = Game;

TILE_SIZE = 24
MAP_HEIGHT = 23
MAP_WIDTH = 37
MAP_CENTER_X = (MAP_WIDTH - 1) / 2
MAP_CENTER_Y = (MAP_HEIGHT - 1) / 2

DIRS = ['up', 'right', 'down', 'left']

_dirs_to_tile = (dirs) -> {
  up: 0, right: 1, down:2, left:3, updown:4, rightleft:5, upright:8, rightdown:9, downleft: 10, upleft: 11,uprightleft:12, uprightdown: 13, rightdownleft: 14, updownleft: 15, uprightdownleft:16, '':19,}[dirs.join '']

_dxdy = (dir) -> {up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0]}[dir]

_angle = (dir) -> {up: 0, right: 90, down: 180, left: 270}[dir]

_reverse = (dir) -> {up: 'down', right: 'left', down: 'up', left: 'right'}[dir]


F_PENTOMINO = [[18, 10], [19, 10], [17, 11], [18, 11], [18, 12]]


class 


Game.prototype =

  create: ->
    @s = 
      moving: no
      player: x: 18, y: 11
      dest: x:18, y:11
      expanding: no
      over:no

    @in = 
      cursors: @input.keyboard.createCursorKeys()
      space: @input.keyboard.addKey '32'
    
    #@bg_static = @add.image 0, 0, 'backpixel'
    @bg_rot = @add.image 580, 550, 'back'
    @bg_rot.anchor.setTo .5, .5
    @bg_rot.alpha = 0.8
    tween = @add.tween @bg_rot
    tween.to (angle: 360), 199999
    tween.onComplete.add => @bg_rot.angle = 0; tween.start()
    tween.start()
    @bg_rot2 = @add.image 580, 550, 'back2clouds'
    @bg_rot2.anchor.setTo .5, .5
    @bg_rot2.alpha = 1
    tween = @add.tween @bg_rot2
    tween.to (angle: 360), 99999
    tween.onComplete.add => @bg_rot2.angle = 0; tween.start()
    tween.start()
    @bg_rot3 = @add.image 580, 550, 'back2surface'
    @bg_rot3.anchor.setTo .5, .5
    @bg_rot3.alpha = 1
    tween = @add.tween @bg_rot3
    tween.to (angle: -360), 99999
    tween.onComplete.add => @bg_rot3.angle = 0; tween.start()
    tween.start()
    

    @tilemap = @add.tilemap null, TILE_SIZE, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT
    @baselayer = @tilemap.createBlankLayer 'layer1', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE
    @tilemap.addTilesetImage('tileset');
    @putTile x, y for [x, y] in F_PENTOMINO

    @growseeds = @add.group()
    @growseed_timer = @game.time.create no
    @growseed_timer.loop 2500, => @expand()
    @growseed_timer.start()

    @destroyseeds = @add.group()
    @destroyseed_timer = @game.time.create no
    @destroyseed_timer.loop 3200, => @contract()
    @destroyseed_timer.start()

    {x, y} = @s.player
    @player = @add.image (x + .5) * TILE_SIZE, (y + .5) * TILE_SIZE, 'player'
    @player.anchor.setTo .5, .5


  mk_growseed: (x, y, dir) ->
    s = new Phaser.Sprite(@game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'growseed')
    s.anchor.setTo .5, 0.6
    s.angle = _angle dir
    s.animations.add 'play'
    s.animations.play 'play', 10, true
    s

  mk_destroyseed: (x, y, dir) ->
    s = new Phaser.Sprite(@game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'destroyseed')
    s.anchor.setTo .5, 0.6
    s.angle = _angle dir
    s.animations.add 'play'
    s.animations.play 'play', 10, true
    s

  putTile: (x, y) ->
    @tilemap.putTile 0, x, y
    @updateTile x, y
    for dir in DIRS
      [dx, dy] = _dxdy dir
      @updateTile x+dx, y+dy

  clearTile: (x, y) ->
    @tilemap.putTile null, x, y
    for dir in DIRS
      [dx, dy] = _dxdy dir
      @updateTile x + dx, y + dy

  updateTile: (x, y) ->
    return unless @tilemap.getTile x, y
    dirs = []
    for dir in DIRS
      [dx, dy] = _dxdy dir
      if @tilemap.getTile  x+dx, y+dy
        dirs[dirs.length] = dir 
    @tilemap.putTile (_dirs_to_tile dirs), x, y

  move_player: (dir) ->
    tween = @add.tween @player
    [dx, dy] = _dxdy dir
    tween.to (
      x: @player.x + dx * TILE_SIZE
      y: @player.y + dy * TILE_SIZE
    ), 99
    @s.dest.x = @s.player.x + dx
    @s.dest.y = @s.player.y + dy
    tween.onComplete.add =>
      @s.moving = no
      @s.player.x = @s.dest.x
      @s.player.y = @s.dest.y
    tween.start()

  expand: ->
    for i in [1..1000]
      [x, y] = [(@rnd.integerInRange 1, MAP_WIDTH-2), (@rnd.integerInRange 1, MAP_HEIGHT-2)]
      if (@tilemap.getTile x, y) and (@tilemap.getTile x, y).index != 16
        while 1
          dir = DIRS[@rnd.integerInRange 0, 3]
          [dx, dy] = _dxdy dir
          unless @tilemap.getTile x + dx, y + dy
            gs = @growseeds.add @mk_growseed x, y, dir
            setTimeout (=> 
              if (@growseeds.getIndex gs) > -1
                @growseeds.remove gs; @putTile x+dx, y+dy
            ), 3000
            break
        break

  contract: ->
    for i in [1..1000]
      [x, y] = [(@rnd.integerInRange 1, MAP_WIDTH-2), (@rnd.integerInRange 1, MAP_HEIGHT-2)]
      if (@tilemap.getTile x, y) and (@tilemap.getTile x, y).index != 16
        while 1
          dir = DIRS[@rnd.integerInRange 0, 3]
          [dx, dy] = _dxdy dir
          unless @tilemap.getTile x + dx, y + dy
            gs = @destroyseeds.add @mk_destroyseed x, y, dir
            setTimeout (=> 
              if (@destroyseeds.getIndex gs) > -1
                @destroyseeds.remove gs; @clearTile x, y
            ), 3000
            break
        break

  update: ->
    if not @s.over
      if @in.space.isDown and not @.moving
        @growseeds.forEach (s) => if s
          t = @tilemap.getTileWorldXY s.x, s.y
          if t and t == @tilemap.getTile @s.player.x, @s.player.y
            @growseeds.remove s
      if @in.space.isDown and not @.moving
        @destroyseeds.forEach (s) => if s
          t = @tilemap.getTileWorldXY s.x, s.y
          if t and t == @tilemap.getTile @s.player.x, @s.player.y
            @destroyseeds.remove s
      for dir in DIRS
        if @in.cursors[dir].isDown and not @s.moving
          @player.angle = _angle dir
          [dx, dy] = _dxdy dir
          if @tilemap.getTile @s.player.x + dx, @s.player.y + dy
            @s.moving = yes
            @move_player dir

      if not @tilemap.getTile @s.player.x, @s.player.y
        @s.over = yes
        @add.text 200, 200, 'game over', color: '#ffffff'
        setTimeout (=>@quitGame()), 2000
        
        
  quitGame: (pointer) ->
    #//  Here you should destroy anything you no longer need.
    #//  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    #//  Then let's go back to the main menu.
    @game.state.start('MainMenu');
