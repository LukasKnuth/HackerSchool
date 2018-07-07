import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    B,
    GameState,
    GridState,
    PLAYER_ORIENTATION_LEFT,
    PlayerPosition,
    T,
    TILE_COLLECTIBLE,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl12_BoolVariables implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = true;
    public readonly showDebugLog = true;
    public readonly description = "Von nun an hast du auch Zugriff auf den Speicher des Roboters. Im Bereich 'Variables' " +
        "kannst du dir neue Speicherblöcke erstellen.";
    public readonly maxBlocks = 12;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Bool'sche Variabeln";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, B, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, _, _, B, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, _, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, T, X, _, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, _, X, X, X, X],
        [X, X, X, _, _, B, _, _, _, B, _, _, _, X, X],
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
            Control: ["controls_if", "controls_repeat_ext"/*, "controls_whileUntil"*/],
            Game: ["forward", "backward", 'turn_left', 'turn_right', 'sensor_camera'/*, 'sensor_radar'*/],
            //   Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number"/*, "text"*/, "logic_boolean"/*, "math_random_int"*/],
            Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(12, 7, PLAYER_ORIENTATION_LEFT));
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
                gameState.setGameOver(true, true, "Gut gemacht! Die Werte 'Wahr' ('true') und 'Falsch' ('false') nennt man Bool'sche Werte oder Wahrheitswerte." +
                    " Damit kannst du beschreiben, ob eine Aussage wahr oder falsch ist.");
                break;
        }

        if(!gameState.isGameOver && !gameState.hasMoreCode){
            gameState.setGameOver(true, false, MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED)
        }
    }

}