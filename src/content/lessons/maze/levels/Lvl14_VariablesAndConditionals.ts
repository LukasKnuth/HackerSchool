import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl14_VariablesAndConditionals implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "";
    public readonly maxBlocks = 11;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 14 - Variabeln und Bedingungen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, T, X, B, X, _, X, _, X, _, X, X, X],
        [X, X, _, _, _, _, _, B, B, B, _, B, B, X, X],
        [X, X, X, _, X, B, X, _, X, _, X, _, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, B, _, X, X],
        [X, X, X, _, X, B, X, _, X, _, X, _, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, _, X, B, X, _, X, _, X, B, X, X, X],
        [X, X, B, B, B, B, _, _, B, T, _, B, _, X, X],
        [X, X, X, _, X, _, X, _, X, _, X, B, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, _, X, _, X, _, X, _, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//Comparisons with >=, <=, ==, <, > should now be available
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(5, 12, PLAYER_ORIENTATION_UP));
    }

    tick(gameState: GameState): void {//make sure to remind players of having to collect both collectibles
    }
}