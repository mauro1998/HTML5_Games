/**
 * Main file:
 * Loads dependencies and starts our game.
 */

// Dependencies:
import '../style.css';
import 'phaser';

// Game Config:
import config from './config';

// Game Scenes:
import BootScene from './scenes/boot.scene';
import SetupScene from './scenes/setup.scene';
import LevelScene from './scenes/level.scene';

config.scene = [
  BootScene,
  SetupScene,
  LevelScene,
];

// Start game:
(() => {
  const game = new Phaser.Game(config);
  game.scene.start('BootScene');
})();
