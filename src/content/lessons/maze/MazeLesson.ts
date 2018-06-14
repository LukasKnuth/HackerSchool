import {Lesson, Level} from '@/content/Lesson';
import MazeLevel1 from '@/content/lessons/maze/levels/Level1';

export default class MazeLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new MazeLevel1());
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
