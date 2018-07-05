import {Lesson, Level} from '../Lesson';
import Lvl01_SimpleInstructions from "@/content/lessons/levels/Lvl01_SimpleInstructions";
import Lvl02_MultipleInstructions from "@/content/lessons/levels/Lvl02_MultipleInstructions";
import Lvl03_BasicLoop from "@/content/lessons/levels/Lvl03_BasicLoop";
import Lvl04_AdvancedLoop from "@/content/lessons/levels/Lvl04_AdvancedLoop";
import Lvl05_LoopWithOuterCode from "@/content/lessons/levels/Lvl05_LoopWithOuterCode";
import Lvl06_NestedLoop from "@/content/lessons/levels/Lvl06_NestedLoop";
import Lvl07_LoopBonus from "@/content/lessons/levels/Lvl07_LoopBonus";
import Lvl08_SimpleConditionals from "@/content/lessons/levels/Lvl08_SimpleConditionals";
import Lvl09_SimpleConditionalsWithATwist from "@/content/lessons/levels/Lvl09_SimpleConditionalsWithATwist";
import Lvl10_ConditionalsWithElse from "@/content/lessons/levels/Lvl10_ConditionalsWithElse";
import Lvl11_ConditionalsWithElseIf from "@/content/lessons/levels/Lvl11_ConditionalsWithElseIf";
import Lvl12_BoolVariables from "@/content/lessons/levels/Lvl12_BoolVariables";
import Lvl13_NumericVariables from "@/content/lessons/levels/Lvl13_NumericVariables";
import Lvl14_VariablesAndConditionals from "@/content/lessons/levels/Lvl14_VariablesAndConditionals";
import Lvl15_VariablesAndConditionalsBonus from "@/content/lessons/levels/Lvl15_VariablesAndConditionalsBonus";
import Lvl16_ChallengeRadarFinder from "@/content/lessons/levels/Lvl16_ChallengeRadarFinder";
import Lvl17_ChallengeRunForYourLives from "@/content/lessons/levels/Lvl17_ChallengeRunForYourLives";
import Lvl18_ChallengeRacingCar from "@/content/lessons/levels/Lvl18_ChallengeRacingCar";
import Lvl19_ChallengeLabyrinth from "@/content/lessons/levels/Lvl19_ChallengeLabyrinth";
import Lvl20_ChallengeXMarksTheSpot from "@/content/lessons/levels/Lvl20_ChallengeXMarksTheSpot";
import TestLevel from "@/content/lessons/levels/TestLevel";

export default class DebuggingLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new TestLevel());
        this.levels.push(new Lvl01_SimpleInstructions());
        this.levels.push(new Lvl02_MultipleInstructions());
        this.levels.push(new Lvl03_BasicLoop());
        this.levels.push(new Lvl04_AdvancedLoop());
        this.levels.push(new Lvl05_LoopWithOuterCode());
        this.levels.push(new Lvl06_NestedLoop());
        this.levels.push(new Lvl07_LoopBonus());
        this.levels.push(new Lvl08_SimpleConditionals());
        this.levels.push(new Lvl09_SimpleConditionalsWithATwist());
        this.levels.push(new Lvl10_ConditionalsWithElse());
        this.levels.push(new Lvl11_ConditionalsWithElseIf());
        this.levels.push(new Lvl12_BoolVariables());
        this.levels.push(new Lvl13_NumericVariables());
        this.levels.push(new Lvl14_VariablesAndConditionals());
        this.levels.push(new Lvl15_VariablesAndConditionalsBonus());
        this.levels.push(new Lvl16_ChallengeRadarFinder());
        this.levels.push(new Lvl17_ChallengeRunForYourLives());
        this.levels.push(new Lvl18_ChallengeRacingCar());
        this.levels.push(new Lvl19_ChallengeLabyrinth());
        this.levels.push(new Lvl20_ChallengeXMarksTheSpot());
    }

    get name() {
        return "Debugging Lesson";
    }
    get description() {
        return "Contains all levels in order.";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}
