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
export const ACTION_SET_LEVEL_PROGRESS = "setLevelProgress";

export interface LevelProgress {
    isFinished: boolean;
    // TODO extend this to hold workspace-xml, etz.
}
export interface LessonProgress {
    levelProgress: {
        [index: number]: LevelProgress
    }
}
interface CourseProgressState {
    currentLesson?: string,
    currentLevel?: number,
    lessonProgress: {
        [index: string]: LessonProgress
    }
}
type Context = ActionContext<CourseProgressState, RootState>;
export interface LessonListEntry {
    id: string,
    lesson: Lesson,
    hasProgress: boolean,
    isFinished: boolean
}
export interface LevelListEntry {
    nr: number,
    level: Level,
    hasProgress: boolean,
    isFinished: boolean
}

interface LevelProgressPayload {
    lessonId: string,
    levelNr: number,
    progress: LevelProgress
}

function getLessonProgress(state: CourseProgressState, lessonId: string): LessonProgress|undefined {
    if (lessonId in state.lessonProgress) {
        return state.lessonProgress[lessonId];
    } else {
        return undefined;
    }
}
function getLevelProgress(state: CourseProgressState, lessonId: string, level: number): LevelProgress|undefined {
    const lessonProgress = getLessonProgress(state, lessonId);
    if (lessonProgress && level in lessonProgress.levelProgress) {
        return lessonProgress.levelProgress[level];
    }
    return undefined;
}
function hasLevelProgress(state: CourseProgressState, lessonId: string, level: number): boolean {
    return getLevelProgress(state, lessonId, level) !== undefined;
}
function isLevelFinished(state: CourseProgressState, lessonId: string, level: number): boolean {
    const progress = getLevelProgress(state, lessonId, level);
    return progress ? progress.isFinished : false;
}

const CourseProgressModule: Module<CourseProgressState, RootState> = {
    state: () => {
        return {
            currentLevel: undefined,
            currentLesson: undefined,
            lessonProgress: {}
        }
    },
    mutations: { // These shouldn't be used directly, as they allow setting invalid state...
        setLesson: (state: CourseProgressState, lessonId: string) => {
            state.currentLesson = lessonId;
        },
        setLevel: (state: CourseProgressState, levelNr: number) => {
            state.currentLevel = levelNr;
        },
        setLevelProgress: (state: CourseProgressState, payload: LevelProgressPayload) => {
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
                    const progress = getLevelProgress(context.state, lessonId, i);
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
        [ACTION_SET_LEVEL_PROGRESS]: (context: Context, progress: LevelProgress) => {
            if (context.state.currentLesson !== undefined && context.state.currentLevel !== undefined) {
                context.commit("setLevelProgress", {
                    lessonId: context.state.currentLesson,
                    levelNr: context.state.currentLevel,
                    progress
                });
            } else {
                console.warn("Can't set level progress because no level/lesson is selected!");
            }
        }
    },
    getters: {
        lessons: (state: CourseProgressState): LessonListEntry[] => {
            return Object.keys(AllLessons).map((id: string) => {
                const lesson = AllLessons[id];
                const progress = lesson.getLevels().some((_, i) => hasLevelProgress(state, id, i));
                const finished = lesson.getLevels().every((_, i) => isLevelFinished(state, id, i));
                return {id, lesson, hasProgress: progress, isFinished: finished};
            });
        },
        currentLesson: (state: CourseProgressState): Lesson|undefined => {
            if (state.currentLesson !== undefined) {
                return AllLessons[state.currentLesson];
            } else {
                return undefined;
            }
        },
        currentLessonProgress: (state: CourseProgressState): LessonProgress|undefined => {
            if (state.currentLesson !== undefined) {
                return getLessonProgress(state, state.currentLesson);
            }
        },
        levels: (state: CourseProgressState, getters: any): LevelListEntry[] => {
            const lesson: Lesson = getters.currentLesson;
            const lessonId = state.currentLesson;
            if (lesson && lessonId) {
                return lesson.getLevels().map((level: Level, index: number) => {
                    const progress = getLevelProgress(state, lessonId, index);
                    if (progress) {
                        return {nr: index, level, hasProgress: true, isFinished: progress.isFinished};
                    } else {
                        return {nr: index, level, hasProgress: false, isFinished: false};
                    }
                });
            } else {
                return [];
            }
        },
        currentLevel: (state: CourseProgressState): Level|undefined => {
            if (state.currentLesson !== undefined && state.currentLevel !== undefined) {
                return AllLessons[state.currentLesson].getLevels()[state.currentLevel];
            } else {
                return undefined;
            }
        },
        currentLevelProgress: (state: CourseProgressState): LevelProgress|undefined => {
            if (state.currentLesson !== undefined && state.currentLevel !== undefined) {
                return getLevelProgress(state, state.currentLesson, state.currentLevel);
            }
        },
        hasCurrentLevel: (state: CourseProgressState, getters: any): boolean => {
            return getters.currentLevel !== undefined;
        }
    }
};

export default CourseProgressModule;