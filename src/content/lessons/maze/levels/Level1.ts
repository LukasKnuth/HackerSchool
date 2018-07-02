import {BlockToolbox, Level} from '@/content/Lesson';
import {
    GameState,
    GridPosition, GridState, GridTile, PlayerPosition,
    TILE_COLLECTIBLE, TILE_ENEMY, TILE_ENEMY_COLOR, TILE_GOAL, TILE_NEUTRAL,
    TILE_PIT,
    TILE_TELEPORT_ENTRY, TILE_TRAP
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope, PrimitiveObject} from 'js-interpreter';

export default class MazeLevel1 implements Level {
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
            Values: ["math_number", "text", "logic_boolean", "text_print", "math_random_int"],
            Debug: ["debug_log"]
        };
    }

    public exportAPI(gameState: GameState): API {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            const moveWrapper = (amount: PrimitiveObject) => {
                gameState.walkPlayer(amount.toNumber());
            };
            interpreter.setProperty(scope, "move", interpreter.createNativeFunction(moveWrapper));
            const turnWrapper = (degrees: PrimitiveObject) => {
                gameState.turnPlayer(degrees.toNumber());
            };
            interpreter.setProperty(scope, "turn", interpreter.createNativeFunction(turnWrapper));
            const alertWrapper = (text: PrimitiveObject) => {
                alert(text.toString());
            };
            interpreter.setProperty(scope, "alert", interpreter.createNativeFunction(alertWrapper));
            // Sensors
            const checkType = (tile: GridTile, type: string) => {
                switch (type) {
                    case 'collectible':
                        return tile === TILE_COLLECTIBLE;
                    case "trap":
                        return tile === TILE_TRAP;
                    case "enemy_color":
                        return tile === TILE_ENEMY_COLOR;
                    case "enemy":
                        return tile === TILE_ENEMY;
                    default:
                        return false;
                }
            };
            const cameraWrapper = (type: PrimitiveObject) => {
                const tile = gameState.sensorNext();
                const result = checkType(tile, type.toString());
                return interpreter.createPrimitive(result);
            };
            interpreter.setProperty(scope, "sensorCamera", interpreter.createNativeFunction(cameraWrapper));
            const radarWrapper = (type: PrimitiveObject) => {
                const tiles = gameState.sensorAround();
                const typeString = type.toString();
                const result = tiles.some((tile: GridTile) => checkType(tile, typeString));
                return interpreter.createPrimitive(result);
            };
            interpreter.setProperty(scope, "sensorRadar", interpreter.createNativeFunction(radarWrapper));
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
                gameState.setGameOver();
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
            case TILE_GOAL:
                gameState.setGameOver(true, true);
        }
    }

}
