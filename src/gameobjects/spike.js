import { GameOver } from "../scenes/GameOver.js";
export class Spike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        player,
        angle,
        enablePhysics = true,
        addToScene = true,
        name,
    }) 
    
    {
        super(scene, x, y, 'spike');
        this.setOrigin(0, 1);
        this.setName(name || 'spike');
        this.angle = angle;

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
        }

        if (angle == -90) {
            this.body.setOffset(-12, 0);
        }
        if (angle == 90) {
            this.body.setOffset(-3, 16);
        }
        if (angle == 180 || angle == -180) {
            this.body.setOffset(-16, 12);
        }
        if (angle == 0) {
            this.body.setOffset(0, 4);
        }

        /*scene.physics.add.overlap(this, player,
            () => {
                scene.destroyPlayer();
                scene.createPlayer();
            }
        );*/
    }
}