
class Collider extends GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        asset = 'collider',                //I have not loaded the asset, this is just here for looks
        enablePhysics = true,
        addToScene = true,
        frame,
        name,
    }) 
    
    {
        super(scene, x, y, asset, frame);
        this.setOrigin(0, 1);
        this.setName(name || asset);

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            this.setVisible(false);
        }
    }
}