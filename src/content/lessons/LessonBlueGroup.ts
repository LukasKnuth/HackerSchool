import {Lesson, Level} from "../Lesson";
import LevelBlueGroup1 from '@/content/lessons/versus/LevelBlueGroup1';

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new LevelBlueGroup1());
    }

    get name() {
        return "Team Blau";
    }
    get description() {
        return "Euer Level für Team Blau";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}