import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    GameState,
    GridPosition,
    GridState,
    GridTile,
    PLAYER_ORIENTATION_UP,
    PlayerPosition,
    TILE_BLUE,
    TILE_PIT,
    TILE_RED,
    TILE_YELLOW,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";

const COLLAPSE_DELAY = 10;
const COLLAPSE_DANGER_LOW_TIME = 0;
const COLLAPSE_DANGER_MEDIUM_TIME = 3;
const COLLAPSE_DANGER_HIGH_TIME = 6;

const WIN_THRESHOLD = 130;

export default class Lvl17_ChallengeRunForYourLives implements Level {
    public readonly allowMethods = true;
    public readonly showDebugLog = true;
    public readonly allowVariables = true;
    public readonly description = "Überlebe so lange du kannst!";
    public readonly maxBlocks = 20; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;

    public readonly name = "Prüfung: Überlebenskünstler";
    private timer = 0;
    private epicentre: GridPosition = new GridPosition(0, 0);

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
    ];

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
        const startX = 7;
        const startY = 7;

        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(startX, startY, PLAYER_ORIENTATION_UP));
        this.timer = 0;
        this.epicentre = new GridPosition(startX, startY); //the tremors always start at player starting position
    }

    tick(gameState: GameState): void {
        const playerPosition = gameState.getPlayerPosition();
        const tremorsLevel = this.timer % COLLAPSE_DELAY;
        if (tremorsLevel === COLLAPSE_DELAY - 1) {
            Lvl17_ChallengeRunForYourLives.applyTremorLevel(gameState, TILE_PIT, this.epicentre);

            //find all available spaces for next tremor
            let availableSpaces: GridPosition[] = [];
            let currentTilePos = new GridPosition(0, 0);

            //make sure the next epicenter is not too far away from the player
            const colMin = Math.max(0, playerPosition.x - 2);
            const colMax = Math.min(gameState.mazeWidth - 1, playerPosition.x + 2);
            const rowMin = Math.max(0, playerPosition.y - 2);
            const rowMax = Math.min(gameState.mazeHeight - 1, playerPosition.y + 2);

            for (let row = rowMin; row <= rowMax; ++row) {
                currentTilePos.y = row;
                for (let col = colMin; col <= colMax; ++col) {
                    currentTilePos.x = col;

                    let tile = gameState.getGridTile(currentTilePos);
                    if (tile !== TILE_PIT) {
                        availableSpaces.push(currentTilePos.clone());
                    }
                }
            }

            //pick one of available positions at random
            const posNumber = Math.round(Math.random() * (availableSpaces.length - 1))
            this.epicentre = availableSpaces[posNumber];


        } else if (tremorsLevel >= COLLAPSE_DANGER_HIGH_TIME) {
            Lvl17_ChallengeRunForYourLives.applyTremorLevel(gameState, TILE_RED, this.epicentre);
        } else if (tremorsLevel >= COLLAPSE_DANGER_MEDIUM_TIME) {
            Lvl17_ChallengeRunForYourLives.applyTremorLevel(gameState, TILE_YELLOW, this.epicentre);
        } else if (tremorsLevel >= COLLAPSE_DANGER_LOW_TIME) {
            Lvl17_ChallengeRunForYourLives.applyTremorLevel(gameState, TILE_BLUE, this.epicentre);
        }

        const standingOn = gameState.getGridTile(playerPosition);
        if(standingOn === TILE_PIT){
            if (this.timer > WIN_THRESHOLD) {
                gameState.setGameOver(true, true, "Der Abgrund hat dich verschlungen." +
                    ` Du hast aber ganze ${this.timer} Züge überlebt. Sehr gut! Schaffst du noch mehr?`)
            }else {
                gameState.setGameOver(true, false, "Der Abgrund hat dich verschlungen." +
                    ` Du hast ${this.timer} Züge überlebt. Nicht schlecht. Aber du schaffst sicher noch mehr.`)
            }
        }else if(!gameState.hasMoreCode){
            gameState.setGameOver(true, false, "Dir ist der Code ausgegangen." +
                ` Du hast ${this.timer} Züge überlebt. Schaffst du noch mehr?`)
        }

        this.timer ++;
    }

    static applyTremorLevel(gameState: GameState, targetTileType: GridTile, epicentre: GridPosition) {
        //set all non PIT tiles in 3x3 area around circle to target tile type
        const xMin = Math.max(0, epicentre.x - 1);
        const xMax = Math.min(gameState.mazeWidth - 1, epicentre.x + 1);
        const yMin = Math.max(0, epicentre.y - 1);
        const yMax = Math.min(gameState.mazeHeight - 1, epicentre.y + 1);

        var currentPosition = new GridPosition(0, 0);
        for (var x = xMin; x <= xMax; x++) {
            currentPosition.x = x;
            for (var y = yMin; y <= yMax; y++) {
                currentPosition.y = y;

                if (gameState.getGridTile(currentPosition) !== TILE_PIT) {
                    gameState.setGridTile(currentPosition, targetTileType)
                }
            }
        }
    }
}