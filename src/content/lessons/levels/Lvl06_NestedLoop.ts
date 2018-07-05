import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl06_NestedLoop implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "";
    public readonly maxBlocks = 6; //actually only 4 blocks necessary
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 6 - Verschachtelte Schleifen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, _, _, _, _, _, _, _, _, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, X, X, X],
        [X, X, X, T, _, _, _, _, _, _, _, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];


    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//only `repeat X times` block from repeat section
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(3, 1, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
    }
}