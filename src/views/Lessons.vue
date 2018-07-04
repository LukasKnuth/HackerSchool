<template>
    <b-container id="lessons">
        <b-row>
            <b-col v-for="l in lessons" :key="l.id" cols="4">
                <b-card :title="l.lesson.name"
                        class="mb-2"
                        :img-src="`/lessons/${l.id}.png`"
                        :img-alt="l.lesson.name"
                        img-top>
                    <p class="card-text">{{l.lesson.description}}</p>
                    <b-button @click="startLevel(l.id)">Start</b-button>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {ACTION_SELECT_LESSON} from "../store/LevelProgress";

    @Component
    export default class Lessons extends Vue {
        get lessons() {
            return this.$store.getters.lessons;
        }

        startLevel(lessonId: string) {
            this.$store.dispatch(ACTION_SELECT_LESSON, lessonId);
        }
    }
</script>

<style lang="scss">
    #lessons {
        margin-top: 20px;
    }
</style>
