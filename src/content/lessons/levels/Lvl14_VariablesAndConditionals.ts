import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    B,
    GameState,
    GridState,
    PLAYER_ORIENTATION_UP,
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

export default class Lvl14_VariablesAndConditionals implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = true;
    public readonly showDebugLog = true;
    public readonly description = "Zum Rechnen und Vergleichen von Zahlen stehen dir neue neue Blöcke zur Verfügung. Dein Roboter kann jetzt also zählen.";
    public readonly maxBlocks = 14;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Vergleiche und Berechnungen";
    private requiredCollectablesNumber = 2;
    private currentlyAcquiredCollectibles = 0;

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, T, X, B, X, _, X, _, X, _, X, X, X],
        [X, X, _, _, _, _, _, B, B, B, _, B, B, X, X],
        [X, X, X, _, X, B, X, _, X, _, X, _, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, B, _, X, X],
        [X, X, X, _, X, B, X, _, X, _, X, _, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, B, _, X, X],
        [X, X, X, _, X, B, X, _, X, _, X, B, X, X, X],
        [X, X, B, B, B, B, _, _, B, T, _, B, _, X, X],
        [X, X, X, _, X, _, X, _, X, _, X, B, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, _, X, _, X, _, X, _, X, _, X, X, X],
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
            Logic: ["logic_compare", /*"logic_operation", "logic_negate",*/ "math_arithmetic", "math_modulo"],
            Values: ["math_number"/*, "text", "logic_boolean", "math_random_int"*/],
            Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        this.currentlyAcquiredCollectibles = 0;
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(5, 12, PLAYER_ORIENTATION_UP));
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
                    gameState.setGameOver(true, true, "Clever! Jetzt stehen dir verschiedene Arten von Variabeln und Vergleichen zur Verfügung. Entscheide geschickt, wie du Informationen speicherst und nutzt.");
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