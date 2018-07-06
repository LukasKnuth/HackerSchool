import {
    GameState,
    GridTile,
    TILE_BLUE,
    TILE_COLLECTIBLE,
    TILE_ENEMY,
    TILE_ENEMY_COLOR,
    TILE_GREEN,
    TILE_NEUTRAL,
    TILE_PIT,
    TILE_TRAP
} from '@/components/game/GameState';
import {default as Interpreter, InterpreterScope, PrimitiveObject} from 'js-interpreter';

export const FUNCTION_MOVE = "move";
export const FUNCTION_TURN = "turn";
export const FUNCTION_SENSOR_CAMERA = "sensorCamera";
export const FUNCTION_SENSOR_RADAR = "sensorRadar";
export const PARAM_COLLECTIBLE = "collectible";
export const PARAM_GREEN = "green";
export const PARAM_BLUE = "blue";
export const PARAM_PIT = "pit";
export const PARAM_TRAP = "trap";
export const PARAM_ENEMY_COLOR = "enemy_color";
export const PARAM_ENEMY = "enemy";
export const PARAM_FLOOR = "floor";

/**
 * Attaches the interpreter-API for all custom game-related blocks to the given interpreter.
 * @param {Interpreter} interpreter the interpreter to attach the API to
 * @param {"js-interpreter".InterpreterScope} scope the scope to use when attaching
 * @param {GameState} gameState the game-state which the game-blocks should operate on
 */
export function attachGameBlockAPI(interpreter: Interpreter, scope: InterpreterScope, gameState: GameState) {
    const moveWrapper = (amount: PrimitiveObject) => {
        gameState.walkPlayer(amount.toNumber());
    };
    interpreter.setProperty(scope, FUNCTION_MOVE, interpreter.createNativeFunction(moveWrapper));
    const turnWrapper = (degrees: PrimitiveObject) => {
        gameState.turnPlayer(degrees.toNumber());
    };
    interpreter.setProperty(scope, FUNCTION_TURN, interpreter.createNativeFunction(turnWrapper));
    // Sensors
    const checkType = (tile: GridTile, type: string) => {
        switch (type) {
            case PARAM_COLLECTIBLE:
                return tile === TILE_COLLECTIBLE;
            case PARAM_BLUE:
                return tile === TILE_BLUE;
            case PARAM_GREEN:
                return tile === TILE_GREEN;
            case PARAM_PIT:
                return tile === TILE_PIT;
            case PARAM_TRAP:
                return tile === TILE_TRAP;
            case PARAM_ENEMY_COLOR:
                return tile === TILE_ENEMY_COLOR;
            case PARAM_ENEMY:
                return tile === TILE_ENEMY;
            case PARAM_FLOOR:
                return tile === TILE_NEUTRAL;
            default:
                return false;
        }
    };
    const cameraWrapper = (type: PrimitiveObject) => {
        const tile = gameState.sensorNext();
        const result = checkType(tile, type.toString());
        return interpreter.createPrimitive(result);
    };
    interpreter.setProperty(scope, FUNCTION_SENSOR_CAMERA, interpreter.createNativeFunction(cameraWrapper));
    const radarWrapper = (type: PrimitiveObject) => {
        const tiles = gameState.sensorAround();
        const typeString = type.toString();
        const result = tiles.some((tile: GridTile) => checkType(tile, typeString));
        return interpreter.createPrimitive(result);
    };
    interpreter.setProperty(scope, FUNCTION_SENSOR_RADAR, interpreter.createNativeFunction(radarWrapper));
}
