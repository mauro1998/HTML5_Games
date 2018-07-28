/**
 * SetupScene:
 * This class is intended to load/create things just once.
 * Perfect to create animations, repeated sounds, etc, that only need to be created once.
 * In this sample code we load all the animations from a json file
 * and start playing a background music.
 * Starts LevelScene when finished (the actual game).
 */

export default class SetupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SetupScene' });
  }

  preload() {
    this.load.json('animations', 'assets/data/animations.json');
  }

  addBgMusic() {
    this._music = this.sound.add('sfx:bg');
    this._music.play({
      loop: true,
      volume: 0.3,
    });
  }

  addAnimations() {
    const anims = this.cache.json.get('animations');
    anims.forEach(({ animations }) => {
      animations.forEach(options => this.anims.create(options));
    });
  }

  create() {
    this.addBgMusic();
    this.addAnimations();
    this.scene.start('LevelScene');
  }
}
