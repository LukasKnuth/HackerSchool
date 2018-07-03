import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl05_LoopWithOuterCode implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "";
    public readonly maxBlocks = 15;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 5 - Komplexe Schleifen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, T, X, X, X, X, X, X, X, X, X],
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
        gameState.setPlayerPosition(new PlayerPosition(1, 3, PLAYER_ORIENTATION_UP));
    }

    tick(gameState: GameState): void {
    }
}