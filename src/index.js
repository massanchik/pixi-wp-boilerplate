import {randomInt} from './utill';
import {keyboard} from './input';
import {contain} from './helper';

let Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite,
    renderWindow = PIXI.autoDetectRenderer;

let stage = new Container(),
    renderer = renderWindow(512, 512);
document.body.appendChild(renderer.view);

PIXI.loader.add([
    'images/dung.json',
]).load(setup);


let dungeon, explorer, treasure, door, blob;

function setup(loader, resources) {
    let id = resources['images/dung.json'].textures;

    dungeon = new Sprite(id['dungeon.png']);
    stage.addChild(dungeon);

    explorer = new Sprite(id['explorer.png']);

    explorer.x = 68;
    explorer.y = stage.height / 2 - explorer.height / 2;
    explorer.vx = 0;
    explorer.vy = 0;
    explorer.accelerationX = 0;
    explorer.accelerationY = 0;
    explorer.frictionX = 1;
    explorer.frictionY = 1;
    explorer.speed = 0.2;
    explorer.drag = 0.98;

    let left = keyboard(['left', 'a']),
        up = keyboard(['up', 'w']),
        right = keyboard(['right', 'd']),
        down = keyboard(['down', 's']);

    left.press = () => {
        explorer.accelerationX = -explorer.speed;
        explorer.frictionX = 1;
    };
    left.release = () => {
        if (!right.isDown) {
            explorer.accelerationX = 0;
            explorer.frictionX = explorer.drag;
        }
    };
    //Up
    up.press = () => {
        explorer.accelerationY = -explorer.speed;
        explorer.frictionY = 1;
    };
    up.release = () => {
        if (!down.isDown) {
            explorer.accelerationY = 0;
            explorer.frictionY = explorer.drag;
        }
    };
//Right
    right.press = () => {
        explorer.accelerationX = explorer.speed;
        explorer.frictionX = 1;
    };
    right.release = () => {
        if (!left.isDown) {
            explorer.accelerationX = 0;
            explorer.frictionX = explorer.drag;
        }
    };
//Down
    down.press = () => {
        explorer.accelerationY = explorer.speed;
        explorer.frictionY = 1;
    };
    down.release = () => {
        if (!up.isDown) {
            explorer.accelerationY = 0;
            explorer.frictionY = explorer.drag;
        }
    };


    treasure = new Sprite(id['treasure.png']);
    treasure.x = stage.width - treasure.width - 48;
    treasure.y = stage.height / 2 - treasure.height / 2;

    door = new Sprite(id['door.png']);
    door.position.set(32, 0);


    stage.addChild(dungeon);
    stage.addChild(explorer);
    stage.addChild(treasure);
    stage.addChild(door);

    let numberOfBlobs = 6,
        spacing = 48,
        xOffsetL = 150,
        xOffsetR = 80,
        yOffset = 52;

    for (let i = 0; i < numberOfBlobs; i++) {
        blob = new Sprite(id['blob.png']);
        blob.x = spacing * i + xOffsetL - blob.width / 2;
        blob.x = blob.x > stage.width - xOffsetR ? stage.width - xOffsetR : blob.x;
        blob.y = randomInt(0, stage.height - blob.height);
        blob.y = blob.y > stage.height - yOffset ? stage.height - yOffset : blob.y;
        blob.y = blob.y < yOffset ? yOffset : blob.y;
        stage.addChild(blob);
    }

    gameLoop();
}

let state = play;

function play() {
    let collision = contain(explorer, {
        x: 0,
        y: 0,
        width: renderer.view.width,
        height: renderer.view.height,
    });
    if (collision) {
        if (collision.has('left') || collision.has('right')) {
            explorer.vx = 0;
        }
        if (collision.has('top') || collision.has('bottom')) {
            explorer.vy = 0;
        }
    }
    //Apply acceleration by adding the acceleration to the sprite's velocity
    explorer.vx += explorer.accelerationX;
    explorer.vy += explorer.accelerationY;
    //Apply friction by multiplying sprite's velocity by the friction
    explorer.vx *= explorer.frictionX;
    explorer.vy *= explorer.frictionY;

    //Gravity
    explorer.vy += 0.1;

    //Apply the velocity to the sprite's position to make it move
    explorer.x += explorer.vx;
    explorer.y += explorer.vy;

}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}
