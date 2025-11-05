const TILESET_KEY = 'mapPack_tilesheet';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image(TILESET_KEY, 'assets/mapPack_tilesheet.png');
        this.load.tilemapTiledJSON('tiles', 'assets/wfcmap.tmj');
    }

    create() {
        this.map = this.add.tilemap('tiles');
        var tileset = this.map.addTilesetImage('mapPack_tilesheet', TILESET_KEY);
        this.map.createLayer("Tile Layer 1", tileset, 0, 0);
        this.map.createLayer("Tile Layer 2", tileset, 0, 0);
        this.map.createLayer("Tile Layer 3", tileset, 0, 0);
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
    }
    
}
