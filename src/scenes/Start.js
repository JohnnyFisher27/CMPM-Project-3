import {FallingSpike} from "../gameobjects/fallingSpike.js";
import {Candy} from "../gameobjects/candy.js";
import {Monster} from "../gameobjects/monster.js";
import {Spike} from "../gameobjects/spike.js";
import {FallingPlatform} from "../gameobjects/fallingPlatform.js";

export class Start extends Phaser.Scene {

    constructor() {
        
        super('Start');
    }

    preload() {
        this.load.image('tilesheet', 'assets/monochrome_tilemap_packed.png');
        this.load.tilemapTiledJSON('tiles', 'assets/project3map.tmj');
        
        this.load.spritesheet('player_nor', 'assets/spritesheet.png', 
            {
                frameWidth: 14,
                frameHeight: 15,
            }
        );
        this.load.image('bullet', 'assets/Player_Tiles/tile_0044.png');
        this.load.image('platform', 'assets/Tiles/Default/tile_0145.png');
                
        
        this.load.audio('shoot', 'assets/Hit9.wav');
        this.load.audio('jump', 'assets/Jump3.wav');
        this.load.audio('boom', 'assets/Boom8.wav');
    }

    create() {
        this.coyote = false;
        this.coyote_start = 0;
        this.grounded = false;
        this.doublejump = 3;
        this.canJump = false;
        this.flipSprite = true;

        this.player = this.physics.add.sprite(6000, 500, 'player_nor');

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers('player_nor', {start: 0, end: 2}),
            frameRate: 6,
            repeat: -1
        });        

        /*var disappearing_platform = this.physics.add.image(700, 500, 'platform')
            .setImmovable(true)

        disappearing_platform.body.setAllowGravity(false);
        this.physics.add.collider(disappearing_platform, this.player, this.disappearPlatform, null, this);*/

        this.map = this.add.tilemap('tiles');
        var tileset = this.map.addTilesetImage('monochrome_tilemap_packed', 'tilesheet');

        //this.map.createLayer("Background", tileset, 0, 0);
        this.layer = this.map.createLayer("Ground", tileset, 0, 0);
        this.layer.setCollisionBetween(1, 1767);
        this.physics.add.collider(this.layer, this.player);
        this.layer.setScale(1.3);
        this.physics.world.TILE_BIAS = 150;

        this.jump = this.input.keyboard.addKey("Space", false, true);
        //this.down = this.input.keyboard.addKey("S", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);


        this.cameras.main.centerOn(this.player.x, this.player.y);

        const dataLayer = this.map.getObjectLayer('data');       //need to make object layer in tiled called 'data' and put in phaser
        dataLayer.objects.forEach((data) => {               //and need to to add the image files for the spike and collider
            const { x, y, name, height, width } = data;         

            if (name === 'fallingSpike') {
                let which = data.properties[0].name;
                const fallingSpike = new FallingSpike({scene: this, x, y});
            }

            if (name === 'appearingSpike') {

            }

            if (name === 'spike') {
                const spike = new Spike({scene: this, x, y});
            }

            if (name === 'fallingPlatform') {
                const fallingPlatform = new FallingPlatform({scene: this, x, y});
            }

            if (name === 'movingPlatform') {
                
            }

            if (name === 'candy') {
                const candy = new Candy({scene: this, x, y});
            }

            if (name === 'monster') {
                const monster = new Monster({scene: this, x, y});
            }
        });
    }

    update(time) {
        let dt = (time - this.last_time)/100;
        this.last_time = time;
        let isgrounded = this.player.body.blocked.down;

        if (this.player.body.velocity.y > 0)        //jump system
        {
            this.player.body.setGravityY(1200);
        }
        else
        {
            this.player.body.setGravityY(600);
        }
        if (isgrounded) {
            this.doublejump = 3;
            this.player.angle = 0;
            if (this.jump.isDown && this.canJump) {
                this.canJump = false;
                this.player.body.setVelocityY(-300);
                this.sound.play('jump');
            }
            
            if (this.player.body.velocity.x == 0) {
                this.player.play("walk")
            }
        }
        else {
            if (this.jump.isDown && this.canJump && this.doublejump > 0) {
                this.canJump = false;
                this.doublejump -= 1;
                this.player.body.setVelocityY(-300);
                this.cameras.main.shake(300, 0.005);
                this.shoot()
                if (this.left.isDown) {
                        this.player.angle = -90;
                        this.player.flipX = true;
                }
                else {
                        this.player.angle = 90;
                        this.player.flipX = false;    
                }
            }
        }

        if (this.jump.isUp) {
            this.canJump = true;
            this.player.angle = 0;
        }
       
        if (this.left.isDown) {
            this.player.body.setAccelerationX(-300);
            this.player.flipX = true;
        }
        if (this.player.body.velocity.x < -200) {       //cap movement speed
            this.player.body.setAccelerationX(0);
        }
        if (this.left.isUp && this.player.body.velocity.x < 0) {    //slow player down
            
            this.player.body.setAccelerationX(1000);
            this.player.body.setVelocityX(0);
        }


        if (this.right.isDown) {
            
            this.player.body.setAccelerationX(300);
            this.player.flipX = false;
            
        }
        if (this.player.body.velocity.x > 200) {        //cap movement speed
            this.player.body.setAccelerationX(0);
        }
        if (this.right.isUp && this.player.body.velocity.x > 0) {   //slow player down
            this.player.body.setAccelerationX(-1000);
            this.player.body.setVelocityX(0);
        }

        if (!isgrounded)                        //coyote time doesnt work ask professor
        {
            if (this.coyote)
            {
                if (time - this.coyote_start > 10000)
                    this.grounded = false;
            }
            else
            {
                this.coyote = true;
                this.coyote_start = time;
            }
        }
        else
        {
            this.coyote = false;
            this.grounded = true;
        }

    }
    
    disappearBullet(bullet) {
        this.sound.play('boom')
        bullet.destroy();
            
    }

    //create bullet object
    shoot() {
        this.sound.play('shoot')
        var bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
        bullet.setScale(0.3);
        bullet.angle = 90;
        bullet.body.setVelocityY(500);
        this.physics.add.collider(this.layer, bullet, this.disappearBullet, null, this);

    }

    checkEndGame()
    {
        if (this.player.hp <= 0)        //should our player haver hp?
        {
            this.scene.stop("Start");
            this.scene.start('GameOver', /*{highscore: this.high_score}*/);
        }
    }
    
}
