/**
 * LevelScene:
 * This is the main scene, contains the game logic by creating configurable "Levels".
 * Levels are just json files loaded from the server,
 * the json files describe how elements (images, text, sprites, etc)
 * and its properties (positions, scales, origins, etc)
 * will be drawn on to the current running scene.
 *
 * In this code sample, once a level is finished (by entering the door)
 * next level is loaded (by restarting the scene) with a different configuration
 * until MAX_LEVEL is reached, in which case the game starts from first level again.
 */

import * as SpriteClasses from '../sprites';
import { updatePropValues } from '../utils';

const MAX_LEVEL = 2;

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
    this._obj = {}; // To store references of sprites by name
  }

  init({ level }) {
    const lvl = level || 1;
    this.data.set('lvl', lvl);
    this.registry.set('level', `level${lvl}`);
  }

  preload() {
    const level = this.registry.get('level');
    const url = `assets/data/${level}.json`;
    this.load.json(level, url);
  }

  createImages() {
    const images = this.data.get('images');
    images.forEach((props) => {
      const { key, name } = props;
      const image = this.add.image(0, 0, key);
      updatePropValues(image, props);
      this._obj[name] = image;
    });
  }

  createSprite(options) {
    const { key, class: className } = options;
    const CustomSprite = SpriteClasses[className];
    const sprite = new CustomSprite(this, 0, 0, key, options);
    return sprite;
  }

  createSprites() {
    const sprites = this.data.get('sprites');
    sprites.forEach((props) => {
      const { type, name } = props;

      switch (type) {
        case 'group':
          this._obj[name] = this.add.group();
          props.elements.forEach((element) => {
            const child = this.createSprite(element);
            this._obj[name].add(child);
          });
          break;
        case 'sprite':
          this._obj[name] = this.createSprite(props);
          break;
        default: break;
      }
    });
  }

  setLevelData() {
    const data = this.cache.json.get(this.registry.get('level'));
    Object.keys(data).forEach((key) => {
      this.data.set(key, data[key]);
    });
  }

  createText() {
    this.add.text(10, 10, `Level ${this.data.get('lvl')}`, {
      fontSize: 20,
      color: '#6E7680',
    });
  }

  create() {
    this.setLevelData();
    this.createImages();
    this.createText();
    this.createSprites();
    this.handleCollisions();
    this.cameras.main.flash(500, 238, 238, 238);
  }

  onHeroOverlapDoor(hero, door) {
    hero.freeze();
    door.anims.play('open');
    door.on('animationcomplete', () => {
      this.tweens.add({
        targets: hero,
        duration: 500,
        ease: Phaser.Math.Easing.Circular.InOut,
        x: door.x,
        y: door.y,
        onComplete: this.finish.bind(this),
      });
    });
  }

  handleCollisions() {
    this.physics.add.collider(this._obj.hero, this._obj.platforms);
    this.physics.add.overlap(this._obj.hero, this._obj.door, this.onHeroOverlapDoor, null, this);
  }

  update() {
    this._obj.hero.update();
  }

  finish() {
    const num = Number(this.registry.get('level').match(/\d+/g).pop());
    const lvl = num < MAX_LEVEL ? num + 1 : num - 1;
    this.cameras.main.fade(500, 238, 238, 238, false, (_, progress) => {
      if (progress === 1) {
        this.scene.stop();
        this.scene.restart({ level: lvl });
      }
    });
  }
}
