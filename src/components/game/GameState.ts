const MAP_INVALID_SQUARE = -1;
const MAP_SIZE = 10;

export class GridPosition {
    constructor(public x: number, public y: number){}

    public equals(other: GridPosition): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public clone(): GridPosition {
        return new GridPosition(this.x, this.y);
    }

    public moveX(amount: number): this {
        this.x += amount;
        return this;
    }

    public moveY(amount: number): this {
        this.y += amount;
        return this;
    }
}

type GridState = number[][];

export class GameState {

    public isGameOver: boolean = false;
    private playerPosition: GridPosition[] = [new GridPosition(0, 0), new GridPosition(0, 0)];
    private levelState: GridState;

    constructor(mazeWidth: number, mazeHeight: number) {
        this.levelState = Array.from(new Array(mazeWidth), () => new Array(mazeHeight));
    }

    public setPlayerPosition(newPosition: GridPosition, playerIndex = 0) {
        if (this.playerPosition.length > playerIndex) {
            // Copies the (mutable) value into the local position
            this.playerPosition[playerIndex].x = newPosition.x;
            this.playerPosition[playerIndex].y = newPosition.y;
        } else {
            console.error(
                `No player at index ${playerIndex}, only ${this.playerPosition.length} players available. `
                + "Ignoring..."
            );
        }
    }

    public getPlayerPosition(playerIndex = 0) {
        // TODO instead of copy, can we return an immtable version? This won't work with moveX() methods though!
        if (this.playerPosition.length > playerIndex) {
            return this.playerPosition[playerIndex].clone();
        } else {
            return new GridPosition(-1, -1);
        }
    }

    /**
     * This operation is EXPENSIVE, because it copies the entire array.
     * @param {GridState} newState
     */
    public setGridState(newState: GridState) {
        // copy the array into the local storage
        this.levelState = Array.from(newState, (arr) => Array.from(arr));
    }

    public setGridSquare(position: GridPosition, content: number) {
        if (this.levelState.length > position.y && this.levelState[position.y].length > position.x) {
            this.levelState[position.y][position.x] = content;
        } else {
            console.error(
                `No map data found at (${position.x}|${position.y})`
                + `map size is ${this.levelState.length}x${this.levelState[0].length}. Ignoring...`
            );
        }
    }

    public getGridSquare(position: GridPosition) {
        if (this.levelState.length > position.y && this.levelState[position.y].length > position.x) {
            return this.levelState[position.y][position.x];
        } else {
            return MAP_INVALID_SQUARE;
        }
    }

    public swapGridSquares(positionA: GridPosition, positionB: GridPosition) {
        const temp = this.getGridSquare(positionA);
        this.setGridSquare(positionA, this.getGridSquare(positionB));
        this.setGridSquare(positionB, temp);
    }

    public get mazeWidth(): number {
        return this.levelState.length;
    }

    public get mazeHeight(): number {
        return this.levelState[0].length;
    }

}
