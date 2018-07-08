import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    GameState,
    GridPosition,
    GridState,
    PLAYER_ORIENTATION_RIGHT,
    PlayerPosition,
    TILE_BLUE,
    TILE_NEUTRAL,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl20_ChallengeXMarksTheSpot implements Level {
    public readonly allowMethods = true;
    public readonly showDebugLog = true;
    public readonly allowVariables = true;

    public readonly description = "Finde den mit dem Kreuz markierten Schatz. Aber Vorsicht vor falschen Fährten. Der Kristall ist unsichtbar, befindet sich aber in der Mitte des balauen Kreuzes.";
    public readonly maxBlocks = 40; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Prüfung: Unbeirrt";

    private isFirstTurn = false;
    private crossPos = new GridPosition(0, 0);
    private decoyVerticalPos = new GridPosition(0, 0);
    private decoyHorizontalPos = new GridPosition(0, 0);

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, X, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, _, _, _, _, _, _, _, _, _, _, _, _, _, X],
        [X, X, _, _, _, _, _, _, _, _, _, _, _, X, X],
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
        //TODO fix this
        const crossX = Math.round(Math.random() * 9) % 9;
        const crossY = Math.round(Math.random() * 9) % 9;

        const decoyOneDeltaX = Math.round(Math.random() * 6) % 6;
        const decoyOneY = Math.round(Math.random() * 13) % 13;

        const decoyTwoX = Math.round(Math.random() * 13) % 13;
        const decoyTwoDeltaY = Math.round(Math.random() * 6) % 6;

        //We make sure that the small pattern don't obscure the big cross by offsetting them

        //Add a cross pattern on a random valid spot
        //The pattern looks like this
        //
        // B _ _ _ B
        // _ B _ B _
        // _ _ _ _ _
        // _ B _ B _
        // B _ _ _ B
        const borderOffset = 1;
        const crossOffset = 2;
        const additionalCrossToDecoyOffset = 1;
        this.crossPos = new GridPosition(borderOffset + crossOffset + crossX, borderOffset + crossOffset + crossY);

        //Also generate some decoys that look like this
        //
        // B
        // B
        // B
        //
        // or B B B

        this.decoyHorizontalPos = new GridPosition(borderOffset + (crossX + crossOffset + additionalCrossToDecoyOffset + decoyOneDeltaX) % 13, borderOffset + decoyOneY);
        this.decoyVerticalPos = new GridPosition(borderOffset + decoyTwoX, borderOffset + (crossY + crossOffset + additionalCrossToDecoyOffset + decoyTwoDeltaY) % 13);

        // These patterns should not cross each other

        gameState.setGridState(this.initialMazeLayout);

        gameState.setPlayerPosition(new PlayerPosition(1, 7, PLAYER_ORIENTATION_RIGHT));

        this.isFirstTurn = true;
    }

    tick(gameState: GameState): void {
        //The level should be revealed from the start but without any patterns
        //visible. As soon as the player presses play the marks should be revealed
        //Player wins if they step on the center of the "X"
        if(this.isFirstTurn){
            this.isFirstTurn = false;

            const actualMaze = Array.from(this.initialMazeLayout, (arr) => Array.from(arr))
            Lvl20_ChallengeXMarksTheSpot.drawCross(actualMaze, this.crossPos);
            //Lvl20_ChallengeXMarksTheSpot.drawDecoyLine(actualMaze, this.decoyVerticalPos, true);
            //Lvl20_ChallengeXMarksTheSpot.drawDecoyLine(actualMaze, this.decoyHorizontalPos, false);

            gameState.setGridState(actualMaze);
        }

        const playerPos = gameState.getPlayerPosition();
        const standingOn = gameState.getGridTile(playerPos);
        if (standingOn === TILE_PIT) {
            gameState.setGameOver(true, false, MSG_FALLEN_IN_PIT);
        } else if (playerPos.equals(this.crossPos)) {// Instantly wins game
            gameState.setGameOver(true, true, "Du hast den Schatz gefunden! Findest du ihn auch auf anderen Positionen? Probier's aus!");
        }

        if(!gameState.isGameOver && !gameState.hasMoreCode){
            gameState.setGameOver(true, false, "Dein Code ist zuende aber der Roboter hat noch nicht das Zentrum des Kreuzes gefunden.")
        }
    }

    private static drawCross(maze: GridState, crossPos: GridPosition){
        for (var i = -2; i < 3; i++) {
            //skip center

            var targetTile = TILE_BLUE;
            if(i === 0){
                targetTile = TILE_NEUTRAL;
            }

            //first diagonal
            maze[crossPos.y + i][crossPos.x + i] = targetTile;

            //second diagonal
            maze[crossPos.y - i][crossPos.x + i] = targetTile;
        }
    }

    private static drawDecoyLine(maze: GridState, decoyPos: GridPosition, vertical:boolean){
        for (var i = -1; i < 2; i++) {
            if(vertical){
                maze[decoyPos.y + i][decoyPos.x] = TILE_BLUE;
            }else{
                maze[decoyPos.y ][decoyPos.x + i] = TILE_BLUE;
            }
        }
    }
}