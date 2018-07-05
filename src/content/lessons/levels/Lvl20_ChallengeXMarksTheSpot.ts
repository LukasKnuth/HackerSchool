import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT, G, PLAYER_ORIENTATION_DOWN
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl20_ChallengeXMarksTheSpot implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Finde den mit dem Kreuz markierten Schatz. Aber Vorsicht vor falschen Fährten.";
    public readonly maxBlocks = 25; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 20 - Prüfung: Unbeirrt";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;
    }

    initializeState(gameState: GameState): void {
        //Add a cross pattern on a random valid spot
        //The pattern looks like this
        //
        // B _ _ _ B
        // _ B _ B _
        // _ _ _ _ _
        // _ B _ B _
        // B _ _ _ B

        //Also generate some decoys that look like this
        //
        // B
        // B
        // B
        //
        // or B B B

        // These patterns should not cross each other
        gameState.setGridState(this.initialMazeLayout);

        gameState.setPlayerPosition(new PlayerPosition(1, 7, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
        //The level should be revealed from the start but without any patterns
        //visible. As soon as the player presses play the marks should be revealed
        //Player wins if they step on the center of the "X"

    }
}