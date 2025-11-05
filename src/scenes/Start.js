

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('tilesheet', 'assets/monochrome_tilemap_packed.png');
        this.load.tilemapTiledJSON('tiles', 'assets/project3map.tmj');

        this.load.image('player_nor', 'assets/player_normal.png');
    }

    create() {
        this.map = this.add.tilemap('tiles');
        var tileset = this.map.addTilesetImage('monochrome_tilemap_packed', 'tilesheet');
        this.map.createLayer("Background", tileset, 0, 0);
        var layer = this.map.createLayer("Ground", tileset, 0, 0);
        layer.setCollisionBetween(1, 1767);
        this.physics.add.collider(layer, this.player);

        this.player = this.physics.add.sprite(120, 360, 'player_nor');

        this.jump = this.input.keyboard.addKey("W", false, true);
        //this.down = this.input.keyboard.addKey("S", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.cameras.main.centerOn(this.player.x, this.player.y);
    }

    update(time) {
        let dt = (time - this.last_time)/100;
        this.last_time = time;
        
        if (this.player.body.velocity.y > 0)
        {
            this.player.body.setGravityY(1200);
        }
        else
        {
            this.player.body.setGravityY(600);
        }
        if (this.jump.isDown) {
            this.player.body.setVelocityY(100);
        }

        if (this.left.isDown && this.player.body.velocity.x > -200) {
            this.player.body.setAccelerationX(-50);
        }
        if (this.left.isUp && this.player.body.velocity.x < 0) {
            this.player.body.setAccelerationX(100);
        }

        if (this.right.isDown && this.player.body.velocity.x < 200) {
            this.player.body.setAccelerationX(50);
        }
        if (this.right.isUp && this.player.body.velocity.x > 0) {
            this.player.body.setAccelerationX(-100);
        }
    }
}
