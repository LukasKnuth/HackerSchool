import {Lesson, Level} from "../Lesson";
import LevelRedGroup1 from '@/content/lessons/versus/LevelRedGroup1';
import LevelRedGroup2 from "@/content/lessons/versus/LevelRedGroup2";

export default class ChallengesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new LevelRedGroup1());
        this.levels.push(new LevelRedGroup2());
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