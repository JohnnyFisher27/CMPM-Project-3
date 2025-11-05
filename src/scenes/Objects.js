export class Objects extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {
        var layer = this.map.createLayer("Map", tileset, 0, 0);
        layer.setCollisionBetween(1, 1767);
        this.physics.add.collider(layer, this.player);
    }
}