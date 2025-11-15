
export class Candy extends Phaser.GameObjects.Sprite {
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
        super(scene, x, y, 'candy');
        this.setOrigin(0, 1);
        this.setName(name || 'candy');

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
        }
        
        scene.physics.add.overlap(this, player, //not sure if this works inside the constructor or even inside the file
            () => {                                 //if not we can move this to a preupdate or to the start file
                this.destroy();
            }
        );

        scene.tweens.add({           //have not tested this yet, hope it moves up and down nicely
            targets: this,     //so the player knows to interact with it
            duration: 500,
            loop: -1,
            yoyo: true,
            hold: 100,
            y: "+=5"
        });
    }
}