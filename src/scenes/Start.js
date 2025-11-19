import {FallingSpike} from "../gameobjects/fallingSpike.js";
import {Candy} from "../gameobjects/candy.js";
import {Monster} from "../gameobjects/monster.js";
import {Spike} from "../gameobjects/spike.js";
import {FallingPlatform} from "../gameobjects/fallingPlatform.js";
import {MovingPlatform} from "../gameobjects/movingPlatform.js";
import {AppearingSpike} from "../gameobjects/appearingSpike.js";
import {UI} from '../scenes/UI.js';
import { Checkpoint } from "../gameobjects/checkpoint.js";
import { AppearingPlatform } from "../gameobjects/appearigPlatform.js";
import {Collider} from "../gameobjects/collider.js";


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
        this.load.audio('checkpoint', 'assets/PowerUp7.wav');

    }

    create() {
        this.player_x = 4450;
        this.player_y = 500;

        this.coyote = false;
        this.coyote_start = 0;
        this.grounded = false;
        this.numBullets = 3;
        this.canJump = false;
        this.flipSprite = true;
        this.checkpoint = false;

        this.hasTakenCandy = false;
        this.candyCount = 0;
        this.hasTakenMonster = false;
        this.monsterCount = 0;

        this.map = this.add.tilemap('tiles');
        var tileset = this.map.addTilesetImage('monochrome_tilemap_packed', 'tilesheet');

        this.layer = this.map.createLayer("Ground", tileset, 0, 26);
        this.layer2 = this.map.createLayer("Background", tileset, 0, 26);
        this.layer.setDepth(0);
        this.layer2.setDepth(0);
        this.layer.setCollisionBetween(1, 5600);
        this.physics.world.TILE_BIAS = 220;

        this.playerInteractives = this.physics.add.group();
        this.resettableObjects = this.physics.add.group();
        this.clearObjects = this.physics.add.group();

        this.jump = this.input.keyboard.addKey("Space", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);
    
        this.createPlayer();    

        var dataLayer = this.map.getObjectLayer('data');
        dataLayer.objects.forEach((data) => {
            const { x, y, name, height, width } = data;         

            if (name === 'appearingSpike') {
                let which = data.properties[0].name;
                let angle = data.rotation;
                const appearingSpike = new AppearingSpike({scene: this, x, y, dataLayer, which, player: this.player, angle});
                appearingSpike.setDepth(1);
                this.playerInteractives.add(appearingSpike);
                this.resettableObjects.add(appearingSpike);
                appearingSpike.body.setAllowGravity(false); 
                appearingSpike.body.setImmovable(true);
                appearingSpike.body.enable = false;
            }

            if (name === 'spike') {
                let angle = data.rotation;
                const spike = new Spike({scene: this, x, y, player: this.player, angle});
                spike.setDepth(1);
                this.playerInteractives.add(spike);
                spike.body.setAllowGravity(false); 
                spike.body.setImmovable(true);
            }

            if (name === 'movingPlatform') {
                const movingPlatform = new MovingPlatform({scene: this, x, y, player: this.player});
                movingPlatform.setDepth(1);
            }

            if (name === 'candy') {
                const candy = new Candy({scene: this, x, y, player: this.player});
                candy.setDepth(1);
                this.playerInteractives.add(candy);
                candy.body.setAllowGravity(false); 
                candy.body.setImmovable(true);
            }

            if (name === 'monster') {
                const monster = new Monster({scene: this, x, y, player: this.player});
                monster.setDepth(1);
                this.playerInteractives.add(monster);
                monster.body.setAllowGravity(false); 
                monster.body.setImmovable(true);
            }

            if (name === 'checkpoint') {
                const checkpoint = new Checkpoint({scene: this, x, y, player: this.player});
                checkpoint.setDepth(1);
                this.playerInteractives.add(checkpoint);
                checkpoint.body.setAllowGravity(false); 
                checkpoint.body.setImmovable(true);
            }


        });

        this.scene.launch('UI');
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
            if (this.jump.isDown && this.canJump && this.numBullets > 0) {      //double jump
                this.canJump = false;
                this.numBullets -= 1;
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

        if (!isgrounded)
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

        // 16 total
        if (this.hasTakenCandy) {
            this.sound.play('collect');
            this.candyCount += 1;
            this.events.emit('updateCandy', this.candyCount);            
            this.hasTakenCandy = false;
        }
        // 5 total
        if (this.hasTakenMonster) {
            this.sound.play('collect');
            this.monsterCount += 1;
            this.events.emit('updateMonster', this.monsterCount);            
            this.hasTakenMonster = false;
        }

        if (this.checkpoint) {
            this.numBullets = 3;
            this.events.emit('updateBullets', this.numBullets);   
            this.sound.play('checkpoint');
            this.checkpoint = false;

        }

    }

    createPlayer() {
        this.numBullets = 3;
        this.events.emit('updateBullets', this.numBullets);   
        this.player = this.physics.add.sprite(this.player_x, this.player_y, 'player_nor');
        this.player.setDepth(2);

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers('player_nor', {start: 0, end: 2}),
            frameRate: 6,
            repeat: -1
        });  

        this.cameras.main.zoom = 1.75;
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 50);
        this.cameras.main.setDeadzone(0, 0);
        this.physics.add.collider(this.layer, this.player);
        this.physics.add.overlap(this.player, this.playerInteractives, this.handlePlayerInteraction, null, this);

        //this.clearObjects.clear(true, true);
        var dataLayer = this.map.getObjectLayer('data');
        dataLayer.objects.forEach((data) => {
            const { x, y, name, height, width } = data; 

                if (name === 'fallingPlatform') {
                    let asset = data.properties[0].name;
                    const fallingPlatform = new FallingPlatform({scene: this, x, y, asset, player: this.player});
                    fallingPlatform.setDepth(1);
                    this.playerInteractives.add(fallingPlatform);
                    this.clearObjects.add(fallingPlatform);
                    fallingPlatform.body.setAllowGravity(false); 
                    fallingPlatform.body.setImmovable(true);
                }

                if (name === 'fallingSpike') {
                    let which = data.properties[0].name;
                    const fallingSpike = new FallingSpike({scene: this, x, y, dataLayer, which, player: this.player});
                    fallingSpike.setDepth(1);
                    this.playerInteractives.add(fallingSpike);
                    this.clearObjects.add(fallingSpike);
                    fallingSpike.body.setAllowGravity(false); 
                    fallingSpike.body.setImmovable(true);
                }

                if (name === 'appearingPlatform') {
                    const appearingPlatform = new AppearingPlatform({scene: this, x, y, player: this.player});
                    appearingPlatform.setDepth(1);
                    this.playerInteractives.add(appearingPlatform);
                    this.resettableObjects.add(appearingPlatform);
                    this.clearObjects.add(appearingPlatform);
                    appearingPlatform.body.setAllowGravity(false); 
                    appearingPlatform.body.setImmovable(true);
                    this.physics.add.collider(appearingPlatform, this.player);
                }
            
        });
    }

    destroyPlayer() {
        this.player.destroy();
    }
    
    handlePlayerInteraction(player, object) {
        if (object.name === 'spike') {
            this.time.delayedCall(100, () => {
            this.respawnPlayer();
            }, [], this);
        }
        else if (object.name == 'appearingSpike') {
            this.time.delayedCall(100, () => {
            this.respawnPlayer();
            }, [], this);
        }
        else if (object.name == 'fallingSpike') {
            this.time.delayedCall(100, () => {
            this.respawnPlayer();
            }, [], this);
            
        }
        else if (object.name === 'checkpoint') {
            this.player_x = object.x;
            this.player_y = object.y;
            this.checkpoint = true;
            object.destroy();
        }
        else if (object.name === 'candy') {
            this.hasTakenCandy = true; 
            object.destroy();
        }
        else if (object.name === 'monster') {
            this.hasTakenMonster = true; 
            object.destroy();
        }
        else if (object.name === 'fallingPlatform') {
            this.tweens.add({
                targets: object,
                alpha: 0,
                y: "+=25",
                ease: 'Linear', 
                duration: 100,
                onComplete: () => {
                    object.destroy();
                                }
                });
        }
        else if (object.name === 'appearingPlatform') {
            object.setVisible(true);
        }
    }

    respawnPlayer() {
        this.destroyPlayer();

        this.resettableObjects.children.each(function (object) {
            object.setVisible(false);
            }, this);
        
        this.createPlayer();
    }

    disappearBullet(bullet) {
        this.sound.play('boom')
        bullet.destroy();
    }

    shoot() {
        this.sound.play('shoot');
        var bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
        var bullet_fire = this.add.sprite(this.player.x, this.player.y+10, 'bullet_fire');
        bullet.setScale(0.3);
        bullet_fire.setScale(1.5);
        bullet.angle = 90;
        bullet_fire.angle = 90;
        bullet.body.setVelocityY(500);
        this.time.delayedCall(50, () => {
            bullet_fire.destroy(); 
            }, [], this);
        this.physics.add.collider(this.layer, bullet, this.disappearBullet, null, this);
        this.events.emit('updateBullets', this.numBullets);   
    }

    checkEndGame()
    {
        if (this.player.hp <= 0)
        {
            this.scene.stop("Start");
            this.scene.start('GameOver', /*{highscore: this.high_score}*/);
        }
    }
    
}
