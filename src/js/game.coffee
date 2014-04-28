__ = -> console.log arguments...; arguments[0]

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
  up: 0, right: 1, down:2, left:3, updown:4, rightleft:5, upright:8, rightdown:9, downleft: 10, upleft: 11,uprightleft:12, uprightdown: 13, rightdownleft: 14, updownleft: 15, uprightdownleft:16, '':17,}[dirs.join '']

_dxdy = (dir) -> {up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0]}[dir]

_angle = (dir) -> {up: 0, right: 90, down: 180, left: 270}[dir]

_reverse = (dir) -> {up: 'down', right: 'left', down: 'up', left: 'right'}[dir]

_angle_to_dir = (angle) -> {'0': 'up', '90': 'right', '180': 'down', '-180': 'down', '270': 'left', '-90': 'left'}[angle]

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
      putdown: no
      inv: []
      max_inv: 3

    @in = 
      cursors: @input.keyboard.createCursorKeys()
      space: @input.keyboard.addKey '32'
    
    rot = (res, angle, period) =>
      img = @add.image 580, 550, res
      img.anchor.setTo .5, .5
      img.alpha = 1 #0.8
      tween = @add.tween img
      tween.to (angle: angle), period
      tween.onComplete.add => img.angle = 0; tween.start()
      tween.start()

    rot 'back', 360, 199999
    rot 'back2clouds',360, 99999
    rot 'back2surface', -360, 99999

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

    @inv = @add.group()

  upd_inv: ->
    @inv.removeAll()
    for i, n in @s.inv
      if i ==  1 then  @inv.add @mk_growseed n, 0, 'up'
      if i == -1 then  @inv.add @mk_destroyseed n, 0, 'up'
      console.log i, n

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
      @s.putdown = no
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
            gs.alpha = 0
            gs.scale = {x: 3, y:3}
            tween = @add.tween gs.scale
            tween.to {x: 1, y: 1}, 500
            tween.start()
            tween = @add.tween gs
            tween.to {alpha: 1}, 500
            tween.start()
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
            gs.alpha = 0
            gs.scale = {x: 3, y:3}
            tween = @add.tween gs.scale
            tween.to {x: 1, y: 1}, 500
            tween.start()
            tween = @add.tween gs
            tween.to {alpha: 1}, 500
            tween.start()
            setTimeout (=> 
              if (@destroyseeds.getIndex gs) > -1
                @destroyseeds.remove gs; @clearTile x, y
            ), 3000
            break
        break

  update: ->
    if not @s.over
      found = no
      if not @.moving
        @growseeds.forEach (s) => if s
          t = @tilemap.getTileWorldXY s.x, s.y
          if t and t == @tilemap.getTile @s.player.x, @s.player.y
            found = yes
            @s.putdown = yes
            @s.inv.push 1
            @upd_inv()
            
            ss = @world.add @mk_growseed t.x, t.y, 'up'
            ss.angle = s.angle
            tween = @add.tween ss.scale
            tween.to {x:0.5, y:0.5}, 1000
            tween.onComplete.add => @world.remove ss
            tween.start()
            tween = @add.tween ss
            [dx, dy] = _dxdy _reverse _angle_to_dir s.angle
            tween.to {alpha:0, x: ss.x + 0.2 * dx * TILE_SIZE, y: ss.y + 0.2 * dy * TILE_SIZE}, 500
            tween.start()
            
            @growseeds.remove s

      if @in.space.isDown and not @.moving
        @destroyseeds.forEach (s) => if s
          t = @tilemap.getTileWorldXY s.x, s.y
          if t and t == @tilemap.getTile @s.player.x, @s.player.y
            found = yes
            @s.putdown = yes
            
            ss = @world.add @mk_destroyseed t.x, t.y, _angle_to_dir s.angle
            tween = @add.tween ss.scale
            tween.to {x:0.5, y:0.5}, 1000
            tween.onComplete.add => @world.remove ss
            tween.start()
            tween = @add.tween ss
            [dx, dy] = _dxdy _angle_to_dir s.angle
            tween.to {alpha:0, x: ss.x + 2 * dx * TILE_SIZE, y: ss.y + 2 * dy * TILE_SIZE}, 1000
            tween.start()

            @destroyseeds.remove s

        if not found and not @s.putdown and @s.inv.length > 0
          @s.putdown = yes
          console.log 'put', @s.inv.pop()
          dir = _angle_to_dir @player.angle
          [dx, dy] = _dxdy dir
          @putTile @s.player.x+dx, @s.player.y+dy
          ss = @world.add @mk_growseed @s.player.x, @s.player.y, dir
          tween = @add.tween ss.scale
          tween.to {x:0.5, y:0.5}, 1000
          tween.onComplete.add => @world.remove ss
          tween.start()
          tween = @add.tween ss
          tween.to {alpha:0, x: ss.x + 2 * dx * TILE_SIZE, y: ss.y + 2 * dy * TILE_SIZE}, 1000
          tween.start()
          
          @upd_inv()

      if not @in.space.isDown and @s.putdown
        @s.putdown = no

      for dir in DIRS
        if @in.cursors[dir].isDown and not @s.moving
          @player.angle = _angle dir
          [dx, dy] = _dxdy dir
          if @tilemap.getTile @s.player.x + dx, @s.player.y + dy
            @s.moving = yes
            @move_player dir

      if not @tilemap.getTile @s.player.x, @s.player.y
        @s.over = yes
        #@add.text 200, 200, 'game over', color: '#ffffff'
        player = @add.image @player.x, @player.y, 'player'
        player.anchor.setTo .5, .5
        tween = @add.tween player
        tween.to {angle: 720, alpha: 0}, 500
        tween.start()
        tween = @add.tween player.scale
        tween.to {x:0.2, y:0.2}, 500
        tween.start()
        @world.remove @player
        setTimeout (=>@quitGame()), 2000
        
        
  quitGame: (pointer) ->
    #//  Here you should destroy anything you no longer need.
    #//  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    #//  Then let's go back to the main menu.
    @game.state.start('MainMenu');
