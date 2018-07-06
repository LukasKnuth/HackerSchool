import {Lesson, Level} from "../Lesson";
import Lvl20_ChallengeXMarksTheSpot from "@/content/lessons/levels/Lvl20_ChallengeXMarksTheSpot";
import Lvl18_ChallengeRacingCar from "@/content/lessons/levels/Lvl18_ChallengeRacingCar";
import Lvl19_ChallengeLabyrinth from "@/content/lessons/levels/Lvl19_ChallengeLabyrinth";
import Lvl16_ChallengeRadarFinder from "@/content/lessons/levels/Lvl16_ChallengeRadarFinder";
import Lvl17_ChallengeRunForYourLives from "@/content/lessons/levels/Lvl17_ChallengeRunForYourLives";

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new Lvl16_ChallengeRadarFinder());
        this.levels.push(new Lvl17_ChallengeRunForYourLives());
        this.levels.push(new Lvl18_ChallengeRacingCar());
        this.levels.push(new Lvl19_ChallengeLabyrinth());
        this.levels.push(new Lvl20_ChallengeXMarksTheSpot());
    }

    get name() {
        return "Herausforderungen";
    }
    get description() {
        return "Knifflige Rätsel zum Tüfteln";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}