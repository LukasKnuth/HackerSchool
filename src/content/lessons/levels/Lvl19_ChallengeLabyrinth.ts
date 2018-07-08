import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    GameState,
    GridPosition,
    GridState,
    PLAYER_ORIENTATION_DOWN,
    PlayerPosition,
    TILE_COLLECTIBLE,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED, MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl19_ChallengeLabyrinth implements Level {
    public readonly allowMethods = true;
    public readonly showDebugLog = true;
    public readonly allowVariables = true;

    public readonly description = "Lass den Roboter den Weg durch das Labyrinth finden. Aber Vorsicht, es verändert sich bei jedem neuen Versuch.";
    public readonly maxBlocks = 25; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Prüfung: Umwegfinder";

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, _, X, _, _, _, _, X, _, _, _, X, X],
        [X, X, X, _, X, _, X, X, _, X, X, X, _, X, X],
        [X, X, _, _, _, _, X, X, _, X, _, X, _, X, X],
        [X, _, _, X, X, X, X, _, _, X, _, X, _, _, X],
        [X, _, X, X, X, _, X, _, X, X, _, X, _, X, X],
        [X, _, X, _, _, _, X, _, _, _, _, X, _, X, X],
        [X, _, X, _, X, _, X, _, _, X, X, X, _, _, X],
        [X, _, X, _, X, _, X, X, _, _, _, X, X, _, X],
        [X, _, X, X, X, _, _, _, _, X, _, _, _, _, X],
        [X, _, X, X, X, X, X, _, X, X, _, X, X, X, X],
        [X, _, _, X, _, X, X, _, _, X, _, X, _, _, X],
        [X, X, _, X, _, _, X, _, X, X, _, X, X, _, X],
        [X, _, _, _, _, X, X, _, _, X, _, _, _, _, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

    private mazeCover: boolean[][] = [];
    private randomizedMaze: GridState = [];
    private hasFirstTickOccured = true;
    private playerStartingPos: PlayerPosition = new PlayerPosition(0,0,PLAYER_ORIENTATION_DOWN);

    exportAPI(gameState: GameState) {
        return (interpreter: Interpreter, scope: InterpreterScope) => {
            attachGameBlockAPI(interpreter, scope, gameState);
        };
    }

    getBlocks(): BlockToolbox {
        return {
            Control: ["controls_if", "controls_repeat_ext", "controls_whileUntil"],
            Game: ["forward", "backward", 'turn_left', 'turn_right', 'sensor_camera', 'sensor_radar'],
            Logic: ["logic_compare", "logic_operation", "logic_negate", "math_arithmetic", "math_modulo"],
            Values: ["math_number", "text", "logic_boolean", /* "math_random_int"*/],
            Debug: ["debug_log"]
        };
    }

    initializeState(gameState: GameState): void {
        if(this.hasFirstTickOccured) {
            this.hasFirstTickOccured = false;

            //randomize layout of maze by rotating or mirroring the initial maze area
            this.randomizedMaze = Array.from(this.initialMazeLayout, (arr) => Array.from(arr))

            const shouldFlipDiagonally = Math.round(Math.random()) === 0;
            const shouldFlipHorizontally = Math.round(Math.random()) === 0;
            const shouldFlipVertically = Math.round(Math.random()) === 0;

            //we assume a perfectly square matrix
            let len = this.initialMazeLayout.length;
            for (var sourceX = 0; sourceX < len; sourceX++) {
                for (var sourceY = 0; sourceY < len; sourceY++) {
                    var targetX = sourceX;
                    var targetY = sourceY;

                    if (shouldFlipVertically) {
                        targetX = len - 1 - targetX;
                    }

                    if (shouldFlipHorizontally) {
                        targetY = len - 1 - targetY;
                    }

                    if (shouldFlipDiagonally) {
                        const tmp = targetY;
                        targetY = targetX;
                        targetX = tmp;
                    }

                    this.randomizedMaze[targetX][targetY] = this.initialMazeLayout[sourceX][sourceY];
                }
            }

            //Place collectible and player randomly on one of the ground spaces. Since alle pathways
            //are connected it is always possible to find it.

            //find all available spaces player and collectible placement
            let availableSpaces: GridPosition[] = [];
            let currentTilePos = new GridPosition(0, 0);

            for (let row = 0; row < this.randomizedMaze.length; ++row) {
                currentTilePos.y = row;
                for (let col = 0; col < this.randomizedMaze[row].length; ++col) {
                    currentTilePos.x = col;

                    let tile = this.randomizedMaze[currentTilePos.y][currentTilePos.x];
                    if (tile !== TILE_PIT) {
                        availableSpaces.push(currentTilePos.clone());
                    }
                }
            }

            //pick one of available positions at random
            const playerPosNumber = Math.round(Math.random() * (availableSpaces.length - 1));
            const selectedPlayerTile = availableSpaces.splice(playerPosNumber, 1).pop();

            const collectiblePosNumber = Math.round(Math.random() * (availableSpaces.length - 1));
            const selectedCollectibleTile = availableSpaces[collectiblePosNumber];

            this.randomizedMaze[selectedCollectibleTile.y][selectedCollectibleTile.x] = TILE_COLLECTIBLE;

            if (selectedPlayerTile) {
                this.playerStartingPos = new PlayerPosition(selectedPlayerTile.x, selectedPlayerTile.y, PLAYER_ORIENTATION_DOWN);
            } else {
                console.log("WTF selected position should never be undefined!");
                return;
            }

            this.mazeCover.length = 0;
            this.mazeCover = Array.from(this.randomizedMaze, (arr) => Array.from(arr, () => false));

            Lvl19_ChallengeLabyrinth.revealHotSpot(this.mazeCover, selectedCollectibleTile);
            Lvl19_ChallengeLabyrinth.revealHotSpot(this.mazeCover, selectedPlayerTile);
        }
        gameState.setPlayerPosition(this.playerStartingPos);
        gameState.setGridState(Lvl19_ChallengeLabyrinth.calculateConcealedMap(this.randomizedMaze, this.mazeCover));
    }

    tick(gameState: GameState): void {
        this.hasFirstTickOccured = true;
        //reveal the level gradually to the player around the robot.
        const playerPos = gameState.getPlayerPosition();
        const standingOn = this.randomizedMaze[playerPos.y][playerPos.x];
        switch (standingOn) {
            case TILE_PIT:
                gameState.setGameOver(true, false, MSG_FALLEN_IN_PIT);
                break;
            case TILE_COLLECTIBLE:
                // Instantly wins game
                gameState.setGameOver(true, true, "Das war stark! Findest du in jedem möglichen Labyrinth den Weg?");
                break;
        }

        if(!gameState.isGameOver && !gameState.hasMoreCode){
            gameState.setGameOver(true, false, MSG_CODE_OVER_BUT_COLLECTABLE_NOT_GATHERED)
        }

        Lvl19_ChallengeLabyrinth.revealHotSpot(this.mazeCover, playerPos);
        let newGridState = Lvl19_ChallengeLabyrinth.calculateConcealedMap(this.randomizedMaze, this.mazeCover);
        gameState.setGridState(newGridState);
    }

    private static calculateConcealedMap(maze: GridState, mazeCover: boolean[][]):GridState{
        const out = Array.from(maze, (arr) => Array.from(arr));
        for (var x = 0; x < out[0].length; x++) {
            for(var y = 0; y < out.length; y++){
                if(!mazeCover[y][x]){
                    out[y][x] = TILE_PIT;
                }
            }
        }

        return out;
    }

    private static revealHotSpot(mazeCover: boolean[][], hotspot: GridPosition){
        const xMin = Math.max(0, hotspot.x - 1);
        const xMax = Math.min(mazeCover[0].length - 1, hotspot.x + 1);
        const yMin = Math.max(0, hotspot.y - 1);
        const yMax = Math.min(mazeCover.length - 1, hotspot.y + 1);

        for (var x = xMin; x <= xMax; x++) {
            for (var y = yMin; y <= yMax; y++) {
                 mazeCover[y][x] = true;
            }
        }
    }
}