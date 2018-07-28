/**
 * Linter ESLint rules.
 * Uses a modified version of Airbnb's Javascript Style Guide (https://github.com/airbnb/javascript).
 */

module.exports = {
  extends: 'airbnb-base',
  rules: {
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 4 },
      ObjectPattern: { multiline: false },
      ImportDeclaration: { multiline: true, minProperties: 3 },
      ExportDeclaration: { multiline: true, minProperties: 3 }
    }]
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Phaser: false
  }
};
