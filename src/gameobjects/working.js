//do work here when you can't on start
//testing testing

//maybe we should make a group for all the platform types

//moving platform

//Make falling spikes, platforms that appear when touched (what this one mean??), spikes that kill player, make appearing spikes

var moving_plat = this.physics.add.image(100, 500, '')
    .setImmovable(true)
    .setVelocity(100, -100);

moving_plat.body.setAllowGravity(false);
this.physics.add.collider(moving_plat, player);

this.tweens.add({           //have not tested this so see if it moves back and forth
    targets: moving_plat,
    duration: 5000,
    loop: -1,
    yoyo: true,
    hold: 2000,
    x: 500
})

function collide (moving_plat, player) {        //gets the player to stick to the moving platform
  if (moving_plat.body.moves && moving_plat.body.touching.up && player.body.touching.down) {
    player.setGravityY(10000);
  }
}                                               //still need to implement unsticking the player like when they move or jump
                                                //unless it works as is already idk I'm not testing it from here




//falling platform

var falling_plat = this.physics.add.image(400, 500, '')
    .setImmovable(true);

falling_plat.body.setAllowGravity(false);
this.physics.add.collider(falling_plat, player);

if (player.body.blocked.down) {                 //have not tested yet so chill
    this.tweens.add({
          targets: falling_plat,
          yoyo: true,
          repeat: 10,
          x: {
              from: falling_plat.x,
              to: falling_plat.x + 2 * 1,
          },
          ease: 'Linear',
          duration: 50,
          onComplete: function() {
              destroyPlatform.call(this.scene, falling_plat);
          }
      });
}

function destroyPlatform(falling_plat) {
  this.tweens.add({
      targets: falling_plat,
      alpha: 0,
      y: "+=25",
      ease: 'Linear',
      duration: 100,
      onComplete: function() {
          falling_plat.destroy();
      }
  });
}



//falling spikes

const dataLayer = map.getObjectLayer('data');           //this would go in the create section in the start.js file
dataLayer.objects.forEach((data) => {                   //this requires the spikes + colliders to be on an object layer in tiled
    const { x, y, name, height, width } = data;         //we should probably make our platforms an object layer too

    if (name === 'spike') {
        const spike = new Spike({scene: this, x, y});
        const customCollider = new Collider({scene: this, x, y});   //somehow grab the locations of the colliders on tiles and input into here
        const { y: spikeY } = spike;

        const collider = this.physics.add.overlap(customCollider, this.player,
            () => {
                if (!spike.body.allowGravity) {
                    spike.body.setAllowGravity(true);
                    this.time.delayedCall(2000, () => {
                        spike.body.setAllowGravity(false);

                        spike.body.setAcceleration(0, 0);
                        spike.body.setVelocity(0, 0);
                        spike.setY(spikeY);
                    });
                }
            }
        );

        this.physics.add.overlap(spike,this.player,
            () => {
                //what happens when spike hits player
            }
        );
    }
});



//appearing spikes will probably have like the same code as falling spikes with the collider stuff and all
//the only difference is what happens when the player collides with the collider (spikes appear instead of fall)
//im assuming these would have to be on a different object layer cause these collisions are specific to appearing spikes not falling spikes