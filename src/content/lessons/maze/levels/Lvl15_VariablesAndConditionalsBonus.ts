import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT, G
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl15_VariablesAndConditionalsBonus implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "";
    public readonly maxBlocks = 15; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 15 - EXTRA Variabeln und Bedingungen";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, T, G, B, G, B, G, B, G, T, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, B, G, B, G, B, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, T, B, G, B, G, B, T, X, X],
        [X, X, B, G, B, G, B, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, B, G, B, G, B, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, T, B, T, X, X],
        [X, X, T, G, B, G, T, G, B, G, B, G, B, X, X],
        [X, X, G, B, G, B, G, B, G, B, G, B, G, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];
    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//from here on out all control blocks available
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(4, 3, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {//make sure to remind players of having to collect both collectibles
    }
}