
export class Spike extends Phaser.GameObjects.Sprite {
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
        super(scene, x, y, player, 'spike');
        this.setOrigin(0, 1);
        this.setName(name || 'spike');

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
                //hurt or kill player
            }
        );
    }
}