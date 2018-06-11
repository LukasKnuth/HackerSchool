import * as pixi from "pixi.js";

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
