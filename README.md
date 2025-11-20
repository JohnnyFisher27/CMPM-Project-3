Controls
‘A’ moves the player to the left, ‘D’ moves the player to the right, and ‘SPACE’ makes the player jump. ‘SPACE’ again while airborne makes the player do another jump (aka the double jump).

Camera
The camera follows the player in the center of the screen with a little offset so that the camera is actually positioned a bit above the player. There is also a deadzone box of 100 by 100.

Which student created which level, and what is each level's unique mechanic?
The player starts in the central hub with the name of the game in the air. The ‘level’ to the left is Johnny’s level that utilizes appearing/falling platforms to trick the player. The ‘level’ to the right is Alina’s level that utilizes appearing/falling spikes to trick the player.

How the teaching team can select which level to play (is there a menu? a secret key we can press to switch between levels?)
Because the player can choose either to go left or right, they can do any level they want in the order they want to. We have also added a god mode button in the hub that the graders can press with their mouse to turn off the killing feature on the spikes and give the player infinite double jumps.

Which bonus elements you included and how; you will not get points for bonus elements that are not listed in your readme, even if you implemented them!
Juicy juice:
The double jump makes the player face down, shoot a bullet down, adds a firing sprite, shakes the camera, and makes an explosion/shooting sound. We really wanted to communicate that a gun was firing to launch the player in the air, so we made it extra juicy.
Ways for player to die/be incapacitated:
We have normal spikes, falling spikes, and appearing spikes. Normal spikes are passive while falling and appearing spikes are triggered when the player collides with a collider block that tells a spike to become active. When hit by the spike, the player restarts to the beginning or the checkpoint (depending on if you got to the checkpoint or not yet). REMEMBER JUST THE APPEARING SPIKE IS THE UNIQUE MECHANIC.
Animated level elements:
The collectibles (monster and candy) and the checkpoints hover up and down to let the player know they can interact with them. The moving platform moves back and forth. The falling platform falls downward and fades away when the player lands on it. The falling spike falls when it is triggered (though that’s just gravity I guess).
Dynamic level elements:
We have checkpoints that when the player gets to them, their double jump is set back to 3 and the next time they die they will respawn at the checkpoint. Of course we also have the appearing and falling spikes and platforms. The player is actively always changing the level whenever they trigger these game objects. REMEMBER THE APPEARING PLATFORM AND APPEARING SPIKE IS THE UNIQUE MECHANIC.
Interactive items:
We created a god mode for the graders so that they can turn off spike damage and have infinite double jumps for easy level traversal. They turn it on by using their mouse to click the button or text that is located in the central hub. Technically, this should count as an interactive element in the game, so I’m adding it as a bonus element.
Complex camera:
The camera follows the player in the center of the screen with a little offset so that the camera is actually positioned a bit above the player. There is also a deadzone box of 100 by 100. Rubric says implementing a deadzone counts.
Moving platform:
We have a platform that moves back and forth, and when the player lands on the platform they don’t slide around. You could say they’ve landed themselves in a sticky situation. Literally, the platform is really sticky.
Puzzles: While there are no locks and keys, because of the nature of objects appearing/disappearing each area is a puzzle to manuever. It will take the player multiple deaths to figure out the right path to get all the collectables.
