import {Lesson, Level} from "../Lesson";
import LevelBlueGroup from '@/content/lessons/versus/LevelBlueGroup';

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new LevelBlueGroup());
    }

    get name() {
        return "Team Blau";
    }
    get description() {
        // todo ausfüllen
        return "Knifflige Rätsel zum Tüfteln";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}