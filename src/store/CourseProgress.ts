import {ActionContext, Module} from 'vuex';
import {RootState} from "@/store";
import MazeLesson from "@/content/lessons/maze/MazeLesson";
import {Lesson, Level} from "@/content/Lesson";

export const ACTION_SELECT_LESSON = "selectLesson";
export const ACTION_SELECT_LEVEL = "selectLevel";

interface CourseProgressState {
    currentLesson?: string,
    currentLevel?: number
}
type Context = ActionContext<CourseProgressState, RootState>;

type LessonList = {id: string, lesson: Lesson}[];

const AllLessons: {[index: string]: Lesson} = {
    maze: new MazeLesson()
};

const CourseProgressModule: Module<CourseProgressState, RootState> = {
    state: () => {
        return {
            currentLevel: undefined,
            currentLesson: undefined
        }
    },
    mutations: { // These shouldn't be used directly, as they allow setting invalid state...
        setLesson: (state: CourseProgressState, lessonId: string) => {
            state.currentLesson = lessonId;
            state.currentLevel = 0;
        },
        setLevel: (state: CourseProgressState, levelNr: number) => {
            state.currentLevel = levelNr;
        }
    },
    actions: {
        [ACTION_SELECT_LESSON]: (context: Context, lessonId: string) => {
            if (lessonId in AllLessons) {
                context.commit("setLesson", lessonId);
            } else {
                console.warn(`Unknown lesson-id "${lessonId}", ignoring...`);
            }
        },
        [ACTION_SELECT_LEVEL]: (context: Context, levelNr: number) => {
            const lesson: Lesson|undefined = context.getters.currentLesson();
            if (lesson) {
                if (lesson.getLevels().length < levelNr) {
                    context.commit('setLevel', levelNr);
                } else {
                    console.warn(`Can't set level to ${levelNr}.`
                        + `The current lesson (${lesson.name}) only has ${lesson.getLevels().length} levels!`
                    );
                }
            } else {
                console.warn("Can't set the level yet, no lesson was selected!");
            }
        }
    },
    getters: {
        lessons: (): LessonList => {
            return Object.keys(AllLessons).map((id: string) => {
                return {id, lesson: AllLessons[id]}
            });
        },
        currentLesson: (state: CourseProgressState): Lesson|undefined => {
            if (state.currentLesson !== undefined) {
                return AllLessons[state.currentLesson];
            } else {
                return undefined;
            }
        },
        currentLevel: (state: CourseProgressState): Level|undefined => {
            if (state.currentLesson !== undefined && state.currentLevel !== undefined) {
                return AllLessons[state.currentLesson].getLevels()[state.currentLevel];
            } else {
                return undefined;
            }
        }
    }
};

export default CourseProgressModule;