import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT, G, PLAYER_ORIENTATION_DOWN
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl19_ChallengeLabyrinth implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Lass den Roboter den Weg durch das Labyrinth finden. Aber Vorsicht, es verändert sich bei jedem neuen Versuch.";
    public readonly maxBlocks = 25; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 19 - Prüfung: Umwegfinder";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, _, X, _, _, _, _, X, _, _, _, X, X],
        [X, X, X, _, X, _, X, X, _, X, X, X, _, X, X],
        [X, X, _, _, _, _, X, X, _, X, _, X, _, X, X],
        [X, _, _, X, X, X, X, _, _, X, _, X, _, _, X],
        [X, _, X, X, X, _, X, _, X, X, _, X, _, X, X],
        [X, _, X, _, _, _, X, _, _, _, _, X, _, X, X],
        [X, _, X, _, X, _, X, _, _, X, X, X, _, _, X],
        [X, _, X, _, X, _, X, X, _, _, _, X, X, _, X],
        [X, _, X, X, X, _, _, _, _, X, _, _, _, _, X],
        [X, _, X, X, X, X, X, _, X, X, _, X, X, X, X],
        [X, _, _, X, _, X, X, _, _, X, _, X, _, _, X],
        [X, X, _, X, _, _, X, _, X, X, _, X, X, _, X],
        [X, _, _, _, _, X, X, _, _, X, _, _, _, _, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    exportAPI(gameState: GameState) {
        return undefined;
    }

    getBlocks(): BlockToolbox {
        return undefined;
    }

    initializeState(gameState: GameState): void {
        //randomize layout of maze by rotating or mirroring the initial maze area
        //Place collectible randomly on one of the ground spaces. Since alle pathways
        //are connected it is always possible to find it.
        gameState.setGridState(this.initialMazeLayout);

        //find a random spot for the robot to start at out of all valid spaces
        //Since alle pathways are connected it is impossible for it to get stuck.
        gameState.setPlayerPosition(new PlayerPosition(1, 1, PLAYER_ORIENTATION_RIGHT));
    }

    tick(gameState: GameState): void {
        //reveal the level gradually to the player whenever it square is scanned or walked over
        //Goal should always be visible from the start
        //When player finds collectible or fails reveal the entire level until reset

    }
}