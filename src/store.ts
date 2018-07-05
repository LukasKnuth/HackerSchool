import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import CourseProgressModule from "@/store/CourseProgress";

Vue.use(Vuex);

export interface RootState {}

const vuexLocal = new VuexPersistence({
    strictMode: process.env.NODE_ENV !== 'production',
    storage: window.localStorage
});

export default new Vuex.Store<RootState>({
    strict: process.env.NODE_ENV !== 'production',
    state: {},
    modules: {
        CourseProgressModule
    },
    mutations: {
        RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION // needed to restore state from localStorage
    },
    plugins: [vuexLocal.plugin]
});
