import {BlockToolbox, Level} from '@/content/Lesson';
import {
    B,
    G,
    GameState,
    GridState,
    PLAYER_ORIENTATION_RIGHT,
    PlayerPosition,
    T,
    TILE_COLLECTIBLE,
    TILE_NEUTRAL,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_CODE_OVER_BUT_YOU_NEED_MORE_COLLECTABLES, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl15_VariablesAndConditionalsBonus implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = true;
    public readonly showDebugLog = true;
    public readonly description = "So eine bunte Landschaft! Zum Glück hast du jetzt neue Blöcke um Wahrheitswerte zu kombinieren.";
    public readonly maxBlocks = 18;//is possible to solve in 13
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Verzwickte Verzweigungen - BONUS";

    private currentlyAcquiredCollectibles = 0;
    private requiredCollectablesNumber = 8;


    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, T, G, B, G, B, G, B, G, T, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, B, G, B, G, B, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, T, B, G, B, G, B, T, X, X],
        [X, X, B, G, B, G, B, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, B, G, B, G, B, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, T, B, T, X, X],
        [X, X, T, G, B, G, T, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
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
            Control: ["controls_if", "controls_repeat_ext"/*, "controls_whileUntil"*/],
            Game: ["forward", "backward", 'turn_left', 'turn_right', 'sensor_camera'/*, 'sensor_radar'*/],
            Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number", "text", "logic_boolean", /* "math_random_int"*/],
            Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        this.currentlyAcquiredCollectibles = 0;
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(4, 3, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
        const player = gameState.getPlayerPosition();
        const standingOn = gameState.getGridTile(player);
        switch (standingOn) {
            case TILE_PIT:
                gameState.setGameOver(true, false, MSG_FALLEN_IN_PIT);
                break;
            case TILE_COLLECTIBLE:
                this.currentlyAcquiredCollectibles ++;
                if (this.currentlyAcquiredCollectibles >= this.requiredCollectablesNumber) {
                    gameState.setGameOver(true, true, "Gut gemacht! Komplexe Manöver sind für dich jetzt ein Klacks. Stelle dein Können in neuen Herausforderungen unter Beweis!");
                }else{
                    gameState.setGridTile(player, TILE_NEUTRAL);
                }
                break;
        }

        if(!gameState.isGameOver && !gameState.hasMoreCode){
            gameState.setGameOver(true, false, `${MSG_CODE_OVER_BUT_YOU_NEED_MORE_COLLECTABLES} (${this.currentlyAcquiredCollectibles} von ${this.requiredCollectablesNumber})`)
        }
    }
}