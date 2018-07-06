import {MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";
import {BlockToolbox, Level} from "@/content/Lesson";
import {
    _,
    GameState,
    GridState,
    PLAYER_ORIENTATION_RIGHT,
    PlayerPosition,
    T, TILE_COLLECTIBLE,
    TILE_PIT,
    X
} from "@/components/game/GameState";
import Interpreter, {InterpreterScope} from "js-interpreter";
import {attachGameBlockAPI} from "@/content/blocks/API";

export default class Lvl01_SimpleInstructions implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly showDebugLog = false;
    public readonly description = "Hier schreibst du das erste Programm. Versuche den Kristall einzusammeln," +
        " indem du Blöcke aus dem Vorrat in den Arbeitsbereich ziehst und sie korrekt anordnest.";
    public readonly maxBlocks = 3;
    //TODO mazeWidth und MazeHeight überflssig?
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Anweisungen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, _, T, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
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
            //   Control: ["controls_if", "controls_repeat_ext", "controls_whileUntil"],
            Game: ["forward", /* "backward", 'turn_left', 'turn_right', 'sensor_camera', 'sensor_radar'*/],
            //   Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            //  Values: ["math_number", "text", "logic_boolean", "math_random_int"],
            //   Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(5, 7, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
        const player = gameState.getPlayerPosition();
        const standingOn = gameState.getGridTile(player);
        switch (standingOn) {
            case TILE_PIT:
                gameState.setGameOver(true, false, MSG_FALLEN_IN_PIT);
                break;
            case TILE_COLLECTIBLE:
                // Instantly wins game
                gameState.setGameOver(true, true, "Level geschafft!");
                break;
        }

        if(!gameState.isGameOver && !gameState.hasMoreCode){
            gameState.setGameOver(true, false, MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED)
        }
    }
}