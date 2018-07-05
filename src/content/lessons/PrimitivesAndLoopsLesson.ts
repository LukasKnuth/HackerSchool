import {Lesson, Level} from "@/content/Lesson";
import Lvl01_SimpleInstructions from "@/content/lessons/levels/Lvl01_SimpleInstructions";
import Lvl02_MultipleInstructions from "@/content/lessons/levels/Lvl02_MultipleInstructions";
import Lvl03_BasicLoop from "@/content/lessons/levels/Lvl03_BasicLoop";
import Lvl04_AdvancedLoop from "@/content/lessons/levels/Lvl04_AdvancedLoop";
import Lvl05_LoopWithOuterCode from "@/content/lessons/levels/Lvl05_LoopWithOuterCode";
import Lvl06_NestedLoop from "@/content/lessons/levels/Lvl06_NestedLoop";
import Lvl07_LoopBonus from "@/content/lessons/levels/Lvl07_LoopBonus";

export default class PrimitivesAndLoopsLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new Lvl01_SimpleInstructions());
        this.levels.push(new Lvl02_MultipleInstructions());
        this.levels.push(new Lvl03_BasicLoop());
        this.levels.push(new Lvl04_AdvancedLoop());
        this.levels.push(new Lvl05_LoopWithOuterCode());
        this.levels.push(new Lvl06_NestedLoop());
        this.levels.push(new Lvl07_LoopBonus());
    }

    get name() {
        return "Grundlagen";
    }
    get description() {
        return "Lerne deinen Roboter zu steuern und sammle Kristalle";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}