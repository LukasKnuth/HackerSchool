import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, GridTile, PlayerPosition,
    TILE_COLLECTIBLE, TILE_ENEMY, TILE_ENEMY_COLOR, TILE_GREEN, TILE_NEUTRAL,
    TILE_PIT,
    TILE_TELEPORT_ENTRY, TILE_TRAP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from '@/content/blocks/API';

export default class TestLevel implements Level {
    public readonly name = "Level 1";
    public readonly description = "A test level about mazes!";
    public maxBlocks = Infinity;
    public allowMethods = true;
    public allowVariables = true;
    public showDebugLog = true;

    private initialMazeLayout: GridState = [
        [2, 2, 2, 2, 2, 2, 2, 0, 0, 7],
        [2, 0, 0, 0, 0, 0, 2, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 2, 6, 0, 0],
        [2, 0, 3, 0, 0, 0, 2, 2, 2, 2],
        [2, 0, 0, 0, 2, 2, 0, 0, 0, 2],
        [2, 0, 0, 0, 2, 2, 0, 4, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 3, 0, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0, 4, 0, 2],
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
            Control: ["controls_if", "controls_repeat_ext", "controls_whileUntil"],
            Game: ["forward", "backward", 'turn_left', 'turn_right', 'sensor_camera', 'sensor_radar'],
            Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number", "text", "logic_boolean", "math_random_int"],
            Debug: ["debug_log"]
        };
    }

    public exportAPI(gameState: GameState): API {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            attachGameBlockAPI(interpreter, scope, gameState);
        };
    }

    public initializeState(gameState: GameState): void {
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(8, 8, 270));
    }

    public tick(gameState: GameState) {
        const player = gameState.getPlayerPosition();
        const standingOn = gameState.getGridTile(player);
        switch (standingOn) {
            case TILE_PIT:
            case TILE_TRAP:
                gameState.setGameOver(true, false, "You ran into a trap...");
                break;
            case TILE_COLLECTIBLE:
                // This reveals the Teleporter!
                gameState.setGridTile(new GridPosition(2, 2), TILE_TELEPORT_ENTRY);
                gameState.setGridTile(player, TILE_NEUTRAL);
                break;
            case TILE_TELEPORT_ENTRY:
                // Teleport player
                gameState.setPlayerPosition(new PlayerPosition(7, 2, player.angle));
                break;
            case TILE_GREEN:
                gameState.setGameOver(true, true, "Goal was reached");
        }
    }

}
