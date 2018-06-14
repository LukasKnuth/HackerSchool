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

const loadResources: () => Promise<void> = () => {
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
};

const resourceToSprite: (assetFile: string) => pixi.Sprite = (file) => {
    return new pixi.Sprite(pixi.loader.resources[file].texture);
};

export const loadSprites: (app: pixi.Application) => Promise<GameSprites> = async (app) => {
    await loadResources();
    return {
        player1: resourceToSprite(FILE_ASSET_PLAYER1),
        background: resourceToSprite(FILE_ASSET_BACKGROUND)
    };
};

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
