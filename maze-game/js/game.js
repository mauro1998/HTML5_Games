(() => {
  const container = document.getElementById('container');
  const game = new Phaser.Game(960, 600, Phaser.AUTO, container, null, false, true);

  const PlayState = ((game) => {
    const assets = [
      { type: 'image', name: 'background', src: 'images/background.png' },
      { type: 'image', name: 'ground', src: 'images/ground.png' },
      { type: 'image', name: 'grass:8x1', src: 'images/grass_8x1.png' },
      { type: 'image', name: 'grass:6x1', src: 'images/grass_6x1.png' },
      { type: 'image', name: 'grass:4x1', src: 'images/grass_4x1.png' },
      { type: 'image', name: 'grass:2x1', src: 'images/grass_2x1.png' },
      { type: 'image', name: 'grass:1x1', src: 'images/grass_1x1.png' },
      { type: 'image', name: 'key', src: 'images/key.png' },
      { type: 'image', name: 'hero_stopped', src: 'images/hero_stopped.png' },
      { type: 'image', name: 'invisible_wall', src: 'images/invisible_wall.png' },
      { type: 'spritesheet', name: 'decor', src: 'images/decor.png', width: 42, height: 42 },
      { type: 'spritesheet', name: 'coin', src: 'images/coin_animated.png', width: 22, height: 22 },
      { type: 'spritesheet', name: 'door', src: 'images/door.png', width: 42, height: 66 },
      { type: 'spritesheet', name: 'spider', src: 'images/spider.png', width: 42, height: 32 },
      { type: 'spritesheet', name: 'hero', src: 'images/hero.png', width: 36, height: 42 },
      { type: 'audio', name: 'sfx:jump', src: 'audio/jump.wav' },
      { type: 'audio', name: 'sfx:coin', src: 'audio/coin.wav' },
      { type: 'audio', name: 'sfx:key', src: 'audio/key.wav' },
      { type: 'audio', name: 'sfx:stomp', src: 'audio/stomp.wav' },
      { type: 'audio', name: 'music:background', src: 'audio/bgm.mp3', volume: 4, loop: true },
    ];

    const obj = {};
    let sounds;
    let keys;
    let hasKey = false;

    class Character extends Phaser.Sprite {
      constructor(x, y, name) {
        super(game, x, y, name);
        this._initialX = x;
        this._initialY = y;
        this.anchor.set(0.5);
        game.stage.addChild(this);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
      }

      move(direction = 0) {
        this.body.velocity.x = this.MOVE_SPEED * direction;
        if (this.body.velocity.x < 0) this.scale.x = -1;
        else this.scale.x = 1;
      }
    }

    class Hero extends Character {
      constructor(x, y) {
        super(x, y, 'hero', 0);
        this.MOVE_SPEED = 200;
        this.JUMP_SPEED = 350;
        this.JUMP_HOLD = 300;
        this.BOUNCE_SPEED = 200;
        this.animations.add('stop', [0]);
        this.animations.add('run', [1, 2], 8, true);
        this.animations.add('jump', [3]);
        this.animations.add('fall', [4]);
        this.animations.add('die', [5, 6, 5, 6], 8);
        window.hero = this;
      }

      getAnimName() {
        let name = 'stop';
        if (!this.alive) name = 'die';
        else if (this._isFrozen) name = 'stop';
        else if (this.body.velocity.y < 0) name = 'jump';
        else if (this.body.velocity.y >= 0 && !this.body.touching.down) name = 'fall';
        else if (this.body.velocity.x !== 0 && this.body.touching.down) name = 'run';
        return name;
      }

      update() {
        this._name = this.getAnimName();
        if (this._name !== this.animations.name) {
          this.animations.play(this._name);
        }

        if (this._stillOnAir
          && this.body.velocity.y === 0
          && this.body.touching.down) {
          this._stillOnAir = false;
        }
      }

      jump() {
        const isOnFloor = this.body.velocity.y === 0 && this.body.touching.down;
        const isOnAirOnce = this.body.velocity.y > 0
          && !this.body.touching.down
          && !this.isBoosting
          && !this._stillOnAir;

        const canJump = this.alive
          && !this._isFrozen
          && (isOnFloor || isOnAirOnce || this.isBoosting);

        if (isOnFloor || isOnAirOnce) sounds.jump.play();

        if (canJump) {
          this.body.velocity.y = - this.JUMP_SPEED;
          this._stillOnAir = true;
          this.isBoosting = !this.body.touching.up
            && !this.body.blocked.up
            && this.body.velocity.y <= 0;
        }
      }

      bounce() {
        this.body.velocity.y = - this.BOUNCE_SPEED;
      }

      freeze() {
        this.body.enable = false;
        this._isFrozen = true;
      }

      die(callback) {
        this.freeze();
        this.alive = false;
        this.animations.play('die').onComplete.addOnce(() => {
          this.kill();
          callback();
        });
      }
    }

    class Spider extends Character {
      constructor(x, y) {
        super(x, y, 'spider');
        this.MOVE_SPEED = game.rnd.between(100, 130);
        this.animations.add('crawl', [4, 3, 2], 8, true);
        this.animations.add('die', [4, 0, 4, 0, 4, 0, 1, 1, 1, 1, 1, 1], 8, false);
        this.animations.play('crawl');
        this.move(1);
      }

      update() {
        if (this.body.touching.left || this.body.blocked.left) this.move(1);
        else if (this.body.touching.right || this.body.blocked.right) this.move(-1);
      }

      die() {
        this.body.enable = false;
        this.animations.currentAnim.stop();
        this.animations.play('die')
          .onComplete.addOnce(() => this.kill());
      }
    }

    function init() {
      game.renderer.renderSession.roundPixels = true;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.pageAlignVertically = true;
      game.scale.pageAlignHorizontally = true;
      game.stage.backgroundColor = '#FFFFFF';
      game.scale.refresh();

      keys = game.input.keyboard.addKeys({
        LEFT: Phaser.Keyboard.A,
        RIGHT: Phaser.Keyboard.D,
        UP: Phaser.Keyboard.SPACEBAR,
      });
    }

    function preload() {
      game.load.json('level:1', 'data/level01.json');
      assets.forEach((asset) => {
        const { type, name, src, width, height } = asset;
        game.load[type](name, src, width, height);
      });
    }

    function createPlatforms(platforms) {
      obj.platforms = game.add.group();
      obj.enemyWalls = game.add.group();
      platforms.forEach((platformData) => {
        const { x, y, image } = platformData;
        const platform = game.add.sprite(x, y, image);
        game.physics.enable(platform, Phaser.Physics.ARCADE);
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        obj.platforms.add(platform);
        const rightWall = createEnemyWall(platform.x + platform.width, platform.y);
        const leftWall = createEnemyWall(platform.x - rightWall.width, platform.y);
        obj.enemyWalls.add(rightWall);
        obj.enemyWalls.add(leftWall);
      });
    }

    function createEnemyWall(x, y) {
      const wall = game.add.sprite(x, y, 'invisible_wall');
      wall.anchor.set(0, 1);
      game.physics.enable(wall);
      wall.body.immovable = true;
      wall.body.allowGravity = false;
      wall.visible = false;
      return wall;
    }

    function createDecoration(decoration) {
      decoration.forEach((decor) => {
        const { x, y, frame } = decor;
        game.add.sprite(x, y, 'decor', frame);
      });
    }

    function createCoins(coinsPos) {
      obj.coins = game.add.group();
      coinsPos.forEach((pos) => {
        const { x, y } = pos;
        const coin = game.add.sprite(x, y, 'coin', 0);
        coin.anchor.set(0.5);
        coin.animations.add('rotate', [0, 1, 2, 1]);
        coin.animations.play('rotate', 8, true);
        game.physics.enable(coin, Phaser.Physics.ARCADE);
        coin.body.allowGravity = false;
        obj.coins.add(coin);
      });
    }

    function createDoor(doorPos) {
      const { x, y } = doorPos;
      obj.door = game.add.sprite(x, y, 'door', 0);
      obj.door.anchor.set(0, 1);
      obj.door.animations.add('open');
      game.physics.enable(obj.door, Phaser.Physics.ARCADE);
      obj.door.body.allowGravity = false;
    }

    function createKey(keyPos) {
      const { x, y } = keyPos;
      obj.key = game.add.sprite(x, y, 'key', 0);
      obj.key.anchor.set(0.5);
      game.physics.enable(obj.key, Phaser.Physics.ARCADE);
      obj.key.body.allowGravity = false;
    }

    function createSpiders(spiders) {
      obj.spiders = game.add.group();
      spiders.forEach((spiderPos) => {
        const { x, y } = spiderPos;
        const spider = new Spider(x, y);
        obj.spiders.add(spider);
      });
    }

    function createHero(pos) {
      const { x, y } = pos;
      obj.hero = new Hero(400, y);
    }

    function loadLevel(data) {
      const GRAVITY = 1200;
      game.physics.arcade.gravity.y = GRAVITY;
      createPlatforms(data.platforms);
      createDecoration(data.decoration);
      createCoins(data.coins);
      createDoor(data.door);
      createKey(data.key);
      createSpiders(data.spiders);
      createHero(data.hero);
    }

    function createSounds() {
      sounds = assets.filter(({ type }) => type === 'audio')
        .reduce((wrap, asset) => {
          const { name, volume, loop } = asset;
          wrap[name.split(':').pop()] = game.add.audio(name, volume, loop);
          return wrap;
        }, {});
    }

    function create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.add.sprite(0, 0, 'background');
      loadLevel(game.cache.getJSON('level:1'));
      createSounds();
      game.camera.flash(0xFFFFFF, 500);
      sounds.background.play();
    }

    function handleInput() {
      if (keys.LEFT.isDown) {
        obj.hero.move(-1);
      } else if (keys.RIGHT.isDown) {
        obj.hero.move(1);
      } else {
        obj.hero.move(0);
      }

      if (keys.UP.downDuration(obj.hero.JUMP_HOLD)) {
        obj.hero.jump();
      } else {
        obj.hero.isBoosting = false;
      }
    }

    function onHeroOverlapCoin(hero, coin) {
      coin.kill();
      sounds.coin.play();
    }

    function onHeroOverlapsEnemy(hero, spider) {
      const enemyStomped = hero.body.velocity.y > 0 && hero.body.touching.down;
      sounds.stomp.play();

      if (enemyStomped) {
        hero.bounce();
        spider.die();
      } else {
        hero.die(() => restartGame());
      }
    }

    function restartGame() {
      game.camera.fade(0xFFFFFF, 500);
      sounds.background.stop();
      game.camera.onFadeComplete.addOnce(() => {
        game.state.restart();
      });
    }

    function onHeroOverlapsKey(hero, key) {
      hasKey = true;
      key.kill();
      sounds.key.play();
    }

    function onHeroOverlapsDoor(hero, door) {
      hero.body.moves = false;
      door.animations.play('open');
    }

    function handleCollisions() {
      game.physics.arcade.collide(obj.hero, obj.platforms);
      game.physics.arcade.collide(obj.spiders, obj.platforms);
      game.physics.arcade.collide(obj.spiders, obj.enemyWalls);
      game.physics.arcade.overlap(obj.hero, obj.spiders, onHeroOverlapsEnemy);
      game.physics.arcade.overlap(obj.hero, obj.coins, onHeroOverlapCoin);
      game.physics.arcade.overlap(obj.hero, obj.key, onHeroOverlapsKey);
      game.physics.arcade.overlap(obj.hero, obj.door, onHeroOverlapsDoor);
    }

    function update() {
      handleCollisions();
      handleInput();
    }

    return { preload, create, update, init };
  })(game);

  game.state.add('Play', PlayState);
  game.state.start('Play');
})();
