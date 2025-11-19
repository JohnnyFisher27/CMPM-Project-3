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

        scene.physics.add.overlap(this, player,
            () => {
                this.scene.scene.stop();
                this.scene.scene.start("GameOver");
            }
        );
    }
}