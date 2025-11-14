
export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    /*init(data) {
        this.highscore = data.highscore;
    }*/

    preload() {
        
    }

    create() {
        this.add.text(290, 220, 'GAME OVER.', { fontSize: '128px', fill: '#FFF', align: "center" });
        //this.add.text(350, 340, 'High Score: ' + this.highscore, { fontSize: '78px', fill: '#FFF', align: "center" });
        this.add.text(395, 460, 'Press R to restart', { fontSize: '50px', fill: '#FFF', align: "center" });

        this.r = this.input.keyboard.addKey("R", false, true);
    }

    update(time) {
        if (this.r.isDown)
        {
            this.scene.stop('GameOver');
            this.scene.start("Start"/*, {high_score: this.highscore}*/);
        }
    }

}
