import Vue from 'vue';
import Vuex from 'vuex';
import LevelProgressModule from "@/store/LevelProgress";

Vue.use(Vuex);

export interface RootState {}

export default new Vuex.Store<RootState>({
    strict: process.env.NODE_ENV !== 'production',
    state: {},
    modules: {
        LevelProgressModule
    }
});
