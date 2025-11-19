
export class AppearingPlatform extends Phaser.GameObjects.Sprite {
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
        super(scene, x, y, 'appearingPlatform');
        this.setOrigin(0, 1);
        this.setName(name || 'appearingPlatform');

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            this.setVisible(false);
        }


        /*scene.physics.add.overlap(this, player,
            () => {
                if (this.body.touching.up && player.body.touching.down) {
                    scene.physics.add.collider(this, player);
                    this.setVisible(true);
                }
            }
        );*/
    }
}