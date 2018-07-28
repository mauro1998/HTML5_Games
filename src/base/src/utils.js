/**
 * Capitalize strings
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Easily update values of given properties of an object,
 * for instance, to update an object's position, scaling and alpha:
 *    updatePropValues(obj, {
 *      position: [100, 20],
 *      scale: 0.8,
 *      alpha: 0.5,
 *    });
 * Is the same as:
 *    obj.setPosition(100, 20);
 *    obj.setScale(0.8);
 *    obj.setAlpha(0.5);
 */
export function updatePropValues(obj, props) {
  const PROPS = [
    'alpha',
    'angle',
    'position',
    'origin',
    'scale',
    'visible',
  ];

  Object.keys(props).filter(key => PROPS.indexOf(key) !== -1)
    .forEach((key) => {
      const method = `set${capitalize(key)}`;
      const args = props[key];
      if (Array.isArray(args)) obj[method](...args);
      else obj[method](args);
    });
}
