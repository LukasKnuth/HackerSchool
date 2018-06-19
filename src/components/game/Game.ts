import * as pixi from "pixi.js";
import {GameState} from '@/components/game/GameState';
import {Level} from '@/content/Lesson';

// ----------------- ASSET LOADING -----------------

const FILE_ASSET_PLAYER1 = "/sprites/player.png";
const FILE_ASSET_BACKGROUND = "/sprites/background.png";

export interface GameSprites {
    player1: pixi.Sprite;
    background: pixi.Sprite;
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
        background: resourceToSprite(FILE_ASSET_BACKGROUND)
    };
}

// ------------------- GAME LOOP ----------------------

const gameLoop = (app: pixi.Application, level: Level, userCode: string) => {
    // Reset state:
    const state = new GameState();
    // eval code:
    const context = level.getActions(state);  // TODO this way will capture the gamestate. Is that OK? What about reset?
    const gameLogic = new Function(userCode).bind(context);

    app.ticker.destroy(); // TODO reset needed!
    app.ticker.add((delta: number) => { // todo this will tick with 60fps. Simulation should be slower! Do we need this??
        gameLogic(delta);
        level.tick(state);
    });
};
