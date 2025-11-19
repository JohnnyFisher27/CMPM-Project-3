import { Start } from '../scenes/Start.js';

export class UI extends Phaser.Scene {
    constructor() {
        super('UI');
    }

    preload() {
        this.load.image('candy', 'assets/Tiles/Default/tile_0102.png');
        this.load.image('monster', 'assets/Tiles/Default/tile_0340.png');
        this.load.image('gun', 'assets/Player_Tiles/tile_0050.png');


    }

    create() {
        this.gun1 = this.add.image(0, 690, 'gun').setOrigin(0);
        this.gun1.setScale(2.5);
        this.gun2 = this.add.image(30, 690, 'gun').setOrigin(0);
        this.gun2.setScale(2.5);
        this.gun3 = this.add.image(60, 690, 'gun').setOrigin(0);
        this.gun3.setScale(2.5);

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
            gameScene.events.on('updateBullets', this.updateBulletDisplay, this);
        }
    }

    updateCandyDisplay(count) {
        this.candyText.setText(`:${count}`);
    }

    updateMonsterDisplay(count) {
        this.monsterText.setText(`:${count}`);
    }
    
    updateBulletDisplay(count) {
        this.gun1.destroy();
        this.gun2.destroy();
        this.gun3.destroy();
        if (count == 3) {
            this.gun1 = this.add.image(0, 690, 'gun').setOrigin(0);
            this.gun1.setScale(2.5);
            this.gun2 = this.add.image(30, 690, 'gun').setOrigin(0);
            this.gun2.setScale(2.5);
            this.gun3 = this.add.image(60, 690, 'gun').setOrigin(0);
            this.gun3.setScale(2.5);
        }
        else if (count == 2) {
            this.gun1 = this.add.image(0, 690, 'gun').setOrigin(0);
            this.gun1.setScale(2.5);
            this.gun2 = this.add.image(30, 690, 'gun').setOrigin(0);
            this.gun2.setScale(2.5);
        }
        else if (count == 1) {
            this.gun1 = this.add.image(0, 690, 'gun').setOrigin(0);
            this.gun1.setScale(2.5);
        }

    }

}   