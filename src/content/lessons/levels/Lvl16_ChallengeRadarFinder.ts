import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    GameState,
    GridPosition,
    GridState,
    GridTile,
    PLAYER_ORIENTATION_DOWN,
    PlayerPosition,
    TILE_BLUE,
    TILE_COLLECTIBLE,
    TILE_ENEMY_COLOR,
    TILE_GREEN,
    TILE_NEUTRAL,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_CODE_OVER_BUT_YOU_NEED_MORE_COLLECTABLES, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl16_ChallengeRadarFinder implements Level {
    public readonly allowMethods = true;
    public readonly allowVariables = true;
    public readonly showDebugLog = true;
    public readonly description = "Diesmal sind die Kristalle versteckt und ihre Anordnung ändert sich von Mal zu Mal." +
        " Benutze dein neues Radar, um sie ausfindig zu machen.";
    public readonly maxBlocks = 40; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Herausforderung: Unsichtbar";

    private readonly requiredCollectiblesNumber = 3;

    private currentlyAcquiredCollectibles = 0;
    private collectiblePositions: GridTile[] = [];
    private firstTurn = false;

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, X, _, _, _, _, _, X, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    exportAPI(gameState: GameState) {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            attachGameBlockAPI(interpreter, scope, gameState);
        };
    }

    getBlocks(): BlockToolbox {
        return {
            Control: ["controls_if", "controls_repeat_ext", "controls_whileUntil"],
            Game: ["forward", "backward", 'turn_left', 'turn_right', 'sensor_camera', 'sensor_radar'],
            Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number", "text", "logic_boolean", /* "math_random_int"*/],
            Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(7, 2, PLAYER_ORIENTATION_DOWN));
        this.firstTurn = true;
        this.collectiblePositions.length = 0;
        this.currentlyAcquiredCollectibles = 0;
    }

    tick(gameState: GameState): void {
        const playerPos = gameState.getPlayerPosition();

        if (this.firstTurn) {
            this.firstTurn = false;

            //find all available spaces to put things in
            let availableSpaces: GridPosition[] = [];
            let currentTilePos = new GridPosition(0, 0);
            for (let row = 0; row < gameState.mazeHeight; ++row) {
                currentTilePos.y = row;
                for (let col = 0; col < gameState.mazeWidth; ++col) {
                    currentTilePos.x = col;

                    let tile = gameState.getGridTile(currentTilePos);
                    if (
                        (tile === TILE_NEUTRAL
                            || tile === TILE_BLUE
                            || tile === TILE_GREEN
                            || tile === TILE_ENEMY_COLOR)
                        && (!currentTilePos.equals(playerPos))
                    ) {
                        availableSpaces.push(currentTilePos.clone());
                    }
                }
            }

            for(let i = 0; i < this.requiredCollectiblesNumber; ++i){
                //pick one of available positions at random
                const posNumber = Math.round(Math.random() * (availableSpaces.length - 1))
                const selectedTile = availableSpaces.splice(posNumber, 1);
                const position = selectedTile.pop();
                if (position) {
                    gameState.setGridTile(position, TILE_COLLECTIBLE);
                }else{
                    console.log("WTF selected position should never be undefined!")
                }
            }
        }
        const standingOn = gameState.getGridTile(playerPos);
        switch (standingOn) {
            case TILE_PIT:
                gameState.setGameOver(true, false, MSG_FALLEN_IN_PIT);
                break;
            case TILE_COLLECTIBLE:
                this.currentlyAcquiredCollectibles++;
                if (this.currentlyAcquiredCollectibles >= this.requiredCollectiblesNumber) {
                    gameState.setGameOver(true, true, "Klasse! Findest du auch alle Kristalle unabhängig von ihrer Verteilung?");
                } else {
                    gameState.setGridTile(playerPos, TILE_NEUTRAL);
                }
                break;
        }

        if (!gameState.isGameOver && !gameState.hasMoreCode) {
            gameState.setGameOver(true, false, `${MSG_CODE_OVER_BUT_YOU_NEED_MORE_COLLECTABLES} (${this.currentlyAcquiredCollectibles} von ${this.requiredCollectiblesNumber})`)
        }
    }
}