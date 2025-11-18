import {FallingSpike} from "../gameobjects/fallingSpike.js";
import {Candy} from "../gameobjects/candy.js";
import {Monster} from "../gameobjects/monster.js";
import {Spike} from "../gameobjects/spike.js";
import {FallingPlatform} from "../gameobjects/fallingPlatform.js";
import {MovingPlatform} from "../gameobjects/movingPlatform.js";
import {AppearingSpike} from "../gameobjects/appearingSpike.js";

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
        this.load.image('bullet_fire', 'assets/Player_Tiles/tile_0043.png');

        this.load.image('platform', 'assets/Tiles/Default/tile_0145.png');
        this.load.image('collider', 'assets/Tiles/Default/tile_0001.png');
        this.load.image('candy', 'assets/Tiles/Default/tile_0102.png');
        this.load.image('fallingSpike', 'assets/Tiles/Default/tile_0166.png');
        this.load.image('fallingPlatform', 'assets/Tiles/Default/tile_0250.png');
        this.load.image('fallingPlat1', 'assets/Tiles/Default/tile_0276.png');
        this.load.image('fallingPlat2', 'assets/Tiles/Default/tile_0111.png');
        this.load.image('fallingPlat3', 'assets/Tiles/Default/tile_0116.png');
        this.load.image('appearingPlatform', 'assets/Tiles/Default/tile_0049.png');
        this.load.image('checkpoint', 'assets/Tiles/Default/tile_0041.png');
        this.load.image('spike', 'assets/Tiles/Default/tile_0183.png');
        this.load.image('monster', 'assets/Tiles/Default/tile_0340.png');

        this.load.image('player', 'assets/player_normal.png');
        
        this.load.audio('shoot', 'assets/Hit9.wav');
        this.load.audio('jump', 'assets/Jump3.wav');
        this.load.audio('boom', 'assets/Boom8.wav');
        this.load.audio('collect', 'assets/Pickup3.wav');
        this.load.audio('move', 'assets/Random17.wav');
    }

    create() {
        this.coyote = false;
        this.coyote_start = 0;
        this.grounded = false;
        this.doublejump = 3;
        this.canJump = false;
        this.flipSprite = true;
        this.moving = false;

        this.player = this.physics.add.sprite(4200, 500, 'player_nor');
        this.player.setDepth(2);

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
        this.layer = this.map.createLayer("Ground", tileset, 0, 26);
        this.layer2 = this.map.createLayer("Background", tileset, 0, 26);
        this.layer.setDepth(0);
        this.layer2.setDepth(0);
        this.layer.setCollisionBetween(1, 5600);
        this.physics.add.collider(this.layer, this.player);
        this.physics.world.TILE_BIAS = 150;

        this.jump = this.input.keyboard.addKey("Space", false, true);
        //this.down = this.input.keyboard.addKey("S", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        //this.cameras.main.centerOn(this.player.x + 300, this.player.y - 110);       //this needs a lot of work
        this.cameras.main.zoom = 1.75;
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 100);
        this.cameras.main.setDeadzone(0, 100);

        const dataLayer = this.map.getObjectLayer('data');
        dataLayer.objects.forEach((data) => {
            const { x, y, name, height, width } = data;         

            if (name === 'fallingSpike') {
                let which = data.properties[0].name;
                const fallingSpike = new FallingSpike({scene: this, x, y, dataLayer, which, player: this.player});
                fallingSpike.setDepth(1);
            }

            if (name === 'appearingSpike') {
                let which = data.properties[0].name;
                let angle = data.rotation;
                const appearingSpike = new AppearingSpike({scene: this, x, y, dataLayer, which, player: this.player, angle});
                appearingSpike.setDepth(1);
            }

            if (name === 'spike') {
                let angle = data.rotation;
                const spike = new Spike({scene: this, x, y, player: this.player, angle});
                spike.setDepth(1);
            }

            if (name === 'fallingPlatform') {
                let asset = data.properties[0].name;
                const fallingPlatform = new FallingPlatform({scene: this, x, y, asset, player: this.player});
                fallingPlatform.setDepth(1);
            }

            if (name === 'movingPlatform') {
                const movingPlatform = new MovingPlatform({scene: this, x, y, player: this.player});
                movingPlatform.setDepth(1);
            }

            if (name === 'candy') {
                const candy = new Candy({scene: this, x, y, player: this.player});
                candy.setDepth(1);
            }

            if (name === 'monster') {
                const monster = new Monster({scene: this, x, y, player: this.player});
                monster.setDepth(1);
            }
        });
    }

    update(time) {
        let dt = (time - this.last_time)/100;
        this.last_time = time;
        let isgrounded = this.player.body.blocked.down;

        if (this.player.body.velocity.y > 0)        //jump system
        {
            this.player.body.setGravityY(1150);
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
            if (this.jump.isDown && this.canJump && this.doublejump > 0) {      //doublejump
                this.canJump = false;
                this.doublejump -= 1;
                this.player.body.setVelocityY(-300);
                this.cameras.main.shake(200, 0.0025);
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
            this.moving = true;
            //this.sound.play('move', {loop: true}) fix this tomorrow
            this.player.body.setAccelerationX(-300);
            this.player.flipX = true;
        }
        if (this.player.body.velocity.x < -180) {       //cap movement speed
            this.player.body.setAccelerationX(0);
        }
        if (this.left.isUp && this.player.body.velocity.x < 0) {    //slow player down
            
            this.player.body.setAccelerationX(1000);
            this.player.body.setVelocityX(0);
        }


        if (this.right.isDown) {
            this.moving = true;
            this.player.body.setAccelerationX(300);
            this.player.flipX = false;
            
        }
        if (this.player.body.velocity.x > 180) {        //cap movement speed
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

        if (this.hasTaken) {
            this.sound.play('collect');
            console.log("HI")
            this.hasTaken = false;
        }

    }
    
    disappearBullet(bullet) {
        this.sound.play('boom')
        bullet.destroy();
            
    }

    //create bullet object
    shoot() {
        this.sound.play('shoot');
        var bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
        var bullet_fire = this.add.sprite(this.player.x, this.player.y, 'bullet_fire');
        bullet.setScale(0.3);
        bullet_fire.setScale(0.5);
        bullet.angle = 90;
        bullet_fire.angle = 90;
        bullet.body.setVelocityY(500);
        this.time.delayedCall(50, () => {
            bullet_fire.destroy(); 
            }, [], this);
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
