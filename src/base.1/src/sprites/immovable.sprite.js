/**
 * Immovable:
 * Use this class if you need to create sprites that won't be affected by
 * other objects when colliding (it won't move nor fall down because of gravity).
 */

import BaseSprite from './base.sprite';

export default class Immovable extends BaseSprite {
  constructor(...args) {
    super(...args);
    this.body.allowGravity = false;
    this.body.immovable = true;
  }
}
