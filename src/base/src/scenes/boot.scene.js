/**
 * BootScene:
 * Preloads all the assets defined in "app/src/assets.js"
 * and displays a progress bar while preloading is in progress.
 * Starts SetupScene when finished.
 */

import {
  images,
  spritesheets,
  audios,
} from '../assets';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  createProgressBar() {
    this.progress = this.add.graphics();
  }

  fillProgressBar(value) {
    const { width, height } = this.sys.game.config;
    const barWidth = width * 0.5;
    const barHeight = 10;
    const x = (width / 2) - (barWidth / 2);
    const y = (height / 2) - (barHeight / 2);
    const radius = 10;

    this.progress.clear();
    this.progress.fillStyle(0xCCCCCC, 1);
    this.progress.fillRoundedRect(x, y, barWidth, barHeight, radius);
    this.progress.fillStyle(0xFFFFFF, 1);
    this.progress.fillRoundedRect(x, y, barWidth * value, barHeight, radius);
  }

  startGame() {
    this.progress.destroy();
    this.scene.start('SetupScene');
  }

  loadImages(assets = []) {
    assets.forEach((asset) => {
      const { name, src } = asset;
      this.load.image(name, src);
    });
  }

  loadSpritesheets(assets = []) {
    assets.forEach((asset) => {
      const { name, src, width, height } = asset;
      this.load.spritesheet(name, src, {
        frameWidth: width,
        frameHeight: height,
      });
    });
  }

  loadAudios(assets = []) {
    assets.forEach((asset) => {
      const { name, src } = asset;
      this.load.audio(name, src);
    });
  }

  preload() {
    this.createProgressBar();
    this.loadImages(images);
    this.loadSpritesheets(spritesheets);
    this.loadAudios(audios);
    this.load.on('progress', this.fillProgressBar.bind(this));
    this.load.on('complete', this.startGame.bind(this));
  }
}
