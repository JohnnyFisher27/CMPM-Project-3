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
        this.load.image('particle', 'assets/Tiles/Transparent/tile_0020.png');

        this.load.image('platform', 'assets/Tiles/Default/tile_0145.png');
        this.load.image('collider', 'assets/Tiles/Default/tile_0001.png');
        this.load.image('candy', 'assets/Tiles/Default/tile_0102.png');
        this.load.image('fallingSpike', 'assets/Tiles/Default/tile_0166.png');
        this.load.image('fallingPlat1', 'assets/Tiles/Default/tile_0276.png');
        this.load.image('fallingPlat2', 'assets/Tiles/Default/tile_0111.png');
        this.load.image('fallingPlat3', 'assets/Tiles/Default/tile_0116.png');
        this.load.image('appearingPlatform', 'assets/Tiles/Default/tile_0049.png');
        this.load.image('movingPlatform', 'assets/Tiles/Default/tile_0111.png');
        this.load.image('checkpoint', 'assets/Tiles/Default/tile_0041.png');
        this.load.image('spike', 'assets/Tiles/Default/tile_0183.png');
        this.load.image('monster', 'assets/Tiles/Default/tile_0340.png');

        this.load.image('button', 'assets/Tiles/Default/tile_0370.png')
        this.load.image('buttonPressed', 'assets/Tiles/Default/tile_0369.png')
        this.load.image('door', 'assets/Tiles/Default/tile_0056.png')
        this.load.image('doorOpen', 'assets/Tiles/Default/tile_0058.png')
        this.load.image('player', 'assets/player_normal.png');
        
        this.load.audio('shoot', 'assets/Hit9.wav');
        this.load.audio('jump', 'assets/Jump3.wav');
        this.load.audio('boom', 'assets/Boom8.wav');
        this.load.audio('collect', 'assets/Pickup3.wav');
        this.load.audio('move', 'assets/Random17.wav');
        this.load.audio('checkpoint', 'assets/PowerUp7.wav');
        this.load.audio('death', 'assets/Hit19.wav');
        this.load.audio('victory', 'assets/PowerUp10.wav');

    }

    create() {
        this.sound.play('victory');

        this.player_x = 4450;
        this.player_y = 500;

        this.coyote = false;
        this.coyote_start = 0;
        this.grounded = false;
        this.numBullets = 3;
        this.canJump = false;
        this.flipSprite = true;
        this.buttonClicked = false;
        this.godMode = false;
        this.gameEnded = false;

        this.candyCount = 0;
        this.monsterCount = 0;
        
        this.colliderMap = new Map(); 

        this.deathSound = this.sound.add('death');

        this.map = this.add.tilemap('tiles');
        var tileset = this.map.addTilesetImage('monochrome_tilemap_packed', 'tilesheet');

        this.anims.create({
                key: "walk",
                frames: this.anims.generateFrameNumbers('player_nor', {start: 0, end: 2}),
                frameRate: 6,
                repeat: -1
            });
        
        this.layer = this.map.createLayer("Ground", tileset, 0, 26);
        this.layer2 = this.map.createLayer("Background", tileset, 0, 26);
        this.layer.setDepth(0);
        this.layer2.setDepth(0);
        this.layer.setCollisionBetween(1, 5600);
        this.physics.world.TILE_BIAS = 300;

        this.button = this.add.image(4395, 455, 'button').setOrigin(0);
        this.buttonPressed = this.add.image(4395, 455, 'buttonPressed').setOrigin(0);
        this.buttonPressed.setVisible(false)
        const godmodeText = this.add.text(4250, 450, 'Click to enable god\n mode (for graders)', { 
            fontSize: '12px', 
            fill: '#fff' 
        }).setOrigin(0);
        godmodeText.setInteractive();
        this.button.setInteractive();
        this.buttonPressed.setInteractive();
        godmodeText.on('pointerdown', () => { 
            this.buttonClick();
        });
        this.button.on('pointerdown', () => { 
            this.buttonClick();
        });
        this.buttonPressed.on('pointerdown', () => { 
            this.buttonClick();
        });

        this.door = this.add.image(4550, 473,'door').setOrigin(0);
        this.door.setScale(2)

        var candy = this.add.image(4530, 440, 'candy').setOrigin(0);
        candy.setScale(1);
        
        this.candyText = this.add.text(4525, 460, '0/15', { 
            fontSize: '12px', 
            fill: '#fff' 
        }).setOrigin(0);

        var monster = this.add.image(4583, 438, 'monster').setOrigin(0);
        monster.setScale();
        
        this.monsterText = this.add.text(4578, 460, '0/5', { 
            fontSize: '12px', 
            fill: '#fff' 
        }).setOrigin(0);


        this.playerInteractives = this.physics.add.group({
            allowGravity: false,
            immovable: true
            });
        this.resettableObjects = this.physics.add.group({
            allowGravity: false,
            immovable: true
            });
        this.clearObjects = this.physics.add.group({ 
            allowGravity: false,
            immovable: true
            });

        this.jump = this.input.keyboard.addKey("Space", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);
    
        var dataLayer = this.map.getObjectLayer('data');
        
        const getRobustKey = (obj) => {
            if (!obj.properties || obj.properties.length === 0) 
                return null;
            if (obj.properties[0].value) 
                return String(obj.properties[0].value);
            
            const namedProp = obj.properties.find(p => ['key', 'which', 'id'].includes(p.name));
            if (namedProp) 
                return String(namedProp.value);

            return String(obj.properties[0].name);
        };

        dataLayer.objects.forEach((data) => {
            if (data.name === 'collider') {
                const key = getRobustKey(data);
                
                if (key) {
                    if (!this.colliderMap.has(key)) {
                        this.colliderMap.set(key, []);
                    }
                    
                    this.colliderMap.get(key).push(data);
                }
            }
        });
        
        dataLayer.objects.forEach((data) => {
            const { x, y, name, height, width } = data;         

            if (name === 'spike') {
                let angle = data.rotation;
                const spike = new Spike({scene: this, x, y, player: this.player, angle});
                spike.setDepth(1);
                this.playerInteractives.add(spike);
            }

            if (name === 'movingPlatform') {
                const movingPlatform = new MovingPlatform({scene: this, x, y, player: this.player});
                movingPlatform.setDepth(1);
                this.playerInteractives.add(movingPlatform);
            }

            if (name === 'candy') {
                const candy = new Candy({scene: this, x, y, player: this.player});
                candy.setDepth(1);
                this.playerInteractives.add(candy);
            }

            if (name === 'monster') {
                const monster = new Monster({scene: this, x, y, player: this.player});
                monster.setDepth(1);
                this.playerInteractives.add(monster);
            }

            if (name === 'checkpoint') {
                const checkpoint = new Checkpoint({scene: this, x, y, player: this.player});
                checkpoint.setDepth(1);
                this.playerInteractives.add(checkpoint);
            }
        });
        
        this.createPlayer();    
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
                if (!this.godMode)
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

        // 17 total
        if (this.hasTakenCandy) {
            this.sound.play('collect');
            this.candyCount += 1;
            this.candyText.setText(`${this.candyCount}/15`);
            this.events.emit('updateCandy', this.candyCount);            
            this.hasTakenCandy = false;
            let particle = this.add.particles(0, 0, 'particle', {
                    scale: { start: 1, end: 0.01, random: true },
                    angle: { min: 0, max: 360 },
                    x: this.player.x,
                    y: this.player.y,
                    gravityY: -10,
                    speed: { min: 1, max: 50 },
                    lifespan: { min: 500, max: 1500 },
                    alpha: { start: 1, end: 0 },
                });
            setTimeout(()=> particle.stop(), 300)
        }
        // 5 total
        if (this.hasTakenMonster) {
            this.sound.play('collect');
            this.monsterCount += 1;
            this.monsterText.setText(`${this.monsterCount}/5`);
            this.events.emit('updateMonster', this.monsterCount);            
            this.hasTakenMonster = false;
            let particle = this.add.particles(0, 0, 'particle', {
                    scale: { start: 1, end: 0.01, random: true },
                    angle: { min: 0, max: 360 },
                    x: this.player.x,
                    y: this.player.y,
                    gravityY: -10,
                    speed: { min: 1, max: 50 },
                    lifespan: { min: 500, max: 1500 },
                    alpha: { start: 1, end: 0 },
                });
            setTimeout(()=> particle.stop(), 300)
        }

        if (this.checkpoint) {
            this.numBullets = 3;
            this.events.emit('updateBullets', this.numBullets);   
            this.sound.play('checkpoint');
            this.checkpoint = false;

        }

        if (this.monsterCount == 5 && this.candyCount >= 15 && !this.gameEnded) {
            this.gameEnded = true;
            this.door.destroy();
            this.doorOpen = this.physics.add.sprite(4550, 473,'doorOpen').setOrigin(0);
            this.doorOpen.body.setAllowGravity(false)
            this.doorOpen.body.setImmovable(true)
            this.doorOpen.setScale(2)
            this.physics.add.collider(this.doorOpen, this.player, this.checkEndGame, null, this);
        }

    }

    createPlayer() {
        this.numBullets = 3;
        this.events.emit('updateBullets', this.numBullets);   
        this.player = this.physics.add.sprite(this.player_x, this.player_y, 'player_nor');
        this.player.setDepth(2);
        this.player.setDragX(1000); 
        this.player.setMaxVelocity(180, 500); 

        this.deathDelayEvent = null; 

        this.cameras.main.zoom = 1.75;
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 50);
        this.cameras.main.setDeadzone(100, 100);

        this.layerCollider = this.physics.add.collider(this.layer, this.player);
        this.playerOverlap = this.physics.add.overlap(this.player, this.playerInteractives, this.handlePlayerInteraction, null, this);
        this.platformColliders = [];

        this.clearObjects.clear(true, true);
        
        var dataLayer = this.map.getObjectLayer('data');
        
        const getSpikeKey = (obj) => {
            if (!obj.properties || obj.properties.length === 0) 
                return null;
            if (obj.properties[0].value) 
                return String(obj.properties[0].value);
            const namedProp = obj.properties.find(p => ['key', 'which', 'id'].includes(p.name));
            if (namedProp) 
                return String(namedProp.value);
            return String(obj.properties[0].name);
        };
        
        dataLayer.objects.forEach((data) => {
            const { x, y, name, height, width } = data; 

            switch (name) {
                case 'fallingPlatform':
                    let asset = 'platform';
                    if (data.properties && data.properties.length > 0) {
                        const prop = data.properties[0];
                        asset = prop.value ? String(prop.value) : prop.name;
                    }
                    
                    const fallingPlatform = new FallingPlatform({scene: this, x, y, asset, player: this.player});
                    fallingPlatform.setDepth(1);
                    this.playerInteractives.add(fallingPlatform);
                    this.clearObjects.add(fallingPlatform);
                    break; 

                case 'fallingSpike':
                    const fallingKey = getSpikeKey(data);
                    const fallingColliders = this.colliderMap.get(fallingKey);
                    
                    const fallingSpike = new FallingSpike({
                        scene: this, 
                        x, 
                        y, 
                        colliderDataArray: fallingColliders, 
                        which: fallingKey, 
                        player: this.player
                    });
                    
                    fallingSpike.setDepth(1);
                    this.playerInteractives.add(fallingSpike);
                    this.clearObjects.add(fallingSpike);
                    break;

                case 'appearingPlatform':
                    const appearingPlatform = new AppearingPlatform({scene: this, x, y, player: this.player});
                    appearingPlatform.setDepth(1);
                    this.playerInteractives.add(appearingPlatform);
                    this.resettableObjects.add(appearingPlatform);
                    this.clearObjects.add(appearingPlatform);
                    
                    const collider = this.physics.add.collider(appearingPlatform, this.player);
                    this.platformColliders.push(collider);
                    break;

                case 'appearingSpike':
                    const appearingKey = getSpikeKey(data);
                    let angle = data.rotation;
                    const appearingColliders = this.colliderMap.get(appearingKey); 
                    
                    const appearingSpike = new AppearingSpike({
                        scene: this, 
                        x, 
                        y, 
                        colliderDataArray: appearingColliders, 
                        which: appearingKey, 
                        player: this.player, 
                        angle
                    });
                    
                    appearingSpike.setDepth(1);
                    this.playerInteractives.add(appearingSpike);
                    this.resettableObjects.add(appearingSpike);
                    this.clearObjects.add(appearingSpike);
                    appearingSpike.body.enable = false;
                    break;
            }
        });
    }

    destroyPlayer() {
        if (this.layerCollider) {
            this.physics.world.removeCollider(this.layerCollider);
            this.layerCollider = null; 
        }
        if (this.playerOverlap) {
            this.physics.world.removeCollider(this.playerOverlap);
            this.playerOverlap = null; 
        }

        this.platformColliders.forEach(collider => {
            this.physics.world.removeCollider(collider);
        });
        this.platformColliders = []; 

        if (this.deathDelayEvent) {
            this.deathDelayEvent.remove(false);
            this.deathDelayEvent = null;
        }

        //this.tweens.killTweensOf(this.player);

        if (this.player) {
            this.player.anims.stop();
            this.player.destroy();
            this.player = null; 
        }


            
    }
    
    handlePlayerInteraction(player, object) {
        if ((object.name === 'spike' || object.name === 'appearingSpike' || object.name === 'fallingSpike') && !this.godMode) {
            this.deathDelayEvent = this.time.delayedCall(100, () => {
            if (this.scene) { 
                this.respawnPlayer();
            }
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
            const platformTween = this.tweens.add({
            targets: object,
            alpha: 0,
            y: "+=25",
            ease: 'Linear', 
            duration: 100,
            onComplete: () => {
                if (object && object.destroy) { 
                    object.destroy();
                }
                platformTween.remove();
                }
            });
        }
        else if (object.name === 'appearingPlatform') {
            object.setVisible(true);
        }

        else if (object.name === 'movingPlatform') {
            this.physics.add.collider(object, this.player,
                () => {
                    if (object.body.moves && object.body.touching.up && this.player.body.touching.down) {
                        this.player.x = object.x + 8;
                    }
                }
            );
        }
    }

    respawnPlayer() {
        this.destroyPlayer();

        if (!this.deathSound.isPlaying) {
            this.deathSound.play();
        }

        this.resettableObjects.children.each(function (object) {
            object.setVisible(false);
            object.body.enable = false;
            }, this);
            
        this.clearObjects.children.each(function (object) {
            object.destroy(true); 
            }, this);
        
        this.createPlayer();
    }

    buttonClick() {
        this.numBullets = 3;
        if (!this.buttonClicked) {
                this.button.setVisible(false)
                this.buttonPressed.setVisible(true)
                this.buttonClicked = true;
                this.godMode = true;
                this.sound.play('boom');
                this.sound.play('checkpoint');
                this.sound.play('collect');
            }
        else {
                this.button.setVisible(true)
                this.buttonPressed.setVisible(false)
                this.buttonClicked = false;
                this.godMode = false;
            }
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
        this.sound.play('collect');
        this.sound.play('checkpoint');
        this.sound.play('victory');

        this.scene.stop('UI');
        this.scene.stop("Start");
        this.scene.start('GameOver', /*{highscore: this.high_score}*/);
    }
    
}
