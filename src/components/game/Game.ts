import * as pixi from "pixi.js";
import {GameState} from '@/components/game/GameState';
import {Level} from '@/content/Lesson';

// ----------------- ASSET LOADING -----------------

const FILE_ASSET_PLAYER1 = "/sprites/player.png";
const FILE_ASSET_BACKGROUND = "/sprites/background.png";

export type GameLoop = (delta: number) => void;
export type GameRenderer = (state: GameState) => void;

export interface GameSprites {
    player1: pixi.Sprite;
    background: pixi.Sprite;
    grid: pixi.Graphics;
}

function loadResources(): Promise<void> {
    if (Object.keys(pixi.loader.resources).length > 0) {
        return Promise.resolve();
    } else {
        return new Promise((resolve, reject) => {
            pixi.loader
                .add(FILE_ASSET_PLAYER1)
                .add(FILE_ASSET_BACKGROUND)
                .on("error", (err) => reject(err))
                .on("progress", (loader, resource) => {
                    console.log(`Loading ${resource.url}, progress at ${loader.progress}%`);
                })
                .load(resolve);
        });
    }
}

function resourceToSprite(assetFile: string): pixi.Sprite {
    return new pixi.Sprite(pixi.loader.resources[assetFile].texture);
}

async function loadSprites(app: pixi.Application): Promise<GameSprites> {
    await loadResources();
    const grid = new pixi.Graphics();
    return {
        player1: resourceToSprite(FILE_ASSET_PLAYER1),
        background: resourceToSprite(FILE_ASSET_BACKGROUND),
        grid
    };
}

// ------------------- GAME LOOP ----------------------

const LOGIC_TICK_THRESHOLD = 1000;

export function startGameLoop(app: PIXI.Application, level: Level, userCode: string, render: GameRenderer): GameLoop {
    // Reset state:
    const state = new GameState(level.mazeWidth, level.mazeHeight);
    // eval code:
    const context = level.getActions(state);  // TODO this way will capture the gamestate. Is that OK? What about reset?
    const gameLogic = new Function(userCode).bind(context);
    // run game loop:
    let gameTime = 0;
    const loop = (delta: number) => {
        gameTime += app.ticker.elapsedMS * delta;
        if (gameTime >= LOGIC_TICK_THRESHOLD) {
            console.log("Tick!");
            gameTime = 0;
            gameLogic(delta);
            level.tick(state);
        }
        render(state);
    };
    app.ticker.add(loop);
    return loop;
}

export function stopGameLoop(app: pixi.Application, loop: GameLoop): void {
    app.ticker.remove(loop);
    app.ticker.stop();
}

// ---------------- RENDER --------------------------

export async function initializeRenderer(app: pixi.Application): Promise<GameSprites> {
    const sprites = await loadSprites(app);
    app.stage.addChild(sprites.background);
    app.stage.addChild(sprites.grid);
    app.stage.addChild(sprites.player1);

    sprites.player1.position.set(40, 100);
    sprites.player1.scale.set(0.25, 0.25);

    return sprites;
}

export function renderFrame(app: PIXI.Application, sprites: GameSprites, state: GameState) {
    const fullWidth = app.renderer.view.width;
    const fullHeight = app.renderer.view.height;
    // Render the maze:
    const xGridSize = fullWidth / state.mazeWidth;
    const yGridSize = fullHeight / state.mazeHeight;

    sprites.grid.clear();
    for (let x = 0; x < state.mazeWidth; x++) {
        for (let y = 0; y < state.mazeHeight; y++) {
            sprites.grid.lineStyle(1, 0xacacac, .7);
            sprites.grid.beginFill(0xfbfbfb, .3);
            sprites.grid.drawRect(x * xGridSize, y * yGridSize, xGridSize, yGridSize);
            sprites.grid.endFill();
        }
    }
}
