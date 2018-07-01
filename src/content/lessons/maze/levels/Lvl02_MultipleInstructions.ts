import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl02_MultipleInstructions implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Diemal befindet sich das Ziel etwas weiter entfernt. Schaffst du auch die Kurve?";
    public readonly maxBlocks = 6;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 2 - Komplexe Bewegungen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, _, _, _, _, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, _, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, T, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
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
        return undefined;
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(5, 6, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
    }
}