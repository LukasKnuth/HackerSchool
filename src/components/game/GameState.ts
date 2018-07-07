const MAP_INVALID_SQUARE = -1;

// Map squares:
export const TILE_BLUE = 3;
export const TILE_GREEN = 4;
export const TILE_YELLOW = 5;
export const TILE_RED = 6;
export const TILE_NEUTRAL = 1;
export const TILE_PIT = 2;
export const TILE_TRAP = 3;
export const TILE_COLLECTIBLE = 9;
export const TILE_TELEPORT_ENTRY = 10;
export const TILE_TELEPORT_EXIT = 11;

// This isn't actually placeable, it's used as a fake-return to check around the player.
export const TILE_ENEMY = -1;
export const TILE_ENEMY_COLOR = 8; // TODO add this for MP!

// Level square shorthands
export const _ = TILE_NEUTRAL;
export const X = TILE_PIT;
export const T = TILE_COLLECTIBLE;
export const B = TILE_BLUE;
export const G = TILE_GREEN;

export const PLAYER_ORIENTATION_UP = 0;
export const PLAYER_ORIENTATION_RIGHT = 90;
export const PLAYER_ORIENTATION_DOWN = 180;
export const PLAYER_ORIENTATION_LEFT = 270;

const ANGLE_MAX = 360;
export const DISTANCE_NOT_FOUND = -1;

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
export type ExtendedGridTile = GridTile;
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

    public hasMoreCode: boolean = true;
    //TODO rename or hide this variable because it is confusing since this suggests that isGameRunning = !isGameOver for API consumers.
    public isGameRunning: boolean = true;
    private _gameOverReason: string = "";
    private _isGameOver: boolean = false;
    private _isGameWon: boolean = false;
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

    public sensorNext(playerIndex = 0): ExtendedGridTile {
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

    public sensorAround(playerIndex = 0): ExtendedGridTile[] {
        const position = this.getPlayerPosition(playerIndex);
        const searchPosition = new GridPosition(0, 0);
        const results = new Set<number>();
        for (let x = position.x - 2; x <= position.x + 2; x++) {
            for (let y = position.y - 2; y <= position.y + 2; y++) {
                searchPosition.x = x;
                searchPosition.y = y;
                results.add(this.getGridTile(searchPosition));
            }
        }
        return Array.from(results);
    }

    public sensorShortestDistance(tileType: GridTile, playerIndex = 0): number {
        let shortestDistance = DISTANCE_NOT_FOUND;
        const playerPosition = this.getPlayerPosition(playerIndex);
        const gridPosition = new GridPosition(0, 0);
        for (let x = 0; x < this.mazeWidth; x++) {
            for (let y = 0; y < this.mazeHeight; y++) {
                gridPosition.x = x;
                gridPosition.y = y;
                const currentTile = this.getGridTile(gridPosition);
                if (currentTile === tileType) {
                    const distance = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
                    if (shortestDistance === DISTANCE_NOT_FOUND || distance < shortestDistance) {
                        shortestDistance = distance;
                    }
                }
            }
        }
        return shortestDistance;
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

    public setGameOver(isOver = true, isWin = false, reason = "") {
        this._isGameOver = isOver;
        this._isGameWon = isWin;
        this._gameOverReason = reason;
    }

    public get isGameOver() {
        return this._isGameOver;
    }
    public get isGameWon() {
        return this._isGameWon;
    }
    public get gameOverReason() {
        return this._gameOverReason;
    }

}
