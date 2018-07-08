import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    B,
    G,
    GameState,
    GridState,
    PLAYER_ORIENTATION_RIGHT,
    PlayerPosition,
    R,
    T,
    TILE_COLLECTIBLE,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class LevelBlueGroup1 implements Level {
    public readonly allowMethods = true;
    public readonly showDebugLog = true;
    public readonly allowVariables = true;

    public readonly description = "";
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Moderne Kunst?";
    public readonly maxBlocks = 15; //todo set this!

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, G, G, G, G, G, B, _, X, _, _, _, _, G, X],
        [X, X, X, X, X, G, _, G, G, G, X, X, X, _, X],
        [X, _, _, _, _, G, G, G, X, G, _, _, _, _, X],
        [X, _, B, _, _, _, _, _, X, G, B, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, G, G, _, B, _, X],
        [X, _, _, _, _, _, _, _, _, _, G, G, _, _, X],
        [X, _, _, R, _, B, X, X, X, X, X, B, X, _, X],
        [X, _, _, R, R, _, X, _, _, _, X, G, X, _, X],
        [X, R, R, R, R, R, X, _, T, _, X, G, X, _, X],
        [X, _, _, R, R, _, X, _, G, _, X, G, X, _, X],
        [X, B, _, R, _, _, X, _, G, X, X, G, X, _, X],
        [X, _, _, _, _, B, X, B, G, G, G, G, X, _, X],
        [X, G, _, _, _, _, X, _, _, _, X, B, X, G, X],
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
        // Todo set initial player position
        gameState.setPlayerPosition(new PlayerPosition(1, 1, PLAYER_ORIENTATION_RIGHT));
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