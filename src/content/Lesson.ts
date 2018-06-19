import {GameState} from '@/components/game/GameState';

class Block {
    // TODO Define what a block can hold. Copy from Blockly docs?
}

export interface Level {
    name: string;
    description: string;
    maxBlocks: number;
    /**
     * How many blocks the maze should have on the X axis
     */
    mazeWidth: number;
    /**
     * How many blocks the maze should have on the Y axis
     */
    mazeHeight: number;

    // TODO need something to store/load level state. Files? VueX?

    /**
     * Get any available Blockly blocks that can be used in this Level.
     * @returns {Block[]}
     */
    getBlocks: () => Block[];
    /**
     * This is the object that will be given to the generated code as "this".
     * It should have all methods that the blocks use in their code!
     * @returns {any}
     */
    getActions: (gameState: GameState) => any;
    /**
     * Simulate a step for this level. This is where you can interact with the games state and make changes,
     *  for example, move the player to another location (teleport) or remove consumables from the map.
     * @param {GameState} gameState
     */
    tick: (gameState: GameState) => void;
}

export interface Lesson {
    name: string;
    description: string;

    getLevels: () => Level[];
}
