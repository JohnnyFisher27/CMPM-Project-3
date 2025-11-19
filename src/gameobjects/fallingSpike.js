import {Collider} from "./collider.js";

export class FallingSpike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        colliderDataArray, 
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
        this.overlapHandlers = []; 
        this.colliders = []; 

        if (addToScene) {
            scene.add.existing(this);
        }

        if (colliderDataArray) {
            colliderDataArray.forEach((data) => {
                
                const collider = new Collider({scene, x: data.x, y: data.y});
                this.colliders.push(collider); 

                const spikeRef = this; 

                const handler = scene.physics.add.overlap(collider, player,
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

        if (this.delayEvent) {
            this.delayEvent.remove(false);
            this.delayEvent = null;
        }

        super.destroy(fromScene);
    }
}