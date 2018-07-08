import {Lesson, Level} from "../Lesson";
import LevelBlueGroup1 from '@/content/lessons/versus/LevelBlueGroup1';
import LevelBlueGroup2 from "@/content/lessons/versus/LevelBlueGroup2";

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new LevelBlueGroup1());
        this.levels.push(new LevelBlueGroup2());
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