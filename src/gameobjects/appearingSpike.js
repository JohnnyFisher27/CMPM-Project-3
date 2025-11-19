import {Collider} from "./collider.js";

export class AppearingSpike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        colliderData, 
        which,
        player,
        angle,
        enablePhysics = true,
        addToScene = true,
        name,
    }) 
    
    {
        super(scene, x, y, 'spike');
        this.setOrigin(0, 1);
        this.setName(name || 'appearingSpike');
        this.angle = angle;

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
            this.setVisible(false);
            this.body.enable = false;
        }

        this.colliderObject = null; 
        this.overlapHandler = null; 

        if (colliderData) {
            const collider = new Collider({
                scene, 
                x: colliderData.x,
                y: colliderData.y 
            });
            
            this.colliderObject = collider; 
            
            this.overlapHandler = scene.physics.add.overlap(collider, player,
                () => {
                    this.body.enable = true;
                    this.setVisible(true);
                }
            );
        }
    }

    destroy(fromScene) {
        if (this.overlapHandler) {
            this.scene.physics.world.removeCollider(this.overlapHandler);
            this.overlapHandler = null;
        }

        if (this.colliderObject) {
            this.colliderObject.destroy();
            this.colliderObject = null;
        }

        super.destroy(fromScene);
    }
}