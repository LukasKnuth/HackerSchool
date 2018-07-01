import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl04_AdvancedLoop implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Tipp: Wenn du nicht weiter weist, kannst du die vorherigen Level zu Rate ziehen," +
        "da sie auf einander aufbauen.";
    public readonly maxBlocks = 5;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 4 - Schleifen für Fortgeschrittene";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, _],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, _, _],
        [X, X, X, X, X, X, X, X, X, X, X, X, _, _, X],
        [X, X, X, X, X, X, X, X, X, X, X, _, T, X, X],
        [X, X, X, X, X, X, X, X, X, X, _, _, X, X, X],
        [X, X, X, X, X, X, X, X, X, _, _, X, X, X, X],
        [X, X, X, X, X, X, X, X, _, _, X, X, X, X, X],
        [X, X, X, X, X, X, X, _, _, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, _, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, _, _, X, X, X, X, X, X, X, X, X],
        [X, X, X, _, _, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, X, X, X, X, X, X, X, X, X, X, X, X],
        [_, _, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];


    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//only `repeat X times` block from repeat section
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(2, 12, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
    }
}