

export class Start extends Phaser.Scene {

    constructor() {
        
        super('Start');
    }

    preload() {
        this.load.image('tilesheet', 'assets/monochrome_tilemap_packed.png');
        this.load.tilemapTiledJSON('tiles', 'assets/project3map.tmj');

        this.load.image('player_nor', 'assets/player_normal.png');
        this.load.image('platform', 'assets/Tiles/Default/tile_0145.png')
    }

    create() {
        this.coyote = false;
        this.coyote_start = 0;
        this.grounded = false;
        this.doublejump = 3;
        this.canJump = false;
        this.changeAngle = false;

        this.player = this.physics.add.sprite(600, 500, 'player_nor');

        var disappearing_platform = this.physics.add.image(700, 500, 'platform')
            .setImmovable(true)

        disappearing_platform.body.setAllowGravity(false);
        this.physics.add.collider(disappearing_platform, this.player, this.disappearPlatform, null, this);

        this.map = this.add.tilemap('tiles');
        var tileset = this.map.addTilesetImage('monochrome_tilemap_packed', 'tilesheet');

        //this.map.createLayer("Background", tileset, 0, 0);
        var layer = this.map.createLayer("Ground", tileset, 0, 0);
        layer.setCollisionBetween(1, 1767);
        this.physics.add.collider(layer, this.player);
        layer.setScale(1.3);
        this.physics.world.TILE_BIAS = 150;

        this.jump = this.input.keyboard.addKey("Space", false, true);
        //this.down = this.input.keyboard.addKey("S", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);


        this.cameras.main.centerOn(this.player.x, this.player.y);
    }

    update(time) {
        let dt = (time - this.last_time)/100;
        this.last_time = time;
        let isgrounded = this.player.body.blocked.down;

        if (this.player.body.velocity.y > 0)
        {
            this.player.body.setGravityY(1200);
        }
        else
        {
            this.player.body.setGravityY(600);
        }
        if (this.grounded == true) {
            this.doublejump = 3;
            this.player.angle = 0;
            if (this.jump.isDown) {
                this.grounded = false;
                this.player.body.setVelocityY(-300);       
                this.player.angle = 90;      
            }
        }
        if (isgrounded == false && this.doublejump > 0) {      //doublejump
            if (this.jump.isDown && this.canJump) {
                this.canJump = false;
                this.doublejump -= 1;
                this.player.body.setVelocityY(-300);
                this.player.angle = 90;
            }
            if (this.jump.isUp) {
                this.canJump = true;
                this.player.angle = 0;
            }
        }
       

        if (this.left.isDown) {
            this.player.body.setAccelerationX(-300);
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
        }
        if (this.player.body.velocity.x > 200) {        //cap movement speed
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

    }

    disappearPlatform(platform) {
            platform.destroy();
        }
}
