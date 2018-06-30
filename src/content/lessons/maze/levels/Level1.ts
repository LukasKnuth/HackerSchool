import {BlockToolbox, Level} from '@/content/Lesson';
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
    public maxBlocks = Infinity;

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

    public getBlocks(): BlockToolbox {
        return {
            Control: ["controls_if", "controls_repeat_ext", "controls_whileUntil", "string_length"],
            Game: ["forward", "backward", 'turn_left', 'turn_right'],
            Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number", "text", "logic_boolean", "text_print", "math_random_int"]
        };
    }

    public exportAPI(gameState: GameState): API {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            const moveWrapper = (amount: number) => {
                gameState.walkPlayer(amount);
            };
            interpreter.setProperty(scope, "move", interpreter.createNativeFunction(moveWrapper));
            const turnWrapper = (degrees: number) => {
                gameState.turnPlayer(degrees);
            };
            interpreter.setProperty(scope, "turn", interpreter.createNativeFunction(turnWrapper));
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
