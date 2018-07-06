import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT, G, PLAYER_ORIENTATION_DOWN
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl16_ChallengeRadarFinder implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Diesmal sind die Kristalle versteckt und ihre Anordnung ändert sich von Mal zu Mal." +
        " Benutze dein neues Radar, um sie ausfindig zu machen.";
    public readonly maxBlocks = 20; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 16 - Prüfung: Unsichtbar";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, X, _, _, _, X, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, X, _, _, _, X, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];
    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;//Radar will be added here.
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(7, 2, PLAYER_ORIENTATION_DOWN));
    }

    tick(gameState: GameState): void {//make sure to remind players of having to collect both collectibles
        //implement randomly spawning 3 stars and revealing them once they have been scanned or walked over.
    }
}