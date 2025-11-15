import {Collider} from "./collider.js";

export class FallingSpike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        dataLayer,
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

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setAllowGravity(false);
            this.body.setImmovable(true);
        }

        dataLayer.objects.forEach((data) => {                           //dont know if this is the right place to put this
            const { x, y, name, height, width } = data;         

            if (name === 'collider') {
                if (data.properties[0].name === which) {                //hopefully this if statement is set up right and the variables work
                    const collider = new Collider({scene, x, y});
                    const { y: spikeY } = this.y;                            //not sure what this line is for yet until we can test it
                    scene.physics.add.overlap(collider, player,
                        () => {
                            if (!this.body.allowGravity) {
                                this.body.setAllowGravity(true);
                                this.body.setGravityY(1200);
                                scene.time.delayedCall(5000, () => {
                                    this.body.setAllowGravity(false);

                                    this.body.setAcceleration(0, 0);
                                    this.body.setVelocity(0, 0);
                                    this.setY(spikeY);                  //places the spike offscreen, should move it more off screen though
                                                                        //maybe add a crashing sound into the ground
                                    this.setActive(false);
                                    this.setVisible(false);
                                });
                            }
                        }
                    );

                    scene.physics.add.overlap(this.body, player,
                        () => {
                            //what happens when spike hits player
                        }
                    );
                }
            }

        });
    }
}