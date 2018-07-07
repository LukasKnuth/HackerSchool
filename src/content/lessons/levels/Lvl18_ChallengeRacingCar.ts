import {BlockToolbox, Level} from '@/content/Lesson';
import {
    _,
    G,
    GameState,
    GridState,
    PLAYER_ORIENTATION_RIGHT,
    PlayerPosition,
    TILE_GREEN,
    TILE_PIT,
    X
} from '@/components/game/GameState';
import {API, default as Interpreter, InterpreterScope} from 'js-interpreter';
import {attachGameBlockAPI} from "@/content/blocks/API";
import {MSG_FALLEN_IN_PIT} from "@/content/LevelCommons";

export default class Lvl18_ChallengeRacingCar implements Level {
    public readonly allowMethods = true;
    public readonly showDebugLog = true;
    public readonly allowVariables = true;

    public readonly description = "Umrunde die Piste so schnell du kannst.";
    public readonly maxBlocks = 25; //verify that number
    public readonly mazeHeight = 15;
    public readonly mazeWidth = 15;
    public readonly name = "Prüfung: Unüberholbar";

    private wasStandingOnPreFinishLineLastTick = false;
    private timer = 0;

    private initialMazeLayout: GridState = [
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, X, X, X, X, X, X, X, X, X, X, X, X, X, X],
        [X, _, _, _, _, X, X, X, _, _, _, _, _, X, X],
        [X, _, _, _, _, _, G, _, _, _, _, _, _, X, X],
        [X, X, _, X, _, _, G, _, _, X, X, _, _, X, X],
        [X, X, _, X, X, _, G, _, X, X, X, _, _, X, X],
        [X, X, _, X, X, X, X, X, X, X, _, _, X, X, X],
        [X, X, _, _, X, X, X, X, X, X, _, _, X, X, X],
        [X, X, _, _, X, X, X, X, X, X, X, _, _, X, X],
        [X, _, _, _, X, X, X, X, X, X, X, _, _, X, X],
        [X, _, _, X, X, _, _, _, _, X, X, _, _, X, X],
        [X, _, _, _, X, _, _, _, _, _, _, _, _, X, X],
        [X, X, _, _, _, _, X, X, _, _, _, _, _, X, X],
        [X, X, X, _, _, _, X, X, X, X, X, X, X, X, X],
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
        gameState.setGridState(this.initialMazeLayout);
        gameState.setPlayerPosition(new PlayerPosition(7, 4, PLAYER_ORIENTATION_RIGHT));
        this.wasStandingOnPreFinishLineLastTick = false;
        this.timer = 0;
    }

    tick(gameState: GameState): void {
        this.timer++;
        const playerPos = gameState.getPlayerPosition();
        const standingOn = gameState.getGridTile(playerPos);
        switch (standingOn) {
            case TILE_PIT:
                gameState.setGameOver(true, false, MSG_FALLEN_IN_PIT);
                break;
            case TILE_GREEN:
                // Wins game if the player has circled the board

                if (this.wasStandingOnPreFinishLineLastTick) {
                    gameState.setGameOver(true, true, `Spitzenrennen! Du hast ${this.timer} Züge dafür gebraucht. Schaffst du das noch schneller?`);
                }else{
                    gameState.setGameOver(true, false, `Du hast leider die falsche Richtung eingeschlagen. Umrunde die Rennstrecke im Uhrzeigersinn.`);
                }
                break;
        }

        if (!gameState.isGameOver && !gameState.hasMoreCode) {
            gameState.setGameOver(true, false, "Dein Code ist zuende aber du hast nicht die Ziellinie erreicht.")
        }

        this.wasStandingOnPreFinishLineLastTick = playerPos.x === 5 && playerPos.y < 6;
    }
}