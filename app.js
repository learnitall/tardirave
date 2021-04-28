// Tardirave!!
// Ryan Drew, 2020
// Made with <3
// P.S. Opal is a cutie

var width = 800;
var widthRange = function() {return Phaser.Math.Between(0, width);}
var height = 600;
var heightRange = function() {return Phaser.Math.Between(0, height);}
var background_color = "0xe6ffe6";

// these below scales were determined empirically
var tardigrade_scale = 0.5;  // scale of tardigrade image
var cross_scale = 0.3;  // scale of cross image
var food_scale = 0.2;  // scale of food image
var amoeba_scale = 0.2; // scale of amoeba
var nematode_scale = 0.2;  // scale of nematode
var water_scale = 0.1;  // scale of water image
var level_scale = (7 / 8)  // scalar to reduce scales as level up

var accel_factor = 1.5;  // scalar on player accel
var playerBounce = 0.5;  // bounce factor on world bounds
var playerMaxSpeed = 200;  // max speed of player
var enemyBounce = 1;  // bounce factor of enemy
var enemyMaxSpeed = 100;  // max speed of enemy
// get random velocity componet loosely based on max speed
var enemyVelRange = function() {
    return Phaser.Math.Between(-enemyMaxSpeed, enemyMaxSpeed);
}

var food_health_delta = 0.1;  // how much health player gets from food
var enemy_health_delta = 0.1;  // how much health player loses from enemy
var water_health_delta = 0.1;  // how much health player gets from water

var min_health = 0.2;  // player's min health
var max_health =  1;  // player's max health
var in_tun = false;  // whether or not player is in tun state
var health = 0.7;  // health of the player, acts as alpha
var level = 0;  // current level
var score = 0;  // player score


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
    this.load.image('water', 'assets/water.svg');

    enemy_images = ['amoeba', 'nematode'];
}

function create()
{
    // Setup background
    this.add.rectangle(width / 2, height / 2, width, height, background_color);

    // Setup text labels
    healthText = this.add.text(
        16, 16, '', { fontFamily: "Arial", fontSize: '24px', fill: '#00b8e6'}
    );
    scoreText = this.add.text(
        16, 48, '', { fontFamily: "Arial", fontSize: '24px', fill: '#00b8e6'}
    );
    updateScore();

    // Setup player
    targetX = width / 2;
    targetY = height * (3/4);
    player = this.physics.add.image(targetX, targetY, 'tardigrade');
    player.setScale(tardigrade_scale).refreshBody();
    player.setCollideWorldBounds(true);
    player.setBounce(playerBounce);
    player.setAlpha(health);
    player.body.setMaxSpeed(playerMaxSpeed);
    updatePlayerHealth();

    // Setup mouse target
    target = this.physics.add.staticImage(0, 0, 'cross');
    target.setScale(cross_scale);
    target.disableBody(true, true);

    // Setup food
    foodies = this.physics.add.group();
    this.physics.add.overlap(player, foodies, collectFood, null, this);

    // Setup water
    waterdrops = this.physics.add.group();
    this.physics.add.overlap(player, waterdrops, collectWater, null, this);

    // Setup enemies
    enemies = this.physics.add.group()
    this.physics.add.collider(player, enemies, hitEnemy, null, this);


    startLevel();
}

function update()
{
    if (!in_tun)
    {
        if (this.input.activePointer.isDown)
        {
            targetX = this.input.activePointer.worldX;
            targetY = this.input.activePointer.worldY;
            target.enableBody(true, targetX, targetY, true, true);
        }

        player.setAccelerationX((-player.x + targetX) * accel_factor);
        player.setAccelerationY((-player.y + targetY) * accel_factor);

    } else {
        player.setAccelerationX(0);
        player.setAccelerationY(0);
        target.disableBody(true, true);
    }

}

function updateScore() {
    scoreText.setText('Score: ' + score);
}

function updatePlayerHealth() {
    if (health <= min_health)
    {
        health = min_health;
        in_tun = true;
        healthText.setText('Health: (TUN)');
    } else
    {
        in_tun = false;
        if (health > max_health)
        {
            health = max_health;
        }
        healthText.setText('Health: ' + Math.round((health / max_health) * 100) + '%');
    }


    player.setAlpha(health);
    player.refreshBody()
}

function createFood (x, y)
{
    var food = foodies.create(x, y, 'food');
    food.setScale(food_scale);
    food.refreshBody()
}

function collectFood (player, food)
{
    if (!in_tun)
    {
        food.disableBody(true, true);
        health += food_health_delta;
        updatePlayerHealth()
        score += 1;
        updateScore()

        if (foodies.countActive(true) == 0)
        {
            startLevel();
        }
    }
}

function createWater (x, y)
{
    var water = waterdrops.create(x, y, 'water');
    water.setScale(water_scale);
    water.refreshBody();
}

function collectWater (player, water)
{
    water.disableBody(true, true);
    health += water_health_delta;
    updatePlayerHealth();
    score += 1;
    updateScore();
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
    enemy.setVelocity(enemyVelRange(), enemyVelRange())
    enemy.refreshBody();
}

function createRandomEnemy(x, y)
{
    image = enemy_images[Math.floor(Math.random() * enemy_images.length)];
    createEnemy(x, y, image);
}

function hitEnemy (player, enemy)
{
    if (!in_tun)
    {
        health -= enemy_health_delta;
        updatePlayerHealth();
    }
}

function startLevel ()
{
    level += 1;
    createFood(0, 0);
    foodies.children.iterate(function (child) {
        child.enableBody(true, widthRange(), heightRange(), true, true);
        child.setScale(child.scale * level_scale);
        child.refreshBody()
    });

    createWater(widthRange(), heightRange());
    createRandomEnemy(widthRange(), heightRange());

    updatePlayerHealth();
    player.setScale(player.scale * level_scale);
    player.refreshBody()
}
