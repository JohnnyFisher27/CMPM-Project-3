import {Collider} from "./collider.js";

export class AppearingSpike extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        dataLayer,
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
            this.setActive(false);
            this.setVisible(false);
        }

        dataLayer.objects.forEach((data) => {
            const { x, y, name, height, width } = data;         

            if (name === 'collider') {
                if (data.properties[0].name === which) {
                    const collider = new Collider({scene, x, y});
                    scene.physics.add.overlap(collider, player,
                        () => {
                            this.setActive(true);
                            this.setVisible(true);
                        }
                    );

                    /*scene.physics.add.overlap(this.body, player,
                        () => {
                            //what happens when spike hits player
                        }
                    );*/
                }
            }

        });
    }
}