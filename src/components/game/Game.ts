import * as pixi from "pixi.js";
import {
    GameState,
    GridPosition,
    SQUARE_COLLECTIBLE, SQUARE_GOAL,
    SQUARE_NEUTRAL,
    SQUARE_PIT, SQUARE_TELEPORT_ENTRY, SQUARE_TELEPORT_EXIT,
    SQUARE_TRAP
} from '@/components/game/GameState';
import {Level} from '@/content/Lesson';
import Interpreter, {API, InterpreterScope} from 'js-interpreter';

export const BLOCK_EXECUTING = "blockExecuting";

// ----------------- ASSET LOADING -----------------

const FILE_ASSET_PLAYER1 = "/sprites/player.png";
const FILE_ASSET_BACKGROUND = "/sprites/background.png";

export interface GameLoop {
    ticker: (delta: number) => void;
    onBlockExecuting?: (blockId: string) => void;
    onGameTerminated?: () => void;
}
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
    // Create fresh state:
    let gameLoop: GameLoop;
    const gameState = new GameState(level.mazeWidth, level.mazeHeight);
    const userCodeApi = level.exportAPI(gameState);  // TODO this way will capture the gamestate. Is that OK? What about reset?
    // Inject the block-highlighting callback:
    let hasMoreCode = true;
    let blockExecutionPause = false;
    const onBlockExecuting = (blockId: string) => {
        if (gameLoop.onBlockExecuting) {
            gameLoop.onBlockExecuting(blockId);
        }
        blockExecutionPause = true;
    };
    const apiWrapper: API = (interp: Interpreter, scope: InterpreterScope) => {
        const blockExecWrapper = (id: any) => onBlockExecuting(id ? id.toString() : '');
        interp.setProperty(scope, BLOCK_EXECUTING, interp.createNativeFunction(blockExecWrapper));
        // Add the levels own API
        userCodeApi(interp, scope);
    };
    // eval code:
    const interpreter = new Interpreter(userCode, apiWrapper);
    // initialize maze
    level.initializeState(gameState); // TODO this needs to be earlier, can't see level otherwise!
    // run game loop:
    let gameTime = 0;
    const loop = (delta: number) => {
        gameTime += app.ticker.elapsedMS * delta;
        if (gameTime >= LOGIC_TICK_THRESHOLD && hasMoreCode) {
            console.log("Ticking User-Code (single Block execution)!");
            gameTime = 0;
            do {
                hasMoreCode = interpreter.step();
                if (!hasMoreCode && gameLoop.onGameTerminated) {
                    gameLoop.onGameTerminated();
                }
            } while (!blockExecutionPause && hasMoreCode);
            blockExecutionPause = false;
            level.tick(gameState);
        }
        render(gameState);
    };
    gameLoop = {ticker: loop};
    app.ticker.add(loop);
    app.ticker.start();
    return gameLoop;
}

export function stopGameLoop(app: pixi.Application, loop: GameLoop): void {
    app.ticker.remove(loop.ticker);
    app.ticker.stop();
    // unset these so it can be collected!
    loop.onGameTerminated = undefined;
    loop.onBlockExecuting = undefined;
}

// ---------------- RENDER --------------------------

export async function initializeRenderer(app: pixi.Application): Promise<GameSprites> {
    const sprites = await loadSprites(app);
    //app.stage.addChild(sprites.background);
    app.stage.addChild(sprites.grid);
    app.stage.addChild(sprites.player1);

    sprites.player1.position.set(40, 100);
    sprites.player1.scale.set(0.1, 0.1);

    return sprites;
}

export function renderFrame(app: PIXI.Application, sprites: GameSprites, state: GameState) {
    const fullWidth = app.renderer.view.width;
    const fullHeight = app.renderer.view.height;
    // Render the maze:
    const xGridSize = fullWidth / state.mazeWidth;
    const yGridSize = fullHeight / state.mazeHeight;
    sprites.grid.clear();
    const pos = new GridPosition(0, 0);
    for (let x = 0; x < state.mazeWidth; x++) {
        pos.x = x;
        for (let y = 0; y < state.mazeHeight; y++) {
            pos.y = y;
            const square = state.getGridSquare(pos);
            sprites.grid.lineStyle(1, 0xacacac, .7);
            // Render the square:
            switch (square) {
                case SQUARE_PIT:
                    sprites.grid.beginFill(0xb49147);
                    break;
                case SQUARE_TRAP:
                    sprites.grid.beginFill(0xd84f32);
                    break;
                case SQUARE_COLLECTIBLE:
                    sprites.grid.beginFill(0xdfdd2d);
                    break;
                case SQUARE_TELEPORT_ENTRY:
                    sprites.grid.beginFill(0xb42ddf);
                    break;
                case SQUARE_TELEPORT_EXIT:
                    sprites.grid.beginFill(0xdf2db1);
                    break;
                case SQUARE_GOAL:
                    sprites.grid.beginFill(0x6ab446);
                    break;
                case SQUARE_NEUTRAL:
                default:
                    sprites.grid.beginFill(0x000);
            }
            sprites.grid.drawRect(x * xGridSize, y * yGridSize, xGridSize, yGridSize);
            sprites.grid.endFill();
        }
    }
    // Render the player:
    const playerPosition = state.getPlayerPosition();
    const playerX = playerPosition.x * xGridSize;
    const playerY = playerPosition.y * yGridSize;
    sprites.player1.x = playerX;
    sprites.player1.y = playerY;
    // TODO change player size dynamically?? Also center him inside the grid!
}
