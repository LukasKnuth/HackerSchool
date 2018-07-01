import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl03_BasicLoop implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Für dieses Programm kannst du nur zwei Blöcke verwenden.";
    public readonly maxBlocks = 2;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 3 - Schleifen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, T, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];


    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(9, 12, PLAYER_ORIENTATION_UP));
    }

    tick(gameState: GameState): void {
    }
}