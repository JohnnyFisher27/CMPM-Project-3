
export class FallingPlatform extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        asset,
        player,
        enablePhysics = true,
        addToScene = true,
        name,
    }) 
    
    {
        super(scene, x, y, asset);
        this.setOrigin(0, 1);
        this.setName(name || 'fallingPlatform');

        this.currentTween = null; 

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            
        }

    }
    
    destroy(fromScene) {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween.remove();
            this.currentTween = null;
        }

        super.destroy(fromScene);
    }

}