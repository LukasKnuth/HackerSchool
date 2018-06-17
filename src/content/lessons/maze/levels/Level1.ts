import {Level} from '@/content/Lesson';
import {GameState, GridPosition} from '@/components/game/GameState';

export default class MazeLevel1 implements Level {
    public readonly name = "Level 1";
    public readonly description = "Simple level about mazes";
    public maxBlocks = Infinity;

    private pickupItem = new GridPosition(8, 9);
    private doorLocation = new GridPosition(10, 1);

    public getBlocks(): any[] {
        return [];
    }

    public getActions(gameState: GameState) {
        return {
            walkForward: () => {
                gameState.setPlayerPosition(gameState.getPlayerPosition().moveX(1));
            }
        };
    }

    public tick(gameState: GameState) {
        if (gameState.getPlayerPosition().equals(this.pickupItem)) {
            gameState.setGridSquare(this.pickupItem, 10); // switch hit
            gameState.setGridSquare(this.doorLocation, 11); // door opened
        }
    }

}