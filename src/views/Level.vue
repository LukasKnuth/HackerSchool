<template>
    <b-container fluid>
        <b-row class="justify-content-md-center" id="course-nav">
            <b-col md="auto">
                <span class="level-label">{{$t("level.levelListLabel")}}</span>
                <span v-for="l in levelList"
                      class="level-list-entry"
                      :class="{progress: !l.isFinished && l.hasProgress, finished: l.isFinished, selected: l.nr === selectedLevel}"
                      @click="changeLevel(l.nr)"
                >{{l.nr === selectedLevel ? l.nr : "&nbsp;"}}</span>
            </b-col>
        </b-row>
        <b-row class="justify-content-md-center level-name">
            <b-col md="auto"><span>{{levelName}}</span></b-col>
        </b-row>
        <b-row>
            <b-col align-h="center">
                <router-view></router-view>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {ACTION_SELECT_LESSON, ACTION_SELECT_LEVEL, LessonProgress} from "../store/CourseProgress";

    @Component
    export default class Level extends Vue {
        mounted() {
            // TODO This could show the wrong level for the route-params when the state isn't empty!
            if (!this.$store.getters.hasCurrentLevel) {
                // We have no level. Maybe we can set it from the route-props?
                const lessonId = this.$route.params["lessonId"];
                const levelId = parseInt(this.$route.params["levelId"]);
                this.$store.dispatch(ACTION_SELECT_LESSON, lessonId);
                this.$store.dispatch(ACTION_SELECT_LEVEL, levelId);
            }
        }

        get levelName() {
            const level = this.$store.getters.currentLevel;
            return level ? level.name : "";
        }
        get levelList() {
            return this.$store.getters.levels;
        }
        get selectedLevel() {
            return this.$store.state.CourseProgressModule.currentLevel;
        }

        changeLevel(newLevel: number) {
            // TODO this could be easier... use vuex-router-sync?
            this.$store.dispatch(ACTION_SELECT_LEVEL, newLevel);
            this.$router.push(`/lessons/${this.$route.params["lessonId"]}/levels/${newLevel}`);
        }
    }
</script>

<style lang="scss">
    .level-name {
        margin-bottom: 20px;
        span {
            font-weight: bold;
            font-size: 1.2em;
        }
    }

    #course-nav {
        margin-top: 10px;

        .level-label {
            margin-right: 10px;
            vertical-align: middle;
            font-size: 1.1em;
        }
        .level-list-entry {
            $radius: 20px;
            width: $radius;
            height: $radius;
            border-radius: $radius/2;
            margin: 0 5px;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            border: 2px solid darkgray;

            &.finished {
                background-color: #54a928;
            }
            &.progress {
                background-color: lightgray;
            }
            &.selected {
                background-color: white;
                $selectedRadius: 35px;
                width: $selectedRadius;
                height: $selectedRadius;
                border-radius: $selectedRadius/2;
                text-align: center;
                line-height: $selectedRadius - 2;
                font-size: 1.2em;
            }
        }
    }
</style>