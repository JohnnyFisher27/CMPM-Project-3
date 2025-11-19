
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