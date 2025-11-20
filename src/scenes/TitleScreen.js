export class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen'); // Unique key for the scene
    }

    preload() {

    }
    create() {
        this.add.text(650, 100, 'Spooky Jump', { 
            fontSize: '96px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        this.add.text(650, 550, 'Press Space to start!', { 
            fontSize: '48px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        this.add.text(650, 200, 'Collect all monsters and gem candy to win.', { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Start');
        });
    }

}