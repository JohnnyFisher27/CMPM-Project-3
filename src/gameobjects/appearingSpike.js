import {Collider} from "./collider.js";

export class AppearingSpike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        colliderDataArray, 
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

        if (angle == -90) {
            this.body.setOffset(-12, 0);
        }
        if (angle == 90) {
            this.body.setOffset(-3, 16);
        }
        if (angle == 180 || angle == -180) {
            this.body.setOffset(-16, 12);
        }
        if (angle == 0) {
            this.body.setOffset(0, 4);
        }

        this.overlapHandlers = [];
        this.colliders = [];

        if (colliderDataArray) {
            colliderDataArray.forEach((data) => {
                
                const collider = new Collider({scene, x: data.x, y: data.y});
                this.colliders.push(collider); 
                
                const handler = scene.physics.add.overlap(collider, player,
                    () => {
                        this.body.enable = true;
                        this.setVisible(true);
                    }
                );
                this.overlapHandlers.push(handler);
            });
        }
    }

    destroy(fromScene) {
        this.overlapHandlers.forEach(handler => {
            this.scene.physics.world.removeCollider(handler);
        });
        this.overlapHandlers = [];
        
        this.colliders.forEach(collider => {
            collider.destroy();
        });
        this.colliders = [];

        super.destroy(fromScene);
    }
}