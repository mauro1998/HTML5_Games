var width = 800;
var height = 600;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('sky', '/assets/images/sky.png');
  game.load.image('ground', '/assets/images/platform.png');
  game.load.image('star', '/assets/images/star.png');
  game.load.spritesheet('dude', '/assets/images/dude.png', 32, 48);
}

var platforms;
var player;

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');

  platforms = game.add.group();
  platforms.enablebody = false;

  ground = platforms.create(0, game.world.height - 64, 'ground');
  ledge1 = platforms.create(400, 400, 'ground');
  ledge2 = platforms.create(-150, 250, 'ground');
  ledge3 = platforms.create(20, game.world.height - 105, 'ground');

  game.physics.arcade.enable(ground);
  game.physics.arcade.enable(ledge1);
  game.physics.arcade.enable(ledge2);
  game.physics.arcade.enable(ledge3);

  ground.scale.setTo(2, 2);
  ledge3.scale.setTo(0.1, 5);
  ledge3.position.y = game.world.height - ground.height;
  ground.body.immovable = true;
  ledge1.body.immovable = true;
  ledge2.body.immovable = true;
  ledge3.body.immovable = true;

  player = game.add.sprite(32, game.world.height - 150, 'dude');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.3;
  player.body.gravity.y = 500;
  player.body.collideWorldBounds = true;
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
    player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 4;
  }

  if (cursors.up.isDown && (player.body.touching.down || player.body.touching.left)) {
    player.body.velocity.y = -150;
    console.log(player.body.touching.left);
  }
}
