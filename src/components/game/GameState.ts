const MAP_INVALID_SQUARE = -1;

// Map squares:
export const TILE_NEUTRAL = 1;
export const TILE_PIT = 2;
export const TILE_TRAP = 3;
export const TILE_COLLECTIBLE = 4;
export const TILE_TELEPORT_ENTRY = 5;
export const TILE_TELEPORT_EXIT = 6;
export const TILE_GOAL = 7;

// This isn't actually placeable, it's used as a fake-return to check around the player.
export const TILE_ENEMY = -1;
export const TILE_ENEMY_COLOR = 8; // TODO add this for MP!

const ANGLE_MAX = 360;

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

export type GridTile = number;
export type GridState = GridTile[][];

export class PlayerPosition extends GridPosition {
    private currentAngle: number = 0;

    constructor(x: number, y: number, angle: number){
        super(x, y);
        this.angle = angle;
    }

    public get angle() {
        return this.currentAngle;
    }
    public set angle(newValue: number) {
        this.currentAngle = newValue % ANGLE_MAX;
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
    private playerPosition: PlayerPosition[] = [
        new PlayerPosition(0, 0, 0), // player
        new PlayerPosition(-100, -100, 0) // enemy (placed out-of-bounds to avoid sensoring him by accident!)
    ];
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

    public turnPlayer(byDegrees: number, playerIndex = 0): void {
        const position = this.getPlayerPosition(playerIndex);
        position.angle = ((byDegrees + ANGLE_MAX) + position.angle) % ANGLE_MAX;
        this.setPlayerPosition(position, playerIndex);
    }

    private getNextPosition(playerIndex: number, steps = 1) {
        const position = this.getPlayerPosition(playerIndex);
        if (position.angle >= 45 && position.angle < 135) {
            position.x += steps;
        } else if (position.angle >= 135 && position.angle < 225) {
            position.y += steps;
        } else if (position.angle >= 225 && position.angle < 315) {
            position.x -= steps;
        } else if (position.angle >= 315 || position.angle < 45) {
            position.y -= steps;
        }
        return position;
    }

    public walkPlayer(amount: number, playerIndex = 0): void {
        const newPosition = this.getNextPosition(playerIndex, amount);
        this.setPlayerPosition(newPosition, playerIndex);
    }

    public getNextTile(playerIndex = 0): GridTile {
        const nextPosition = this.getNextPosition(playerIndex);
        return this.getGridTile(nextPosition);
    }

    public sensorNext(playerIndex = 0): any {
        const nextPosition = this.getNextPosition(playerIndex);
        const closeEnemy = this.playerPosition.find((enemyPosition: PlayerPosition) => {
            return nextPosition.equals(enemyPosition);
        });
        if (closeEnemy) {
            return TILE_ENEMY;
        } else {
            return this.getNextTile(playerIndex);
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

    public setGridTile(position: GridPosition, content: GridTile) {
        if (this.levelState.length > position.y && this.levelState[position.y].length > position.x) {
            this.levelState[position.y][position.x] = content;
        } else {
            console.error(
                `No map data found at (${position.x}|${position.y})`
                + `map size is ${this.levelState.length}x${this.levelState[0].length}. Ignoring...`
            );
        }
    }

    public getGridTile(position: GridPosition): GridTile {
        if (this.levelState.length > position.y && this.levelState[position.y].length > position.x) {
            return this.levelState[position.y][position.x];
        } else {
            return MAP_INVALID_SQUARE;
        }
    }

    public swapGridTiles(positionA: GridPosition, positionB: GridPosition) {
        const temp = this.getGridTile(positionA);
        this.setGridTile(positionA, this.getGridTile(positionB));
        this.setGridTile(positionB, temp);
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
