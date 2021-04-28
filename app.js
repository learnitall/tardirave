// Tardirave!!
// Ryan Drew, 2020
// Made with <3
// P.S. Opal is a cutie

var width = 800;
var height = 600;
var background_color = "0xe6ffe6"

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
}

function create()
{
    this.add.rectangle(width / 2, height / 2, width, height, background_color);
}

function update()
{

}
