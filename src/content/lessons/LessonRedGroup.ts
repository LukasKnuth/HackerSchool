import {Lesson, Level} from "../Lesson";
import LevelRedGroup from '@/content/lessons/versus/LevelRedGroup';

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new LevelRedGroup());
    }

    get name() {
        return "Team Rot";
    }
    get description() {
        // todo ausfüllen
        return "Knifflige Rätsel zum Tüfteln";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}