import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, _, PlayerPosition,
    T, X, PLAYER_ORIENTATION_RIGHT, PLAYER_ORIENTATION_UP, B, PLAYER_ORIENTATION_LEFT
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class Lvl12_BoolVariables implements Level {
    public readonly allowMethods = false;
    public readonly allowVariables = false;
    public readonly description = "Von nun an hast du auch Zugriff auf den Speicher des Roboters. Im Bereich 'Variables' " +
        "kannst du dir neue Speicherblöcke erstellen.";
    public readonly maxBlocks = 8;
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Level 12 - Bool'sche Variabeln";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, B, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, _, _, B, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, T, X, X, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, _, X, X, X, X],
        [X, X, X, X, X, X, _, X, X, X, _, X, X, X, X],
        [X, X, X, _, _, B, _, _, _, B, _, _, _, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
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
        return undefined;//adding variables of type bool only should be possible (or only bool primitives should be allowed)
    }

    initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(12, 7, PLAYER_ORIENTATION_LEFT));
    }

    tick(gameState: GameState): void {
    }
}