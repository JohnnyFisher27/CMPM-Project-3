import { Start } from './scenes/Start.js';
import { GameOver } from './scenes/GameOver.js';
import { TitleScreen } from './scenes/TitleScreen.js';
import { UI } from './scenes/UI.js';

const config = {
    type: Phaser.AUTO,
    title: 'WFC Map',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
             gravity: {
              x: 0,
              y: 25           
          },
          debug: false
        }
    },
    scene: [
        TitleScreen, Start, UI, GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            