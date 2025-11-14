
export class Monster extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        player,
        enablePhysics = true,
        addToScene = true,
        name,
    }) 
    
    {
        super(scene, x, y, player, 'monster');
        this.setOrigin(0, 1);
        this.setName(name || 'monster');

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
        }

        scene.physics.add.overlap(this.body, player,
            () => {
                this.destroy();
            }
        );

        scene.tweens.add({           //have not tested this yet, hope it moves up and down nicely
            targets: this.body,     //so the player knows to interact with it
            duration: 5000,
            loop: -1,
            yoyo: true,
            hold: 500,
            x: 50
        });
    }
}