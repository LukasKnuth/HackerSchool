import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl07_LoopBonus implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Eine ganz besondere Herausforderung";
    public readonly maxBlocks = 22; //Actually 19 should be possible
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 7 - EXTRA Schleifen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, _, _, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, _, X, X, X, X, X, X],
        [X, X, X, X, _, _, _, _, _, _, _, X, X, X, X],
        [X, X, X, X, _, X, X, X, X, X, _, X, X, X, X],
        [X, X, _, _, _, X, _, _, _, X, _, _, _, X, X],
        [X, X, _, X, X, X, _, X, _, X, X, X, _, X, X],
        [X, X, _, _, _, X, T, X, _, _, _, X, _, X, X],
        [X, X, _, X, _, X, X, X, X, X, _, X, _, X, X],
        [X, X, _, X, _, _, _, _, _, _, _, X, _, X, X],
        [X, X, _, X, X, X, _, X, _, X, X, X, _, X, X],
        [X, X, _, _, _, X, _, _, _, X, _, _, _, X, X],
        [X, X, X, X, _, X, X, X, X, X, _, X, X, X, X],
        [X, X, X, X, _, _, _, _, _, _, _, X, X, X, X],
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
        gameState.setPlayerPosition(new PlayerPosition(12, 7, PLAYER_ORIENTATION_UP));
    }

    tick(gameState: GameState): void {
    }
}