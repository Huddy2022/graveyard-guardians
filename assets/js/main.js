import level1Layout from "./levels/level1/level_1.js";
import level1Config from "./levels/level1/level1Config.js";
import loadLevelAssets from "./levels/level_assets.js";
import generateMappings from "./levels/generalMapping.js";

// Initialize kaboom context
kaboom({
  width: 900,
  height: 600,
  canvas: document.getElementById("game-canvas"),
});

// load tiles
loadLevelAssets();

let spawnInterval;
let destroyedBosses = 0;
let destroyedZombies = 0;
let currentPotion = null;
let SPEED;
let JUMP_FORCE;
let leftEnemyStartPosX;
let leftEnemyStartPosY;
let rightEnemyStartPosX;
let rightEnemyStartPosY;
let bottomRightEnemyStartPosX;
let bottomRightEnemyStartPosY;
let bottomLeftEnemyStartPosX;
let bottomLeftEnemyStartPosY;
let enemySpawnInterval;


// general setting of the game level
let level = 1;
/**
 * Game settings based on level
 * @param {*} gravity - sets the gravity of the game
 * @param {*} playerSpeed - sets the speed of the game based on player speed
 * @param {*} levelJumpForce - sets the player jump force
 * @param {*} leftEnemyStartX - enemy left spawn coordinate X
 * @param {*} leftEnemyStartY - enemy left spawn coordinate Y
 * @param {*} rightEnemyStartX - enemy right spawn coordinate X
 * @param {*} rightEnemyStartY - enemy right spawn coordinate Y
 * @param {*} bottomRightEnemyStartPosX - enemy bottom right spawn coordinate X
 * @param {*} bottomRightEnemyStartY - enemy bottom right spawn coordinate Y
 * @param {*} bottomLeftEnemyStartPosX - enemy bottom left spawn coordinate X
 * @param {*} bottomLeftEnemyStartY - enemy bottom left spawn coordinate Y
 */
function levelSettings(
  speed, levelJumpForce, leftEnemyStartX, leftEnemyStartY, rightEnemyStartX, rightEnemyStartY, bottomRightEnemyStartX, bottomRightEnemyStartY, bottomLeftEnemyStartX, bottomLeftEnemyStartY, lvlSpawnInterval) {
  SPEED = speed;
  JUMP_FORCE = levelJumpForce;
  leftEnemyStartPosX = leftEnemyStartX;
  leftEnemyStartPosY = leftEnemyStartY;
  rightEnemyStartPosX = rightEnemyStartX;
  rightEnemyStartPosY = rightEnemyStartY;
  bottomRightEnemyStartPosX = bottomRightEnemyStartX;
  bottomRightEnemyStartPosY = bottomRightEnemyStartY;
  bottomLeftEnemyStartPosX = bottomLeftEnemyStartX;
  bottomLeftEnemyStartPosY = bottomLeftEnemyStartY;
  enemySpawnInterval = lvlSpawnInterval;

}
// call levelSettings based on level
switch (level) {
  case 1:
    levelSettings(
      level1Config.playerSpeed,
      level1Config.levelJumpForce,
      level1Config.leftEnemyStartPosX,
      level1Config.leftEnemyStartPosY,
      level1Config.rightEnemyStartPosX,
      level1Config.rightEnemyStartPosY,
      level1Config.bottomRightEnemyStartPosX,
      level1Config.bottomRightEnemyStartPosY,
      level1Config.bottomLeftEnemyStartPosX,
      level1Config.bottomLeftEnemyStartPosY,
      level1Config.levelSpawnInterval
    );
}

// Define the home page scene
scene("home", () => {
  // Display background image
  add([sprite("background-home"), layer("bg")]);

  // Display title
  const title = add([
    text("Graveyard Guardians", 30),
    pos(width() / 28, height() / 2 - 280),
    layer("ui"),
    {
      value: "Graveyard Guardians",
    },
  ]);

  // Start button
  const startButton = add([
    pos(width() / 2, height() / 2),
    origin("center"),
    layer("ui"),
    area(),
    color(255, 230, 0),
    {
      value: "Start",
    },
    {
      clickAction: () => {
        musicPlayer.pause();
        go("game"); // Switch to the game scene when Start button is clicked
      },
    },
    text("Start", {
      size: 30,
      origin: "center",
    }),
  ]);

  const instructionsButton = add([
    pos(width() / 2, height() / 2 + 60),
    origin("center"),
    layer("ui"),
    area(),
    color(255, 230, 0),
    {
      value: "Instructions",
    },
    {
      clickAction: () => {
        musicPlayer.pause();
        go("instructions");
      },
    },
    text("Instructions", {
      size: 30,
      origin: "center",
    }),
  ]);

  // Speaker button
  const speakerButton = add([
    pos(50, height() - 50),
    origin("center"),
    layer("ui"),
    area(),
    sprite("sound"), // Initial sprite based on isMuted variable
    scale(0.1),
    color(255, 255, 255),
    {
      value: "Speaker",
      isPlaying: true, // Added a property to track if music is playing
    },
    {
      clickAction: function () {
        if (this.isPlaying) {
          this.use("mute"); // If music is playing, switch to mute sprite
          this.isPlaying = false; // Toggle playing state
          musicPlayer.pause(); // Pause the music
        } else {
          this.use("sound"); // If music is paused, switch to sound sprite
          this.isPlaying = true; // Toggle playing state
          musicPlayer.play(); // Start playing the music
        }
      },
    },
  ]);

  // Function to play background music and set it to loop
  const musicPlayer = play("home-music", {
    loop: true, // Set loop to true to play the music in a loop
    volume: 0.04, // Adjust the volume as needed (0.0 to 1.0)
  });

  // Initially, music starts playing
  musicPlayer.play();

  // Function to generate a random shade of red
  function randomRed() {
    return rgb(rand(150, 255), rand(0, 50), rand(0, 50));
  }

  // Register onUpdate events for the buttons to handle bloody hover effects
  startButton.onUpdate(() => {
    if (startButton.isHovering()) {
      startButton.color = randomRed(); // Change to a random shade of red when hovered
      startButton.scale = vec2(1.2);
    } else {
      startButton.scale = vec2(1);
      startButton.color = rgb(255, 0, 0); // Default red color for the button
    }
  });

  instructionsButton.onUpdate(() => {
    if (instructionsButton.isHovering()) {
      instructionsButton.color = randomRed(); // Change to a random shade of red when hovered
      instructionsButton.scale = vec2(1.2);
    } else {
      instructionsButton.scale = vec2(1);
      instructionsButton.color = rgb(255, 0, 0); // Default red color for the button
    }
  });

  // Handle mouse clicks on the buttons
  mouseClick(() => {
    const { x, y } = mousePos();
    if (
      x > startButton.pos.x - startButton.width / 2 &&
      x < startButton.pos.x + startButton.width / 2 &&
      y > startButton.pos.y - startButton.height / 2 &&
      y < startButton.pos.y + startButton.height / 2
    ) {
      startButton.clickAction();
    } else if (
      x > instructionsButton.pos.x - instructionsButton.width / 2 &&
      x < instructionsButton.pos.x + instructionsButton.width / 2 &&
      y > instructionsButton.pos.y - instructionsButton.height / 2 &&
      y < instructionsButton.pos.y + instructionsButton.height / 2
    ) {
      instructionsButton.clickAction();
    } else if (
      x > speakerButton.pos.x - speakerButton.width / 2 &&
      x < speakerButton.pos.x + speakerButton.width / 2 &&
      y > speakerButton.pos.y - speakerButton.height / 2 &&
      y < speakerButton.pos.y + speakerButton.height / 2
    ) {
      speakerButton.clickAction();
    }
  });

  // Clear the spawn interval when switching to another scene
  clearInterval(spawnInterval);
});

// How to play button (similar to Start button)
// ...
scene("instructions", () => {
  add([sprite("window"), layer("bg")]);

  // Function to play background music and set it to loop
  const musicPlayer = play("home-music", {
    loop: true, // Set loop to true to play the music in a loop
    volume: 0.04, // Adjust the volume as needed (0.0 to 1.0)
  });

  // Initially, music starts playing
  musicPlayer.play();

  // Display instructions
  add([
    text("Instructions", 30),
    pos(width() / 2, height() / 4),
    origin("center"),
    layer("ui"),
    color(rgb(255, 255, 255)),
  ]);
  const overlay = add([
    rect(width(), height()),
    color(0, 0, 0), // Set the color to black
    opacity(0.5),
  ]);

  const instructionText = [
    "Welcome to Graveyard Guardians!",
    "Instructions:",
    "- Use the arrow keys to move your character.",
    "- Use the space key to shoot.",
    "- Avoid the enemies and obstacles.",
    "- Survive as long as you can!",
  ];

  // Add each line of the instructions
  instructionText.forEach((instructionText, index) => {
    add([
      text(instructionText, {
        size: 24,
        color: rgb(0, 0, 0),
        scale: (width() / 900, height() / 600),
      }),
      pos(width() / 2, height() / 4 + 40 * (index + 2)),
      origin("center"),
      layer("ui"),
    ]);
  });

  // Back button
  const backButton = add([
    rect(120, 40),
    pos(width() / 2, height() - 60),
    origin("center"),
    layer("ui"),
    {
      value: "Back",
    },
    {
      clickAction: () => {
        musicPlayer.pause();
        go("home"); // Switch to the home scene when the Back button is clicked
      },
    },
    text("Back", {
      size: 24,
      color: rgb(0, 0, 0),
      origin: "center",
    }),
  ]);

  // Speaker button
  const speakerButton = add([
    pos(50, height() - 50),
    origin("center"),
    layer("ui"),
    area(),
    sprite("sound"), // Initial sprite based on isMuted variable
    scale(0.1),
    color(255, 255, 255),
    {
      value: "Speaker",
      isPlaying: true, // Added a property to track if music is playing
    },
    {
      clickAction: function () {
        if (this.isPlaying) {
          this.use("mute"); // If music is playing, switch to mute sprite
          this.isPlaying = false; // Toggle playing state
          musicPlayer.pause(); // Pause the music
        } else {
          this.use("sound"); // If music is paused, switch to sound sprite
          this.isPlaying = true; // Toggle playing state
          musicPlayer.play(); // Start playing the music
        }
      },
    },
  ]);

  // Handle mouse clicks on the buttons
  mouseClick(() => {
    const { x, y } = mousePos();
    if (
      x > backButton.pos.x - backButton.width / 2 &&
      x < backButton.pos.x + backButton.width / 2 &&
      y > backButton.pos.y - backButton.height / 2 &&
      y < backButton.pos.y + backButton.height / 2
    ) {
      backButton.clickAction();
    } else if (
      x > speakerButton.pos.x - speakerButton.width / 2 &&
      x < speakerButton.pos.x + speakerButton.width / 2 &&
      y > speakerButton.pos.y - speakerButton.height / 2 &&
      y < speakerButton.pos.y + speakerButton.height / 2
    ) {
      speakerButton.clickAction();
    }
  });
});

// Define the game scene
scene("game", () => {
  add([sprite("background_cemetery"), layer("bg"), scale(0.53)]);

  // assign tiles to map layout
  const tileMapping = generateMappings();
  // attach tiles to game
  const map = [];
  for (let layout of level1Layout) {
    map.push(addLevel(layout, tileMapping));
  }

  const player = add([
    sprite("idle1"),
    pos(width() / 2, height() / 2),
    scale(0.12),
    origin("center"),
    area({ scale: 0.6, offset: vec2(0, 16) }),
    body({ isStatic: true }),
    {
      dir: vec2(1, 0),
      health: 6, // Set player health to 6 hits
    },
  ]);

  let nextRoundText = add([
    text("Zombie Horde", 30),
    pos(width() / 2, height() / 2),
    origin("center"),
    layer("ui"),
    color(255, 0, 0),
    {
      value: "Next Round",
    },
  ]);

  // Initially hide the texts
  nextRoundText.hidden = true;


  function spawnPotion() {
    if (currentPotion) {
      destroy(currentPotion); // Destroy the current potion if it exists
    }

    // Define an array of positions where potions can spawn
    const spawnPositions = [
      pos(130, 495),
      pos(430, 175),
      pos(130, 108),
      pos(750, 365),
      pos(750, 108),
    ];

    // Choose a random position from the spawnPositions array
    const randomPosition = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];

    // Spawn a new potion at the selected position
    currentPotion = add([
      sprite("potion"),
      randomPosition,
      scale(0.2),
      origin("center"),
      area(),
      "potion",
    ]);
  }

  // Call spawnPotion initially to spawn the first potion
  spawnPotion();

  // Use loop to spawn a new potion every 30 seconds
  loop(30, () => {
    spawnPotion();
  });

  // Player collects the potion
  player.onCollide("potion", () => {
    // Increase the player's health
    player.health += 1;

    // Update the health bar
    updateHealthBar();

    // Destroy the health item after the collision
    destroy(currentPotion);
  });


  function updatePlayerPosition() {
    const playerPosition = player.pos;

    // Check if the player falls off the screen vertically
    if (playerPosition.y > height()) {
      // Player fell off the screen
      handlePlayerDeath();
    }
  }

  // Function to handle player's death
  function handlePlayerDeath() {
    musicPlayer.pause(); // Pause the music
    go("gameOver", { zombiesKilled: destroyedZombies, bossesKilled: destroyedBosses }); // Switch to the game over scene
  }

  // Update function for the game scene
  action(() => {
    updatePlayerPosition();
  });

  let currentSpriteIndex = 0;
  const spriteChangeDelay = 0.05;

  // Speaker button
  const speakerButton = add([
    pos(50, height() - 50),
    origin("center"),
    layer("ui"),
    area(),
    sprite("sound"), // Initial sprite based on isMuted variable
    scale(0.1),
    color(255, 255, 255),
    {
      value: "Speaker",
      isPlaying: true, // Added a property to track if music is playing
    },
    {
      clickAction: function () {
        if (this.isPlaying) {
          this.use("mute"); // If music is playing, switch to mute sprite
          this.isPlaying = false; // Toggle playing state
          musicPlayer.pause(); // Pause the music
        } else {
          this.use("sound"); // If music is paused, switch to sound sprite
          this.isPlaying = true; // Toggle playing state
          musicPlayer.play(); // Start playing the music
        }
      },
    },
  ]);

  // Function to play background music and set it to loop
  const musicPlayer = play("game1-music", {
    loop: true, // Set loop to true to play the music in a loop
    volume: 0.04, // Adjust the volume as needed (0.0 to 1.0)
  });

  // Initially, music starts playing
  musicPlayer.play();

  const healthBar = add([
    rect(200, 20), // Width: 200, Height: 20
    pos(50, 50), // Position of the health bar on the screen
    layer("ui"), // UI layer
    {
      value: player.health, // Initial player health
    },
    color(255, 255, 0),
  ]);

  // Function to update the health bar based on player's health
  function updateHealthBar() {
    // Calculate the percentage of remaining health
    const percentage = player.health / 6; // Assuming maximum health is 6

    // Update health bar width based on player's health
    healthBar.width = player.health * 33.3;

    // Set health bar color based on remaining health
    healthBar.color = rgb(255 * (1 - percentage), 255 * percentage, 0);
  }

  let currentFrame = 0; // Track the current frame index
  let originalFacingDirection = false; // Variable to store the original facing direction

  // Handle player movement
  onKeyDown("right", async () => {
    originalFacingDirection = false;
    currentSpriteIndex++;

    if (currentSpriteIndex >= spriteNames.length) {
      currentSpriteIndex = 0;
    }
    const nextSpriteName = spriteNames[currentSpriteIndex];
    player.move(SPEED, 0), (player.flipX = false);
    await wait(spriteChangeDelay);
    player.use(sprite(nextSpriteName));

    player.dir = vec2(1, 0);
  });

  onKeyDown("left", async () => {
    originalFacingDirection = true;
    currentSpriteIndex++;
    if (currentSpriteIndex >= spriteNames.length) {
      currentSpriteIndex = 0;
    }
    const nextSpriteName = spriteNames[currentSpriteIndex];
    player.move(-SPEED, 0);
    await wait(spriteChangeDelay);
    player.use(sprite(nextSpriteName));
    player.flipX(true);
    player.dir = vec2(-1, 0);
  });

  onKeyDown("up", async () => {
    currentSpriteIndex++;
    if (currentSpriteIndex >= jumpNames.length) {
      currentSpriteIndex = 0;
    }

    if (player.grounded()) {
      player.jump(400);
    }

    const jumpForce = JUMP_FORCE;

    // Apply jump force to the player without changing the facing direction
    player.jump(0, -SPEED, jumpForce);

    // Use the correct jump sprite based on the original facing direction
    player.use(
      sprite(jumpNames[currentSpriteIndex], { flipX: originalFacingDirection })
    );
  });

  keyDown("down", () => {
    player.move(0, 120);
  });

  keyPress("space", () => {
    play("gunshot", { volume: 0.05 });
    const bullet = createBullet(player);
  });

  keyPress("escape", () => {
    musicPlayer.pause();
    destroyedZombies = 0;
    destroyedBosses = 0;
    clearInterval(spawnInterval);
    go("home");
  });

  loadSprite("red", "public/sprites/bullet/red.png");

  loadSprite("zombie_male", "public/sprites/zombie_male/Walk1.png");
  loadSprite("zombie_female", "public/sprites/zombie_female/Walk1.png");
  loadSprite("doll_ghost", "public/sprites/doll_ghost/doll_ghost_00.png");
  loadSprite("grumpy_ghost", "public/sprites/grumpy_ghost/grumpy_ghost_00.png");
  loadSprite("skeleton_bomb", "public/sprites/skeleton_bomb/idle/skeleton-00_idle_00.png")

  // Define a variable to keep track of the number of spawned enemies
  let numSpawnedEnemies = 0;

  let enemyHealth = 3; // Set the initial health of enemies

  let canAttack = true; // Variable to control attack rate

  // Define the moveEnemy function
  function moveEnemy(enemy) {
    const distanceToPlayer = player.pos.sub(enemy.pos).len(); // Calculate distance to player

    // If the enemy is close to the player, perform attack
    if (distanceToPlayer < 50) {
      performAttack(enemy);
    }

    const movementDirection = player.pos.sub(enemy.pos).unit();

    if (destroyedZombies >= 16) {
      enemy.move(movementDirection.scale(14000 * dt()));
      enemyHealth = 6;
      nextRoundText.hidden = true;
    } else if (destroyedZombies >= 15) {
      enemy.move(movementDirection.scale(14000 * dt()));
      enemyHealth = 6;
      nextRoundText.hidden = false;
    } else if (destroyedZombies >= 11) {
      enemy.move(movementDirection.scale(10000 * dt()));
      enemyHealth = 5;
      nextRoundText.hidden = true;
    } else if (destroyedZombies >= 10) {
      enemy.move(movementDirection.scale(10000 * dt()));
      enemyHealth = 5;
      nextRoundText.hidden = false;
    } else if (destroyedZombies >= 6) {
      enemy.move(movementDirection.scale(6000 * dt()));
      enemyHealth = 4;
      nextRoundText.hidden = true;
    } else if (destroyedZombies >= 5) {
      enemy.move(movementDirection.scale(6000 * dt()));
      nextRoundText.hidden = false;
      enemyHealth = 4;
    } else {
      enemy.move(movementDirection.scale(2000 * dt()));
      nextRoundText.hidden = true;
    }

    // Flip the enemy sprite based on player's position
    if (player.pos.x > enemy.pos.x) {
      // Player is on the right-hand side of the enemy
      enemy.flipX(false);
    } else {
      // Player is on the left-hand side of the enemy
      enemy.flipX(true);
    }

    function performAttack(enemy) {
      if (canAttack) {
        play("player-hit", { volume: 0.05 });
        // Check if the enemy can attack (based on timer)
        canAttack = false; // Set canAttack to false to prevent rapid attacks
        setTimeout(() => {
          canAttack = true; // Allow the enemy to attack again after the delay
        }, 1000); // Set the delay in milliseconds (adjust as needed)

        // Decrease player's health by 3 when attacked by a boss enemy.
        if (enemy.isBoss) {
          player.health -= 3;
        } else {
          player.health--; // Decrease player's health by 1 when attacked by a regular enemy.
        }
        healthBar.color = rgb(255, 0, 0);

        // Update health bar
        updateHealthBar();

        // Check if the player is out of health
        if (player.health <= 0) {
          play("player-death", { volume: 0.05 });
          musicPlayer.pause();
          // Switch to game over scene with the number of zombies killed as a parameter
          go("gameOver", { zombiesKilled: destroyedZombies, bossesKilled: destroyedBosses });
        }
      }
    }

    // Handle mouse clicks on the buttons
    mouseClick(() => {
      const { x, y } = mousePos();
      if (
        x > speakerButton.pos.x - speakerButton.width / 2 &&
        x < speakerButton.pos.x + speakerButton.width / 2 &&
        y > speakerButton.pos.y - speakerButton.height / 2 &&
        y < speakerButton.pos.y + speakerButton.height / 2
      ) {
        speakerButton.clickAction();
      }
    });
  }

  const spawnRandomEnemy = (x, y) => {

    const randomEnemySprite =
      enemySprites[Math.floor(Math.random() * enemySprites.length)];

    let enemyAreaScale = randomEnemySprite == "zombie_female" ? 0.7 : 0.8;
    const enemy = add([
      sprite(randomEnemySprite),
      pos(x, y),
      origin("center"),
      scale(0.15),
      body(),
      area({ scale: vec2(enemyAreaScale, 1) }),
      "enemy",
    ]);

    console.log(destroyedZombies)

    console.log(destroyedBosses)

    console.log(enemyHealth)

    console.log(enemySpawnInterval)


    // check the altitude of the player vs enemy
    // to make enemy walk horizontally if is grounded
    enemy.onUpdate(() => {
      if (player.pos.y > enemy.pos.y) {
        if (player.pos.x > enemy.pos.x) {
          enemy.move(SPEED / 6, 0);
        } else {
          enemy.move(-(SPEED / 6), 0);
        }
      }
    });

    // Increment the number of spawned enemies
    numSpawnedEnemies++;

    // Handle enemy movement towards the player
    enemy.action(() => {
      moveEnemy(enemy);

      // Randomly jump with a 0.7% probability
      if (Math.random() < 0.007 && enemy.grounded()) {
        enemy.jump(0, -JUMP_FORCE);
      }
    });

    return enemy;
  };

  const spawnBossEnemy = (x, y) => {

    let enemyAreaScale = bossSprite ? 0.3 : 0.4;
    const boss = add([
      sprite(bossSprite[0]),
      pos(x, y),
      origin("center"),
      scale(0.15),
      body(),
      area({ scale: vec2(enemyAreaScale, 1) }),
      "enemy",
      {
        health: 10,
        isBoss: true,
      },
    ]);

    // check the altitude of the player vs enemy
    // to make enemy walk horizontally if is grounded
    boss.onUpdate(() => {
      if (player.pos.y > boss.pos.y) {
        if (player.pos.x > boss.pos.x) {
          boss.move(SPEED / 6, 0);
        } else {
          boss.move(-(SPEED / 6), 0);
        }
      }
    });

    // Handle enemy movement towards the player
    boss.action(() => {
      moveEnemy(boss);

      // Randomly jump with a 0.7% probability
      if (Math.random() < 0.007 && boss.grounded()) {
        boss.jump(0, -JUMP_FORCE);
      }
    });

    return boss;
  };

  let bossSpawned = false;

  // Update function to spawn random enemies at random positions
  const spawnPoints = [
    { x: leftEnemyStartPosX, y: leftEnemyStartPosY },
    { x: rightEnemyStartPosX, y: rightEnemyStartPosY },
    { x: bottomRightEnemyStartPosX, y: bottomRightEnemyStartPosY },
    { x: bottomLeftEnemyStartPosX, y: bottomLeftEnemyStartPosY },
  ];

  const enemySprites = ["zombie_male", "zombie_female", "doll_ghost", "grumpy_ghost"];
  const bossSprite = ["skeleton_bomb"];

  spawnInterval = setInterval(() => {
    const randomSpawnPoint =
      spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    spawnRandomEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
    if (destroyedZombies === 5 && !bossSpawned) {
      spawnBossEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
      bossSpawned = true;
    } else if (destroyedZombies === 10 && !bossSpawned) {
      spawnBossEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
      bossSpawned = true;
    } else if (destroyedZombies === 15 && !bossSpawned) {
      spawnBossEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
      bossSpawned = true;
    } else if (destroyedZombies === 17 && !bossSpawned) {
      spawnBossEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
      bossSpawned = true;
    } else if (destroyedZombies === 19 && !bossSpawned) {
      spawnBossEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
      bossSpawned = true;
    } else if (destroyedZombies === 20 && !bossSpawned) {
      spawnBossEnemy(randomSpawnPoint.x, randomSpawnPoint.y);
      bossSpawned = true;
    } else {
      bossSpawned = false;
    }
  }, enemySpawnInterval); // Spawn a new enemy every 3 seconds (adjust the interval as needed)


  function createBullet(player) {
    const bulletSpeed = 10000;
    const bulletDirection = player.dir;

    const bullet = add([
      sprite("red"),
      pos(player.pos.sub(0, -20)),
      origin("center"),
      area({ width: 8, height: 8 }),
      {
        dir: bulletDirection,
      },
    ]);

    // Flip the bullet sprite if shooting left
    if (bulletDirection.x === -1) {
      bullet.flipX(true);
    }

    // Update function to move the bullet
    bullet.action(() => {
      bullet.move(bullet.dir.scale(bulletSpeed * dt()));
    });

    // Remove the bullet when it goes out of the screen
    bullet.action(() => {
      if (
        bullet.pos.x < 0 ||
        bullet.pos.x > width() ||
        bullet.pos.y < 0 ||
        bullet.pos.y > height()
      ) {
        bullet.destroy();
      }
    });

    // Handle collisions with enemies
    bullet.collides("enemy", (enemy) => {
      // Decrease enemy health
      play("zombie-hit", { volume: 0.05 });
      enemy.health = enemy.health || enemyHealth;
      enemy.health--; // Decrease enemy health by 1 each time they are hit

      // Check if the enemy has no health left
      if (enemy.health <= 0) {
        // Check if the enemy is a boss
        if (enemy.isBoss) {
          play("boss-death", { volume: 0.2 }); // Play the boss death sound
          destroyedBosses++;
        } else {
          play("enemy-death", { volume: 0.05 }); // Play the regular enemy death sound
        }

        // If the enemy is out of health, destroy it
        enemy.destroy();
        destroyedZombies++;
      }

      bullet.destroy(); // Destroy the bullet after hitting an enemy
    });

    return bullet;
  }

  // Update health bar to reflect player's health
  updateHealthBar();

});

// Game over scene
scene("gameOver", ({ zombiesKilled }) => {
  add([
    sprite("background_cemetery"),
    layer("bg"),
    scale(0.53),
    text(`You were killed!\nZombies killed: ${zombiesKilled}\nBosses Killed: ${destroyedBosses}`, 24),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  const restartButton = add([
    pos(width() / 2, height() / 2 + 80),
    origin("center"),
    layer("ui"),
    area(),
    color(255, 230, 0),
    {
      value: "Restart",
      clickAction: () => {
        // Reset destroyedZombies to 0 when entering the game scene
        destroyedZombies = 0;
        destroyedBosses = 0;
        musicPlayer.pause();
        go("home");
      },
    },
    text("Try Again!", {
      size: 50,
      origin: "center",
    }),
  ]);

  // Speaker button
  const speakerButton = add([
    pos(50, height() - 50),
    origin("center"),
    layer("ui"),
    area(),
    sprite("sound"), // Initial sprite based on isMuted variable
    scale(0.1),
    color(255, 255, 255),
    {
      value: "Speaker",
      isPlaying: true, // Added a property to track if music is playing
    },
    {
      clickAction: function () {
        if (this.isPlaying) {
          this.use("mute"); // If music is playing, switch to mute sprite
          this.isPlaying = false; // Toggle playing state
          musicPlayer.pause(); // Pause the music
        } else {
          this.use("sound"); // If music is paused, switch to sound sprite
          this.isPlaying = true; // Toggle playing state
          musicPlayer.play(); // Start playing the music
        }
      },
    },
  ]);

  // Function to play background music and set it to loop
  const musicPlayer = play("home-music", {
    loop: true, // Set loop to true to play the music in a loop
    volume: 0.04, // Adjust the volume as needed (0.0 to 1.0)
  });

  // Initially, music starts playing
  musicPlayer.play();

  // Function to generate a random shade of red
  function randomRed() {
    return rgb(rand(150, 255), rand(0, 50), rand(0, 50));
  }

  // Register onUpdate events for the buttons to handle bloody hover effects
  restartButton.onUpdate(() => {
    if (restartButton.isHovering()) {
      restartButton.color = randomRed(); // Change to a random shade of red when hovered
      restartButton.scale = vec2(1.2);
    } else {
      restartButton.scale = vec2(1);
      restartButton.color = rgb(255, 0, 0); // Default red color for the button
    }
  });

  mouseClick(() => {
    const { x, y } = mousePos();
    if (
      x > restartButton.pos.x - restartButton.width / 2 &&
      x < restartButton.pos.x + restartButton.width / 2 &&
      y > restartButton.pos.y - restartButton.height / 2 &&
      y < restartButton.pos.y + restartButton.height / 2
    ) {
      restartButton.clickAction();
    }
  });

  // Clear the spawn interval when switching to another scene
  clearInterval(spawnInterval);
});

// Load assets and start the home page scene
loadSprite("background-home", "public/background-images/home_page.png", {
  sliceX: 1,
  sliceY: 1,
});

const spriteNames = ["idle1", "walk1", "walk2", "walk3", "walk5"];
const spritePaths = [
  "public/sprites/jack-o-lantern/Idle1.png",
  "public/sprites/jack-o-lantern/walk1.png",
  "public/sprites/jack-o-lantern/walk2.png",
  "public/sprites/jack-o-lantern/walk3.png",
  "public/sprites/jack-o-lantern/walk4.png",
  "public/sprites/jack-o-lantern/walk5.png",
];
const jumpNames = ["jump1", "jump2", "jump3"];
const jumpPaths = [
  "public/sprites/jack-o-lantern/jump1.png",
  "public/sprites/jack-o-lantern/jump2.png",
  "public/sprites/jack-o-lantern/jump3.png",
];
jumpPaths.forEach((path, index) => {
  loadSprite(jumpNames[index], path);
});
spriteNames.forEach((name, index) => {
  loadSprite(name, spritePaths[index]);
});

loadSprite("window", "public/background-images/window.jpg", {
  sliceX: 1,
  sliceY: 1,
});

loadSprite("idle1", "public/sprites/jack-o-lantern/Idle1.png");
loadSprite(
  "background_cemetery",
  "public/sprites/objects_set/background_cemetery.png",
  {
    sliceX: 1,
    sliceY: 1,
  }
);

loadSprite("potion", "public/sprites/potion.png");

loadSprite("player", "public/sprites/jack-o-lantern/Idle1.png", {
  sliceX: 0,
  sliceY: 3,
  anims: {
    walk: {
      from: 0,
      to: 3,
      loop: true,
    },
  },
});

// Load the speaker sprite for the speaker button
loadSprite("sound", "public/sprites/speaker/sound.png");
loadSprite("mute", "public/sprites/speaker/mute.png");

// Load the background music
loadSound("home-music", "public/sound/home.ogg");
loadSound("game1-music", "public/sound/game1.ogg");

// Load the gunshot sound
loadSound("gunshot", "public/sound/gunshot.mp3", 0);
// Load the hit sound
loadSound("zombie-hit", "public/sound/zombie-hit.mp3");
loadSound("player-hit", "public/sound/player-hit.mp3");
// Load the death sound
loadSound("enemy-death", "public/sound/death.mp3");
loadSound("player-death", "public/sound/player-death.mp3");
loadSound("boss-death", "public/sound/scary-laugh.mp3");

go("home");
