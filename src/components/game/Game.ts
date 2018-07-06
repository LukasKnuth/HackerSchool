import * as pixi from "pixi.js";
import "pixi-sound";
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
const FILE_SOUND_SUCCESS = "/sounds/success.mp3";
const FILE_SOUND_FAIL = "/sounds/fail.mp3";

export interface GameLoop {
    isPaused: boolean;
    tickWait: number;
    ticker: (delta: number) => void;
    onBlockExecuting?: (blockId: string) => void;
    onGameTerminated?: () => void;
    onGameOver?: (victory: boolean, message: string) => void;
    onDebugLog?: (log: string, blockId: string) => void;
}
export type GameRenderer = (state: GameState) => void;

export interface GameResources {
    player1: pixi.Sprite;
    player1Cone: pixi.Graphics;
    background: pixi.Sprite;
    grid: pixi.Graphics;
    win: pixi.sound.Sound;
    fail: pixi.sound.Sound;
}

function startLoader(): Promise<void> {
    if (Object.keys(pixi.loader.resources).length > 0) {
        return Promise.resolve();
    } else {
        return new Promise((resolve, reject) => {
            pixi.loader
                .add(FILE_SOUND_SUCCESS)
                .add(FILE_SOUND_FAIL)
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
function resourceToSound(assetFile: string): pixi.sound.Sound {
    return (pixi.loader.resources[assetFile] as any).sound;
}

async function loadResources(app: pixi.Application): Promise<GameResources> {
    await startLoader();
    return {
        player1: resourceToSprite(FILE_ASSET_PLAYER1),
        player1Cone: new pixi.Graphics(),
        background: resourceToSprite(FILE_ASSET_BACKGROUND),
        grid: new pixi.Graphics(),
        win: resourceToSound(FILE_SOUND_SUCCESS),
        fail: resourceToSound(FILE_SOUND_FAIL)
    };
}

// ------------------- GAME LOOP ----------------------

export function renderPreview(app: PIXI.Application, level: Level, render: GameRenderer) {
    const gameState = new GameState(level.mazeWidth, level.mazeHeight); // This is thrown away immediately...
    level.initializeState(gameState);
    render(gameState);
}

export function startGameLoop(app: PIXI.Application, level: Level, userCode: string,
                              render: GameRenderer, tickWait: number): GameLoop {
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
            // TODO make this translatable! Return raw data??
            const line = `${variable.toString()} mit Wert: ${log.toString()}`;
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
        if (gameTime >= gameLoop.tickWait) {
            gameTime = 0;
            // check pre-conditions
            if (!gameLoop.isPaused && hasMoreCode && !gameState.isGameOver) {
                do {
                    hasMoreCode = interpreter.step();
                } while (!blockExecutionPause && hasMoreCode);
                blockExecutionPause = false;
                gameState.hasMoreCode = hasMoreCode;
                level.tick(gameState);
                // Check game termination
                if (gameState.isGameOver || !hasMoreCode) {
                    if (gameLoop.onGameTerminated) {
                        gameState.isGameRunning = false;
                        gameLoop.onGameTerminated();
                    }
                    if (gameState.isGameOver && gameLoop.onGameOver) {
                        gameLoop.onGameOver(gameState.isGameWon, gameState.gameOverReason);
                    }
                }
            }
        }
        render(gameState);
    };
    gameLoop = {ticker: loop, tickWait, isPaused: false};
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

export async function initializeRenderer(app: pixi.Application): Promise<GameResources> {
    const sprites = await loadResources(app);
    // app.stage.addChild(sprites.background);
    app.stage.addChild(sprites.grid);
    app.stage.addChild(sprites.player1);
    app.stage.addChild(sprites.player1Cone);

    sprites.player1.position.set(40, 100);
    sprites.player1.scale.set(0.12, 0.15);

    return sprites;
}

export function renderFrame(app: PIXI.Application, resources: GameResources, state: GameState) {
    const fullWidth = app.renderer.view.width;
    const fullHeight = app.renderer.view.height;
    // Render the maze:
    const xGridSize = fullWidth / state.mazeWidth;
    const yGridSize = fullHeight / state.mazeHeight;
    resources.grid.clear();
    const pos = new GridPosition(0, 0);
    for (let x = 0; x < state.mazeWidth; x++) {
        pos.x = x;
        for (let y = 0; y < state.mazeHeight; y++) {
            pos.y = y;
            const square = state.getGridTile(pos);
            resources.grid.lineStyle(1, 0xacacac, .7);
            // Render the square:
            switch (square) {
                case TILE_PIT:
                    resources.grid.beginFill(0x020202);
                    break;
                case TILE_BLUE:
                    resources.grid.beginFill(0x2222CC);
                    break;
                case TILE_GREEN:
                    resources.grid.beginFill(0x22CC22);
                    break;
                case TILE_COLLECTIBLE:
                    resources.grid.beginFill(0xdfdd2d);
                    break;
                case TILE_TELEPORT_ENTRY:
                    resources.grid.beginFill(0xb42ddf);
                    break;
                case TILE_TELEPORT_EXIT:
                    resources.grid.beginFill(0xdf2db1);
                    break;
                case TILE_NEUTRAL:
                default:
                    resources.grid.beginFill(0xBBBBBB);
            }
            resources.grid.drawRect(x * xGridSize, y * yGridSize, xGridSize, yGridSize);
            resources.grid.endFill();
        }
    }
    // Render the player:
    // TODO change player size dynamically?? Also center him inside the grid!
    const playerPosition = state.getPlayerPosition();
    const playerX = playerPosition.x * xGridSize;
    const playerY = playerPosition.y * yGridSize;
    resources.player1.x = playerX;
    resources.player1.y = playerY;

    // TODO instead of this, add a arrow to the sprite and rotate it!
    resources.player1Cone.clear();
    resources.player1Cone.beginFill(0xfa1122, .8);
    const size = 30;
    resources.player1Cone.moveTo(0, 0);
    resources.player1Cone.lineTo(0, size);
    resources.player1Cone.lineTo(size, size);
    resources.player1Cone.lineTo(0, 0);
    resources.player1Cone.pivot = new pixi.Point(size / 2, size / 2);
    resources.player1Cone.rotation = (playerPosition.angle + 135) * 0.0174533;
    resources.player1Cone.x = playerX + (xGridSize / 2);
    resources.player1Cone.y = playerY + (yGridSize / 2);
    resources.player1Cone.endFill();

    // Play sounds?
    if (state.isGameOver && state.isGameWon) {
        resources.win.volume = 0.05;
        resources.win.play();
    } else if ((state.isGameOver || !state.isGameRunning) && !state.isGameWon) {
        resources.fail.volume = 0.5;
        resources.fail.play();
    }
}
