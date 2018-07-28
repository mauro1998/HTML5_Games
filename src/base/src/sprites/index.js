/**
 * Easily expose your sprite classes here.
 * Create new sprite types and always remember to add them here
 * in order to make it accesible from the scene classes.
 * Also remember to keep the naming convention "name.sprite.js" or "large-name.sprite.js"
 * when creating a new file for a sprite class (same for scenes).
 *
 * In this sample code we expose our main character "Hero"
 * and an "Immovable" class (like the door and the platforms).
 */

import Hero from './hero.sprite';
import Immovable from './immovable.sprite';

export {
  Hero,
  Immovable,
};
