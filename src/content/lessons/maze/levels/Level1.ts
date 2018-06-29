import {Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, PlayerPosition,
    SQUARE_COLLECTIBLE, SQUARE_GOAL, SQUARE_NEUTRAL,
    SQUARE_PIT,
    SQUARE_TELEPORT_ENTRY, SQUARE_TRAP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';

export default class MazeLevel1 implements Level {
    public readonly name = "Level 1";
    public readonly description = "A test level about mazes!";
    public maxBlocks = 8;

    private initialMazeLayout: GridState = [
        [2, 2, 2, 2, 2, 2, 2, 0, 0, 7],
        [2, 0, 0, 0, 0, 0, 2, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 2, 6, 0, 0],
        [2, 0, 3, 0, 0, 0, 2, 2, 2, 2],
        [2, 0, 0, 0, 2, 2, 0, 0, 0, 2],
        [2, 0, 0, 0, 2, 2, 0, 4, 0, 2],
        [2, 0, 3, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 3, 0, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    get mazeHeight(): number {
        return 10;
    }
    get mazeWidth(): number {
        return 10;
    }

    public getBlocks(): string[] {
        return [
            "controls_if", "logic_compare", "math_number", "math_arithmetic",
            "text", "text_print", "string_length"
        ];
    }

    public exportAPI(gameState: GameState): API {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            const moveWrapper = () => {
                gameState.setPlayerPosition(gameState.getPlayerPosition().moveX(1));
            };
            interpreter.setProperty(scope, "moveX", interpreter.createNativeFunction(moveWrapper));
            const alertWrapper = (text: string) => {
                alert(text);
            };
            interpreter.setProperty(scope, "alert", interpreter.createNativeFunction(alertWrapper));
        };
    }

    public initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(8, 8, 270));
    }

    public tick(gameState: GameState) {
        const player = gameState.getPlayerPosition();
        const standingOn = gameState.getGridSquare(player);
        switch (standingOn) {
            case SQUARE_PIT:
            case SQUARE_TRAP:
                gameState.setGameOver();
                break;
            case SQUARE_COLLECTIBLE:
                // This reveals the Teleporter!
                gameState.setGridSquare(new GridPosition(2, 2), SQUARE_TELEPORT_ENTRY);
                gameState.setGridSquare(player, SQUARE_NEUTRAL);
                break;
            case SQUARE_TELEPORT_ENTRY:
                // Teleport player
                gameState.setPlayerPosition(new PlayerPosition(7, 2, player.angle));
                break;
            case SQUARE_GOAL:
                gameState.setGameOver(true, true);
        }
    }

}
