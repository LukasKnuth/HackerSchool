import {
    DISTANCE_NOT_FOUND,
    GameState,
    GridTile,
    TILE_BLUE,
    TILE_COLLECTIBLE,
    TILE_ENEMY,
    TILE_ENEMY_COLOR,
    TILE_GREEN,
    TILE_NEUTRAL,
    TILE_PIT, TILE_RED,
    TILE_TRAP, TILE_YELLOW
} from '@/components/game/GameState';
import {default as Interpreter, InterpreterScope, PrimitiveObject} from 'js-interpreter';

export const FUNCTION_MOVE = "move";
export const FUNCTION_TURN = "turn";
export const FUNCTION_SENSOR_CAMERA = "sensorCamera";
export const FUNCTION_SENSOR_RADAR = "sensorRadar";
export const PARAM_COLLECTIBLE = "collectible";
export const PARAM_GREEN = "green";
export const PARAM_BLUE = "blue";
export const PARAM_RED = "red";
export const PARAM_YELLOW = "yellow";
export const PARAM_PIT = "pit";
export const PARAM_TRAP = "trap";
export const PARAM_ENEMY_COLOR = "enemy_color";
export const PARAM_ENEMY = "enemy";
export const PARAM_FLOOR = "floor";

const TYPE_TO_TILE: {[keys: string]: GridTile} = {
    [PARAM_COLLECTIBLE]: TILE_COLLECTIBLE,
    [PARAM_BLUE]: TILE_BLUE,
    [PARAM_YELLOW]: TILE_YELLOW,
    [PARAM_RED]: TILE_RED,
    [PARAM_GREEN]: TILE_GREEN,
    [PARAM_PIT]: TILE_PIT,
    [PARAM_TRAP]: TILE_TRAP,
    [PARAM_ENEMY_COLOR]: TILE_ENEMY_COLOR,
    [PARAM_ENEMY]: TILE_ENEMY,
    [PARAM_FLOOR]: TILE_NEUTRAL
};

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
    const cameraWrapper = (type: PrimitiveObject) => {
        const actions = gameState.getPlayerActions();
        actions.usedCamera = true;
        gameState.setPlayerActions(actions);
        const tile = gameState.sensorNext();
        const typeString = type.toString();
        if (typeString in TYPE_TO_TILE) {
            return interpreter.createPrimitive(TYPE_TO_TILE[typeString] === tile);
        } else {
            return interpreter.createPrimitive(false);
        }
    };
    interpreter.setProperty(scope, FUNCTION_SENSOR_CAMERA, interpreter.createNativeFunction(cameraWrapper));
    const radarWrapper = (type: PrimitiveObject) => {
        const actions = gameState.getPlayerActions();
        actions.usedRadar = true;
        gameState.setPlayerActions(actions);
        const typeString = type.toString();
        if (typeString in TYPE_TO_TILE) {
            const tileType = TYPE_TO_TILE[typeString];
            const result = gameState.sensorShortestDistance(tileType);
            return interpreter.createPrimitive(result);
        } else {
            return interpreter.createPrimitive(DISTANCE_NOT_FOUND);
        }
    };
    interpreter.setProperty(scope, FUNCTION_SENSOR_RADAR, interpreter.createNativeFunction(radarWrapper));
}
