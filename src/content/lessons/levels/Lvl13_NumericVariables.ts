import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl13_NumericVariables implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Auch Zahlen können gespeichert werden.";
    public readonly maxBlocks = 6;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 12 - Numerische Variabeln";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, X, X, X, X, X, X, X, _, X, X, X, X],
        [X, X, _, X, _, _, _, _, _, X, _, X, X, X, X],
        [X, X, _, X, _, X, X, X, _, X, _, X, X, X, X],
        [X, X, _, X, _, X, T, X, _, X, _, X, X, X, X],
        [X, X, _, X, _, X, _, _, _, X, _, X, X, X, X],
        [X, X, _, X, _, X, X, X, X, X, _, X, X, X, X],
        [X, X, _, X, _, _, _, _, _, _, _, X, X, X, X],
        [X, X, _, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//variables of bool and of int should be possible. All numeric operations except for comparisons in conditionals should be available
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(12, 12, PLAYER_ORIENTATION_LEFT));
    }

    tick(gameState: GameState): void {
    }
}