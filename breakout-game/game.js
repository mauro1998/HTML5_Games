(() => {
  const state = { preload, create, update };
  const game = new Phaser.Game(480, 320, Phaser.AUTO, null, state, false, true);
  const obj = {};
  const assets = [
    { name: 'start', src: 'img/start.png' },
    { name: 'ball', src: 'img/ball.png' },
    { name: 'paddle', src: 'img/paddle.png' },
    { name: 'brick', src: 'img/brick.png' },
    { name: 'wobble', src: 'img/wobble.png' },
  ];

  // Game variables:
  let score = 0;
  let lives = 3;

  function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';

    assets.forEach((asset) => {
      const { name, src } = asset;
      game.load.image(name, src);
    });
  }

  function createBall() {
    const ball = game.add.sprite(game.world.centerX, 290, 'ball');
    ball._initialX = ball.x;
    ball._initialY = ball.y;
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.anchor.set(0.5);
    ball.body.velocity.set(200, -200);
    ball.body.collideWorldBounds = true;
    ball.body.collideWorldBoundBottom = false;
    ball.checkWorldBounds = true;
    ball.body.bounce.set(1);
    return ball;
  }

  function createPaddle() {
    const paddle = game.add.sprite(game.world.centerX, 305, 'paddle');
    paddle._initialX = paddle.x;
    paddle._initialY = paddle.y;
    paddle.anchor.set(0.5, 0);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
    return paddle;
  }

  function createBricks() {
    const bricks = game.add.group();
    const rows = 2;
    const columns = 2;
    const paddingX = 20;
    const paddingY = 10;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const brick = game.add.sprite(0, 0, 'brick');
        const x = (brick.width + paddingX) * i;
        const y = (brick.height + paddingY) * j;
        brick.position.set(x, y);

        game.physics.enable(brick, Phaser.Physics.ARCADE);
        brick.body.immovable = true;
        bricks.add(brick);
      }
    }

    bricks.position.set(game.world.centerX, paddingY * 4);
    bricks.pivot.set(bricks.width / 2, 0);
    return bricks;
  }

  function createGameScoreText() {
    const scoreText = game.add.text(10, 10, `Score: ${score}`, {
      font: 'Arial',
      fontSize: 16,
    });

    return scoreText;
  }

  function createLivesText() {
    const livesText = game.add.text(game.width - 10, 10, `Lives: ${lives}`, {
      font: 'Arial',
      fontSize: 16,
    });

    livesText.anchor.set(1, 0);
    return livesText;
  }

  function createLifeLostText() {
    const { centerX, centerY } = game.world;
    const txt = 'Live lost, click to continue';
    const livesText = game.add.text(centerX, centerY, txt, {
      font: 'Arial',
      fontSize: 16,
    });

    livesText.anchor.set(0.5, 0.5);
    livesText.visible = false;
    return livesText;
  }

  function onBallHitsBrick(ball, brick) {
    score += 10;
    obj.score.setText(`Score: ${score}`);
    brick.kill();

    const allBricksKilled = obj.bricks.children.every(child => !child.alive);

    if (allBricksKilled) {
      setTimeout(() => {
        alert(`CONGRATULATIONS, YOU WON!\nYou have scored ${score} points`);
        location.reload();
      }, 300);
    }
  }

  function onBallOutOfBounds() {
    lives -= 1;

    if (lives) {
      obj.lives.setText(`Lives: ${lives}`);
      obj.lifeLost.visible = true;
      obj.ball.reset(obj.ball._initialX, obj.ball._initialY);
      obj.paddle.reset(obj.paddle._initialX, obj.paddle._initialY);
      game.input.onDown.addOnce(() => {
        obj.lifeLost.visible = false;
        obj.ball.body.velocity.set(200, -200);
      });
    } else {
      alert(`GAME OVER\nYou scored ${score} points.`);
      location.reload();
    }
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;

    obj.ball = createBall();
    obj.paddle = createPaddle();
    obj.bricks = createBricks();
    obj.score = createGameScoreText();
    obj.lives = createLivesText();
    obj.lifeLost = createLifeLostText();

    obj.ball.events.onOutOfBounds.add(onBallOutOfBounds);
  }

  function update() {
    game.physics.arcade.collide(obj.ball, obj.paddle);
    game.physics.arcade.collide(obj.ball, obj.bricks, onBallHitsBrick);
    obj.paddle.x = game.input.x || obj.paddle._initialX;
  }
})();

