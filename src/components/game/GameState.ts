const MAP_INVALID_SQUARE = -1;

// Map squares:
export const SQUARE_NEUTRAL = 1;
export const SQUARE_PIT = 2;
export const SQUARE_TRAP = 3;
export const SQUARE_COLLECTIBLE = 4;
export const SQUARE_TELEPORT_ENTRY = 5;
export const SQUARE_TELEPORT_EXIT = 6;
export const SQUARE_GOAL = 7;

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

export type GridState = number[][];

export class PlayerPosition extends GridPosition {
    constructor(x: number, y: number, public angle: number){
        super(x, y);
    }

    public equals(other: GridPosition|PlayerPosition): boolean {
        if (other instanceof PlayerPosition) {
            return super.equals(other) && this.angle === other.angle;
        } else {
            return super.equals(other);
        }
    }

    public clone(): PlayerPosition {
        return new PlayerPosition(this.x, this.y, this.angle);
    }

    public turn(amount: number): this {
        this.angle += amount;
        return this;
    }
}

export class GameState {

    private isGameOver: boolean = false;
    private isGameWon: boolean = false;
    private playerPosition: PlayerPosition[] = [new PlayerPosition(0, 0, 0), new PlayerPosition(0, 0, 0)];
    private levelState: GridState;

    constructor(mazeWidth: number, mazeHeight: number) {
        this.levelState = Array.from(new Array(mazeWidth), () => new Array(mazeHeight));
    }

    public setPlayerPosition(newPosition: PlayerPosition, playerIndex = 0) {
        if (this.playerPosition.length > playerIndex) {
            // Copies the (mutable) value into the local position
            this.playerPosition[playerIndex].x = newPosition.x;
            this.playerPosition[playerIndex].y = newPosition.y;
            this.playerPosition[playerIndex].angle = newPosition.angle;
        } else {
            console.error(
                `No player at index ${playerIndex}, only ${this.playerPosition.length} players available. `
                + "Ignoring..."
            );
        }
    }

    public getPlayerPosition(playerIndex = 0): PlayerPosition {
        // TODO instead of copy, pass a PlayerPosition instance and mutate it to the internal state!
        if (this.playerPosition.length > playerIndex) {
            return this.playerPosition[playerIndex].clone();
        } else {
            return new PlayerPosition(-1, -1, 0);
        }
    }

    public walkPlayer(amount: number, playerIndex = 0): void {
        const position = this.getPlayerPosition(playerIndex);
        if (position.angle >= 315 && position.angle < 45) {
            position.y += amount;
        } else if (position.angle >= 45 && position.angle < 135) {
            position.x += amount;
        } else if (position.angle >= 135 && position.angle < 225) {
            position.y -= amount;
        } else if (position.angle >= 225 && position.angle < 315) {
            position.x -= amount;
        }
        this.setPlayerPosition(position, playerIndex);
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

    public setGameOver(isOver = true, isWin = false) {
        this.isGameOver = isOver;
        this.isGameWon = isWin;
    }

}
