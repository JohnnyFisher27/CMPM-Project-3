
export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    /*init(data) {
        this.highscore = data.highscore;
    }*/

    preload() {
        this.load.image('playersmirk', 'assets/player_smirk.png')
    }

    create() {
        this.add.text(375, 50, 'YOU WIN', { fontSize: '128px', fill: '#FFF', align: "center" });
        //this.add.text(350, 340, 'High Score: ' + this.highscore, { fontSize: '78px', fill: '#FFF', align: "center" });
        this.add.text(375, 600, 'Press R to restart', { fontSize: '50px', fill: '#FFF', align: "center" });
        var smirk = this.add.image(660, 370, 'playersmirk');
        smirk.setScale(0.25);
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
