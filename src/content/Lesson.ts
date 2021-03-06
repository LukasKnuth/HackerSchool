import {GameState, GridState} from '@/components/game/GameState';
import {API} from 'js-interpreter';

export interface BlockToolbox {
    [keys: string]: string[];
}

// TODO need something to store/load level state. Files? VueX?
export interface Level {
    name: string;
    description: string;
    /**
     * The maximum number of blocks allowed for the solution, or "Infinity" for no limit.
     */
    maxBlocks: number;
    /**
     * How many blocks the maze should have on the X axis
     */
    mazeWidth: number;
    /**
     * How many blocks the maze should have on the Y axis
     */
    mazeHeight: number;
    /**
     * Show the method-category in the Editor-Toolbox?
     */
    allowMethods: boolean;
    /**
     * Show the variable-category in the Editor-Toolbox?
     */
    allowVariables: boolean;
    /**
     * Show the debug-log overlay in the Editor?
     */
    showDebugLog: boolean;

    /**
     * Set the initial game state, like the maze and player position.
     * @param gameState The state to be set.
     */
    initializeState(gameState: GameState): void;

    /**
     * Returns the ids of any Blockly blocks that can be used in this Level.
     * @see content/blocks/GameBlocks.js
     */
    getBlocks(): BlockToolbox;
    /**
     * This is the object that will be given to the generated code as "this".
     * It should have all methods that the blocks use in their code!
     * @returns {any}
     */
    exportAPI(gameState: GameState): API;
    /**
     * Simulate a step for this level. This is where you can interact with the games state and make changes,
     *  for example, move the player to another location (teleport) or remove consumables from the map.
     * @param {GameState} gameState
     */
    tick(gameState: GameState): void;
}

export interface Lesson {
    /**
     * The name of the overall lesson
     */
    name: string;
    /**
     * Description of the overall lesson.
     */
    description: string;
    /**
     * Return all Levels of this lesson.
     * @returns {Level[]}
     */
    getLevels: () => Level[];
}
