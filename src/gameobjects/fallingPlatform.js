
export class FallingPlatform extends Phaser.GameObjects.Sprite {
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
        super(scene, x, y, asset);
        this.setOrigin(0, 1);
        this.setName(name || 'fallingPlatform');

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
        }

        scene.physics.add.collider(this, player,
            () => {
                if (player.body.blocked.down) {
                    /*scene.tweens.add({        //turned off the shake before drop, it wasn't working correctly
                        targets: this,
                        yoyo: true,
                        repeat: 10,
                        x: {
                            from: x,
                            to: x + 2 * 1,
                        },
                        ease: 'Linear',
                        duration: 50,
                        onComplete: () => {*/
                            scene.tweens.add({
                                targets: this,
                                alpha: 0,
                                y: "+=25",
                                ease: 'Linear',
                                duration: 100,
                                onComplete: () => {
                                    this.destroy();
                                }
                            });
                        /*}
                    });*/
                }
            }
        );
        
        /*scene.physics.add.overlap(this, player,
            () => {
                this.destroy();
            }
        );*/
    }
}