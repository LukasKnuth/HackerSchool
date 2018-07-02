import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT, G, PLAYER_ORIENTATION_DOWN
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl17_ChallengeRunForYourLives implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Überlebe so lange du kannst!";
    public readonly maxBlocks = 20; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 17 - Prüfung: Überlebenskünstler";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
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
        return undefined;
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(7, 7, PLAYER_ORIENTATION_UP));
    }

    tick(gameState: GameState): void {
        //The level pseudo randomly decides to remove a 3 x 3 Square space and replace it with pits.
        //Before removing happens, all spaces that will be removed ar first colored Green then Blue and finally Red.
        //Decide on appropriate time (in instructions) that the players should have to leave affected area after a warning.
        //The first removed tiles should be directly underneath the player.
    }
}