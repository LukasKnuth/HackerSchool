import {ActionContext, Module} from 'vuex';
import {RootState} from "@/store";
import MazeLesson from "@/content/lessons/maze/MazeLesson";
import {Lesson, Level} from "@/content/Lesson";

// --------- STATIC DATA -------------
const AllLessons: {[index: string]: Lesson} = {
    maze: new MazeLesson()
};

// -------- MODULE -------------
export const ACTION_SELECT_LESSON = "selectLesson";
export const ACTION_SELECT_LEVEL = "selectLevel";
export const ACTION_CHANGE_LEVEL_PROGRESS = "changeLevelProgress";

export interface LevelProgress {
    isFinished: boolean;
    workspaceData: string;
}
const LEVEL_PROGRESS_DEFAULTS: LevelProgress = {
    isFinished: false,
    workspaceData: ""
};
export interface LessonProgress {
    levelProgress: {
        [index: number]: LevelProgress
    };
}
interface CourseProgressState {
    currentLesson: string|null;
    currentLevel: number|null;
    lessonProgress: {
        [index: string]: LessonProgress
    };
}
type Context = ActionContext<CourseProgressState, RootState>;
export interface LessonListEntry {
    id: string;
    lesson: Lesson;
    hasProgress: boolean;
    isFinished: boolean;
}
export interface LevelListEntry {
    nr: number;
    level: Level;
    hasProgress: boolean;
    isFinished: boolean;
}

interface LevelProgressPayload {
    lessonId: string;
    levelNr: number;
    progress: LevelProgress;
}

const CourseProgressModule: Module<CourseProgressState, RootState> = {
    state: () => {
        return {
            currentLevel: null,
            currentLesson: null,
            lessonProgress: {}
        };
    },
    mutations: { // These shouldn't be used directly, as they allow setting invalid state...
        setLesson: (state: CourseProgressState, lessonId: string) => {
            state.currentLesson = lessonId;
        },
        setLevel: (state: CourseProgressState, levelNr: number) => {
            state.currentLevel = levelNr;
        },
        changeLevelProgress: (state: CourseProgressState, payload: LevelProgressPayload) => {
            if (!(payload.lessonId in state.lessonProgress)) {
                state.lessonProgress[payload.lessonId] = {levelProgress: {}};
            }
            state.lessonProgress[payload.lessonId].levelProgress[payload.levelNr] = payload.progress;
        }
    },
    actions: {
        [ACTION_SELECT_LESSON]: (context: Context, lessonId: string) => {
            if (lessonId in AllLessons) {
                context.commit("setLesson", lessonId);
                let firstNoProgressLevel = 0;
                for (let i = 0; i < AllLessons[lessonId].getLevels().length; i++) {
                    const progress = context.getters.levelProgress(lessonId, i);
                    if (!progress || !progress.isFinished) {
                        firstNoProgressLevel = i;
                        break;
                    }
                }
                context.commit("setLevel", firstNoProgressLevel);
            } else {
                console.warn(`Unknown lesson-id "${lessonId}", ignoring...`);
            }
        },
        [ACTION_SELECT_LEVEL]: (context: Context, levelNr: number) => {
            const lesson: Lesson|undefined = context.getters.currentLesson;
            if (lesson) {
                if (levelNr < lesson.getLevels().length) {
                    context.commit('setLevel', levelNr);
                } else {
                    console.warn(`Can't set level to ${levelNr}.`
                        + ` The current lesson (${lesson.name}) only has ${lesson.getLevels().length} levels!`
                    );
                }
            } else {
                console.warn("Can't set the level yet, no lesson was selected!");
            }
        },
        [ACTION_CHANGE_LEVEL_PROGRESS]: (context: Context, progress: LevelProgress) => {
            if (context.state.currentLesson !== undefined && context.state.currentLevel !== undefined) {
                const currentProgress = context.getters.levelProgress(
                    context.state.currentLesson, context.state.currentLevel
                );
                context.commit("changeLevelProgress", {
                    lessonId: context.state.currentLesson,
                    levelNr: context.state.currentLevel,
                    progress: Object.assign({}, LEVEL_PROGRESS_DEFAULTS, currentProgress, progress)
                });
            } else {
                console.warn("Can't set level progress because no level/lesson is selected!");
            }
        }
    },
    getters: {
        // ------------ UTILITIES ---------------
        lessonProgress: (state: CourseProgressState) => (lessonId: string): LessonProgress|null => {
            /*
                This MUST be here, because otherwise this method isn't re-evaluated on changes to lessonProgress.
                Something with reactivity is fucked here, todo fix it!
            */
            const reactive = state.currentLesson;
            const reactive2 = state.currentLevel;
            // Actual code:
            if (lessonId in state.lessonProgress) {
                return state.lessonProgress[lessonId];
            } else {
                return null;
            }
        },
        levelProgress: (state: CourseProgressState, getters: any) =>
            (lessonId: string, level: number): LevelProgress|null => {
            const lesson = getters.lessonProgress(lessonId);
            if (lesson && level in state.lessonProgress[lessonId].levelProgress) {
                return state.lessonProgress[lessonId].levelProgress[level];
            }
            return null;
        },
        hasLevelProgress: (state: CourseProgressState, getters: any) => (lessonId: string, level: number): boolean => {
            return getters.levelProgress(lessonId, level) !== null;
        },
        isLevelFinished: (state: CourseProgressState, getters: any) => (lessonId: string, level: number): boolean => {
            const progress = getters.levelProgress(lessonId, level);
            return progress ? progress.isFinished : false;
        },
        // ------------ EXPORTS -----------------
        lessons: (state: CourseProgressState, getters: any): LessonListEntry[] => {
            return Object.keys(AllLessons).map((id: string) => {
                const lesson = AllLessons[id];
                const progress = lesson.getLevels().some((_, i) => getters.hasLevelProgress(id, i));
                const finished = lesson.getLevels().every((_, i) => getters.isLevelFinished(id, i));
                return {id, lesson, hasProgress: progress, isFinished: finished};
            });
        },
        currentLesson: (state: CourseProgressState): Lesson|null => {
            if (state.currentLesson !== null) {
                return AllLessons[state.currentLesson];
            } else {
                return null;
            }
        },
        currentLessonProgress: (state: CourseProgressState, getters: any): LessonProgress|null => {
            if (state.currentLesson !== null) {
                return getters.lessonProgress(state.currentLesson);
            } else {
                return null;
            }
        },
        levels: (state: CourseProgressState, getters: any): LevelListEntry[] => {
            const lesson: Lesson = getters.currentLesson;
            const lessonId = state.currentLesson;
            if (lesson && lessonId) {
                return lesson.getLevels().map((level: Level, index: number) => {
                    const progress = getters.levelProgress(lessonId, index);
                    if (progress !== null) {
                        return {
                            nr: index, level,
                            hasProgress: progress.workspaceData.length > 0,
                            isFinished: progress.isFinished
                        };
                    } else {
                        return {nr: index, level, hasProgress: false, isFinished: false};
                    }
                });
            } else {
                return [];
            }
        },
        currentLevel: (state: CourseProgressState): Level|null => {
            if (state.currentLesson !== null && state.currentLevel !== null) {
                return AllLessons[state.currentLesson].getLevels()[state.currentLevel];
            } else {
                return null;
            }
        },
        currentLevelProgress: (state: CourseProgressState, getters: any): LevelProgress|null => {
            if (state.currentLesson !== null && state.currentLevel !== null) {
                return getters.levelProgress(state.currentLesson, state.currentLevel);
            } else {
                return null;
            }
        },
        hasCurrentLevel: (state: CourseProgressState, getters: any): boolean => {
            return getters.currentLevel !== null;
        }
    }
};

export default CourseProgressModule;
