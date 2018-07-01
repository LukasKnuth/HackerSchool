import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl11_ConditionalsWithElseIf implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "";
    public readonly maxBlocks = 5;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 11 - Bedingungen mit 'Else If'";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, T, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, X, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, B, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, X, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//full conditionals with `if`, `else` and `else if` from here on out
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(4, 10, PLAYER_ORIENTATION_UP));
    }

    tick(gameState: GameState): void {
    }
}