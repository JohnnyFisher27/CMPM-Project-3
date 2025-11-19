import { Start } from '../scenes/Start.js';

export class UI extends Phaser.Scene {
    constructor() {
        super('UI');
    }

    preload() {
        this.load.image('candy', 'assets/Tiles/Default/tile_0102.png');
        this.load.image('monster', 'assets/Tiles/Default/tile_0340.png');

    }

    create() {
        var candy = this.add.image(0, 0, 'candy').setOrigin(0);
        candy.setScale(1.5);
        
        this.candyText = this.add.text(20, 0, ':0', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setOrigin(0);

        var monster = this.add.image(0, 20, 'monster').setOrigin(0);
        monster.setScale(1.5);
        
        this.monsterText = this.add.text(20, 23, ':0', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setOrigin(0);

        let gameScene = this.scene.get('Start');
        if (gameScene) {
            gameScene.events.on('updateCandy', this.updateCandyDisplay, this);
            gameScene.events.on('updateMonster', this.updateMonsterDisplay, this);

        }
    }

    updateCandyDisplay(count) {
        this.candyText.setText(`:${count}`);
    }

    updateMonsterDisplay(count) {
        this.monsterText.setText(`:${count}`);
    }

    shutdown() {
        let gameScene = this.scene.get('Start');
        if (gameScene) {
            console.log("shutdown")
            gameScene.events.off('updateCandy', this.updateCandyDisplay, this);
        }
    }
}   