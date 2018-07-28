// Game render config:
const config = {
  parent: 'container',
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  antialias: true,
  transparent: true,
  roundPixels: true,
  backgroundColor: '#EEE',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1200 } },
  },
};

export default config;
