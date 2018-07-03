import {Lesson, Level} from '@/content/Lesson';
import TestLevel from '@/content/lessons/maze/levels/TestLevel';

export default class MazeLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new TestLevel());
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
