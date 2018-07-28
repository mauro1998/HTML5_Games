/**
 * Character:
 * Base class containing common properties and methods for characters.
 *
 * In this sample code, for instance, our main character can move and jump,
 * enemies might do so as well.
 */

import BaseSprite from './base.sprite';

export default class Character extends BaseSprite {
  constructor(...args) {
    super(...args);
    this.alive = true;
    this._frozen = false;
    this.body.allowGravity = true;
    this.body.setCollideWorldBounds(true);
  }

  move(direction) {
    if (!this.alive || this._frozen) return;
    const velocity = direction * (this.MOVE_SPEED || 200);
    this.body.velocity.x = velocity;
    this.setFlipX(velocity < 0);
  }

  jump() {
    this.body.velocity.y = (this.JUMP_SPEED || -400);
  }

  freeze() {
    this.move(0);
    this.body.enable = false;
    this._frozen = true;
  }
}
