
export class Checkpoint extends Phaser.GameObjects.Sprite {
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
        super(scene, x, y, 'checkpoint');
        this.setOrigin(0, 1);
        this.setName(name || 'checkpoint');

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
        }
        
        /*scene.physics.add.overlap(this, player, //not sure if this works inside the constructor or even inside the file
            () => {           
                       //if not we can move this to a preupdate or to the start file
                this.destroy();
                scene.checkpoint = true;
                scene.player_x = x;
                scene.player_y = y;
            }
        );*/

        scene.tweens.add({
            targets: this,
            duration: 500,
            loop: -1,
            yoyo: true,
            hold: 100,
            y: "+=5"
        });
    }

}