/**
 * Hero:
 * Our main character Hero.
 *
 * In this sample code, our hero not only can move or jump,
 * but do some more other specific stuff as our main character,
 * like define how to move/jump (with user inputs),
 * or show an animation for a given state.
 */

import Character from './character.sprite';

export default class Hero extends Character {
  constructor(...args) {
    super(...args);
    this.setupSounds();
    this.setupInput();
    this.anims.play(this.getAnimationName());
  }

  setupSounds() {
    this._sounds = {};
    this._sounds.jump = this.scene.sound.add('sfx:jump', { volume: 0.02 });
  }

  setupInput() {
    this._keys = this.scene.input.keyboard.addKeys({
      LEFT: Phaser.Input.Keyboard.KeyCodes.A,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.scene.input.keyboard.on('keydown_W', () => {
      this.jump();
      this._sounds.jump.play();
    });
  }

  getAnimationName() {
    let name;

    if (!this.alive) name = 'die';
    else if (!this.body.touching.down) {
      if (this.body.velocity.y < 0) name = 'jump';
      else name = 'stomp';
    } else if (this.body.velocity.x !== 0) name = 'run';
    else name = 'turn';

    return name;
  }

  checkUserInput() {
    if (this._keys.LEFT.isDown) this.move(-1);
    else if (this._keys.RIGHT.isDown) this.move(1);
    else this.move(0);
  }

  updateAnimations() {
    const name = this.getAnimationName();

    if (name !== this.anims.currentAnim.key) {
      this.anims.play(name);
    }
  }

  update() {
    if (!this.active) return;
    this.checkUserInput();
    this.updateAnimations();
  }
}
