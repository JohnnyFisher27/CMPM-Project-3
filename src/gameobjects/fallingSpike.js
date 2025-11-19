import {Collider} from "./collider.js";

export class FallingSpike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        colliderData, 
        which,
        player,
        enablePhysics = true,
        addToScene = true,
        name,
    }) 
    
    {
        super(scene, x, y, 'fallingSpike');
        this.setOrigin(0, 1);
        this.setName(name || 'fallingSpike');

        this.initialY = y; 
        this.delayEvent = null; 
        this.colliderObject = null;
        this.overlapHandler = null; 

        if (addToScene) {
            scene.add.existing(this);
        }

        if (colliderData) {
            const collider = new Collider({
                scene, 
                x: colliderData.x, 
                y: colliderData.y 
            });
            this.colliderObject = collider; 

            const spikeRef = this; 

            this.overlapHandler = scene.physics.add.overlap(collider, player,
                () => {
                    if (!spikeRef.body.allowGravity) {
                        spikeRef.body.setAllowGravity(true);
                        spikeRef.body.setGravityY(1150);
                        
                        spikeRef.delayEvent = scene.time.delayedCall(5000, () => {
                            if (spikeRef.scene && spikeRef.body) {
                                spikeRef.body.setAllowGravity(false);
                                spikeRef.body.setAcceleration(0, 0);
                                spikeRef.body.setVelocity(0, 0);
                                
                                spikeRef.setY(spikeRef.initialY); 
                                spikeRef.body.enable = false;
                                spikeRef.setVisible(false);
                            }
                            spikeRef.delayEvent = null;
                        });
                    }
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

        if (this.delayEvent) {
            this.delayEvent.remove(false);
            this.delayEvent = null;
        }

        super.destroy(fromScene);
    }
}