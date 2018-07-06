import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    GameState,
    GridState,
    PLAYER_ORIENTATION_RIGHT,
    PlayerPosition,
    T,
    TILE_COLLECTIBLE,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl04_AdvancedLoop implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly showDebugLog = false;
    public readonly description = "Tipp: Wenn du nicht weiter weist, kannst du die vorherigen Level zu Rate ziehen," +
        "da sie auf einander aufbauen.";
    public readonly maxBlocks = 6;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Schleifen für Fortgeschrittene";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, _],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, _, _],
        [X, X, X, X, X, X, X, X, X, X, X, X, _, _, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, T, X, X],
        [X, X, X, X, X, X, X, X, X, X, _, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, _, X, X, X, X],
        [X, X, X, X, X, X, X, X, _, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, _, _, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, _, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, _, _, X, X, X, X, X, X, X, X, X],
        [X, X, X, _, _, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, X, X, X, X, X, X, X, X, X, X, X, X],
        [_, _, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];


    exportAPI(gameState: GameState) {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            attachGameBlockAPI(interpreter, scope, gameState);
        };
    }

    getBlocks(): BlockToolbox {
        return {
            Control: [/*"controls_if",*/ "controls_repeat_ext"/*, "controls_whileUntil"*/],
            Game: ["forward", "backward", 'turn_left', 'turn_right'/*, 'sensor_camera', 'sensor_radar'*/],
            //   Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number"/*, "text", "logic_boolean", "math_random_int"*/],
            //   Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(2, 12, PLAYER_ORIENTATION_RIGHT));
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
                gameState.setGameOver(true, true, "Super! Halte immer wieder Ausschau nach sich wiederholenden Mustern, die durch Schleifen vereinfacht werden können.");
                break;
        }

        if(!gameState.isGameOver && !gameState.hasMoreCode){
            gameState.setGameOver(true, false, MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED)
        }
    }
}