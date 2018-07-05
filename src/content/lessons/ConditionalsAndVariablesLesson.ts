import {Lesson, Level} from "../Lesson";
import Lvl12_BoolVariables from "@/content/lessons/levels/Lvl12_BoolVariables";
import Lvl09_SimpleConditionalsWithATwist from "@/content/lessons/levels/Lvl09_SimpleConditionalsWithATwist";
import Lvl14_VariablesAndConditionals from "@/content/lessons/levels/Lvl14_VariablesAndConditionals";
import Lvl08_SimpleConditionals from "@/content/lessons/levels/Lvl08_SimpleConditionals";
import Lvl15_VariablesAndConditionalsBonus from "@/content/lessons/levels/Lvl15_VariablesAndConditionalsBonus";
import Lvl10_ConditionalsWithElse from "@/content/lessons/levels/Lvl10_ConditionalsWithElse";
import Lvl11_ConditionalsWithElseIf from "@/content/lessons/levels/Lvl11_ConditionalsWithElseIf";
import Lvl13_NumericVariables from "@/content/lessons/levels/Lvl13_NumericVariables";

export default class ConditionalsAndVariablesLesson implements Lesson {
    private readonly levels: Level[] = [];

    constructor() {
        this.levels.push(new Lvl08_SimpleConditionals());
        this.levels.push(new Lvl09_SimpleConditionalsWithATwist());
        this.levels.push(new Lvl10_ConditionalsWithElse());
        this.levels.push(new Lvl11_ConditionalsWithElseIf());
        this.levels.push(new Lvl12_BoolVariables());
        this.levels.push(new Lvl13_NumericVariables());
        this.levels.push(new Lvl14_VariablesAndConditionals());
        this.levels.push(new Lvl15_VariablesAndConditionalsBonus());
    }

    get name() {
        return "Vollgas";
    }
    get description() {
        return "Fortgeschrittene Manöver und Reagieren auf die Umgebung";
    }

    public getLevels(): Level[] {
        return this.levels;
    }

}