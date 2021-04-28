// Tardirave!!
// Ryan Drew, 2020
// Made with <3
// P.S. Opal is a cutie

var width = 800;
var widthRange = function() {return Phaser.Math.Between(0, width);}
var height = 600;
var heightRange = function() {return Phaser.Math.Between(0, height);}
var background_color = "0xe6ffe6";

var tardigrade_scale = 0.5;  // scale of tardigrade image
var cross_scale = 0.3;  // scale of cross image
var food_scale = 0.2;  // scale of food image
var amoeba_scale = 0.2; // scale of amoeba
var nematode_scale = 0.2;  // scale of nematode
var level_scale = (3 / 4)  // scalar to reduce scales as level up

var accel_factor = 1.5;  // scalar on player accel
var playerBounce = 0.5;  // bounce factor on world bounds
var playerMaxSpeed = 200;  // max speed of player
var enemyBounce = 0.2;  // bounce factor of enemy
var enemyMaxSpeed = 50;  // max speed of enemy

var food_health_delta = 0.05;  // how much health player gets from food
var enemy_health_delta = 0.01;  // how much health player loses from enemy

var health = 0.7;  // health of the player, acts as alpha
var level = 1;  // current level


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

    enemy_images = ['amoeba', 'nematode'];
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
    player.setBounce(playerBounce);
    player.setAlpha(health);
    player.body.setMaxSpeed(playerMaxSpeed);

    // Setup mouse target
    target = this.physics.add.staticImage(0, 0, 'cross');
    target.setScale(cross_scale);
    target.disableBody(true, true);

    // Setup food
    foodies = this.physics.add.group();
    this.physics.add.overlap(player, foodies, collectFood, null, this);

    // Setup enemies
    enemies = this.physics.add.group()
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    startLevel();
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

function createFood (x, y)
{
    var food = foodies.create(x, y, 'food');
    food.setScale(food_scale);
    food.refreshBody()
}

function collectFood (player, food)
{
    food.disableBody(true, true);
    health += food_health_delta;
    player.setAlpha(health);

    if (foodies.countActive(true) == 0)
    {
        startLevel();
    }
}

function createEnemy (x, y, image)
{
    var scale = 1;
    if (image == 'amoeba') {
        scale = amoeba_scale;
    } else if (image == 'nematode') {
        scale = nematode_scale;
    }
    var enemy = enemies.create(x, y, image);
    enemy.setScale(scale);
    enemy.setCollideWorldBounds(true);
    enemy.setBounce(enemyBounce);
    enemy.body.setMaxSpeed(enemyMaxSpeed);
    enemy.refreshBody()
}

function createRandomEnemy(x, y)
{
    image = enemy_images[Math.floor(Math.random() * enemy_images.length)];
    createEnemy(x, y, image);
}

function hitEnemy (player, enemy)
{
    health -= enemy_health_delta;
    player.setAlpha(health);
}

function startLevel ()
{
    level += 1;
    for (var i = Math.pow(2, level - 1); i < Math.pow(2, level); i++) {
        createFood(0, 0);
        if (i % 2 == 0) {
            createRandomEnemy(0, 0);
        }
    }
    foodies.children.iterate(function (child) {
        child.enableBody(true, widthRange(), heightRange(), true, true);
        child.setScale(child.scale * level_scale);
        child.refreshBody()
    });
    enemies.children.iterate(function (child) {
        child.enableBody(true, widthRange(), heightRange(), true, true);
        child.setScale(child.scale * level_scale);
        child.refreshBody()
    })
    player.setScale(player.scale * level_scale);
    player.refreshBody()
}
