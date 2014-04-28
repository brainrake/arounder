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

TILE_SIZE = 30
MAP_HEIGHT = 21
MAP_WIDTH = 30
MAP_CENTER_X = (MAP_WIDTH - 2) / 2
MAP_CENTER_Y = (MAP_HEIGHT - 3) / 2
BORDER_TOP = 3
BORDER_RIGHT = 22
BORDER_BOTTOM = 22
BORDER_LEFT = 3

DIRS = ['up', 'right', 'down', 'left']

_dirs_to_tile = (dirs) -> {
  up: 0, right: 1, down:2, left:3, updown:4, rightleft:5, upright:8, rightdown:9, downleft: 10, upleft: 11,uprightleft:12, uprightdown: 13, rightdownleft: 14, updownleft: 15, uprightdownleft:16, '':17,}[dirs]

_dxdy = (dir) -> {up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0]}[dir]

_angle = (dir) -> {up: 0, right: 90, down: 180, left: 270}[dir]

_reverse = (dir) -> {up: 'down', right: 'left', down: 'up', left: 'right'}[dir]

_angle_to_dir = (angle) -> {'0': 'up', '90': 'right', '180': 'down', '-180': 'down', '270': 'left', '-90': 'left'}[angle]

F_PENTOMINO = [[0, -1], [1, -1], [-1, 0], [0, 0], [0, 1]]

_pyt = (x0, y0, x1, y1) ->
  Math.sqrt (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)

class 


Game.prototype =

  create: ->
    @s = 
      moving: no
      player: x: MAP_CENTER_X, y:MAP_CENTER_Y
      dest: x: MAP_CENTER_X, y:MAP_CENTER_Y
      expanding: no
      over:no
      putdown: no
      inv: []
      max_inv: 3

    @in = 
      cursors: @input.keyboard.createCursorKeys()
      space: @input.keyboard.addKey '32'
    
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


    rot 'cloud',360, 99999
    rot 'cloud3',-360, 119999
    #@bg = @add.image 0, 0, 'border'
    #@bg.fixedToCamera = yes

    @a_destroy = this.add.audio 'a_destroy', 0.3
    @a_growseed = this.add.audio 'a_growseed', 2
    @a_push = this.add.audio 'a_push', 2

    @tilemap = @add.tilemap null, TILE_SIZE, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT
    @baselayer = @tilemap.createBlankLayer 'layer1', MAP_WIDTH, MAP_HEIGHT, TILE_SIZE, TILE_SIZE
    @baselayer.fixedToCamera =  no
    @tilemap.addTilesetImage('tileset');
    @surf = @add.group()
    @st = @add.group()

    for [x, y] in F_PENTOMINO
      @putTile MAP_CENTER_X + x, MAP_CENTER_Y + y 

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

    @circ = @add.group()
    rot 'cloud2', 360, 149999

    @upd_surf()

  upd_inv: ->
    @inv.removeAll()
    for i, n in @s.inv
      if i ==  1
        t = @inv.add new Phaser.Sprite @game, 2 * TILE_SIZE, (2 + n) * TILE_SIZE, 'tilesetgrow'
        t.frame = _dirs_to_tile ''

  mk_growseed: (x, y, dir) ->
    s = new Phaser.Sprite(@game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'growseed')
    s.anchor.setTo .5, .5
    s.angle = _angle dir
    s.animations.add 'play'
    s.animations.play 'play', 10, true
    s

  mk_destroyseed: (x, y, dir) ->
    s = new Phaser.Sprite(@game, (x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, 'destroyseed')
    s.anchor.setTo .5, .5
    s.angle = _angle dir
    s.animations.add 'play'
    s.animations.play 'play', 10, true
    s

  putTile: (x, y) ->
    @tilemap.putTile 0, x, y
    @upd_surf()
    @updateTile x, y
    for dir in DIRS
      [dx, dy] = _dxdy dir
      @updateTile x+dx, y+dy

  clearTile: (x, y) ->
    @tilemap.putTile null, x, y
    @upd_surf()
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
    @tilemap.putTile (_dirs_to_tile dirs.join ''), x, y

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
      [x, y] = [(@rnd.integerInRange BORDER_LEFT, BORDER_RIGHT), (@rnd.integerInRange BORDER_TOP, BORDER_BOTTOM)]
      if (@tilemap.getTile x, y) and (@tilemap.getTile x, y).index != 16
        while 1
          dir = DIRS[@rnd.integerInRange 0, 3]
          [dx, dy] = _dxdy dir
          unless @tilemap.getTile x + dx, y + dy
            gs = @growseeds.add @mk_growseed x, y, dir
            gs.alpha = 0
            gs.anchor.setTo 0.5, 10
            tween = @add.tween gs.anchor
            tween.to {x:0.5, y:0.5}, 500
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
      [x, y] = [(@rnd.integerInRange BORDER_LEFT, BORDER_RIGHT), (@rnd.integerInRange BORDER_TOP, BORDER_BOTTOM)]
      if (@tilemap.getTile x, y) and (@tilemap.getTile x, y).index != 16
        while 1
          dir = DIRS[@rnd.integerInRange 0, 3]
          [dx, dy] = _dxdy dir
          unless @tilemap.getTile x + dx, y + dy
            gs = @destroyseeds.add @mk_destroyseed x, y, dir
            gs.alpha = 0
            gs.anchor.setTo 0.5, 10
            tween = @add.tween gs.anchor
            tween.to {x:0.5, y:0.5}, 500
            tween.start()
            tween = @add.tween gs
            tween.to {alpha: 1}, 500
            tween.start()
            setTimeout (=> 
              if (@destroyseeds.getIndex gs) > -1
                @destroyseeds.remove gs; @clearTile x, y
                @a_destroy.play()
            ), 3000
            break
        break

  upd_surf: ->
    tiles = [[@s.player.x, @s.player.y]]
    negtiles = [[0, 0]]

    _in = (ts, x, y) ->
      for t in ts
        if t[0] == x and t[1] == y
          return yes
      no

    at = 0
    while 1
      if at > 100 
        return []
      if at >= tiles.length then break
      t = tiles[at]
      for dir in DIRS
        [dx, dy] = _dxdy dir
        if @tilemap.getTile t[0] + dx, t[1] + dy
          found = no
          for tt in tiles
            if t[0] + dx == tt[0] and t[1] + dy == tt[1]
              found = yes
              break
          if not found
            tiles.push [t[0] + dx, t[1] + dy]
      at += 1

    #__ 'tiles'
    #__ tiles
    @surf.removeAll()

    outerborder = []
    for t in tiles
      for dir in DIRS
        [dx, dy] = _dxdy dir
        if not @tilemap.getTile t[0] + dx, t[1] + dy
          b = [t[0] + dx, t[1] + dy, _reverse dir]
          outerborder.push(b)
          s = @surf.add new Phaser.Sprite(@game, (b[0] + 0.5) * TILE_SIZE, (b[1] + 0.5) * TILE_SIZE, 'surfacew')
          s.anchor.setTo 0.5, 0.5
          s.angle = _angle b[2]

    @st.removeAll()
    ls = '' + outerborder.length
    if ls.length == 1
      ls = '00'+ls
    if ls.length == 2
      ls = '0'+ls
    for lc, n in ls
      s = @st.add new Phaser.Sprite(@game, (2 * n + 24) * TILE_SIZE, 2 * TILE_SIZE, 'numbers')
      s.frame = lc*1

    over = no
    if @circ
      @circ.removeAll()

      cx = 14
      cy = 8.5

      for tt in @baselayer.getTiles 0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE 
        x = tt.x
        y = tt.y
        dx = x - cx
        dy = y - cy
        d = _pyt x, y, cx, cy
        if d > 5.2
          angle = Math.atan2 x-cx, y-cy
          #__ angle
          s = @surf.add new Phaser.Sprite(@game, (cx + .5) * TILE_SIZE, (cy + .5) * TILE_SIZE, 'surface')
          s.anchor.setTo 0.5, 7.5
          s.angle = 180 - angle * 180 / 3.1415
        if d > 6.5
          over = yes
    
    if over
      @gover()

    #__ outerborder.length
    outerborder



  update: ->

    if not @s.over
      found = no
      if not @.moving and not @s.putdown
        @growseeds.forEach (s) => if s
          t = @tilemap.getTileWorldXY s.x, s.y
          if t and t == @tilemap.getTile @s.player.x, @s.player.y
            found = yes
            # pickup growseed
            if @s.inv.length <= @s.max_inv
              @s.putdown = yes
              @s.inv.push 1
              @upd_inv()
              ss = @world.add @mk_growseed t.x, t.y, 'up'
              ss.angle = s.angle
              tween = @add.tween ss
              [dx, dy] = _dxdy _reverse _angle_to_dir s.angle
              tween.to {alpha:0, x: ss.x + 0.2 * dx * TILE_SIZE, y: ss.y + 0.2 * dy * TILE_SIZE}, 300
              tween.onComplete.add => @world.remove ss
              tween.start()
              
              @growseeds.remove s

            else # kill growseed
              @s.putdown = yes
              
              ss = @world.add @mk_growseed t.x, t.y, 'up'
              ss.angle = s.angle
              tween = @add.tween ss.scale
              tween.to {x:0.5, y:0.5}, 300
              tween.onComplete.add => @world.remove ss
              tween.start()
              tween = @add.tween ss
              [dx, dy] = _dxdy _angle_to_dir s.angle
              tween.to {alpha:0, x: ss.x + 2 * dx * TILE_SIZE, y: ss.y + 2 * dy * TILE_SIZE}, 300
              tween.start()
              
              @growseeds.remove s

      
      if @in.space.isDown and not @.moving
        # kill destroyseed
        @destroyseeds.forEach (s) => if s
          t = @tilemap.getTileWorldXY s.x, s.y
          if t and t == @tilemap.getTile @s.player.x, @s.player.y
            found = yes
            @s.putdown = yes
            
            ss = @world.add @mk_destroyseed t.x, t.y, _angle_to_dir s.angle
            tween = @add.tween ss
            [dx, dy] = _dxdy _angle_to_dir s.angle
            tween.to {alpha:0, x: ss.x + 2 * dx * TILE_SIZE, y: ss.y + 2 * dy * TILE_SIZE}, 300
            tween.onComplete.add => @world.remove ss
            tween.start()

            @destroyseeds.remove s
            @a_push.play()

        # put down growseed
        if not found and not @s.putdown and @s.inv.length > 0
          @s.putdown = yes
          dir = _angle_to_dir @player.angle
          [dx, dy] = _dxdy dir
          if not @tilemap.getTile @s.player.x + dx, @s.player.y + dy
            @putTile @s.player.x+dx, @s.player.y+dy
            ss = @world.add @mk_growseed @s.player.x, @s.player.y, dir
            tween = @add.tween ss
            tween.to {alpha:0, x: ss.x + 2 * dx * TILE_SIZE, y: ss.y + 2 * dy * TILE_SIZE}, 300
            tween.onComplete.add => @world.remove ss
            tween.start()
            @s.inv.pop()
            @upd_inv()
            @a_growseed.play()

      if not @in.space.isDown and @s.putdown
        @s.putdown = no

      #move
      for dir in DIRS
        if @in.cursors[dir].isDown and not @s.moving
          @player.angle = _angle dir
          [dx, dy] = _dxdy dir
          if @tilemap.getTile @s.player.x + dx, @s.player.y + dy
            @s.moving = yes
            @move_player dir

      #gameover
      if not @tilemap.getTile @s.player.x, @s.player.y
        @gover()


  gover: ->
    if @s.over then return
    @s.over = yes

    player = @add.image @player.x, @player.y, 'player'
    player.anchor.setTo .5, .5
    player.angle = @player.angle
    tween = @add.tween player
    tween.to {alpha: 0}, 500
    tween.start()
    tween = @add.tween player.scale
    tween.to {x:0.2, y:0.2}, 500
    tween.start()
    @world.remove @player
    setTimeout (=>@quitGame()), 4000
        

  quitGame: (pointer) ->
    #//  Here you should destroy anything you no longer need.
    #//  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    #//  Then let's go back to the main menu.
    @game.state.start('MainMenu');
