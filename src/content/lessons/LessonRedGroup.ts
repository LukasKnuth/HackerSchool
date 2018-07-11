import {Lesson, Level} from "../Lesson";
import LevelRedGroup1 from '@/content/lessons/versus/LevelRedGroup1';

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new LevelRedGroup1());
    }

    get name() {
        return "Team Rot";
    }
    get description() {
        return "Euer Level für Team Rot";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}