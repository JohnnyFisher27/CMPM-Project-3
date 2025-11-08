//do work here when you can't on start
//testing testing

//maybe we should make a group for all the platform types

//moving platform

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