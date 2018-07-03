import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT, G, PLAYER_ORIENTATION_DOWN
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl18_ChallengeRacingCar implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Umrunde die Piste so schnell du kannst.";
    public readonly maxBlocks = 25; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 18 - Prüfung: Unüberholbar";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, _, _, X, X, X, _, _, _, _, _, X, X],
        [X, _, _, _, _, _, G, _, _, _, _, _, _, X, X],
        [X, X, _, X, _, _, G, _, _, X, X, _, _, X, X],
        [X, X, _, X, X, _, G, _, X, X, X, _, _, X, X],
        [X, X, _, X, X, X, X, X, X, X, _, _, X, X, X],
        [X, X, _, _, X, X, X, X, X, X, _, _, X, X, X],
        [X, X, _, _, X, X, X, X, X, X, X, _, _, X, X],
        [X, _, _, _, X, X, X, X, X, X, X, _, _, X, X],
        [X, _, _, X, X, _, _, _, _, X, X, _, _, X, X],
        [X, _, _, _, X, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, X, X, _, _, _, _, _, X, X],
        [X, X, X, _, _, _, X, X, X, X, X, X, X, X, X],
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
        gameState.setPlayerPosition(new PlayerPosition(6, 4, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
        //here the player must cross the green line after having run a full round of the course
        //make sure there is no cheating by going back a few squares and then crossing the line.
    }
}