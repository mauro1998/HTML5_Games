/**
 * BaseSprite:
 * Sprites are the core of interactions.
 * The purpose of this BaseSprite is:
 * - To set its very first configuration (initial position, scale, origin, alpha, etc)
 * - To render itself into the given scene.
 * - To enable its physics (Arcade Physics by default).
 *
 * Any sprites created from now on should ideally inherit from this class.
 * Make any changes/additions you need here but try to keep it as simple as possible.
 */

import { updatePropValues } from '../utils';

export default class BaseSprite extends Phaser.GameObjects.Sprite {
  constructor(...args) {
    super(...args.slice(0, 4));
    updatePropValues(this, args.pop());
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }
}
