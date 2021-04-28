// Tardirave!!
// Ryan Drew, 2020
// Made with <3
// P.S. Opal is a cutie

var width = 800;
var height = 600;
var background_color = "0xe6ffe6";
var tardigrade_scale = 0.5;  // scale of tardigrade image
var cross_scale = 0.3;  // scale of cross image

var accel_factor = 1.5;  // scalar on player accel
var bounce = 0.5;  // bounce factor on world bounds
var maxSpeed = 200;  // max speed of player

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.image('tardigrade', 'assets/tardigrade.svg');
    this.load.image('nematode', 'assets/worm.svg');
    this.load.image('food', 'assets/leaf.svg');
    this.load.image('amoeba', 'assets/blob.svg');
    this.load.image('cross', 'assets/cross.svg');
}

function create()
{
    // Setup background
    this.add.rectangle(width / 2, height / 2, width, height, background_color);

    // Setup player
    targetX = width / 2;
    targetY = height * (3/4);
    player = this.physics.add.image(targetX, targetY, 'tardigrade');
    player.setScale(tardigrade_scale).refreshBody();
    player.setCollideWorldBounds(true);
    player.setBounce(bounce);

    // Setup mouse target
    target = this.physics.add.staticImage(0, 0, 'cross');
    target.setScale(cross_scale);
    target.disableBody(true, true);

}

function update()
{

    if (this.input.activePointer.isDown)
    {
        targetX = this.input.activePointer.worldX;
        targetY = this.input.activePointer.worldY;
        target.enableBody(true, targetX, targetY, true, true);
    }

    player.setAccelerationX((-player.x + targetX) * accel_factor);
    player.setAccelerationY((-player.y + targetY) * accel_factor);

}
