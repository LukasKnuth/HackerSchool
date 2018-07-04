import {Lesson, Level} from '@/content/Lesson';
import TestLevel from '@/content/lessons/maze/levels/TestLevel';
import Lvl01_SimpleInstructions from "@/content/lessons/maze/levels/Lvl01_SimpleInstructions";

export default class MazeLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new TestLevel());
        this.levels.push(new Lvl01_SimpleInstructions());
    }

    get name() {
        return "Maze";
    }
    get description() {
        return "Learn how to Program a computer with this basic maze lesson.";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}
