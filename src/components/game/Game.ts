import * as pixi from "pixi.js";
import {
    GameState,
    GridPosition, TILE_BLUE,
    TILE_COLLECTIBLE, TILE_GREEN,
    TILE_NEUTRAL,
    TILE_PIT, TILE_TELEPORT_ENTRY, TILE_TELEPORT_EXIT,

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
    onDebugLog?: (log: string, blockId: string) => void;
}
export type GameRenderer = (state: GameState) => void;

export interface GameSprites {
    player1: pixi.Sprite;
    player1Cone: pixi.Graphics;
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
    return {
        player1: resourceToSprite(FILE_ASSET_PLAYER1),
        player1Cone: new pixi.Graphics(),
        background: resourceToSprite(FILE_ASSET_BACKGROUND),
        grid: new pixi.Graphics()
    };
}

// ------------------- GAME LOOP ----------------------

const LOGIC_TICK_THRESHOLD = 1000;

export function renderPreview(app: PIXI.Application, level: Level, render: GameRenderer) {
    const gameState = new GameState(level.mazeWidth, level.mazeHeight); // This is thrown away immediately...
    level.initializeState(gameState);
    render(gameState);
}

export function startGameLoop(app: PIXI.Application, level: Level, userCode: string, render: GameRenderer): GameLoop {
    // Create fresh state:
    let gameLoop: GameLoop;
    const gameState = new GameState(level.mazeWidth, level.mazeHeight);
    const userCodeApi = level.exportAPI(gameState);
    // Inject the block-highlighting callback:
    let hasMoreCode = true;
    let blockExecutionPause = false;
    const onBlockExecuting = (blockId: string) => {
        if (gameLoop.onBlockExecuting) {
            gameLoop.onBlockExecuting(blockId);
        }
        blockExecutionPause = true;
    };
    const onLogAppend = (log: string, blockId: string) => {
        if (gameLoop.onDebugLog) {
            gameLoop.onDebugLog(log, blockId);
        }
    };
    const apiWrapper: API = (interp: Interpreter, scope: InterpreterScope) => {
        const blockExecWrapper = (id: any) => onBlockExecuting(id ? id.toString() : '');
        interp.setProperty(scope, BLOCK_EXECUTING, interp.createNativeFunction(blockExecWrapper));
        const logWrapper = (variable: string, log: string, blockId: string) => {
            const line = `${variable.toString()} is: ${log.toString()}`;
            onLogAppend(line, blockId ? blockId.toString() : '');
        };
        interp.setProperty(scope, "debugLog", interp.createNativeFunction(logWrapper));
        // Add the levels own API
        userCodeApi(interp, scope);
    };
    // eval code:
    const interpreter = new Interpreter(userCode, apiWrapper);
    // initialize maze
    level.initializeState(gameState);
    // run game loop:
    let gameTime = 0;
    const loop = (delta: number) => {
        gameTime += app.ticker.elapsedMS * delta;
        if (gameTime >= LOGIC_TICK_THRESHOLD && hasMoreCode) {
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
    // app.stage.addChild(sprites.background);
    app.stage.addChild(sprites.grid);
    app.stage.addChild(sprites.player1);
    app.stage.addChild(sprites.player1Cone);

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
            const square = state.getGridTile(pos);
            sprites.grid.lineStyle(1, 0xacacac, .7);
            // Render the square:
            switch (square) {
                case TILE_PIT:
                    sprites.grid.beginFill(0x020202);
                    break;
                case TILE_BLUE:
                    sprites.grid.beginFill(0x2222CC);
                    break;
                case TILE_GREEN:
                    sprites.grid.beginFill(0x22CC22);
                    break;
                case TILE_COLLECTIBLE:
                    sprites.grid.beginFill(0xdfdd2d);
                    break;
                case TILE_TELEPORT_ENTRY:
                    sprites.grid.beginFill(0xb42ddf);
                    break;
                case TILE_TELEPORT_EXIT:
                    sprites.grid.beginFill(0xdf2db1);
                    break;
                case TILE_NEUTRAL:
                default:
                    sprites.grid.beginFill(0xBBBBBB);
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

    // TODO instead of this, add a arrow to the sprite and rotate it!
    sprites.player1Cone.clear();
    sprites.player1Cone.beginFill(0xfa1122, .7);
    const size = 20;
    sprites.player1Cone.moveTo(0, 0);
    sprites.player1Cone.lineTo(0, size);
    sprites.player1Cone.lineTo(size, size);
    sprites.player1Cone.lineTo(0, 0);
    sprites.player1Cone.pivot = new pixi.Point(size / 2, size / 2);
    sprites.player1Cone.rotation = (playerPosition.angle + 135) * 0.0174533;
    sprites.player1Cone.x = playerX + (xGridSize / 2);
    sprites.player1Cone.y = playerY + (yGridSize / 2);
    sprites.player1Cone.endFill();

    // TODO change player size dynamically?? Also center him inside the grid!
}
