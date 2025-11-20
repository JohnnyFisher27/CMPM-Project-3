
export class MovingPlatform extends Phaser.GameObjects.Sprite {
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
        super(scene, x, y, 'movingPlatform');
        this.setOrigin(0, 1);
        this.setName(name || 'movingPlatform');

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            this.body.setVelocity(100, -100);
        }

        scene.tweens.add({
            targets: this,
            duration: 5000,
            loop: -1,
            yoyo: true,
            hold: 2000,
            x: "+=100"
        });
    }
}